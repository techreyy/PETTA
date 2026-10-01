import test from 'node:test';
import assert from 'node:assert/strict';
import { studioStructuredData } from '../src/lib/structured-data';

test('studio structured data uses current settings and escapes script boundaries', () => {
  const text = studioStructuredData({ name: 'Studio </script>', address: 'Kendari', phone: '123', email: 'hello@example.com', instagram: 'https://instagram.com/studio', facebook: '' }, 'https://example.com');
  assert.ok(!text.includes('<'));
  const data = JSON.parse(text);
  assert.equal(data.name, 'Studio </script>');
  assert.equal(data['@type'], 'LocalBusiness');
  assert.equal(data.url, 'https://example.com');
  assert.deepEqual(data.sameAs, ['https://instagram.com/studio']);
});
