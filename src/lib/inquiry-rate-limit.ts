import { createHmac } from 'node:crypto';
import { Pool } from 'pg';

let pool: Pool | undefined;
export async function reserveInquiry(email: string, ip?: string) {
  if (!process.env.PAYLOAD_SECRET) throw new Error('PAYLOAD_SECRET is not configured');
  pool ??= new Pool({ connectionString: process.env.DATABASE_URI, max: 3, connectionTimeoutMillis: 5000 });
  const hash = (value: string) => createHmac('sha256', process.env.PAYLOAD_SECRET!).update(value).digest('hex');
  const limits: [string, number][] = [['global', 100], [hash(`email:${email}`), 3]];
  if (ip) limits.push([hash(`ip:${ip}`), 5]);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const [key, limit] of limits.sort(([a], [b]) => a.localeCompare(b))) {
      const result = await client.query(`
        INSERT INTO petta_contact_limits (key, count, expires_at) VALUES ($1, 1, NOW() + INTERVAL '1 hour')
        ON CONFLICT (key) DO UPDATE SET
          count = CASE WHEN petta_contact_limits.expires_at <= NOW() THEN 1 ELSE petta_contact_limits.count + 1 END,
          expires_at = CASE WHEN petta_contact_limits.expires_at <= NOW() THEN NOW() + INTERVAL '1 hour' ELSE petta_contact_limits.expires_at END
        WHERE petta_contact_limits.expires_at <= NOW() OR petta_contact_limits.count < $2
        RETURNING count`, [key, limit]);
      if (!result.rowCount) { await client.query('ROLLBACK'); return false; }
    }
    await client.query("DELETE FROM petta_contact_limits WHERE expires_at < NOW() - INTERVAL '1 day'");
    await client.query('COMMIT');
    return true;
  } catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
}
export async function closeInquiryPool() { await pool?.end(); pool = undefined; }
