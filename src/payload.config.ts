import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import sharp from 'sharp';
import { Categories, Inquiries, Media, News, Projects, Users, Team, Awards, Competitions } from './cms/collections';
import { isOwner } from './cms/access';
import { STUDIO_INFO } from './lib/data';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
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
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI || '', connectionTimeoutMillis: 5000 }, push: false, migrationDir: path.resolve(dirname, 'migrations') }),
  editor: lexicalEditor(), sharp,
  email: () => ({ name: 'unconfigured', defaultFromAddress: STUDIO_INFO.email, defaultFromName: 'Petta Studio',
    sendEmail: async () => { throw new Error('Email delivery is not configured. Contact the studio owner for account recovery.'); } }),
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  upload: { limits: { fileSize: 10 * 1024 * 1024 }, abortOnLimit: true },
  collections: [Users, Media, Categories, Projects, News, Team, Inquiries, Awards, Competitions],
  globals: [{ slug: 'siteSettings', access: { read: () => true, update: isOwner }, fields: [
    ...Object.entries(STUDIO_INFO).map(([name, defaultValue]) => ({ name, type: 'text' as const, defaultValue, required: true })),
    { name: 'logo', type: 'upload', relationTo: 'media' },
  ] }],
  cors: [process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'],
  csrf: [process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'],
  plugins: process.env.S3_BUCKET ? [s3Storage({
    collections: { media: true }, bucket: process.env.S3_BUCKET,
    config: { endpoint: process.env.S3_ENDPOINT, region: process.env.S3_REGION || 'auto', forcePathStyle: true,
      credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID || '', secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '' } },
  })] : [],
});
