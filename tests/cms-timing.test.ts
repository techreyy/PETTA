import assert from 'node:assert/strict';
import test from 'node:test';
import type { Payload } from 'payload';
import { withCMSTiming } from '../src/lib/cms-timing';

test('CMS timing is opt-in, disabled in production, and preserves results/errors without logging arguments', async () => {
  const previous = { node: process.env.NODE_ENV, timing: process.env.PETTA_CMS_TIMING };
  const env: Record<string, string | undefined> = process.env;
  const log = console.info;
  const messages: string[] = [];
  const failure = new Error('private error detail');
  const payload = { find: async () => ({ docs: [] }), findGlobal: async () => { throw failure; } } as unknown as Payload;
  try {
    console.info = message => messages.push(message);
    process.env.PETTA_CMS_TIMING = 'true';
    env.NODE_ENV = 'production';
    assert.equal(withCMSTiming(payload), payload);
    env.NODE_ENV = 'development';
    delete process.env.PETTA_CMS_TIMING;
    assert.equal(withCMSTiming(payload), payload);
    process.env.PETTA_CMS_TIMING = 'true';
    const timed = withCMSTiming(payload);
    assert.deepEqual(await timed.find({ collection: 'projects', where: { slug: { equals: 'private-slug' } } }), { docs: [] });
    await assert.rejects(timed.findGlobal({ slug: 'siteSettings' }), error => error === failure);
    assert.equal(messages.length, 2);
    assert.match(messages[0], /find:projects:list .*ms/);
    assert.ok(messages.every(message => !message.includes('private')));
  } finally {
    console.info = log;
    if (previous.node === undefined) delete env.NODE_ENV; else env.NODE_ENV = previous.node;
    if (previous.timing === undefined) delete process.env.PETTA_CMS_TIMING; else process.env.PETTA_CMS_TIMING = previous.timing;
  }
});
