import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PAGE_CONTENT_DEFAULTS } from '../src/lib/page-content.ts';
import { getPageContent } from '../src/lib/get-page-content.ts';
import { PageTextGlobals } from '../src/cms/page-content.ts';
import AwardsView from '../src/components/AwardsView.tsx';
import ContactView from '../src/components/ContactView.tsx';
import { Header } from '../src/components/Header.tsx';
import { Footer } from '../src/components/Footer.tsx';
import { SettingsProvider } from '../src/lib/SettingsContext.tsx';
import { STUDIO_INFO } from '../src/lib/data.ts';

test('public loader handles query failure, reads again after saves and never requests protected data', async () => {
  process.env.DATABASE_URI = 'postgresql://unused';
  process.env.PAYLOAD_SECRET = 'test-secret-that-is-at-least-32-characters';
  let current = 'First save';
  const requests = [];
  globalThis.__contentPayload = async () => ({ findGlobal: async args => { requests.push(args); if (current === 'error') throw Error('test failure'); return { heading: current }; } });
  for (const slug of Object.keys(PAGE_CONTENT_DEFAULTS)) {
    current = 'First save';
    const key = slug === 'siteTextContent' ? 'navHome' : 'heading';
    // Unknown fields do not escape the resolver.
    assert.equal((await getPageContent(slug))[key], slug === 'siteTextContent' ? 'Home' : current);
    current = 'Second save';
    assert.equal((await getPageContent(slug))[key], slug === 'siteTextContent' ? 'Home' : current);
    current = 'error';
    assert.deepEqual(await getPageContent(slug), PAGE_CONTENT_DEFAULTS[slug]);
  }
  assert.equal(requests.length, 15);
  assert.ok(requests.every(request => request.depth === 0 && request.overrideAccess === false));
});

test('saving each global invalidates only its route or the shared public layout', async () => {
  globalThis.__invalidations = [];
  for (const config of PageTextGlobals) await config.hooks.afterChange[0]({});
  assert.deepEqual(globalThis.__invalidations, [['/services', 'page'], ['/awards', 'page'], ['/news', 'page'], ['/contact', 'page'], ['/', 'layout']]);
});

test('client views render editable text safely and keep functional filter values and contact option values', () => {
  const awardCopy = { ...PAGE_CONTENT_DEFAULTS.awardsPageContent, heading: '<script>injected</script>', allFilter: 'Everything' };
  const awards = renderToStaticMarkup(React.createElement(AwardsView, { copy: awardCopy }));
  assert.match(awards, /&lt;script&gt;injected&lt;\/script&gt;/);
  assert.match(awards, /Everything \(/);
  const contactCopy = { ...PAGE_CONTENT_DEFAULTS.contactPageContent, heading: 'Talk to {name}', architectureOption: 'Edited display only', submitLabel: 'Send now' };
  const contact = renderToStaticMarkup(React.createElement(ContactView, { copy: contactCopy }));
  assert.ok(contact.includes(`Talk to ${STUDIO_INFO.name}`));
  assert.match(contact, /value="Jasa Arsitektur &amp; Perencanaan \(Rumah \/ Gedung\)" selected="">Edited display only/);
  assert.match(contact, /Send now/);
});

test('navigation/footer edits preserve fixed routes and use current profile/social values', () => {
  const settings = { ...STUDIO_INFO, name: 'Current studio', founder: 'Current founder', instagram: 'https://example.test/current-social' };
  const siteCopy = { ...PAGE_CONTENT_DEFAULTS.siteTextContent, navServices: 'Our services', footerDescription: '{name} / {founder}', footerCopyright: '{year} {name}' };
  const html = renderToStaticMarkup(React.createElement(SettingsProvider, { settings, siteCopy }, React.createElement(Header), React.createElement(Footer)));
  assert.match(html, /href="\/services"/);
  assert.match(html, /Our services/);
  assert.match(html, /Current studio \/ Current founder/);
  assert.match(html, /https:\/\/example.test\/current-social/);
  assert.ok(html.includes(`${new Date().getFullYear()} Current studio`));
});
