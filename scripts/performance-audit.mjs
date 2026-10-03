// Local production-build audit: read-only CMS queries, no account/content mutations.
// node --env-file-if-exists=.env.local --import tsx scripts/performance-audit.mjs baseline
import { registerHooks } from 'node:module';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, openSync, closeSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';
import http from 'node:http';

const label = process.argv[2];
if (!/^[a-z0-9-]+$/.test(label || '')) throw new Error('Supply an audit label');
const db = new URL(process.env.DATABASE_URI);
if (!['127.0.0.1', 'localhost'].includes(db.hostname)) throw new Error('Audit requires local PostgreSQL');
registerHooks({
  resolve(specifier, context, next) {
    if (specifier === 'server-only') return { url: 'audit:server-only', shortCircuit: true };
    return next(specifier, context);
  },
  load(url, context, next) {
    if (url === 'audit:server-only') return { format: 'module', source: 'export {};', shortCircuit: true };
    return next(url, context);
  },
});
const { getContent, getProject, getNews, cms } = await import('../src/lib/content.ts');
const payload = await cms();
const timings = {};
for (const method of ['find', 'findGlobal']) {
  const original = payload[method].bind(payload);
  payload[method] = async options => {
    const key = `${options.collection || options.slug}.${options.limit === 1 ? 'detail' : 'list'}`;
    const start = performance.now();
    try { return await original(options); }
    finally { (timings[key] ||= []).push(performance.now() - start); }
  };
}
const summary = values => {
  const sorted = [...values].sort((a, b) => a - b);
  return { samples: values.length, medianMs: +sorted[Math.floor(sorted.length / 2)].toFixed(2), p95Ms: +sorted[Math.ceil(sorted.length * .95) - 1].toFixed(2) };
};
const content = await getContent();
if (!content.projects.length) throw new Error('Real CMS projects required');
const slug = content.projects.find(p => p.slug === 'smart-school')?.slug || content.projects[0].slug;
const newsSlug = content.news[0]?.slug;
const snapshot = { content, projects: await Promise.all(content.projects.map(p => getProject(p.slug))), news: await Promise.all(content.news.map(n => getNews(n.slug))) };
for (const key of Object.keys(timings)) timings[key] = [];
for (let i = 0; i < 15; i++) {
  await getContent();
  await getProject(slug);
  if (newsSlug) await getNews(newsSlug);
}
await payload.destroy();
mkdirSync('.cache/performance', { recursive: true });
const log = openSync(`.cache/performance/${label}-server.log`, 'w');
const base = 'http://localhost:3117';
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', '3117'], {
  env: { ...process.env, NODE_ENV: 'production', NEXT_PUBLIC_SITE_URL: base },
  stdio: ['ignore', log, log], windowsHide: true,
});
function request(path, cookie) {
  return new Promise((resolve, reject) => {
    const start = performance.now();
    const req = http.get(base + path, { headers: cookie ? { Cookie: cookie } : {} }, res => {
      const ttfb = performance.now() - start;
      let body = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, ttfb, total: performance.now() - start, bytes: Buffer.byteLength(body), location: res.headers.location }));
    });
    req.on('error', reject);
    req.setTimeout(30000, () => req.destroy(new Error('Request timeout')));
  });
}
const report = { label, environment: 'local production build / local PostgreSQL', contentHash: createHash('sha256').update(JSON.stringify(snapshot)).digest('hex'), queries: Object.fromEntries(Object.entries(timings).filter(([, v]) => v.length).map(([k, v]) => [k, summary(v)])), routes: {} };
try {
  let ready = false;
  for (let i = 0; i < 60; i++) {
    try { await request('/health'); ready = true; break; } catch { await delay(500); }
  }
  if (!ready) throw new Error('Audit server failed to start');
  for (const path of ['/', '/portfolio', `/portfolio/${slug}`, '/news', ...(newsSlug ? [`/news/${newsSlug}`] : []), '/admin/login', '/admin']) {
    const cold = await request(path);
    const samples = [];
    for (let i = 0; i < 15; i++) samples.push(await request(path));
    report.routes[path] = { firstMs: +cold.ttfb.toFixed(2), status: cold.status, location: cold.location, ttfb: summary(samples.map(s => s.ttfb)), total: summary(samples.map(s => s.total)), bytes: samples.at(-1).bytes };
  }
  report.dashboard = 'Unauthenticated redirect only; authenticated browser measurement required';
  writeFileSync(`.cache/performance/${label}.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  server.kill();
  closeSync(log);
}
process.exit(0);
