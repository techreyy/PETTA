import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PAGE_CONTENT_DEFAULTS, resolvePageContent, fillCopyTemplate } from '../src/lib/page-content';
import { PageTextGlobals } from '../src/cms/page-content';

test('each text field independently falls back for missing, blank and invalid CMS data', () => {
  for (const slug of Object.keys(PAGE_CONTENT_DEFAULTS) as (keyof typeof PAGE_CONTENT_DEFAULTS)[]) {
    const defaults = PAGE_CONTENT_DEFAULTS[slug];
    for (const value of [undefined, null, [], 'invalid']) assert.deepEqual(resolvePageContent(slug, value), defaults);
    for (const field of Object.keys(defaults)) {
      for (const value of [undefined, null, '  ', 17, { text: 'invalid' }]) {
        assert.deepEqual(resolvePageContent(slug, { ...defaults, [field]: value }), defaults);
      }
      assert.equal((resolvePageContent(slug, { [field]: '<b>Edited</b>' }) as Record<string, string>)[field], '<b>Edited</b>');
    }
  }
});

test('profile and year tokens remain sourced from existing settings without recursive substitution', () => {
  assert.equal(fillCopyTemplate('Hello {name}, {founder}, {year}, {unknown}', { name: '<em>Studio</em>', founder: '{year}', year: '2026' }).join(''), 'Hello <em>Studio</em>, {year}, 2026, {unknown}');
});

test('globals expose text only, retain authorization and supply labels/defaults for every field', () => {
  assert.equal(PageTextGlobals.length, 5);
  for (const global of PageTextGlobals) {
    assert.equal(global.admin?.group, 'KONTEN WEBSITE');
    assert.ok(global.access?.read);
    assert.ok(global.access?.update);
    assert.equal(global.hooks?.afterChange?.length, 1);
    for (const field of global.fields) {
      assert.ok(field.type === 'text' || field.type === 'textarea');
      assert.ok('label' in field && field.label);
      assert.ok('defaultValue' in field && typeof field.defaultValue === 'string');
      assert.ok('name' in field && !/url|href|email$|phone$|address$/i.test(field.name));
    }
  }
});

test('new migration only creates/seeds new tables and retains them on rollback', () => {
  const source = readFileSync(new URL('../src/migrations/20261005_100000_page_text_content.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /\b(DROP|TRUNCATE|DELETE|ALTER|UPDATE)\s/i);
  assert.equal((source.match(/CREATE TABLE IF NOT EXISTS/g) || []).length, 5);
  assert.equal((source.match(/WHERE NOT EXISTS/g) || []).length, 5);
});
