// Measures real authenticated HTTP responses against a disposable local database.
import { Pool } from 'pg';
import { randomBytes } from 'node:crypto';
import { spawn } from 'node:child_process';
import { mkdirSync, openSync, closeSync, writeFileSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';
import assert from 'node:assert/strict';

const label = process.argv[2];
assert.match(label || '', /^[a-z0-9-]+$/);
const uri = new URL(process.env.DATABASE_URI);
assert.ok(['localhost', '127.0.0.1'].includes(uri.hostname));
const pool = new Pool({ connectionString: uri.href });
const name = `petta_test_${Date.now()}`;
await pool.query(`CREATE DATABASE "${name}"`);
uri.pathname = `/${name}`;
process.env.DATABASE_URI = uri.href;
process.env.PAYLOAD_MIGRATING = 'true';
const base = 'http://localhost:3118';
process.env.NEXT_PUBLIC_SITE_URL = base;
const { getPayload } = await import('payload');
const config = (await import('../src/payload.config.ts')).default;
let payload, server, log;
const result = { label, environment: 'local production build / disposable seeded PostgreSQL', routes: {} };
async function read(path, cookie) {
  const start = performance.now();
  const response = await fetch(base + path, { headers: cookie ? { Cookie: cookie, 'Sec-Fetch-Site': 'none' } : {}, redirect: 'manual' });
  const ttfb = performance.now() - start;
  const body = await response.text();
  return { ttfb, status: response.status, body };
}
try {
  payload = await getPayload({ config });
  await payload.db.migrate();
  const password = randomBytes(24).toString('base64url');
  const email = 'performance@example.test';
  await payload.create({ collection: 'users', context: { bootstrapOwner: true }, data: { name: 'Performance QA', email, password, role: 'owner', active: true } });
  mkdirSync('.cache/performance', { recursive: true });
  log = openSync(`.cache/performance/${label}-admin-server.log`, 'w');
  server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', '3118'], {
    env: { ...process.env, NODE_ENV: 'production' }, stdio: ['ignore', log, log], windowsHide: true,
  });
  let ready = false;
  for (let i = 0; i < 60; i++) {
    try { await read('/health'); ready = true; break; } catch { await delay(500); }
  }
  assert.ok(ready);
  const start = performance.now();
  const login = await fetch(base + '/api/users/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: base }, body: JSON.stringify({ email, password }),
  });
  assert.equal(login.status, 200);
  const { token } = await login.json();
  assert.ok(token);
  result.loginOnceMs = +(performance.now() - start).toFixed(2);
  const cookie = `payload-token=${token}`;
  for (const path of ['/api/users/me', '/admin']) {
    const first = await read(path, cookie);
    assert.equal(first.status, 200);
    if (path === '/admin') assert.ok(first.body.includes('/admin/collections/projects'));
    else assert.equal(JSON.parse(first.body).user.email, email);
    const samples = [];
    for (let i = 0; i < 15; i++) {
      const sample = await read(path, cookie);
      assert.equal(sample.status, 200);
      samples.push(sample.ttfb);
    }
    samples.sort((a, b) => a - b);
    result.routes[path] = { firstMs: +first.ttfb.toFixed(2), medianMs: +samples[7].toFixed(2), p95Ms: +samples[14].toFixed(2), samples: samples.length };
  }
  const anonymous = await read('/api/users/me');
  assert.equal(JSON.parse(anonymous.body).user, null);
  result.anonymousSessionIsolated = true;
  writeFileSync(`.cache/performance/${label}-admin.json`, JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
} finally {
  if (server && server.exitCode === null) {
    const exited = new Promise(resolve => server.once('exit', resolve));
    server.kill();
    await exited;
  }
  if (log !== undefined) closeSync(log);
  await payload?.destroy();
  payload?.db.pool.on('error', () => {});
  assert.match(name, /^petta_test_\d+$/);
  await pool.query(`DROP DATABASE "${name}" WITH (FORCE)`);
  await pool.end();
}
process.exit(0);
