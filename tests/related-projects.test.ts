import test from 'node:test';
import assert from 'node:assert/strict';
import { relatedProjects } from '../src/lib/related-projects';

test('related projects prefer matching categories, exclude current and retain order', () => {
  const current = { slug: 'home', categorySlug: 'house' };
  const items = [current, { slug: 'office', categorySlug: 'commercial' }, { slug: 'villa', categorySlug: 'house' }, { slug: 'cottage', categorySlug: 'house' }];
  assert.deepEqual(relatedProjects(items, current).map(p => p.slug), ['villa', 'cottage']);
  assert.deepEqual(relatedProjects(items.slice(0, 3), current).map(p => p.slug), ['villa', 'office']);
  assert.deepEqual(relatedProjects([current], current), []);
});
