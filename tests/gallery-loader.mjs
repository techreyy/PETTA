import './cms-editorial-loader.mjs';
import { registerHooks } from 'node:module';

const stubs = new Map([
  ['@/lib/content', 'export const getContent = async () => ({ projects: [] }); export const getProject = async () => ({ project: globalThis.__galleryProject });'],
  ['@/lib/seo', 'export const pageMetadata = () => ({});'],
  ['next/navigation', 'export const notFound = () => { throw new Error("Not found"); };'],
]);
registerHooks({
  resolve(specifier, context, next) {
    return stubs.has(specifier) ? { url: `gallery-test:${specifier}`, shortCircuit: true } : next(specifier, context);
  },
  load(url, context, next) {
    return url.startsWith('gallery-test:') ? { format: 'module', source: stubs.get(url.slice(13)), shortCircuit: true } : next(url, context);
  },
});
