// Run: node --import ./tests/content-loader.mjs --test tests/content.test.mjs
// No .env loading, network, writes, or database required. Node >= 22.15.
import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { getContent, getProject, getNews } from "../src/lib/content.ts";
import { PROJECTS, NEWS_ITEMS } from "../src/lib/data.ts";

beforeEach(() => {
  process.env.DATABASE_URI = "postgres://unused.invalid/content-regression";
  process.env.PAYLOAD_SECRET = "test-only-placeholder-not-a-secret-000000";
  delete process.env.DEMO_CONTENT;
  globalThis.__contentPayload = async () => ({
    find: async () => ({ docs: [] }),
    findGlobal: async () => ({}),
  });
});

for (const [name, read, slug] of [
  ["project", getProject, PROJECTS[0].slug],
  ["news", getNews, NEWS_ITEMS[0].slug],
]) {
  test(`missing CMS ${name} returns null even for a static slug`, async () => {
    assert.equal((await read(slug)) === null, true);
  });
}

for (const stage of ["initialization", "query", "settings"]) {
  for (const [name, read] of [
    ["lists", getContent],
    ...(stage === "settings"
      ? []
      : [
          ["project", () => getProject(PROJECTS[0].slug)],
          ["news", () => getNews(NEWS_ITEMS[0].slug)],
        ]),
  ]) {
    test(`${name} propagates CMS ${stage} failure`, async () => {
      const failure = new Error(`CMS ${stage} unavailable`);
      process.env.DEMO_CONTENT = "true";
      globalThis.__contentPayload = async () => {
        if (stage === "initialization") throw failure;
        return {
          find: async () => {
            if (stage === "query") throw failure;
            return { docs: [] };
          },
          findGlobal: async () => {
            throw failure;
          },
        };
      };
      await assert.rejects(read, (error) => error === failure);
    });
  }
}

for (const [name, read] of [
  ["lists", getContent],
  ["project", () => getProject(PROJECTS[0].slug)],
  ["news", () => getNews(NEWS_ITEMS[0].slug)],
]) {
  test(`${name} fails closed without CMS configuration or explicit demo opt-in`, async () => {
    delete process.env.DATABASE_URI;
    await assert.rejects(read, /CMS is not configured/);
  });
}

test("explicit demo opt-in works without CMS configuration", async () => {
  delete process.env.DATABASE_URI;
  process.env.DEMO_CONTENT = "true";
  globalThis.__contentPayload = () => {
    throw new Error("Demo must not contact CMS");
  };
  assert.deepEqual((await getContent()).projects, PROJECTS);
  assert.deepEqual((await getProject(PROJECTS[0].slug)).project, PROJECTS[0]);
  assert.deepEqual((await getNews(NEWS_ITEMS[0].slug)).item, NEWS_ITEMS[0]);
});

test("missing CMS settings are an error, not static studio settings", async () => {
  globalThis.__contentPayload = async () => ({
    find: async () => ({ docs: [] }),
    findGlobal: async () => null,
  });
  await assert.rejects(getContent, /CMS site settings are missing/);
});

test("configured CMS empty collections stay empty, including with demo opt-in", async () => {
  process.env.DEMO_CONTENT = "true";
  const content = await getContent();
  for (const key of [
    "projects",
    "categories",
    "news",
    "team",
    "awards",
    "competitions",
  ]) {
    assert.equal(
      content[key].length,
      0,
      `${key} must not resurrect static content`,
    );
  }
});

test("shared lists omit heavy fields while project detail keeps its gallery", async () => {
  const calls = [];
  globalThis.__contentPayload = async () => ({
    findGlobal: async () => ({}),
    find: async (query) => {
      calls.push(query);
      return { docs: query.collection === 'projects' && query.limit === 1 ? [{
        id: 1, slug: 'gallery', title: 'Gallery', gallery: [{ imageUrl: '/one.webp' }],
      }] : [] };
    },
  });
  await getContent();
  assert.deepEqual(calls.find(q => q.collection === 'projects').select, { gallery: false, description: false, seo: false });
  assert.equal(calls.find(q => q.collection === 'projects').depth, 1);
  assert.deepEqual(calls.find(q => q.collection === 'news').select, { body: false, seo: false });
  const detail = await getProject('gallery');
  assert.deepEqual(detail.project.gallery, ['/one.webp']);
  assert.equal(calls.at(-1).select, undefined);
  assert.equal(calls.at(-1).depth, 1);
  assert.equal(calls.at(-1).pagination, false);
});

test('news detail skips unused totals and preserves the published-only read', async () => {
  let options;
  globalThis.__contentPayload = async () => ({
    find: async query => { options = query; return { docs: [] }; },
  });
  await getNews('missing');
  assert.equal(options.pagination, false);
  assert.equal(options.limit, 1);
  assert.equal(options.overrideAccess, false);
  assert.deepEqual(options.where.and[1], { _status: { equals: 'published' } });
});
