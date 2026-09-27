import test from 'node:test';
import assert from 'node:assert/strict';
import { inquirySchema, readLimitedJSON } from '../src/lib/inquiry-validation';
const valid = { fullName: 'Client Test', email: 'client@example.test', subject: 'Architecture consultation', message: 'I would like to discuss a new house project.' };
test('contact accepts optional phone and rejects invalid or oversized content', () => {
  assert.equal(inquirySchema.parse(valid).phone, '');
  assert.equal(inquirySchema.safeParse({ ...valid, email: 'not-an-email' }).success, false);
  assert.equal(inquirySchema.safeParse({ ...valid, message: 'short' }).success, false);
  assert.equal(inquirySchema.safeParse({ ...valid, message: 'a'.repeat(5001) }).success, false);
});
test('request size is enforced without trusting Content-Length', async () => {
  const request = new Request('http://localhost/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'x'.repeat(17000) }) });
  await assert.rejects(readLimitedJSON(request), /Body too large/);
});
