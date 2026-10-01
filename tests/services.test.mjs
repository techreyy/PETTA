import assert from 'node:assert/strict';
import { test } from 'node:test';

test('services fails closed without configuration and allows explicit empty demo', async () => {
  const { getServices } = await import('../src/lib/services.ts');
  delete process.env.DATABASE_URI;
  delete process.env.DEMO_CONTENT;
  globalThis.__servicesPayload = async () => { throw new Error('must not initialize'); };
  await assert.rejects(getServices, /CMS is not configured/);
  process.env.DEMO_CONTENT = 'true';
  assert.deepEqual(await getServices(), []);
  delete process.env.DEMO_CONTENT;
});

test('configured CMS stays authoritative and propagates failures', async () => {
  const { getServices } = await import('../src/lib/services.ts');
  process.env.DATABASE_URI = 'postgres://unused.invalid/test';
  process.env.PAYLOAD_SECRET = 'test-only-placeholder-not-a-secret-000000';
  process.env.DEMO_CONTENT = 'true';
  globalThis.__servicesPayload = async () => ({ find: async () => ({ docs: [] }) });
  assert.deepEqual(await getServices(), []);
  const failure = new Error('database unavailable');
  globalThis.__servicesPayload = async () => { throw failure; };
  await assert.rejects(getServices, error => error === failure);
  globalThis.__servicesPayload = async () => ({ find: async () => { throw failure; } });
  await assert.rejects(getServices, error => error === failure);
  delete process.env.DEMO_CONTENT;
});

test('getServices returns only active ordered public service fields', async () => {
  const { getServices } = await import('../src/lib/services.ts');
  process.env.DATABASE_URI = 'postgres://unused.invalid/test';
  process.env.PAYLOAD_SECRET = 'test-only-placeholder-not-a-secret-000000';
  globalThis.__servicesPayload = async () => ({ find: async query => {
    assert.equal(query.collection, 'services');
    assert.equal(query.overrideAccess, false);
    assert.equal(query.pagination, false);
    assert.deepEqual(query.where, { active: { equals: true } });
    assert.equal(query.sort, 'order');
    return { docs: [
      { id: 2, title: 'Second', description: 'B', order: 2, active: true },
      { id: 3, title: 'Hidden', description: 'C', order: 0, active: false },
      { id: 1, title: 'First', description: 'A', order: 1, active: true },
    ] };
  } });
  assert.deepEqual(await getServices(), [
    { id: '1', title: 'First', description: 'A', order: 1 },
    { id: '2', title: 'Second', description: 'B', order: 2 },
  ]);
});
