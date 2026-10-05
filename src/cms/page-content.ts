import type { Field, GlobalConfig } from 'payload';
import { revalidatePath } from 'next/cache';
import { canPublish } from './access';
import { PAGE_CONTENT_DEFAULTS, type PageContentSlug } from '../lib/page-content';

const definitions: [PageContentSlug, string, string][] = [
  ['servicesPageContent', 'Layanan', '/services'],
  ['awardsPageContent', 'Penghargaan & Sayembara', '/awards'],
  ['newsPageContent', "Berita / What's On", '/news'],
  ['contactPageContent', 'Kontak', '/contact'],
  ['siteTextContent', 'Site Settings', '/'],
];

const labels: Record<string, string> = {
  eyebrow: 'Eyebrow / label', heading: 'Judul utama', intro: 'Pengantar',
  emptyText: 'Teks saat daftar kosong', ctaEyebrow: 'CTA - label',
  ctaHeading: 'CTA - judul', ctaDescription: 'CTA - deskripsi', ctaLabel: 'CTA - tombol',
  allFilter: 'Filter - semua', awardsFilter: 'Filter - penghargaan', competitionsFilter: 'Filter - sayembara',
  awardsHeading: 'Judul bagian penghargaan', awardsCountLabel: 'Label jumlah penghargaan',
  awardsEmptyText: 'Teks saat penghargaan kosong', projectLabel: 'Label karya',
  competitionsHeading: 'Judul bagian sayembara', competitionsCountLabel: 'Label jumlah sayembara',
  competitionsEmptyText: 'Teks saat sayembara kosong', organizerLabel: 'Label penyelenggara',
  locationLabel: 'Label lokasi', designLabel: 'Label gagasan', publicCompetitionLabel: 'Label sayembara publik',
  projectsLabel: 'Tombol lihat proyek', articleLabel: 'Tombol baca artikel',
  successHeading: 'Pesan berhasil - judul', successDescription: 'Pesan berhasil - deskripsi',
  anotherInquiryLabel: 'Tombol kirim pertanyaan lain', nameLabel: 'Form - nama',
  emailLabel: 'Form - email', phoneLabel: 'Form - telepon', subjectLabel: 'Form - layanan',
  architectureOption: 'Pilihan - arsitektur', interiorOption: 'Pilihan - interior',
  permitOption: 'Pilihan - PBG & SLF', structureOption: 'Pilihan - struktur',
  visualizationOption: 'Pilihan - visualisasi', masterplanOption: 'Pilihan - masterplan',
  messageLabel: 'Form - deskripsi proyek', officeHeading: 'Judul kantor studio', socialHeading: 'Judul media sosial',
  instagramLabel: 'Instagram studio - label', instagramName: 'Instagram studio - teks nama',
  founderLabel: 'Instagram pendiri - label', founderSocialName: 'Instagram pendiri - teks nama',
  founderSocialDescription: 'Instagram pendiri - keterangan', facebookLabel: 'Facebook - label',
  facebookName: 'Facebook - teks nama', hoursHeading: 'Judul waktu konsultasi',
  hoursText: 'Jadwal konsultasi', appointmentText: 'Keterangan janji konsultasi',
  namePlaceholder: 'Contoh nama', emailPlaceholder: 'Contoh email', phonePlaceholder: 'Contoh telepon',
  messagePlaceholder: 'Contoh deskripsi proyek', pendingLabel: 'Tombol saat mengirim',
  submitLabel: 'Tombol kirim', saveError: 'Pesan gagal menyimpan', connectionError: 'Pesan gangguan koneksi',
  navHome: 'Navigasi - Home', navProjects: 'Navigasi - Projects', navServices: 'Navigasi - Services',
  navAwards: 'Navigasi - Awards & Sayembara', navNews: "Navigasi - What's On", navAbout: 'Navigasi - About Us',
  navContact: 'Navigasi - Contact Us', navInquire: 'Navigasi - Inquire', navAllDisciplines: 'Navigasi - semua disiplin',
  navLocation: 'Navigasi mobile - lokasi', navConversation: 'Navigasi mobile - tombol percakapan',
  footerDescription: 'Footer - deskripsi studio', footerExplore: 'Footer - judul eksplorasi',
  footerPortfolio: 'Footer - portofolio', footerPrivateHouse: 'Footer - private house',
  footerCommercial: 'Footer - commercial', footerInterior: 'Footer - interior', footerServices: 'Footer - layanan',
  footerAbout: 'Footer - tentang studio', footerAwards: 'Footer - penghargaan', footerGroup: 'Footer - judul grup',
  footerDesign: 'Footer - unit desain', footerConstruction: 'Footer - unit konstruksi',
  footerPrintlab: 'Footer - unit printlab', footerArchtech: 'Footer - Archtech', footerNetwork: 'Footer - network',
  footerOffice: 'Footer - judul kantor', footerCopyright: 'Footer - hak cipta', footerLocation: 'Footer - lokasi',
  footerInstagramLabel: 'Footer - label Instagram studio', footerFounderInstagramLabel: 'Footer - label Instagram pendiri',
  footerFacebookLabel: 'Footer - label Facebook',
};

export const PageTextGlobals: GlobalConfig[] = definitions.map(([slug, label, route]) => ({
  slug,
  label,
  admin: {
    group: 'KONTEN WEBSITE',
    description: 'Edit teks yang sudah tampil. Simpan untuk menerbitkan perubahan. Item, media, tautan dan profil kontak tetap memakai sumber existing.',
  },
  access: { read: () => true, update: canPublish },
  hooks: {
    afterChange: [() => {
      try {
        revalidatePath(route, slug === 'siteTextContent' ? 'layout' : 'page');
      } catch {
        // Payload migrations and CLI run outside the Next.js request context.
      }
    }],
  },
  fields: Object.entries(PAGE_CONTENT_DEFAULTS[slug]).map(([name, defaultValue]): Field => {
    const field = {
      name,
      label: labels[name],
      required: true,
      defaultValue,
      admin: {
        description: /\{\w+\}/.test(defaultValue)
          ? 'Pertahankan token {name}, {founder}, atau {year} yang ada untuk memakai profil studio / tahun otomatis.'
          : undefined,
      },
    };
    return defaultValue.length > 90 ? { ...field, type: 'textarea' } : { ...field, type: 'text' };
  }),
}));
