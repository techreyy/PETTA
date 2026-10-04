// node --import ./tests/cms-editorial-loader.mjs --test tests/homepage-content.test.mjs
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { HomeView } from '../src/components/HomeView.tsx';
import { getHomepageContent } from '../src/lib/get-homepage-content.ts';
import { DEFAULT_HOMEPAGE_CONTENT, resolveHomepageContent } from '../src/lib/homepage-content.ts';

const render = (homepageContent) => renderToStaticMarkup(React.createElement(HomeView, { homepageContent }));

test('homepage copy defaults preserve existing emphasis and correct founder credentials', () => {
  const html = render();
  assert.ok(html.includes(`<strong>${DEFAULT_HOMEPAGE_CONTENT.founderName}</strong>`));
  for (const name of ['Petta Desain', 'Petta Konstruksi', 'Petta Printlab']) assert.ok(html.includes(`<strong>${name}</strong>`));
  assert.ok(!html.includes('MT., IAI'));
  assert.ok(!html.includes('{founderName}'));
  assert.deepEqual(resolveHomepageContent({ headline: ' ', leftParagraph: null }), DEFAULT_HOMEPAGE_CONTENT);
  assert.deepEqual(resolveHomepageContent(null), DEFAULT_HOMEPAGE_CONTENT);
});

test('all seven CMS fields render safely while CTA URL stays unchanged', () => {
  const copy = {
    eyebrow: 'Lokasi baru', services: 'Layanan baru', headline: 'Headline baru',
    leftParagraph: 'Kiri **{founderName}**', rightParagraph: 'Kanan <script>alert(1)</script>',
    founderName: 'Pendiri Baru', ctaLabel: 'CTA baru',
  };
  const html = render(copy);
  for (const text of ['Lokasi baru', 'Layanan baru', 'Headline baru', 'Kiri <strong>Pendiri Baru</strong>', 'Kanan &lt;script&gt;', 'CTA baru']) assert.ok(html.includes(text), text);
  assert.match(html, /href="\/about"[^>]*>CTA baru/);
  assert.ok(!html.includes('<script>alert(1)</script>'));
});

test('homepage reads saved copy on successive requests and falls back if the new global is unavailable', async () => {
  process.env.DATABASE_URI = 'postgres://unused.invalid/homepage-regression';
  process.env.PAYLOAD_SECRET = 'test-only-placeholder-not-a-secret-000000';
  let current = { ...DEFAULT_HOMEPAGE_CONTENT, headline: 'Saved first' };
  globalThis.__contentPayload = async () => ({
    findGlobal: async (query) => {
      assert.deepEqual(query, { slug: 'homepageContent', depth: 0, overrideAccess: false });
      return current;
    },
  });
  assert.equal((await getHomepageContent()).headline, 'Saved first');
  current = { ...current, headline: 'Saved again' };
  assert.equal((await getHomepageContent()).headline, 'Saved again');
  current = null;
  assert.deepEqual(await getHomepageContent(), DEFAULT_HOMEPAGE_CONTENT);
  globalThis.__contentPayload = async () => { throw new Error('Global table not available'); };
  assert.deepEqual(await getHomepageContent(), DEFAULT_HOMEPAGE_CONTENT);
  delete process.env.DATABASE_URI;
  assert.deepEqual(await getHomepageContent(), DEFAULT_HOMEPAGE_CONTENT);
});

test('homepage requests its copy at the page boundary and retains dynamic rendering', () => {
  const page = readFileSync(new URL('../src/app/(site)/page.tsx', import.meta.url), 'utf8');
  const layout = readFileSync(new URL('../src/app/(site)/layout.tsx', import.meta.url), 'utf8');
  assert.match(page, /getHomepageContent\(\)/);
  assert.match(page, /<HomeView homepageContent=\{homepageContent\}/);
  assert.match(layout, /dynamic = 'force-dynamic'/);
});
