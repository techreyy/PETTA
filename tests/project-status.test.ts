import test from 'node:test';
import assert from 'node:assert/strict';

const statusModule = await import('../src/lib/project-status').catch(() => null);

test('normalizes explicit canonical and legacy status labels without guessing mixed statuses', () => {
  assert.ok(statusModule, 'project-status helper must exist');
  const { getProjectStatus } = statusModule;
  for (const [input, expected] of [
    ['Built', 'built'], [' completed ', 'built'], ['ONGOING', 'ongoing'],
    ['Under Construction', 'ongoing'], ['In Progress', 'ongoing'],
    ['Proposed', 'proposed'], ['Concept', 'concept'], ['Design Development', 'concept'],
    ['Completed / Under Phasing', null], ['In Progress / Built', null],
    ['Built / Exhibition', null], ['unknown', null], ['', null], [undefined, null],
  ] as const) assert.equal(getProjectStatus(input), expected, String(input));
});

test('category and status filters intersect; all retains unclassified records and order', () => {
  assert.ok(statusModule && 'filterProjects' in statusModule, 'combined filter must exist');
  const projects = [
    { id: 'a', category: 'House', categorySlug: 'house', status: 'Completed' },
    { id: 'b', category: 'House', categorySlug: 'house', status: 'Proposed' },
    { id: 'c', category: 'Office', categorySlug: 'office', status: 'Built' },
    { id: 'd', category: 'House', categorySlug: 'house', status: 'Completed / Under Phasing' },
  ];
  const filter = statusModule.filterProjects;
  assert.deepEqual(filter(projects, 'house', 'built').map(p => p.id), ['a']);
  assert.deepEqual(filter(projects, 'all', 'built').map(p => p.id), ['a', 'c']);
  assert.deepEqual(filter(projects, 'house', 'all').map(p => p.id), ['a', 'b', 'd']);
  assert.deepEqual(filter(projects, 'office', 'concept'), []);
  assert.deepEqual(filter(projects, 'all', 'all'), projects);
});
