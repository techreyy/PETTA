import { TEAM_ROSTER } from './team-roster';

export const DEFAULT_HOMEPAGE_CONTENT = {
  eyebrow: 'Petta Desain \u00b7 Kendari',
  services: 'Arsitektur \u00b7 Interior \u00b7 Struktur Sipil',
  headline: 'Studio konsultan perancangan arsitektur berlisensi IAI yang berbasis di Kota Kendari, merajut estetika tropis modern dan ketahanan struktural.',
  leftParagraph: 'Didirikan oleh **{founderName}**, Petta Desain aktif berkarya sejak 2019 menangani perancangan kampus institusi, hotel transit, hingga hunian tapak prestisius.',
  rightParagraph: 'Melalui ekosistem **Petta Desain**, **Petta Konstruksi**, dan **Petta Printlab**, kami menyediakan layanan lengkap mulai dari studi konseptual, gambar kerja teknis, pengurusan PBG & SLF, hingga perhitungan ketahanan gempa.',
  founderName: TEAM_ROSTER[0].name,
  ctaLabel: 'Kenali Studio, Pendiri & Tim Petta Desain',
};

export type HomepageCopy = typeof DEFAULT_HOMEPAGE_CONTENT;

export function resolveHomepageContent(content?: Partial<{ [K in keyof HomepageCopy]: string | null }> | null): HomepageCopy {
  return Object.fromEntries(Object.entries(DEFAULT_HOMEPAGE_CONTENT).map(([key, fallback]) => {
    const value = content?.[key as keyof HomepageCopy];
    return [key, typeof value === 'string' && value.trim() ? value : fallback];
  })) as HomepageCopy;
}
