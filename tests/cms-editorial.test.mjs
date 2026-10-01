import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getContent } from '../src/lib/content.ts';

test('CMS supplies active uploaded logos only, ordered, without resurrecting missing assets', async () => {
  process.env.DATABASE_URI = 'postgres://unused.invalid/test';
  process.env.PAYLOAD_SECRET = 'test-only-placeholder-not-a-secret-000000';
  const calls = [];
  globalThis.__contentPayload = async () => ({
    findGlobal: async () => ({}),
    find: async (query) => {
      calls.push(query);
      return { docs: query.collection === 'brandLogos' ? [
        { id: 1, name: 'Real partner', group: 'collaborator', active: true, order: 2, alt: 'Partner logo', logo: { url: '/media/partner.png' }, url: 'https://example.org' },
        { id: 2, name: 'Hidden', group: 'client', active: false, logo: { url: '/hidden.png' } },
        { id: 3, name: 'Missing upload', group: 'media', active: true, logo: 7 },
      ] : [] };
    },
  });
  const { settings } = await getContent();
  assert.deepEqual(settings.editorial?.logos, [{ id: '1', name: 'Real partner', group: 'collaborator', alt: 'Partner logo', image: '/media/partner.png', url: 'https://example.org' }]);
  assert.equal(calls.find(c => c.collection === 'brandLogos')?.overrideAccess, false);
  assert.deepEqual(calls.find(c => c.collection === 'brandLogos')?.where, { active: { equals: true } });
});
