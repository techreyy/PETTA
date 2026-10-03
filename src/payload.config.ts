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
import { getDatabaseConfig } from './lib/db-config';
import { normalizeS3Config, isS3Configured, createSafeS3Logger } from './lib/s3-config';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const dbConfig = getDatabaseConfig();
const s3Config = normalizeS3Config();

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
      connectionString: dbConfig.connectionString,
      connectionTimeoutMillis: 10000,
      ssl: dbConfig.ssl,
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
  plugins: isS3Configured(s3Config) ? [s3Storage({
    collections: { media: true }, bucket: s3Config.bucket,
    config: {
      endpoint: s3Config.endpoint,
      region: s3Config.region,
      forcePathStyle: s3Config.forcePathStyle,
      credentials: {
        accessKeyId: s3Config.accessKeyId,
        secretAccessKey: s3Config.secretAccessKey,
      },
      logger: createSafeS3Logger(),
    },
  })] : [],
});
