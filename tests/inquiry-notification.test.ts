import test from 'node:test';
import assert from 'node:assert/strict';

import { notifyInquiry } from '../src/lib/inquiry-notification';
const modulePath = '../src/lib/inquiry-notification.ts';
const configured = { INQUIRY_RESEND_API_KEY: 'test-only-key', INQUIRY_NOTIFICATION_FROM: 'forms@example.com', INQUIRY_NOTIFICATION_TO: 'studio@example.com' };

test('configured notification posts plain text to fixed HTTPS provider with bounded wait', async () => {
  let calls = 0;
  const result = await notifyInquiry(inquiry, configured, async (url, options) => {
    calls++;
    assert.equal(url, 'https://api.resend.com/emails');
    assert.equal(options?.method, 'POST');
    assert.equal(options?.redirect, 'error');
    assert.ok(options?.signal instanceof AbortSignal);
    const headers = new Headers(options?.headers);
    assert.equal(headers.get('Authorization'), 'Bearer test-only-key');
    assert.equal(headers.get('Idempotency-Key'), 'inquiry-42');
    const body = JSON.parse(String(options?.body));
    assert.equal(body.from, configured.INQUIRY_NOTIFICATION_FROM);
    assert.deepEqual(body.to, [configured.INQUIRY_NOTIFICATION_TO]);
    assert.equal(body.reply_to, inquiry.email);
    assert.ok(body.text.includes(inquiry.message));
    assert.equal(body.html, undefined);
    return Response.json({ id: 'test-provider-id' });
  });
  assert.equal(calls, 1);
  assert.deepEqual(result, { status: 'accepted' });
});
const inquiry = { id: 42, fullName: 'Test Visitor', email: 'visitor@example.com', subject: 'A project', message: 'Project details for the studio.', phone: '' };

test('missing notification configuration is explicitly skipped without network access', async () => {
  const mod = await import(modulePath).catch(() => ({}));
  assert.equal(typeof mod.notifyInquiry, 'function', 'notification module must exist');
  let calls = 0;
  const result = await mod.notifyInquiry(inquiry, {}, async () => { calls++; throw new Error('unexpected network'); });
  assert.deepEqual(result, { status: 'skipped', reason: 'not_configured' });
  assert.equal(calls, 0);
});
