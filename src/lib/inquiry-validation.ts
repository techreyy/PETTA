import { z } from 'zod';

export const inquirySchema = z.object({
  fullName: z.string().trim().min(2, 'Nama minimal 2 karakter.').max(120),
  email: z.email('Email tidak valid.').trim().toLowerCase().max(254),
  phone: z.string().trim().max(40).regex(/^[+\d\s().-]*$/, 'Nomor telepon tidak valid.').optional().default(''),
  subject: z.string().trim().min(3).max(160),
  message: z.string().trim().min(20, 'Pesan minimal 20 karakter.').max(5000, 'Pesan maksimal 5000 karakter.'),
  website: z.string().max(200).optional().default(''),
});

export async function readLimitedJSON(request: Request, limit = 16384): Promise<unknown> {
  if (!request.headers.get('content-type')?.includes('application/json')) throw new Error('Invalid content type');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('Missing body');
  let length = 0;
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > limit) { await reader.cancel(); throw new Error('Body too large'); }
    chunks.push(value);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
