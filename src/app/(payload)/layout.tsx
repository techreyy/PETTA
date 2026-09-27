import config from '@payload-config';
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts';
import type { ServerFunctionClient } from 'payload';
import { importMap } from './admin/importMap';
import { cmsReady } from '@/lib/cms-ready';
import '@payloadcms/next/css';
import './custom-admin.css';

let migrationPromise: Promise<void> | null = null;
async function ensureMigrations() {
  if (!cmsReady()) return;
  if (!migrationPromise) {
    migrationPromise = (async () => {
      try {
        const { getPayload } = await import('payload');
        const payload = await getPayload({ config });
        await payload.db.migrate();
      } catch (err) {
        console.error('Payload auto-migration warning:', err);
      }
    })();
  }
  await migrationPromise;
}

const serverFunction: ServerFunctionClient = async (args) => {
  'use server';
  if (!cmsReady()) throw new Error('CMS is not configured.');
  await ensureMigrations();
  return handleServerFunctions({ ...args, config, importMap });
};

export default async function CMSLayout({ children }: { children: React.ReactNode }) {
  if (!cmsReady()) return <html lang="id"><body>{children}</body></html>;
  await ensureMigrations();
  return <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>{children}</RootLayout>;
}
