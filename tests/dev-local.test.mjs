import test from 'node:test';
import assert from 'node:assert/strict';

const load = () => import('../scripts/dev-local-runtime.mjs');

test('readiness timeout cleans up owned database and never launches dev', async () => {
  const { startLocalSession } = await load();
  let stopped = false;
  await assert.rejects(startLocalSession({
    probe: async () => 'stopped',
    startDatabase: async () => ({ stop: async () => { stopped = true; } }),
    startDev: async () => assert.fail('not ready'),
    timeoutMs: 0,
  }), /timed out/);
  assert.equal(stopped, true);
});

test('cleanup is idempotent and never stops a reused database', async () => {
  const { startLocalSession } = await load();
  let stops = 0;
  const session = await startLocalSession({
    probe: async () => 'ready',
    startDatabase: async () => assert.fail('must reuse'),
    startDev: async () => ({ stop: async () => { stops++; } }),
  });
  await Promise.all([session.stop(), session.stop()]);
  assert.equal(stops, 1);
});

test('refuses an occupied port with invalid credentials without starting or stopping anything', async () => {
  const { startLocalSession } = await load();
  await assert.rejects(startLocalSession({
    probe: async () => 'busy',
    startDatabase: async () => assert.fail('must not start a second database'),
    startDev: async () => assert.fail('must not start dev'),
  }), /occupied/);
});

test('starts dev only after the owned database answers a readiness query', async () => {
  const { startLocalSession } = await load();
  const events = [];
  const states = ['stopped', 'busy', 'ready'];
  const session = await startLocalSession({
    probe: async () => { const state = states.shift(); events.push(state); return state; },
    startDatabase: async () => { events.push('db'); return { stop: async () => events.push('stop-db') }; },
    startDev: async () => { events.push('dev'); return { stop: async () => events.push('stop-dev') }; },
    pause: async () => {},
  });
  assert.deepEqual(events, ['stopped', 'db', 'busy', 'ready', 'dev']);
  await session.stop();
  assert.deepEqual(events.slice(-2), ['stop-dev', 'stop-db']);
});
