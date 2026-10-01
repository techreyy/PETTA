import 'server-only';
import { getPayload } from 'payload';
import config from '@payload-config';
import { cmsReady } from './cms-ready';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  order: number;
}

const DEFAULT_SERVICES: ServiceItem[] = [
  { id: 'service-1', title: 'Jasa Arsitektur & Perencanaan', description: 'Desain konseptual, denah tata ruang modern tropis, gambar kerja teknis detail (DED), dan masterplan kawasan residensial maupun publik.', order: 1 },
  { id: 'service-2', title: 'Desain Interior Berkelas', description: 'Penataan ruang pimpinan kantor/eksekutif, hunian tinggal privat mewah, cafe & commercial store dengan custom furniture presisi.', order: 2 },
  { id: 'service-3', title: 'Pengurusan PBG & SLF Resmi', description: 'Konsultasi dan pendampingan dokumen legal Persetujuan Bangunan Gedung (PBG) serta Sertifikat Laik Fungsi (SLF) di wilayah Sulawesi Tenggara.', order: 3 },
  { id: 'service-4', title: 'Perhitungan Struktur & Ketahanan Gempa', description: 'Analisis beban teknis sipil, pemodelan struktur beton bertulang & baja, serta sertifikasi keselamatan konstruksi gempa.', order: 4 },
  { id: 'service-5', title: 'Visualisasi & Animasi Sinematik 3D', description: 'Render visual fotorealistik ultra-detail dan video animasi walk-through untuk kebutuhan presentasi proyek serta materi investasi.', order: 5 },
];

export async function getServices(): Promise<ServiceItem[]> {
  if (!cmsReady()) {
    if (process.env.DEMO_CONTENT === 'true') return [];
    if (process.env.VERCEL) return DEFAULT_SERVICES;
    throw new Error('CMS is not configured. Configure DATABASE_URI and PAYLOAD_SECRET, or explicitly set DEMO_CONTENT=true for a demo.');
  }
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: 'services',
      overrideAccess: false,
      depth: 0,
      pagination: false,
      sort: 'order',
      where: { active: { equals: true } },
    });
    return result.docs
      .filter(service => service.active === true)
      .map(service => ({ id: String(service.id), title: service.title, description: service.description, order: service.order ?? 0 }))
      .sort((a, b) => a.order - b.order);
  } catch (err) {
    if (process.env.VERCEL) return DEFAULT_SERVICES;
    throw err;
  }
}
