import type { GlobalConfig } from 'payload';
import { revalidatePath } from 'next/cache';
import { canPublish } from './access';
import { DEFAULT_HOMEPAGE_CONTENT } from '../lib/homepage-content';

export const HomepageContent: GlobalConfig = {
  slug: 'homepageContent',
  label: 'Beranda',
  admin: {
    group: 'KONTEN WEBSITE',
    description: 'Edit teks pengenalan studio di homepage. Simpan untuk menerbitkan perubahan; desain dan tautan tetap.',
  },
  access: { read: () => true, update: canPublish },
  hooks: {
    afterChange: [
      () => {
        try {
          revalidatePath('/', 'page');
        } catch {
          // Ignore outside Next.js request context (e.g. migrations or CLI)
        }
      },
    ],
  },
  fields: [
    { name: 'eyebrow', label: 'Eyebrow / lokasi', type: 'text', required: true, defaultValue: DEFAULT_HOMEPAGE_CONTENT.eyebrow },
    { name: 'services', label: 'Bidang layanan singkat', type: 'text', required: true, defaultValue: DEFAULT_HOMEPAGE_CONTENT.services },
    { name: 'headline', label: 'Headline utama', type: 'textarea', required: true, defaultValue: DEFAULT_HOMEPAGE_CONTENT.headline },
    { name: 'leftParagraph', label: 'Paragraf kiri', type: 'textarea', required: true, defaultValue: DEFAULT_HOMEPAGE_CONTENT.leftParagraph,
      admin: { description: 'Gunakan {founderName} untuk menyisipkan nama pendiri dari field di bawah. Teks di antara **dua bintang** tampil tebal.' } },
    { name: 'rightParagraph', label: 'Paragraf kanan', type: 'textarea', required: true, defaultValue: DEFAULT_HOMEPAGE_CONTENT.rightParagraph,
      admin: { description: 'Teks di antara **dua bintang** tampil tebal. HTML tidak digunakan.' } },
    { name: 'founderName', label: 'Nama pendiri', type: 'text', required: true, defaultValue: DEFAULT_HOMEPAGE_CONTENT.founderName },
    { name: 'ctaLabel', label: 'Label CTA', type: 'text', required: true, defaultValue: DEFAULT_HOMEPAGE_CONTENT.ctaLabel },
  ],
};
