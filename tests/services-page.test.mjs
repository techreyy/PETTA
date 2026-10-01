import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

test('sitemap includes the services landing page', async () => {
  const { default: sitemap } = await import('../src/app/sitemap.ts');
  const entries = await sitemap();
  assert.ok(entries.some(entry => new URL(entry.url).pathname === '/services'));
});

test('navigation exposes Services and keeps long category menus usable', async () => {
  const { Header } = await import('../src/components/Header.tsx');
  const { Footer } = await import('../src/components/Footer.tsx');
  const header = renderToStaticMarkup(React.createElement(Header));
  const footer = renderToStaticMarkup(React.createElement(Footer));
  assert.match(header, /href="\/services"/);
  assert.match(header, /aria-current="page"/);
  assert.match(footer, /href="\/services"/);
  const source = readFileSync(new URL('../src/components/Header.tsx', import.meta.url), 'utf8');
  assert.equal((source.match(/href="\/services"/g) || []).length, 2, 'desktop and mobile links');
  assert.match(source, /max-h-\[calc\(100dvh-8rem\)\] overflow-y-auto/);
  assert.match(source, /aria-controls="mobile-project-navigation"/);
  assert.match(source, /shrink-0/);
});

test('services route renders CMS records in loader order without a static fallback', async () => {
  const { default: Page, metadata } = await import('../src/app/(site)/services/page.tsx');
  globalThis.__pageServices = [
    { id: 'b', title: 'Custom capability B', description: 'Bespoke scope from CMS' },
    { id: 'a', title: 'Custom capability A', description: 'Another scope' },
  ];
  const html = renderToStaticMarkup(await Page());
  assert.ok(html.includes('Bespoke scope from CMS'));
  assert.ok(html.indexOf('Custom capability B') < html.indexOf('Custom capability A'));
  assert.match(html, /href="\/contact"/);
  assert.equal(metadata.alternates.canonical, '/services');
  globalThis.__pageServices = [];
  const empty = renderToStaticMarkup(await Page());
  assert.ok(!empty.includes('Custom capability'));
  assert.ok(!empty.includes('Architecture'));
  assert.match(empty, /Hubungi studio/);
});
