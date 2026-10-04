// node --import ./tests/cms-editorial-loader.mjs --test tests/about-page-content.test.mjs
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AboutView } from '../src/components/AboutView.tsx';
import { getAboutPageContent } from '../src/lib/get-about-page-content.ts';
import { DEFAULT_ABOUT_PAGE_CONTENT, resolveAboutPageContent } from '../src/lib/about-page-content.ts';

const render = (aboutContent) => renderToStaticMarkup(React.createElement(AboutView, { aboutContent }));

test('about copy defaults preserve existing emphasis, structure, and credentials', () => {
  const html = render();
  assert.ok(html.includes('Arsitektur yang'));
  assert.ok(html.includes('<span class="font-serif italic font-normal text-[#39756B]">berpijak</span>'));
  assert.ok(html.includes('<span class="text-[#6B7785] font-light">&amp;</span>'));
  assert.ok(html.includes('bernapas.'));
  assert.ok(html.includes(`<strong class="text-[#14191E]">${DEFAULT_ABOUT_PAGE_CONTENT.principalName}</strong>`));
  assert.ok(html.includes('<em>brise-soleil</em>'));
  assert.ok(html.includes('<strong>Petta Desain</strong>'));
  assert.ok(html.includes('<strong>Petta Konstruksi</strong>'));
  assert.ok(html.includes('<strong>Petta Printlab</strong>'));
  assert.ok(html.includes('<strong>Archtech Kendari</strong>'));
  assert.ok(html.includes('<strong>Arsitek Kendari Network</strong>'));
  assert.ok(html.includes('Mulai Konsultasi Proyek'));
  assert.ok(!html.includes('MT., IAI'));
  assert.ok(!html.includes('{founderName}'));
  assert.deepEqual(resolveAboutPageContent({ heroTitle: ' ', heroIntro: null }), DEFAULT_ABOUT_PAGE_CONTENT);
  assert.deepEqual(resolveAboutPageContent(null), DEFAULT_ABOUT_PAGE_CONTENT);
});

test('CMS fields render safely without HTML injection while preserving layout and links', () => {
  const copy = {
    ...DEFAULT_ABOUT_PAGE_CONTENT,
    heroTitle: 'Konsep Baru\n**tumbuh** & dinamis',
    heroIntro: 'Karya oleh **{founderName}**',
    principalName: 'Ar. Nama Baru, S.Ars.',
    philosophyTitle: 'Filosofi Baru',
    missionTitle: 'Misi Baru',
    ctaHeading: 'Hubungi Studio Kami <script>alert(1)</script>',
    ctaButtonLabel: 'Kirim Proposal',
  };
  const html = render(copy);
  assert.ok(html.includes('Konsep Baru'));
  assert.ok(html.includes('<span class="font-serif italic font-normal text-[#39756B]">tumbuh</span>'));
  assert.ok(html.includes('dinamis'));
  assert.ok(html.includes('Karya oleh <strong class="text-[#14191E]">Ar. Nama Baru, S.Ars.</strong>'));
  assert.ok(html.includes('Filosofi Baru'));
  assert.ok(html.includes('Misi Baru'));
  assert.ok(html.includes('Hubungi Studio Kami &lt;script&gt;'));
  assert.ok(html.includes('Kirim Proposal'));
  assert.match(html, /href="\/contact"[^>]*>Kirim Proposal/);
  assert.ok(!html.includes('<script>alert(1)</script>'));
});

test('about page reads saved copy on successive requests and falls back if the new global is unavailable', async () => {
  process.env.DATABASE_URI = 'postgres://unused.invalid/about-regression';
  process.env.PAYLOAD_SECRET = 'test-only-placeholder-not-a-secret-000000';
  let current = { ...DEFAULT_ABOUT_PAGE_CONTENT, philosophyTitle: 'Filosofi Simpanan 1' };
  globalThis.__contentPayload = async () => ({
    findGlobal: async (query) => {
      assert.deepEqual(query, { slug: 'aboutPageContent', depth: 0, overrideAccess: false });
      return current;
    },
  });
  assert.equal((await getAboutPageContent()).philosophyTitle, 'Filosofi Simpanan 1');
  current = { ...current, philosophyTitle: 'Filosofi Simpanan 2' };
  assert.equal((await getAboutPageContent()).philosophyTitle, 'Filosofi Simpanan 2');
  current = null;
  assert.deepEqual(await getAboutPageContent(), DEFAULT_ABOUT_PAGE_CONTENT);
  globalThis.__contentPayload = async () => { throw new Error('Global table not available'); };
  assert.deepEqual(await getAboutPageContent(), DEFAULT_ABOUT_PAGE_CONTENT);
  delete process.env.DATABASE_URI;
  assert.deepEqual(await getAboutPageContent(), DEFAULT_ABOUT_PAGE_CONTENT);
});

test('about page requests its copy at the page boundary and retains dynamic rendering', () => {
  const page = readFileSync(new URL('../src/app/(site)/about/page.tsx', import.meta.url), 'utf8');
  const layout = readFileSync(new URL('../src/app/(site)/layout.tsx', import.meta.url), 'utf8');
  assert.match(page, /getAboutPageContent\(\)/);
  assert.match(page, /<AboutView aboutContent=\{aboutContent\}/);
  assert.match(page, /dynamic = 'force-dynamic'/);
  assert.match(layout, /dynamic = 'force-dynamic'/);
});
