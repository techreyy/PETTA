import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const source = path => readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8');

test('About pillars expose native keyboard buttons with selected state and visible focus', () => {
  const about = source('app/(site)/about/page.tsx');
  assert.match(about, /<button[\s\S]*?type="button"[\s\S]*?aria-pressed=\{isActive\}/);
  assert.match(about, /focus-visible:ring/);
  assert.doesNotMatch(about, /<div[^>]*onClick=/);
});
 test('About renders emphasis rather than markdown and safe team profile links', () => {
  const about = source('app/(site)/about/page.tsx');
  assert.match(about, /<em>brise-soleil<\/em>/);
  assert.match(about, /href=\{`https:\/\/www.instagram.com\//);
  assert.match(about, /\^@\?\[A-Za-z0-9_.\]/);
});
 test('portfolio filters expose pressed state and cards have contextual heading levels', () => {
  const portfolio = source('app/(site)/portfolio/portfolio-view.tsx');
  assert.match(portfolio, /aria-pressed=\{selectedCategory === "all"\}/);
  assert.match(portfolio, /aria-pressed=\{selectedCategory === cat.slug\}/);
  assert.match(portfolio, /headingLevel=\{2\}/);
  assert.match(source('components/ProjectCard.tsx'), /headingLevel\?: 2 \| 3/);
});
 test('contact uses logical section headings and never promises a response deadline', () => {
  const contact = source('app/(site)/contact/page.tsx');
  assert.doesNotMatch(contact, /1x24|<h[34]/);
  assert.match(contact, /Pesan Anda telah tercatat/);
});
 test('About location has a parent section heading', () => {
  assert.match(source('app/(site)/about/page.tsx'), /<h2[^>]*>Lokasi &amp; Jangkauan Studio<\/h2>/);
});
