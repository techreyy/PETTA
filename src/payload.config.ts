import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import sharp from 'sharp';
import { id } from '@payloadcms/translations/languages/id';
import { en } from '@payloadcms/translations/languages/en';
import { adminCollection, adminFields } from './cms/admin-presentation';
import { Categories, Inquiries, Media, News, Projects, Users, Team, Awards, Competitions } from './cms/collections';
import { BrandLogos, Services } from './cms/editorial';
import { isOwner } from './cms/access';
import { STUDIO_INFO } from './lib/data';
import { migrations } from './migrations';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const isLocalDb = !process.env.DATABASE_URI || process.env.DATABASE_URI.includes('localhost') || process.env.DATABASE_URI.includes('127.0.0.1');

export default buildConfig({
  i18n: { supportedLanguages: { id, en }, fallbackLanguage: 'id' },
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  admin: {
    user: 'users',
    importMap: { baseDir: dirname },
    meta: {
      titleSuffix: ' | Petta Desain CMS',
      icons: [{ rel: 'icon', type: 'image/png', url: '/petta-icon-only.png?v=3' }],
      openGraph: { images: [{ url: '/petta-logo-transparent.png' }] },
    },
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      connectionTimeoutMillis: 10000,
      ssl: isLocalDb ? false : { rejectUnauthorized: false },
    },
    push: false,
    prodMigrations: migrations,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  editor: lexicalEditor(), sharp,
  email: () => ({ name: 'unconfigured', defaultFromAddress: STUDIO_INFO.email, defaultFromName: 'Petta Studio',
    sendEmail: async () => { throw new Error('Email delivery is not configured. Contact the studio owner for account recovery.'); } }),
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  upload: { limits: { fileSize: 10 * 1024 * 1024 }, abortOnLimit: true },
  collections: [Projects, Categories, News, Services, Awards, Competitions, Media, Team, BrandLogos, Inquiries, Users].map(adminCollection),
  globals: [{ slug: 'siteSettings', label: 'Profil & Kontak Studio', admin: { group: 'Identitas Studio', description: 'Ubah identitas, kontak, media sosial dan logo studio. Pengaturan ini hanya dapat diubah oleh pemilik.' }, access: { read: () => true, update: isOwner }, fields: adminFields([
    ...Object.entries(STUDIO_INFO).map(([name, defaultValue]) => ({ name, type: 'text' as const, defaultValue, required: true })),
    { name: 'logo', type: 'upload', relationTo: 'media' },
  ]) }],
  cors: [process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'],
  csrf: [process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'],
  plugins: process.env.S3_BUCKET ? [s3Storage({
    collections: { media: true }, bucket: process.env.S3_BUCKET,
    config: { endpoint: process.env.S3_ENDPOINT, region: process.env.S3_REGION || 'auto', forcePathStyle: true,
      credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID || '', secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '' } },
  })] : [],
});
