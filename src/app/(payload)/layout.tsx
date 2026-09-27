import config from '@payload-config';
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts';
import type { ServerFunctionClient } from 'payload';
import { importMap } from './admin/importMap';
import { cmsReady } from '@/lib/cms-ready';
import '@payloadcms/next/css';
import './custom-admin.css';

const serverFunction: ServerFunctionClient = async (args) => {
  'use server';
  if (!cmsReady()) throw new Error('CMS is not configured.');
  return handleServerFunctions({ ...args, config, importMap });
};

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  if (!cmsReady()) return <html lang="id"><body>{children}</body></html>;
  return <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>{children}</RootLayout>;
}
