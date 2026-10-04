// Run: node --import ./tests/cms-editorial-loader.mjs --test tests/about-portrait.test.mjs
import assert from 'node:assert/strict';
import { test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import AboutPage from '../src/app/(site)/about/page.tsx';
import { ProjectProvider } from '../src/lib/ProjectContext.tsx';
import { SettingsProvider } from '../src/lib/SettingsContext.tsx';
import { getContent } from '../src/lib/content.ts';
import { STUDIO_INFO } from '../src/lib/data.ts';

const render = (content) => renderToStaticMarkup(
  React.createElement(SettingsProvider, { settings: content.settings },
    React.createElement(ProjectProvider, content, React.createElement(AboutPage))),
);

test('About founder and grid use the same CMS portrait across repeated photo changes', async () => {
  process.env.DATABASE_URI = 'postgres://unused.invalid/about-regression';
  process.env.PAYLOAD_SECRET = 'test-only-placeholder-not-a-secret-000000';
  const founder = {
    id: 42, name: STUDIO_INFO.founder, roleTitle: 'Principal Architect / Design Director',
    portraitUrl: '/legacy-portrait.jpg',
  };
  let docs = [
    { id: 99, name: 'Other member', roleTitle: 'Architect', portrait: { url: '/other.jpg' } },
    founder,
  ];
  globalThis.__contentPayload = async () => ({
    findGlobal: async () => STUDIO_INFO,
    find: async (query) => {
      if (query.collection !== 'team') return { docs: [] };
      assert.equal(query.depth, 1);
      assert.deepEqual(query.where, { active: { equals: true } });
      return { docs };
    },
  });
  for (const [id, url] of [[101, '/latest-portrait.jpg'], [102, '/replacement-portrait.png']]) {
    founder.portrait = { id, url };
    const content = await getContent();
    assert.equal(content.team[1].portrait, url);
    const html = render(content);
    const images = [...html.matchAll(/<img\b[^>]*>/g)].map(([tag]) => tag);
    assert.equal(images.length, 3);
    assert.ok(images[0].includes(`src="${url}"`), 'Founder spotlight uses CMS portrait');
    assert.ok(images[2].includes(`src="${url}"`), 'Founder grid uses identical CMS portrait');
    assert.ok(!html.includes('/legacy-portrait.jpg'));
    assert.ok(!html.includes('photo-1507003211169-0a1dd7228f2d'));
  }
  founder.portrait = null;
  founder.portraitUrl = '';
  let html = render(await getContent());
  assert.equal([...html.matchAll(/<img\b/g)].length, 1, 'Missing portraits do not resurrect old images');
  docs = docs.filter((member) => member.id !== founder.id);
  html = render(await getContent());
  assert.equal([...html.matchAll(/<img\b/g)].length, 1, 'Missing founder never selects another member as the hero');
});
