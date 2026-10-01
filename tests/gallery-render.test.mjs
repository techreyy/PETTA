import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import ProjectDetailPage from '../src/app/(site)/portfolio/[slug]/page.tsx';

async function render(gallery) {
  globalThis.__galleryProject = { id: '1', slug: 'gallery-test', title: 'Gallery test', heroImage: '/hero.webp', description: [], gallery };
  return renderToStaticMarkup(await ProjectDetailPage({ params: Promise.resolve({ slug: 'gallery-test' }) }));
}

test('empty gallery renders the hero plate and a matching count', async () => {
  const html = await render([]);
  assert.ok(html.includes('1 Plates'));
  assert.ok(html.includes('alt="Gallery test gallery plate 1"'));
  assert.equal((html.match(/src="\/hero.webp"/g) || []).length, 2);
});

test('gallery preserves uploaded plate order and chooses sizes per column', async () => {
  const html = await render(['/one.webp', '/two.webp']);
  assert.ok(html.includes('2 Plates'));
  assert.ok(html.indexOf('/one.webp') < html.indexOf('/two.webp'));
  assert.ok(html.includes('sizes="(max-width: 1280px) 100vw, 1184px"'));
  assert.ok(html.includes('sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 576px"'));
});
