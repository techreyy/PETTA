import { getPayload } from 'payload';
import config from '@payload-config';
import { cmsReady } from '@/lib/cms-ready';
import { inquirySchema, readLimitedJSON } from '@/lib/inquiry-validation';
import { reserveInquiry } from '@/lib/inquiry-rate-limit';

export const runtime = 'nodejs';
export async function POST(request: Request) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return Response.json({ error: 'Konfigurasi server belum lengkap.' }, { status: 500 });
  const allowed = new URL(siteUrl).origin;
  if (request.headers.get('origin') !== allowed) return Response.json({ error: 'Permintaan tidak diizinkan.' }, { status: 403 });
  let body: unknown;
  try { body = await readLimitedJSON(request); }
  catch { return Response.json({ error: 'Format atau ukuran pesan tidak valid.' }, { status: 400 }); }
  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
  if (parsed.data.website) return Response.json({ error: 'Permintaan tidak dapat diproses.' }, { status: 400 });
  if (!cmsReady()) return Response.json({ error: 'Formulir sedang tidak tersedia. Silakan hubungi email atau telepon studio.' }, { status: 503 });
  try {
    const header = process.env.CONTACT_TRUSTED_IP_HEADER;
    const ip = header ? request.headers.get(header)?.split(',')[0].trim().slice(0, 100) : undefined;
    if (!await reserveInquiry(parsed.data.email, ip)) return Response.json({ error: 'Terlalu banyak pesan. Coba lagi dalam satu jam atau hubungi studio langsung.' }, { status: 429, headers: { 'Retry-After': '3600' } });
    const payload = await getPayload({ config });
    const { fullName, email, phone, subject, message } = parsed.data;
    await payload.create({ collection: 'inquiries', overrideAccess: true, data: { fullName, email, phone, subject, message, status: 'new' } });
    return Response.json({ success: true }, { status: 201 });
  } catch {
    console.error('Contact submission could not be persisted.');
    return Response.json({ error: 'Pesan belum tersimpan. Silakan coba lagi atau hubungi studio langsung.' }, { status: 503 });
  }
}
