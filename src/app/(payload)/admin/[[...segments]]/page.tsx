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
  if (!cmsReady()) return <main style={{ maxWidth: 640, margin: '80px auto', padding: 24, fontFamily: 'sans-serif' }}>
    <h1>Admin belum dikonfigurasi</h1>
    <p>Hubungkan PostgreSQL dan isi konfigurasi server sesuai README. Tidak ada akun atau password bawaan.</p>
    <Link href="/">Kembali ke website</Link>
  </main>;
  return RootPage({ ...props, config, importMap });
}
