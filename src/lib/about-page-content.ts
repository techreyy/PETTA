import { TEAM_ROSTER } from './team-roster';

export const DEFAULT_ABOUT_PAGE_CONTENT = {
  // Hero Monograph
  heroTitle: 'Arsitektur yang\n**berpijak** & bernapas.',
  heroIntro: '**Petta Desain (Petta Studio)** didirikan oleh arsitek **{founderName}**. Kami menolak perancangan yang sekadar dekoratif — setiap karya adalah harmoni terukur antara sains fisika bangunan, ketahanan gempa bumi, dan ketenangan jiwa manusia.',
  heroTagline: 'Kontekstual · Terukur · Berkelanjutan',

  // Philosophy
  philosophyEyebrow: 'Filosofi Tektonika',
  philosophyTitle: 'Philosophy',
  philosophyText1: 'Bagi Petta Desain, arsitektur bukan sekadar membungkus ruang dengan fasad indah. Arsitektur adalah seni rekayasa lingkungan hidup: bagaimana bangunan menyerap sejuknya angin pagi dari Teluk Kendari, meredam radiasi matahari khatulistiwa lewat kisi-kisi pelindung (*brise-soleil*), serta berdiri kokoh dengan perhitungan beban gempa yang akurat.',
  philosophyText2: 'Setiap detail sambungan material, bayangan dinding bata, dan bukaan ventilasi dirancang memiliki tujuan fungsional nyata bagi kenyamanan penghuninya.',
  philosophyMetricLabel: 'Metric Specification',
  philosophyMetricText: 'Integrasi denah tropis pasif, pencahayaan alami 80%, dan reduksi beban pendingin ruangan buatan.',

  // Mission
  missionEyebrow: 'Misi & Standar Operasional',
  missionTitle: 'Mission',
  missionText1: 'Menghadirkan layanan perancangan komprehensif dari hulu ke hilir: mulai dari studi kelayakan tapak, konsepsi tata ruang modern Islami dan tropis, perhitungan struktur teknik sipil, hingga pendampingan legalitas izin Persetujuan Bangunan Gedung (PBG) serta Sertifikat Laik Fungsi (SLF).',
  missionText2: 'Melalui sinergi **Petta Desain**, **Petta Konstruksi**, dan **Petta Printlab**, kami memastikan setiap visi arsitektural dapat dieksekusi secara presisi, hemat biaya, dan tahan lama.',
  missionAccountabilityLabel: 'Akuntabilitas Studio',
  missionAccountabilityText: 'Kepatuhan hukum tata ruang, sertifikasi arsitek berlisensi IAI, dan ketepatan dokumen teknis perizinan PBG & SLF.',
  missionStudioTag: 'PETTA STUDIO · KENDARI',
  missionEstTag: 'EST. 2019',

  // Four Pillars
  pillarsEyebrow: 'Prinsip Desain',
  pillarsHeading: 'Empat Pilar Praktik Petta',
  pillarsSubtitle: 'Sentuh atau arahkan kursor ke tiap pilar untuk melihat fokus perancangan studio kami.',
  pillar1Tag: 'Tectonic Truth',
  pillar1Title: 'Ketepatan Tektonika & Struktur',
  pillar1Desc: 'Kejujuran ekspresi material dan kalkulasi beban teknik sipil dengan mitigasi ketahanan gempa regional Sulawesi.',
  pillar2Tag: 'Bioclimatic Sense',
  pillar2Title: 'Responsivitas Iklim Tropis',
  pillar2Desc: 'Menghormati angin pesisir teluk Kendari dan pergerakan matahari khatulistiwa melalui pembayangan pasif yang sejuk.',
  pillar3Tag: 'Legal Rigor',
  pillar3Title: 'Akuntabilitas Regulasi PBG & SLF',
  pillar3Desc: 'Estetika yang berdiri di atas kepastian hukum, standar kode bangunan, dan kelaikan fungsi teknis sejak sketsa awal.',
  pillar4Tag: 'Cultural Resonance',
  pillar4Title: 'Artikulasi Modern Nusantara',
  pillar4Desc: 'Menerjemahkan ketenangan spasial dan proporsi lokal Sulawesi Tenggara ke dalam bentukan arsitektur kontemporer.',

  // Principal Architect
  principalRole: 'Principal Architect / Design Director',
  principalName: TEAM_ROSTER[0].name,
  principalCredentials: 'Anggota Ikatan Arsitek Indonesia · Praktisi Arsitektur · Akademisi & Dosen',
  principalBio1: 'Sebagai arsitek profesional berlisensi IAI yang juga mendedikasikan diri di dunia akademis, Andi Al-Mustaghfir Syah memadukan ketajaman riset teoritis desain dengan kapabilitas teknis implementasi di lapangan.',
  principalBio2: 'Melalui Petta Desain, beliau memimpin perancangan karya-karya strategis di Sulawesi Tenggara—termasuk Gedung Rektorat & Fakultas Kedokteran UM Kendari, Baraka Hotel Kolaka, hingga perumahan residensial seluas ribuan meter persegi.',
  principalBadgeTitle: 'Andi Thagfir · @aams_ir',
  principalBadgeSubtitle: 'IAI Professional License Holder',
  principalInstagramLabel: 'Instagram @aams_ir',
  principalFacebookLabel: 'Facebook Profil',

  // Team Collective
  teamEyebrow: 'Tim Perancang',
  teamHeading: 'Kolektif Studio & Kolaborator',
  teamIntro: 'Berkolaborasi erat bersama jejaring **Archtech Kendari** & **Arsitek Kendari Network**.',

  // Business Entities
  entitiesEyebrow: 'Sinergi Unit Bisnis',
  entitiesHeading: 'Ekosistem Petta Group',
  entitiesSubtitle: 'Tiga pilar operasional untuk memastikan kualitas perancangan, kekuatan struktur fisik, hingga dokumentasi teknis.',

  // Services
  servicesEyebrow: 'Lingkup Praktik',
  servicesHeading: '5 Layanan Spesialisasi Petta',
  servicesSubtitle: 'Dari konsepsi denah, izin legal PBG/SLF, kalkulasi gempa struktur sipil, hingga visual 3D fotorealistik.',

  // Location
  locationHeading: 'Lokasi & Jangkauan Studio',
  locationOfficeTitle: 'Barokah Abadi, Kendari',
  locationAreasTitle: 'Sulawesi Tenggara & Nasional',

  // CTA
  ctaEyebrow: 'Rencanakan Bangunan Anda Bersama Petta Desain',
  ctaHeading: 'Konsultasikan Gagasan Arsitektur & Perizinan PBG/SLF',
  ctaText: 'Tim arsitek dan tenaga ahli struktur kami siap mewujudkan ruang impian Anda dengan perhitungan presisi, estetika tinggi, dan efisiensi biaya.',
  ctaButtonLabel: 'Mulai Konsultasi Proyek',
};

export type AboutPageCopy = typeof DEFAULT_ABOUT_PAGE_CONTENT;

export function resolveAboutPageContent(content?: Partial<{ [K in keyof AboutPageCopy]: string | null }> | null): AboutPageCopy {
  return Object.fromEntries(Object.entries(DEFAULT_ABOUT_PAGE_CONTENT).map(([key, fallback]) => {
    const value = content?.[key as keyof AboutPageCopy];
    return [key, typeof value === 'string' && value.trim() ? value : fallback];
  })) as AboutPageCopy;
}
