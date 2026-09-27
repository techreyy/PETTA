import type { CollectionConfig, Field } from 'payload';
import { APIError } from 'payload';
import { canPublish, isOwner, isStaff, ownerField, protectPublishing, publishedOrStaff } from './access';

const slug: Field = { name: 'slug', type: 'text', required: true, unique: true, index: true,
  validate: (value: unknown) => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) || 'Use lowercase letters, numbers and single hyphens.' };
const order: Field = { name: 'order', type: 'number', defaultValue: 0 };
const seo: Field = { name: 'seo', type: 'group', fields: [
  { name: 'title', type: 'text' }, { name: 'description', type: 'textarea' }, { name: 'image', type: 'upload', relationTo: 'media' },
] };
export const imageFields = (name: string, required = false): Field[] => [
  { name, type: 'upload', relationTo: 'media', required },
  { name: `${name}Url`, label: 'Existing image URL (optional)', type: 'text',
    validate: (value: unknown) => !value || typeof value === 'string' && (value.startsWith('/') && !value.startsWith('//') || /^https:\/\/images\.unsplash\.com\//.test(value)) || 'Upload an image or use a local /path or images.unsplash.com URL.' },
];

export const Users: CollectionConfig = {
  slug: 'users', admin: { useAsTitle: 'name' },
  auth: { tokenExpiration: 7200, maxLoginAttempts: 5, lockTime: 900000,
    cookies: { secure: process.env.NODE_ENV === 'production', sameSite: 'Lax' } },
  access: { create: isOwner, delete: isOwner, update: isOwner,
    read: ({ req }) => req.user?.active ? req.user.role === 'owner' ? true : { id: { equals: req.user.id } } : false },
  hooks: {
    beforeOperation: [({ operation, req }) => {
      if (operation === 'create' && !req.user && !req.context.bootstrapOwner) throw new APIError('Registration disabled.', 403);
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
    { name: 'role', type: 'select', required: true, defaultValue: 'editor', options: ['owner', 'admin', 'editor'], access: { create: ownerField, update: ownerField } },
    { name: 'active', type: 'checkbox', defaultValue: true, access: { create: ownerField, update: ownerField } },
  ],
};

export const Media: CollectionConfig = {
  slug: 'media', access: { read: () => true, create: isStaff, update: isStaff, delete: canPublish },
  upload: { staticDir: 'media', mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    imageSizes: [{ name: 'card', width: 800 }, { name: 'large', width: 1800 }], adminThumbnail: 'card' },
  fields: [{ name: 'alt', type: 'text', required: true }, { name: 'caption', type: 'text' }],
  hooks: { beforeOperation: [({ operation, req }) => {
    if (['create', 'update'].includes(operation) && req.file && process.env.NODE_ENV === 'production' && !process.env.S3_BUCKET) {
      throw new APIError('Production media storage is not configured.', 503);
    }
  }], beforeDelete: [async ({ id, req }) => {
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
    if (projects.totalDocs || drafts.totalDocs || news.totalDocs || newsVersions.totalDocs || categories.totalDocs || team.totalDocs || settings.logo === id) {
      throw new APIError('This image is referenced by content or a saved version. Remove those references before deleting.', 409);
    }
  }] },
};

export const Categories: CollectionConfig = {
  slug: 'portfolioCategories', admin: { useAsTitle: 'title' },
  access: { read: () => true, create: canPublish, update: canPublish, delete: isOwner },
  hooks: { beforeDelete: [async ({ id, req }) => {
    const references = await req.payload.count({ collection: 'projects', req, where: { category: { equals: id } } });
    if (references.totalDocs) throw new APIError('Move the projects to another category before deleting this category.', 409);
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
  slug: 'projects', admin: { useAsTitle: 'title', defaultColumns: ['title', '_status', 'category', 'updatedAt'] },
  access: { read: publishedOrStaff, create: isStaff, update: isStaff, delete: canPublish, readVersions: isStaff },
  versions: { drafts: true, maxPerDoc: 30 }, hooks: { beforeChange: [protectPublishing] },
  fields: [
    { name: 'title', type: 'text', required: true }, slug,
    { name: 'legacyId', type: 'text', unique: true, admin: { readOnly: true } },
    { name: 'category', type: 'relationship', relationTo: 'portfolioCategories', required: true },
    ...['location', 'year', 'status', 'architectInCharge', 'siteArea', 'constructedArea', 'stories'].map((name): Field => ({ name, type: 'text' })),
    { name: 'shortIntro', type: 'textarea' },
    { name: 'description', type: 'array', fields: [{ name: 'paragraph', type: 'textarea', required: true }] },
    ...imageFields('heroImage'),
    { name: 'gallery', type: 'array', fields: [...imageFields('image'), { name: 'caption', type: 'text' }] },
    { name: 'featured', type: 'checkbox', defaultValue: false }, order, seo,
  ],
};

export const News: CollectionConfig = {
  slug: 'news', admin: { useAsTitle: 'title' },
  access: { read: publishedOrStaff, create: isStaff, update: isStaff, delete: canPublish, readVersions: isStaff },
  versions: { drafts: true, maxPerDoc: 30 }, hooks: { beforeChange: [protectPublishing] },
  fields: [{ name: 'title', type: 'text', required: true }, slug, { name: 'date', label: 'Publication date label', type: 'text' },
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
    { name: 'status', type: 'select', options: ['new', 'read', 'replied', 'archived'], defaultValue: 'new', required: true },
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

