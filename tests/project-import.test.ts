import assert from 'node:assert/strict';
import test from 'node:test';
import { discoverProjects, CATEGORY_DEFINITIONS } from '../scripts/project-import-plan';

test('catalog has eleven unique requested categories', () => {
 assert.equal(CATEGORY_DEFINITIONS.length, 11);
 assert.equal(new Set(CATEGORY_DEFINITIONS.map(c => c.slug)).size, 11);
 assert.ok(CATEGORY_DEFINITIONS.some(c => c.title === 'Social and Cultural Function Buildings'));
});
test('groups nested interior/exterior images under one project without guessing status', () => {
 const result = discoverProjects([
 'Commercial Building/2025/SPORT CENTER/EXTERIOR/1.png',
 'Commercial Building/2025/SPORT CENTER/INTERIOR/2.jpg',
 'Commercial Building/2026/HOTEL BARAKA/1.png',
 'Social and Cultural Function Buildings/2025/SMART SCHOOL/1.png',
 'Private House/2026/F-HOUSE/notes.txt',
 ]);
 assert.equal(result.length,3);
 const sport = result.find(p => p.title === 'SPORT CENTER')!;
 assert.equal(sport.images.length,2);
 assert.equal(sport.categorySlug,'institutional-public');
 assert.equal(result.find(p => p.title === 'HOTEL BARAKA')?.categorySlug,'hospitality');
 assert.equal(result.find(p => p.title === 'SMART SCHOOL')?.categorySlug,'social-cultural-function-buildings');
 assert.ok(result.every(p => !('status' in p)));
});
