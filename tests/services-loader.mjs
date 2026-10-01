import { registerHooks } from 'node:module';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const sources = new Map([
  ['server-only', 'export {};'],
  ['payload', 'export const getPayload = async () => globalThis.__servicesPayload();'],
  ['@payload-config', 'export default {};'],
]);
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (sources.has(specifier)) return { url: `services-test:${specifier}`, shortCircuit: true };
    if (specifier === './cms-ready') return { url: new URL('../src/lib/cms-ready.ts', import.meta.url).href, shortCircuit: true };
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.startsWith('services-test:')) return { format: 'module', source: sources.get(url.slice(14)), shortCircuit: true };
    if (/\/(services|cms-ready)\.ts$/.test(url)) return {
      format: 'module', shortCircuit: true,
      source: ts.transpileModule(readFileSync(new URL(url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText,
    };
    return nextLoad(url, context);
  },
});
