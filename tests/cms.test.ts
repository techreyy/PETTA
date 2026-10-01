import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';

test('real PostgreSQL: permissions, drafts, gallery preservation and contact persistence', { timeout: 120000 }, async (t) => {
  assert.ok(process.env.DATABASE_URI, 'Configure local PostgreSQL before integration tests.');
  assert.match(process.env.PETTA_TEST_DATABASE || '', /^petta_test_\d+$/, 'Run through npm test so the database is isolated.');
  assert.equal(new URL(process.env.DATABASE_URI).pathname, `/${process.env.PETTA_TEST_DATABASE}`);
  const { getPayload } = await import('payload');
  const config = (await import('../src/payload.config')).default;
  const payload = await getPayload({ config });
  const { closeInquiryPool } = await import('../src/lib/inquiry-rate-limit');
  try {
    await payload.db.migrate();
    const password = randomBytes(24).toString('base64url');
    const owner = await payload.create({ collection: 'users', context: { bootstrapOwner: true }, data: { email: 'owner@example.test', name: 'Test Owner', password, role: 'owner', active: true } });
    const ownerUser = { ...owner, collection: 'users' as const };
    const editor = await payload.create({ collection: 'users', user: ownerUser, overrideAccess: false, data: { email: 'editor@example.test', name: 'Test Editor', password, role: 'editor', active: true } });
    const editorUser = { ...editor, collection: 'users' as const };
    const category = await payload.create({ collection: 'portfolioCategories', user: ownerUser, overrideAccess: false, data: { title: 'House', slug: 'house', description: 'Test category' } });
    const project = await payload.create({ collection: 'projects', user: ownerUser, overrideAccess: false, data: { title: 'Gallery test', slug: 'gallery-test', category: category.id, heroImageUrl: '/petta-logo-transparent.png', gallery: [{ imageUrl: '/one.jpg' }, { imageUrl: '/two.jpg' }], _status: 'published' } });

    await t.test('anonymous cannot create users, projects, inquiries or read private messages', async () => {
      await assert.rejects(payload.create({ collection: 'users', overrideAccess: false, data: { email: 'attacker@example.test', name: 'Attacker', password, role: 'owner' } }));
      await assert.rejects(payload.create({ collection: 'projects', overrideAccess: false, data: { title: 'No', slug: 'no', category: category.id } }));
      await assert.rejects(payload.create({ collection: 'inquiries', overrideAccess: false, data: { fullName: 'Test', email: 'x@example.test', subject: 'Test', message: 'Unauthorized write', status: 'new' } }));
      await assert.rejects(payload.find({ collection: 'inquiries', overrideAccess: false }));
      await assert.rejects(payload.find({ collection: 'users', overrideAccess: false }));
    });
    await t.test('editor cannot create owners, delete, publish or alter global settings', async () => {
      await assert.rejects(payload.create({ collection: 'users', user: editorUser, overrideAccess: false, data: { email: 'other@example.test', name: 'Other', password, role: 'owner' } }));
      await assert.rejects(payload.delete({ collection: 'projects', id: project.id, user: editorUser, overrideAccess: false }));
      await assert.rejects(payload.update({ collection: 'projects', id: project.id, user: editorUser, overrideAccess: false, data: { _status: 'published' } }));
      await assert.rejects(payload.updateGlobal({ slug: 'siteSettings', user: editorUser, overrideAccess: false, data: { phone: '1234' } }));
    });
    await t.test('media used by an inactive brand logo cannot be deleted', async () => {
      const sharp = (await import('sharp')).default;
      const data = await sharp({ create: { width: 8, height: 8, channels: 3, background: '#ffffff' } }).png().toBuffer();
      const media = await payload.create({ collection: 'media', data: { alt: 'Protected partner logo' }, file: { data, mimetype: 'image/png', name: 'protected-partner.png', size: data.length } });
      const logo = await payload.create({ collection: 'brandLogos', data: { name: 'Hidden partner', group: 'client', logo: media.id, active: false } });
      await assert.rejects(payload.delete({ collection: 'media', id: media.id, user: ownerUser, overrideAccess: false }), /referenced by content/);
      await payload.delete({ collection: 'brandLogos', id: logo.id });
      await payload.delete({ collection: 'media', id: media.id });
    });
    await t.test('editing title preserves every gallery image and the slug', async () => {
      const edited = await payload.update({ collection: 'projects', id: project.id, user: ownerUser, overrideAccess: false, data: { title: 'Updated title' } });
      assert.deepEqual(edited.gallery?.map(row => row.imageUrl), ['/one.jpg', '/two.jpg']);
      assert.equal(edited.slug, 'gallery-test');
    });
    await t.test('new project generates an address and category versions block deletion', async () => {
      const originalCategory = await payload.create({ collection: 'portfolioCategories', data: { title: 'Version category', slug: 'version-category', description: 'Version protection' } });
      const automatic = await payload.create({ collection: 'projects', user: ownerUser, overrideAccess: false, data: { title: 'Rumah Tropis Baru', slug: '', category: originalCategory.id, _status: 'published' } });
      assert.equal(automatic.slug, 'rumah-tropis-baru');
      await payload.update({ collection: 'projects', id: automatic.id, user: ownerUser, overrideAccess: false, data: { category: category.id } });
      await assert.rejects(payload.delete({ collection: 'portfolioCategories', id: originalCategory.id, user: ownerUser, overrideAccess: false }), /saved version references/);
    });
    await t.test('editor drafts do not leak into public reads', async () => {
      const draft = await payload.create({ collection: 'projects', user: editorUser, overrideAccess: false, draft: true, data: { title: 'Private draft', slug: 'private-draft', category: category.id } });
      const result = await payload.find({ collection: 'projects', overrideAccess: false, where: { id: { equals: draft.id } } });
      assert.equal(result.totalDocs, 0);
      await payload.update({ collection: 'projects', id: project.id, user: editorUser, overrideAccess: false, draft: true, data: { title: 'Unpublished revision' } });
      const published = await payload.findByID({ collection: 'projects', id: project.id, overrideAccess: false });
      assert.equal(published.title, 'Updated title');
    });
    await t.test('disabled account cannot authenticate', async () => {
      await payload.update({ collection: 'users', id: editor.id, user: ownerUser, overrideAccess: false, data: { active: false } });
      await assert.rejects(payload.login({ collection: 'users', data: { email: editor.email, password } }));
    });
    await t.test('contact reports success only after database commit, validates origin and throttles concurrent requests', async () => {
      const { POST } = await import('../src/app/(site)/api/contact/route');
      const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const body = { fullName: 'Inquiry Test', email: 'contact@example.test', subject: 'House design', message: 'Please discuss a new architecture project with me.', phone: '' };
      const request = (originValue = origin) => new Request(`${origin}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: originValue }, body: JSON.stringify(body) });
      assert.equal((await POST(request('https://untrusted.example'))).status, 403);
      const responses = await Promise.all(Array.from({ length: 5 }, () => POST(request())));
      assert.equal(responses.filter(r => r.status === 201).length, 3);
      assert.equal(responses.filter(r => r.status === 429).length, 2);
      const rows = await payload.find({ collection: 'inquiries', where: { email: { equals: body.email } } });
      assert.equal(rows.totalDocs, 3);
      assert.equal(rows.docs[0].message, body.message);
      const savedSecret = process.env.PAYLOAD_SECRET;
      process.env.PAYLOAD_SECRET = '';
      assert.equal((await POST(request())).status, 503);
      process.env.PAYLOAD_SECRET = savedSecret;
    });
  } finally {
    await closeInquiryPool();
    await payload.destroy();
  }
});
