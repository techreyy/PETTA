import './cms-editorial-loader.mjs';
import { registerHooks } from 'node:module';
registerHooks({
  resolve(s, c, next) {
    if (s === 'next/navigation') return { url: 'batch-test:navigation', shortCircuit: true };
    if (s === 'next/cache') return { url: 'batch-test:cache', shortCircuit: true };
    return next(s, c);
  },
  load(u, c, next) {
    if (u === 'batch-test:navigation') return { format: 'module', source: 'export const usePathname = () => "/services";', shortCircuit: true };
    if (u === 'batch-test:cache') return { format: 'module', source: 'export const revalidatePath = (...args) => globalThis.__invalidations.push(args);', shortCircuit: true };
    return next(u, c);
  },
});
