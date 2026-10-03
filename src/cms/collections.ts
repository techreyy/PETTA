import type { CollectionConfig, Field } from 'payload';
import { APIError } from 'payload';
import sharp from 'sharp';
import { canPublish, isOwner, isStaff, ownerField, protectPublishing, publishedOrStaff } from './access';
import { normalizeS3Config, getMissingS3Vars, isS3Configured } from '../lib/s3-config';

const slug: Field = { name: 'slug', type: 'text', required: true, unique: true, index: true,
  hooks: { beforeValidate: [({ value, originalDoc, siblingData }) => value || originalDoc?.slug || String(siblingData?.title || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')] },
  validate: (value: unknown, { siblingData }: { siblingData?: { title?: unknown } }) => (!value && Boolean(siblingData?.title)) || typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) || 'Gunakan huruf kecil, angka, dan tanda hubung.' };
const order: Field = { name: 'order', type: 'number', defaultValue: 0 };
const seo: Field = { name: 'seo', type: 'group', fields: [
  { name: 'title', type: 'text' }, { name: 'description', type: 'textarea' }, { name: 'image', type: 'upload', relationTo: 'media' },
] };
export const imageFields = (name: string, required = false): Field[] => [
  { name, type: 'upload', relationTo: 'media', required },
  { type: 'collapsible', label: 'Tautan gambar lama (opsional)', admin: { initCollapsed: true }, fields: [
  { name: `${name}Url`, label: 'Tautan gambar', type: 'text', admin: { description: 'Utamakan unggah atau pilih foto di atas. Tautan ini dipakai hanya jika foto unggahan belum dipilih.' },
    validate: (value: unknown) => !value || typeof value === 'string' && (value.startsWith('/') && !value.startsWith('//') || /^https:\/\/images\.unsplash\.com\//.test(value)) || 'Upload an image or use a local /path or images.unsplash.com URL.' },
  ] },
];

export const Users: CollectionConfig = {
  slug: 'users', admin: { useAsTitle: 'name' },
  auth: { tokenExpiration: 7200, maxLoginAttempts: 5, lockTime: 900000,
    cookies: { secure: process.env.NODE_ENV === 'production', sameSite: 'Lax' } },
  access: {
    create: async ({ req }) => {
      if (req.user?.active === true && req.user.role === 'owner') return true;
      const count = await req.payload.count({ collection: 'users', req });
      return count.totalDocs === 0;
    },
    delete: isOwner,
    update: isOwner,
    read: ({ req }) => req.user?.active ? req.user.role === 'owner' ? true : { id: { equals: req.user.id } } : false
  },
  hooks: {
    beforeOperation: [async ({ operation, req }) => {
      if (operation === 'create' && !req.user && !req.context.bootstrapOwner) {
        const totalUsers = await req.payload.count({ collection: 'users', req });
        if (totalUsers.totalDocs > 0) throw new APIError('Registration disabled.', 403);
      }
    }],
    beforeLogin: [({ user }) => { if (!user.active) throw new APIError('Account disabled.', 403); }],
    beforeChange: [({ data, originalDoc, req }) => {
      if (originalDoc?.id === req.user?.id && (data.active === false || data.role && data.role !== 'owner')) {
        throw new APIError('An owner cannot disable or demote their own account.', 400);
      }
      return data;
    }],
    beforeDelete: [({ id, req }) => { if (id === req.user?.id) throw new APIError('You cannot delete your own account.', 400); }],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'select', required: true, defaultValue: 'editor', options: [{ label: 'Pemilik', value: 'owner' }, { label: 'Admin', value: 'admin' }, { label: 'Editor', value: 'editor' }], access: { create: ownerField, update: ownerField } },
    { name: 'active', type: 'checkbox', defaultValue: true, access: { create: ownerField, update: ownerField } },
  ],
};

export const Media: CollectionConfig = {
  slug: 'media', access: { read: () => true, create: isStaff, update: isStaff, delete: canPublish },
  upload: {
    staticDir: 'media',
    disableLocalStorage: isS3Configured(),
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml'],
    imageSizes: [
      { name: 'card', width: 800, withoutEnlargement: true },
      { name: 'large', width: 1800, withoutEnlargement: true },
    ],
    focalPoint: false,
    crop: false,
    adminThumbnail: 'card',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      hooks: {
        beforeValidate: [({ value, req }) => {
          if (value && typeof value === 'string' && value.trim()) return value.trim();
          if (req?.file?.name) {
            return req.file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          }
          return 'Media asset';
        }],
      },
    },
    { name: 'caption', type: 'text' },
  ],
  hooks: {
    beforeOperation: [async ({ operation, req, collection }) => {
      if (['create', 'update'].includes(operation)) {
        if (req?.file) {
          const isBuffer = Buffer.isBuffer(req.file.data);
          const bufferSize = isBuffer ? req.file.data.length : (req.file.size ?? 'unknown');
          console.log(`[media] file-received: name="${req.file.name}" mimetype="${req.file.mimetype}" size=${req.file.size}b`);
          console.log(`[actual-file] isBuffer=${isBuffer}, size=${bufferSize} bytes, mimetype="${req.file.mimetype}", name="${req.file.name}"`);

          // 1. Log effective runtime configuration (no secrets)
          const effectiveUpload = (collection?.upload || Media.upload) as Record<string, unknown>;
          const effectiveDisableLocalStorage = effectiveUpload?.disableLocalStorage;
          const effectiveCrop = effectiveUpload?.crop;
          const effectiveFocalPoint = effectiveUpload?.focalPoint;
          const effectiveImageSizes = Array.isArray(effectiveUpload?.imageSizes)
            ? (effectiveUpload.imageSizes as Array<{ name?: string }>).map((s) => s?.name || 'unknown').join(', ')
            : 'none';

          console.log(
            `[runtime-config] disableLocalStorage=${String(effectiveDisableLocalStorage)}, crop=${String(effectiveCrop)}, focalPoint=${String(effectiveFocalPoint)}, imageSizes=[${effectiveImageSizes}]`
          );

          // 2. Diagnostic on actual user uploaded buffer
          if (isBuffer && req.file.data) {
            try {
              const meta = await sharp(req.file.data).metadata();
              console.log(`[actual-file] metadata-ok: format=${meta.format}, ${meta.width}x${meta.height}, space=${meta.space}`);
            } catch (err: unknown) {
              const error = (typeof err === 'object' && err !== null ? err : {}) as Record<string, unknown>;
              console.error(`[actual-file] metadata-error: ${error.name || 'Error'}: ${error.message || String(err)}`);
              if (typeof error.stack === 'string') console.error(`[actual-file] metadata-error stack:\n${error.stack}`);
            }

            try {
              const rotated = await sharp(req.file.data).rotate().toBuffer();
              console.log(`[actual-file] rotate-ok: ${rotated.length} bytes`);
            } catch (err: unknown) {
              const error = (typeof err === 'object' && err !== null ? err : {}) as Record<string, unknown>;
              console.error(`[actual-file] rotate-error: ${error.name || 'Error'}: ${error.message || String(err)}`);
              if (typeof error.stack === 'string') console.error(`[actual-file] rotate-error stack:\n${error.stack}`);
            }

            try {
              const card = await sharp(req.file.data).resize({ width: 800, withoutEnlargement: true }).toBuffer();
              console.log(`[actual-file] card-ok: ${card.length} bytes`);
            } catch (err: unknown) {
              const error = (typeof err === 'object' && err !== null ? err : {}) as Record<string, unknown>;
              console.error(`[actual-file] card-error: ${error.name || 'Error'}: ${error.message || String(err)}`);
              if (typeof error.stack === 'string') console.error(`[actual-file] card-error stack:\n${error.stack}`);
            }

            try {
              const large = await sharp(req.file.data).resize({ width: 1800, withoutEnlargement: true }).toBuffer();
              console.log(`[actual-file] large-ok: ${large.length} bytes`);
            } catch (err: unknown) {
              const error = (typeof err === 'object' && err !== null ? err : {}) as Record<string, unknown>;
              console.error(`[actual-file] large-error: ${error.name || 'Error'}: ${error.message || String(err)}`);
              if (typeof error.stack === 'string') console.error(`[actual-file] large-error stack:\n${error.stack}`);
            }
          } else {
            console.warn(`[actual-file] req.file.data is not a Buffer (type=${typeof req.file.data}). Skipping Sharp actual-file test.`);
          }
        } else {
          console.warn(`[media] file-received: NO file on req for operation=${operation}`);
        }
        const s3 = normalizeS3Config();
        const missing = getMissingS3Vars(s3);
        if (process.env.NODE_ENV === 'production' && missing.length > 0) {
          console.error(`[media] upload aborted: missing S3/R2 configuration: ${missing.join(', ')}`);
          throw new APIError(`Production media storage is not properly configured. Missing environment variables: ${missing.join(', ')}. Please check your Hostinger configuration.`, 503);
        }
        if (s3.bucket) {
          console.log(`[media] S3 target verified: bucket="${s3.bucket}", region="${s3.region}"`);
        }
      }
    }],
    beforeChange: [({ data, operation, req }) => {
      if (['create', 'update'].includes(operation)) {
        const filename = (typeof data?.filename === 'string' ? data.filename : '') || (req?.file?.name ?? 'unknown');
        console.log(`[media] db-create-start: operation=${operation}, filename="${filename}"`);
      }
      return data;
    }],
    afterChange: [({ doc }) => {
      console.log(`[media] db-create-success: id="${doc.id}", filename="${doc.filename}"`);
      console.log(`[media] storage-start: triggering cloud storage sync for "${doc.filename}"`);
      return doc;
    }],
    afterError: [({ error, req }) => {
      const err = (typeof error === 'object' && error !== null ? error : {}) as Record<string, unknown>;
      const metadata = (typeof err.$metadata === 'object' && err.$metadata !== null ? err.$metadata : {}) as Record<string, unknown>;
      const status = metadata.httpStatusCode ?? err.status ?? err.statusCode ?? 500;
      const errorName = typeof err.name === 'string' ? err.name : 'Error';
      const errorMessage = typeof err.message === 'string' ? err.message : String(error);
      const code = typeof err.code === 'string' ? err.code : (typeof err.Code === 'string' ? err.Code : 'N/A');
      const requestId = typeof metadata.requestId === 'string' ? metadata.requestId : undefined;
      const cause = err.cause ? (typeof err.cause === 'object' ? JSON.stringify(err.cause) : String(err.cause)) : undefined;

      console.error(
        `[media] operation-error: name=${errorName}, code=${code}, status=${String(status)}, message="${errorMessage}"` +
        (cause ? `, cause=${cause}` : '') +
        (requestId ? `, requestId=${requestId}` : '') +
        (req?.file ? `, file="${req.file.name}" (${req.file.mimetype}, ${req.file.size} bytes)` : '')
      );

      if (typeof err.stack === 'string') {
        const stackSummary = err.stack.split('\n').slice(0, 8).join('\n');
        console.error(`[media] operation-error stack:\n${stackSummary}`);
      }
    }],
    beforeDelete: [async ({ id, req }) => {
    const projects = await req.payload.find({ collection: 'projects', limit: 1, depth: 0, req,
      where: { or: [{ heroImage: { equals: id } }, { 'gallery.image': { equals: id } }, { 'seo.image': { equals: id } }] } });
    const drafts = await req.payload.findVersions({ collection: 'projects', limit: 1, depth: 0, req,
      where: { or: [{ 'version.heroImage': { equals: id } }, { 'version.gallery.image': { equals: id } }, { 'version.seo.image': { equals: id } }] } });
    const news = await req.payload.find({ collection: 'news', limit: 1, depth: 0, req,
      where: { or: [{ coverImage: { equals: id } }, { 'seo.image': { equals: id } }] } });
    const newsVersions = await req.payload.findVersions({ collection: 'news', limit: 1, depth: 0, req,
      where: { or: [{ 'version.coverImage': { equals: id } }, { 'version.seo.image': { equals: id } }] } });
    const categories = await req.payload.find({ collection: 'portfolioCategories', limit: 1, depth: 0, req, where: { coverImage: { equals: id } } });
    const settings = await req.payload.findGlobal({ slug: 'siteSettings', depth: 0, req });
    const team = await req.payload.find({ collection: 'team', depth: 0, limit: 1, req, where: { portrait: { equals: id } } });
    const logos = await req.payload.count({ collection: 'brandLogos', req, overrideAccess: true, where: { logo: { equals: id } } });
    if (projects.totalDocs || drafts.totalDocs || news.totalDocs || newsVersions.totalDocs || categories.totalDocs || team.totalDocs || logos.totalDocs || settings.logo === id) {
      throw new APIError('This image is referenced by content or a saved version. Remove those references before deleting.', 409);
    }
  }] },
};

export const Categories: CollectionConfig = {
  slug: 'portfolioCategories', admin: { useAsTitle: 'title' },
  access: { read: () => true, create: canPublish, update: canPublish, delete: isOwner },
  hooks: { beforeDelete: [async ({ id, req }) => {
    const references = await req.payload.count({ collection: 'projects', req, where: { category: { equals: id } } });
    const versions = await req.payload.findVersions({ collection: 'projects', req, depth: 0, limit: 1, where: { 'version.category': { equals: id } } });
    if (references.totalDocs || versions.totalDocs) throw new APIError('Move the projects and remove saved version references before deleting this category.', 409);
  }] },
  fields: [{ name: 'title', type: 'text', required: true }, slug, { name: 'description', type: 'textarea', required: true }, ...imageFields('coverImage'), order, { name: 'active', type: 'checkbox', defaultValue: true }],
};

export const Team: CollectionConfig = {
  slug: 'team', admin: { useAsTitle: 'name' },
  access: { read: () => true, create: canPublish, update: canPublish, delete: isOwner },
  fields: [{ name: 'name', type: 'text', required: true }, { name: 'roleTitle', type: 'text', required: true },
    ...imageFields('portrait'), { name: 'bio', type: 'textarea' }, { name: 'instagram', type: 'text' },
    order, { name: 'active', type: 'checkbox', defaultValue: true }],
};

export const Projects: CollectionConfig = {
  slug: 'projects', admin: { useAsTitle: 'title', defaultColumns: ['title', 'status', '_status', 'category', 'updatedAt'] },
  access: { read: publishedOrStaff, create: isStaff, update: isStaff, delete: canPublish, readVersions: isStaff },
  versions: { drafts: true, maxPerDoc: 30 }, hooks: { beforeChange: [protectPublishing] },
  fields: [{ type: 'tabs', tabs: [
    { label: 'Informasi Utama', admin: { description: 'Mulai dari judul, kategori dan lokasi. Status pembangunan berbeda dari status publikasi.' }, fields: [
    { name: 'title', type: 'text', required: true }, slug,
    { name: 'category', type: 'relationship', relationTo: 'portfolioCategories', required: true },
    { type: 'row', fields: ['location', 'year'].map((name): Field => ({ name, type: 'text', admin: { width: '50%' } })) },
    { name: 'status', label: 'Status pembangunan', type: 'text', admin: { components: { Field: '/components/admin/ProjectStatusField#ProjectStatusField' }, description: 'Pilih status sesuai kondisi proyek. Nilai lama tetap dipertahankan.' } },
    { name: 'shortIntro', type: 'textarea' },
    { type: 'collapsible', label: 'Detail proyek (opsional)', admin: { initCollapsed: true }, fields: [
      ...['architectInCharge', 'siteArea', 'constructedArea', 'stories'].map((name): Field => ({ name, type: 'text' })),
      { name: 'description', type: 'array', fields: [{ name: 'paragraph', type: 'textarea', required: true }] },
    ] },
    ] },
    { label: 'Foto & Galeri', admin: { description: 'Pilih foto utama untuk sampul proyek, kemudian susun galeri dokumentasi.' }, fields: [
    ...imageFields('heroImage'),
    { name: 'gallery', type: 'array', fields: [...imageFields('image'), { name: 'caption', type: 'text' }] },
    ] },
    { label: 'Publikasi', admin: { description: 'Atur pilihan dan urutan tampil. Gunakan tombol simpan draf atau terbitkan; editor hanya dapat menyimpan draf.' }, fields: [
    { name: 'featured', type: 'checkbox', defaultValue: false }, order,
    { type: 'collapsible', label: 'Pengaturan lanjutan (opsional)', admin: { initCollapsed: true }, fields: [
      seo, { name: 'legacyId', type: 'text', unique: true, admin: { readOnly: true } },
    ] },
    ] },
  ] }],
};

export const News: CollectionConfig = {
  slug: 'news', admin: { useAsTitle: 'title' },
  access: { read: publishedOrStaff, create: isStaff, update: isStaff, delete: canPublish, readVersions: isStaff },
  versions: { drafts: true, maxPerDoc: 30 }, hooks: { beforeChange: [protectPublishing] },
  fields: [{ name: 'title', type: 'text', required: true }, slug, { name: 'date', label: 'Tanggal yang ditampilkan', type: 'text', admin: { description: 'Contoh: 1 Oktober 2026.' } },
    { name: 'category', type: 'text' }, { name: 'author', type: 'text' }, { name: 'publishDate', type: 'date' },
    ...imageFields('coverImage'), { name: 'excerpt', type: 'textarea', required: true },
    { name: 'body', type: 'richText' }, { name: 'featured', type: 'checkbox', defaultValue: false }, seo],
};

export const Inquiries: CollectionConfig = {
  slug: 'inquiries', admin: { useAsTitle: 'fullName', defaultColumns: ['fullName', 'subject', 'status', 'createdAt'] },
  access: { create: () => false, read: canPublish, update: canPublish, delete: isOwner },
  fields: [
    ...['fullName', 'email', 'phone', 'subject'].map((name): Field => ({ name, type: 'text', required: name !== 'phone', access: { update: () => false } })),
    { name: 'message', type: 'textarea', required: true, access: { update: () => false } },
    { name: 'status', label: 'Status tindak lanjut', type: 'select', options: [{ label: 'Baru', value: 'new' }, { label: 'Sudah dibaca', value: 'read' }, { label: 'Sudah dibalas', value: 'replied' }, { label: 'Diarsipkan', value: 'archived' }], defaultValue: 'new', required: true },
    { name: 'internalNotes', type: 'textarea' },
  ],
};

export const Awards: CollectionConfig = {
  slug: 'awards',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'issuer', 'category', 'updatedAt'],
  },
  access: { read: () => true, create: canPublish, update: canPublish, delete: isOwner },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'year', type: 'text', required: true },
    { name: 'issuer', label: 'Lembaga Pemberi Penghargaan (Issuer)', type: 'text', required: true },
    { name: 'category', label: 'Kategori Penghargaan', type: 'text', required: true },
    { name: 'project', label: 'Nama Proyek Terkait', type: 'text', required: true },
    { name: 'description', label: 'Deskripsi Singkat', type: 'textarea', required: true },
    order,
    { name: 'active', type: 'checkbox', defaultValue: true },
  ],
};

export const Competitions: CollectionConfig = {
  slug: 'competitions',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'achievement', 'organizer', 'updatedAt'],
  },
  access: { read: () => true, create: canPublish, update: canPublish, delete: isOwner },
  fields: [
    { name: 'title', label: 'Judul Sayembara / Gagasan Desain', type: 'text', required: true },
    { name: 'year', type: 'text', required: true },
    { name: 'achievement', label: 'Pencapaian (cth: Finalis / Top 5 / Juara)', type: 'text', required: true },
    { name: 'organizer', label: 'Penyelenggara Sayembara', type: 'text', required: true },
    { name: 'location', label: 'Lokasi Perancangan', type: 'text', required: true },
    { name: 'description', label: 'Deskripsi Konsep Gagasan', type: 'textarea', required: true },
    order,
    { name: 'active', type: 'checkbox', defaultValue: true },
  ],
};
