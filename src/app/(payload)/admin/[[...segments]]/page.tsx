import config from '@payload-config';
import Link from 'next/link';
import { RootPage } from '@payloadcms/next/views';
import { importMap } from '../importMap';
import { cmsReady } from '@/lib/cms-ready';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin | Petta Studio', robots: { index: false, follow: false } };

export default async function AdminPage(props: {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
}) {
  if (!cmsReady()) {
    return (
      <main style={{
        minHeight: '100vh',
        backgroundColor: '#14191E',
        color: '#F4F5F6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          maxWidth: '540px',
          width: '100%',
          backgroundColor: '#182028',
          border: '1px solid #242E38',
          borderRadius: '16px',
          padding: '36px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
        }}>
          <div style={{ display: 'inline-block', padding: '6px 14px', backgroundColor: 'rgba(106, 157, 148, 0.15)', color: '#6A9D94', borderRadius: '999px', fontSize: '13px', fontWeight: 600, marginBottom: '20px' }}>
            PETTA CMS · SETUP
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 12px', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Admin Belum Terhubung ke Database
          </h1>
          <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#A0AEC0', margin: '0 0 24px' }}>
            Di lingkungan cloud (Vercel), Payload CMS memerlukan koneksi database PostgreSQL cloud untuk mengelola akun login dan data konten.
          </p>

          <div style={{ backgroundColor: '#11151A', borderRadius: '12px', padding: '18px', border: '1px solid #202830', marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#CBD5E0', marginBottom: '10px' }}>
              Variabel yang perlu diisi di Vercel Settings → Environment Variables:
            </div>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#A0AEC0', lineHeight: 1.8 }}>
              <li><code style={{ color: '#6A9D94', backgroundColor: 'rgba(106,157,148,0.1)', padding: '2px 6px', borderRadius: '4px' }}>DATABASE_URI</code>: Connection string PostgreSQL cloud (misal: Supabase atau Neon.tech)</li>
              <li><code style={{ color: '#6A9D94', backgroundColor: 'rgba(106,157,148,0.1)', padding: '2px 6px', borderRadius: '4px' }}>PAYLOAD_SECRET</code>: String rahasia minimal 32 karakter</li>
              <li><code style={{ color: '#6A9D94', backgroundColor: 'rgba(106,157,148,0.1)', padding: '2px 6px', borderRadius: '4px' }}>NEXT_PUBLIC_SITE_URL</code>: Domain Vercel Anda</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 20px',
                backgroundColor: '#6A9D94',
                color: '#14191E',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px'
              }}
            >
              Kembali ke Website
            </Link>
          </div>
        </div>
      </main>
    );
  }
  return RootPage({ ...props, config, importMap });
}
