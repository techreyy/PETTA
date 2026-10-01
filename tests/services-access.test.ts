import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as editorial from '../src/cms/editorial';
import type { Access, PayloadRequest } from 'payload';

test('services enforces publishing roles, owner deletion and active-only public reads', async () => {
  const services = editorial.Services;
  assert.ok(services, 'Services collection must exist');
  assert.equal(services.slug, 'services');
  const check = (action: 'read' | 'create' | 'update' | 'delete', role?: string, active = true) =>
    (services.access![action] as Access)({ req: { user: role ? { role, active } : null } as PayloadRequest });
  assert.deepEqual(await check('read'), { active: { equals: true } });
  assert.deepEqual(await check('read', 'owner', false), { active: { equals: true } });
  for (const action of ['create', 'update'] as const) {
    assert.equal(await check(action, 'owner'), true);
    assert.equal(await check(action, 'admin'), true);
    assert.equal(await check(action, 'editor'), false);
    assert.equal(await check(action, 'owner', false), false);
    assert.equal(await check(action), false);
  }
  assert.equal(await check('delete', 'owner'), true);
  assert.equal(await check('delete', 'admin'), false);
  assert.equal(await check('delete', 'editor'), false);
  assert.equal(await check('delete', 'owner', false), false);
  assert.equal(await check('read', 'editor'), true);
  for (const name of ['title', 'description', 'order', 'active']) {
    assert.ok(services.fields.some(field => 'name' in field && field.name === name));
  }
});
