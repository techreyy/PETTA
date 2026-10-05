import './cms-editorial-loader.mjs';
import { registerHooks } from 'node:module';
registerHooks({
  resolve(s, c, next) {
    if (s === '@/lib/services') return { url: 'services-page-test:services', shortCircuit: true };
    if (s === '@/lib/get-page-content') return { url: 'services-page-test:page-copy', shortCircuit: true };
    if (s === '@/lib/content') return { url: 'services-page-test:content', shortCircuit: true };
    if (s === 'next/navigation') return { url: 'services-page-test:navigation', shortCircuit: true };
    return next(s, c);
  },
  load(u, c, next) {
    const sources = {
      'services-page-test:services': 'export const getServices = async () => globalThis.__pageServices;',
      'services-page-test:page-copy': 'import { resolvePageContent } from "@/lib/page-content"; export const getPageContent = async slug => resolvePageContent(slug);',
      'services-page-test:content': 'export const getContent = async () => ({projects: [], categories: [], news: []});',
      'services-page-test:navigation': 'export const usePathname = () => "/services";',
    };
    if (sources[u]) return { format: 'module', source: sources[u], shortCircuit: true };
    return next(u, c);
  },
});
