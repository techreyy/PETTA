type Inquiry = { id: string | number; fullName: string; email: string; phone?: string | null; subject: string; message: string };
type Environment = Record<string, string | undefined>;
export type NotificationResult =
  | { status: 'skipped'; reason: 'not_configured' }
  | { status: 'accepted' }
  | { status: 'failed'; reason: 'invalid_configuration' | 'provider_error' };

/** Server-side only. Provider acceptance does not establish inbox delivery. */
export async function notifyInquiry(
  inquiry: Inquiry,
  env: Environment = process.env,
  send: typeof fetch = fetch,
): Promise<NotificationResult> {
  const apiKey = env.INQUIRY_RESEND_API_KEY;
  const from = env.INQUIRY_NOTIFICATION_FROM;
  const to = env.INQUIRY_NOTIFICATION_TO;

  if (!apiKey || !from || !to) {
    return { status: 'skipped', reason: 'not_configured' };
  }

  try {
    const text = `New Inquiry received from ${inquiry.fullName} (${inquiry.email})${inquiry.phone ? `\nPhone: ${inquiry.phone}` : ''}\n\nSubject: ${inquiry.subject}\n\nMessage:\n${inquiry.message}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    const res = await send('https://api.resend.com/emails', {
      method: 'POST',
      redirect: 'error',
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `inquiry-${inquiry.id}`,
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: inquiry.email,
        subject: `[Petta Desain] Pertanyaan Baru: ${inquiry.subject}`,
        text,
      }),
    });

    clearTimeout(timer);

    if (res.ok) {
      return { status: 'accepted' };
    }
    return { status: 'failed', reason: 'provider_error' };
  } catch {
    return { status: 'failed', reason: 'provider_error' };
  }
}
