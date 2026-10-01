export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  location: string;
  year: string;
  status: string;
  architectInCharge: string;
  siteArea: string;
  constructedArea: string;
  stories: string;
  shortIntro: string;
  description: string[];
  heroImage: string;
  gallery: string[];
  featured?: boolean;
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  coverImage: string;
  excerpt: string;
  featured?: boolean;
}

export const PORTFOLIO_CATEGORIES = [
  {
    title: "Private House",
    slug: "private-house",
    count: 1,
    description: "Hunian privat eksklusif yang memadukan iklim tropis, ruang terbuka asri, dan ritme keseharian keluarga.",
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Masterplanning & Residential",
    slug: "masterplanning-residential",
    count: 1,
    description: "Perencanaan kawasan terpadu, komplek institusi, dan perumahan ramah lingkungan yang beradaptasi dengan kontur alam.",
    coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Commercial Building",
    slug: "commercial-building",
    count: 2,
    description: "Gedung perkantoran rektorat, ruko urban tropis, dan ruang komersial modern yang fungsional dan ikonik.",
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Interior Design",
    slug: "interior-design",
    count: 1,
    description: "Interior eksekutif, ruang pimpinan kontemporer, dan tata ruang privat bernuansa hangat, presisi, dan elegan.",
    coverImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Architecture Installation",
    slug: "architecture-installation",
    count: 1,
    description: "Eksplorasi tektonika fasad parametrik, gerbang landmark kawasan, dan instalasi spasial tematik.",
    coverImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Hospitality",
    slug: "hospitality",
    count: 1,
    description: "Hotel transit modern, resort villa tropis, dan destinasi rekreasi dengan pengalaman ruang yang berkesan.",
    coverImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80"
  }
];

export const PROJECTS: Project[] = [
  // 1. Commercial / Campus: Gedung Rektorat & FK UM Kendari
  {
    id: "proj-rektorat-umkendari",
    slug: "gedung-rektorat-fk-umkendari",
    title: "Gedung Rektorat & Fakultas Kedokteran UM Kendari",
    category: "Commercial Building",
    categorySlug: "commercial-building",
    location: "Kota Kendari, Sulawesi Tenggara",
    year: "2024",
    status: "Completed / Under Phasing",
    architectInCharge: "Ir. Ar. Andi Al-Mustaghfir Syah",
    siteArea: "12,500 sqm",
    constructedArea: "8,400 sqm",
    stories: "6 Lantai + Plaza Akademik",
    shortIntro: "Rancangan arsitektur berkonsep Modern Islami dan Green Building dengan fasad geometris modern yang megah.",
    description: [
      "Gedung Rektorat & Fakultas Kedokteran Universitas Muhammadiyah Kendari dirancang sebagai representasi landmark peradaban pendidikan di Sulawesi Tenggara. Menggabungkan nafas nilai-nilai keislaman dengan arsitektur ramah lingkungan (green building).",
      "Fasad bangunan mengadopsi brise-soleil geometris islami modern yang berfungsi optimal mereduksi panas matahari tropis khatulistiwa, sekaligus menghadirkan pencahayaan alami dan efisiensi energi yang masif pada ruang-ruang kuliah dan administrasi."
    ],
    heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1400&q=80"
    ],
    featured: true
  },

  // 2. Hospitality: Baraka Hotel Kolaka
  {
    id: "proj-baraka-hotel-kolaka",
    slug: "baraka-hotel-kolaka",
    title: "Baraka Hotel Kolaka",
    category: "Hospitality",
    categorySlug: "hospitality",
    location: "Kabupaten Kolaka, Sulawesi Tenggara",
    year: "2023",
    status: "Completed",
    architectInCharge: "Ir. Ar. Andi Al-Mustaghfir Syah & Tim",
    siteArea: "2,200 sqm",
    constructedArea: "3,800 sqm",
    stories: "4 Lantai + Sky Lounge",
    shortIntro: "Hotel transit modern yang memadukan kemewahan tropis dan efisiensi fungsional bagi para pelaku bisnis dan wisatawan.",
    description: [
      "Terletak di pusat mobilitas strategis Kabupaten Kolaka, Baraka Hotel dirancang menghadirkan oase kenyamanan transit berstandar tinggi. Arsitektur eksterior mengekspresikan artikulasi modern tegas dengan sirip vertikal penahan silau matahari.",
      "Bagian interior mengintegrasikan lobby berplafon tinggi, restoran tropis terbuka, serta kamar-kamar yang didesain secara ergonomis dengan sentuhan kayu lokal dan tata cahaya hangat."
    ],
    heroImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80"
    ],
    featured: true
  },

  // 3. Private House: N-House Orinunggu
  {
    id: "proj-n-house-kendari",
    slug: "n-house-orinunggu-kendari",
    title: "N-House Estate Orinunggu",
    category: "Private House",
    categorySlug: "private-house",
    location: "Jl. Orinunggu, Kota Kendari",
    year: "2024",
    status: "In Progress / Built",
    architectInCharge: "Ir. Ar. Andi Al-Mustaghfir Syah",
    siteArea: "5,000 sqm",
    constructedArea: "1,200 sqm",
    stories: "2 Lantai + Private Landscape Park",
    shortIntro: "Hunian prestisius bergaya Modern Klasik Tropis di atas lahan seluas 5.000 m² yang megah dan asri.",
    description: [
      "Berdiri megah di atas lahan 5.000 meter persegi di koridor prestisius Jl. Orinunggu Kendari, N-House memadukan keanggunan proporsi simetri klasik dengan keterbukaan arsitektur tropis modern.",
      "Desain mengutamakan bentang halaman hijau yang luas, paviliun keluarga tepi kolam renang, serta bukaan kaca masif yang menghadirkan sirkulasi udara alami pegunungan Kendari ke setiap sudut ruangan utama."
    ],
    heroImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80"
    ],
    featured: true
  },

  // 4. Interior Design: Modern Executive Office UMKendari
  {
    id: "proj-executive-office-umkendari",
    slug: "modern-executive-office-umkendari",
    title: "Modern Executive Office UMKendari",
    category: "Interior Design",
    categorySlug: "interior-design",
    location: "Gedung Rektorat UMKendari",
    year: "2024",
    status: "Completed",
    architectInCharge: "Reza Alvared, Ir. Ar. Andi Al-Mustaghfir Syah",
    siteArea: "180 sqm",
    constructedArea: "180 sqm",
    stories: "1 Lantai (Ruang Pimpinan)",
    shortIntro: "Desain interior ruang pimpinan bernuansa profesional, kontemporer, dan berwibawa.",
    description: [
      "Penataan interior ruang pimpinan eksekutif Universitas Muhammadiyah Kendari diciptakan untuk memfasilitasi pengambilan keputusan strategis dan audiensi kehormatan.",
      "Menampilkan perpaduan panel dinding kayu jati terkalibrasi, aksen strip pencahayaan LED tersembunyi (*cove lighting*), meja rapat ergonomis kustom, dan partisi akustik berkualitas prima."
    ],
    heroImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80"
    ],
    featured: true
  },

  // 5. Commercial Building: Ruko Urban Tropis Kolaka
  {
    id: "proj-ruko-urban-kolaka",
    slug: "ruko-urban-tropis-kolaka",
    title: "Ruko Urban Tropis Kolaka",
    category: "Commercial Building",
    categorySlug: "commercial-building",
    location: "Pusat Kota Kolaka, Sulawesi Tenggara",
    year: "2023",
    status: "Completed",
    architectInCharge: "Aprial Rahmat, Ir. Ar. Andi Al-Mustaghfir Syah",
    siteArea: "450 sqm",
    constructedArea: "780 sqm",
    stories: "3 Lantai",
    shortIntro: "Konsep rumah toko fungsional vertikal yang menepis kesan monoton ruko konvensional.",
    description: [
      "Menghadirkan redefinisi terhadap tipologi ruko di perkotaan Kolaka. Memadukan display komersial transparan di lantai dasar dengan fasad pelindung matahari kisi-kisi aluminium di lantai atas.",
      "Sirkulasi dan ventilasi silang diperhitungkan matang sehingga lantai atas tetap sejuk dan nyaman digunakan sebagai kantor kreatif maupun hunian pemilik."
    ],
    heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=80"
    ],
    featured: false
  },

  // 6. Masterplanning: Barokah Abadi Living Masterplan
  {
    id: "proj-barokah-abadi-masterplan",
    slug: "barokah-abadi-living-masterplan",
    title: "Barokah Abadi Integrated Living Estate",
    category: "Masterplanning & Residential",
    categorySlug: "masterplanning-residential",
    location: "Kota Kendari, Sulawesi Tenggara",
    year: "2024",
    status: "Ongoing Development",
    architectInCharge: "Ir. Ar. Andi Al-Mustaghfir Syah",
    siteArea: "35,000 sqm",
    constructedArea: "15,400 sqm",
    stories: "Masterplan Terpadu",
    shortIntro: "Kawasan hunian terencana yang mengintegrasikan kantor studio kreatif, drainase resapan, dan taman komunal.",
    description: [
      "Masterplan kawasan yang menempatkan keselarasan alam, aksesibilitas pedestrian, serta proteksi tata air sebagai prioritas utama perancangan lingkungan permukiman modern di Kendari."
    ],
    heroImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1400&q=80"
    ],
    featured: false
  },

  // 7. Architecture Installation: Gerbang Ikonik Sulawesi
  {
    id: "proj-gerbang-ikonik-sulawesi",
    slug: "gerbang-landmark-sulawesi-tenggara",
    title: "Landmark & Fasad Parametrik Petta",
    category: "Architecture Installation",
    categorySlug: "architecture-installation",
    location: "Sulawesi Tenggara",
    year: "2024",
    status: "Built / Exhibition",
    architectInCharge: "Pratama Juna, Ir. Ar. Andi Al-Mustaghfir Syah",
    siteArea: "120 sqm",
    constructedArea: "90 sqm",
    stories: "Landmark Structure",
    shortIntro: "Eksplorasi tektonika fasad parametrik dan gerbang arsitektur berkarakter modern regionalis.",
    description: [
      "Kajian visual 3D dan fabrikasi tektonika parametrik yang menonjolkan kekuatan identitas lokal Sulawesi Tenggara dalam bahasa arsitektur kontemporer masa kini."
    ],
    heroImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1800&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80"
    ],
    featured: false
  }
];

export const STUDIO_TEAM = [
  {
    name: "Ir. Ar. Andi Al-Mustaghfir Syah, MT., IAI",
    role: "Founder & Principal Architect",
    instagram: "@aams_ir",
    portrait: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    bio: "Arsitek profesional berlisensi Ikatan Arsitek Indonesia (IAI), praktisi perancangan berpengalaman, serta akademisi dan dosen arsitektur. Mendirikan Petta Desain sejak 2019 untuk menghadirkan arsitektur kontekstual berdaya tahan tinggi di Sulawesi Tenggara dan nasional."
  },
  {
    name: "Aprial Rahmat",
    role: "Architectural Design Lead",
    instagram: "@ap_rialrahmat",
    portrait: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    bio: "Memimpin perancangan skematik arsitektur, kalkulasi fungsional tata ruang, serta pengembangan teknis detail perizinan PBG & SLF proyek komersial dan hunian."
  },
  {
    name: "Reza Alvared",
    role: "Interior & Spatial Designer",
    instagram: "@reza.alvared",
    portrait: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80",
    bio: "Spesialis desain interior eksekutif, materialitas custom joinery kayu lokal, pencahayaan arsitektural, dan tata ruang privat residensial."
  },
  {
    name: "Pratama Juna",
    role: "3D Visualization & Computational Design",
    instagram: "@prtmajuna",
    portrait: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
    bio: "Mengembangkan visualisasi fotorealistik, simulasi animasi sinematik 3D, dan pemodelan parametrik struktur bangunan."
  }
];

export const BUSINESS_ENTITIES = [
  {
    name: "Petta Desain",
    focus: "Arsitektur, Interior & Masterplan",
    desc: "Studio konsultasi perancangan arsitektur, masterplan tata ruang kawasan, dan interior berstandar ikatan profesi IAI."
  },
  {
    name: "Petta Konstruksi",
    focus: "Pelaksanaan Konstruksi, Struktur & Sipil",
    desc: "Kalkulasi beban teknis, ketahanan gempa, serta manajemen konstruksi fisik lapangan yang presisi dan akuntabel."
  },
  {
    name: "Petta Printlab",
    focus: "Studio Grafis & Percetakan Arsitektur",
    desc: "Fasilitas cetak gambar kerja arsitektur format besar (A0/A1), dokumentasi perizinan PBG/SLF, dan maket presentasi."
  }
];

export const STUDIO_SERVICES = [
  {
    number: "01",
    title: "Jasa Arsitektur & Perencanaan",
    desc: "Desain konseptual, denah tata ruang modern tropis, gambar kerja teknis detail (DED), dan masterplan kawasan residensial maupun publik."
  },
  {
    number: "02",
    title: "Desain Interior Berkelas",
    desc: "Penataan ruang pimpinan kantor/eksekutif, hunian tinggal privat mewah, cafe & commercial store dengan custom furniture presisi."
  },
  {
    number: "03",
    title: "Pengurusan PBG & SLF Resmi",
    desc: "Konsultasi dan pendampingan dokumen legal Persetujuan Bangunan Gedung (PBG) serta Sertifikat Laik Fungsi (SLF) di wilayah Sulawesi Tenggara."
  },
  {
    number: "04",
    title: "Perhitungan Struktur & Ketahanan Gempa",
    desc: "Analisis beban teknis sipil, pemodelan struktur beton bertulang & baja, serta sertifikasi keselamatan konstruksi gempa."
  },
  {
    number: "05",
    title: "Visualisasi & Animasi Sinematik 3D",
    desc: "Render visual fotorealistik ultra-detail dan video animasi walk-through untuk kebutuhan presentasi proyek serta materi investasi."
  }
];

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: "news-1",
    slug: "pembangunan-gedung-rektorat-umkendari",
    title: "Progres Pembangunan Gedung Rektorat & FK UM Kendari oleh Petta Desain",
    date: "Februari 2025",
    category: "Proyek & Konstruksi",
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Gedung megah berkonsep Green Building dan Modern Islami ini mulai memasuki tahapan konstruksi lanjutan di Kota Kendari."
  },
  {
    id: "news-2",
    slug: "baraka-hotel-kolaka-modern-transit",
    title: "Baraka Hotel Kolaka: Sentuhan Modern Tropis untuk Destinasi Transit Bisnis",
    date: "Januari 2025",
    category: "Hospitality & Desain",
    coverImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Petta Desain mengintegrasikan kenyamanan akomodasi berkelas dengan sirkulasi udara alami dan pencahayaan optimal di Kolaka."
  },
  {
    id: "news-3",
    slug: "pentingnya-pbg-slf-bangunan-gedung",
    title: "Edukasi Arsitektur: Regulasi Pengurusan PBG & SLF di Sulawesi Tenggara",
    date: "Desember 2024",
    category: "Edukasi & Regulasi",
    coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Bagaimana studio kami membantu pemilik bangunan memastikan legalitas, kelaikan teknis, dan standar keselamatan struktural."
  }
];

export interface AwardItem {
  id: string;
  year: string;
  title: string;
  issuer: string;
  category: string;
  project: string;
  description: string;
}

export interface CompetitionItem {
  id: string;
  year: string;
  title: string;
  organizer: string;
  achievement: string;
  location: string;
  description: string;
}

export const STUDIO_AWARDS: AwardItem[] = [
  {
    id: "award-1",
    year: "2024",
    title: "IAI Sulawesi Tenggara Architecture Excellence Recognition",
    issuer: "Ikatan Arsitek Indonesia (IAI) Pengda Sulawesi Tenggara",
    category: "Commercial & Institutional Architecture",
    project: "Gedung Rektorat & FK Universitas Muhammadiyah Kendari",
    description: "Penghargaan apresiasi atas inovasi perancangan landmark institusi pendidikan modern berkarakter Islami dan adaptif terhadap iklim tropis khatulistiwa."
  },
  {
    id: "award-2",
    year: "2023",
    title: "Regional Sustainable Hospitality Design Citation",
    issuer: "Southeast Sulawesi Architecture & Tourism Forum",
    category: "Hospitality Architecture",
    project: "Baraka Hotel Kolaka",
    description: "Pengakuan perancangan hotel transit ramah lingkungan dengan sirkulasi udara mikro alami dan integrasi material lokal berkelanjutan."
  },
  {
    id: "award-3",
    year: "2022",
    title: "Excellence in Tropical Residential Tectonics",
    issuer: "Kendari Architectural Practitioner Association",
    category: "Private Residence",
    project: "N-House Estate Orinunggu",
    description: "Apresiasi desain tata ruang hunian privat berskala luas dengan proporsi modern klasik yang harmonis dan responsif terhadap lanskap tropis."
  }
];

export const STUDIO_COMPETITIONS: CompetitionItem[] = [
  {
    id: "comp-1",
    year: "2024",
    title: "Sayembara Gagasan Desain Kawasan Landmark & Gerbang Pesisir Teluk Kendari",
    organizer: "Pemerintah Daerah & Ikatan Arsitek Indonesia Sultra",
    achievement: "Finalis / Top 5 Design Proposal",
    location: "Kawasan Pesisir Teluk Kendari, Sultra",
    description: "Gagasan ruang publik pesisir inklusif yang memadukan mitigasi pasang-surut air laut, ruang rekreasi ramah pedestrian, dan estetika struktur parametrik."
  },
  {
    id: "comp-2",
    year: "2023",
    title: "Sayembara Perancangan Gedung Pusat Kebudayaan & Galeri Maritim Sulawesi",
    organizer: "Forum Kebudayaan & Arsitektur Nusantara",
    achievement: "Honorary Mention",
    location: "Sulawesi Tenggara",
    description: "Eksplorasi tipologi arsitektur bahari kontemporer berbasis struktur bambu komposit dan atap peneduh bentang lebar."
  },
  {
    id: "comp-3",
    year: "2022",
    title: "Sayembara Desain Fasad Kantor Pemerintahan Hijau Ramah Lingkungan",
    organizer: "Dinas Bina Marga & Tata Ruang",
    achievement: "Finalist Proposal",
    location: "Kendari",
    description: "Rancangan fasad kisi-kisi kinetik parametrik yang mampu mengurangi beban radiasi termal matahari hingga 40%."
  }
];

export const BRAND_LOGOS = {
  clients: [
    { name: "Universitas Muhammadiyah Kendari", label: "UM KENDARI" },
    { name: "Baraka Hotel Kolaka", label: "BARAKA HOTEL" },
    { name: "Ikatan Arsitek Indonesia", label: "IAI SULTRA" },
    { name: "Archtech Kendari", label: "ARCHTECH" },
    { name: "Arsitek Kendari Network", label: "ARSITEK KENDARI" },
    { name: "Pemerintah Kota Kendari", label: "KENDARI CITY" }
  ],
  media: [
    { name: "Instagram Resmi", label: "@PETTADESAIN" },
    { name: "Facebook Studio", label: "PETTA DESAIN" },
    { name: "Indonesian Architecture", label: "IAI NETWORK" },
    { name: "Kendari Pos", label: "KENDARI POS" },
    { name: "Sultra Media", label: "SULTRA KINI" },
    { name: "Architecture Daily", label: "ARCH DAILY INDO" }
  ]
};

export const STUDIO_INFO = {
  name: "Petta Desain (Petta Arsitek / Petta Studio)",
  established: "2019",
  founder: "Ir. Ar. Andi Al-Mustaghfir Syah, MT., IAI",
  address: "Barokah Abadi Blok C-12, Kota Kendari, Sulawesi Tenggara 93118",
  workingAreas: "Kendari, Kolaka, Sulawesi Tenggara, serta layanan daring ke seluruh Indonesia",
  phone: "+62 822 9318 8899",
  email: "pettadesain@gmail.com",
  instagram: "https://www.instagram.com/pettadesain/",
  instagramFounder: "https://www.instagram.com/aams_ir/",
  facebook: "https://www.facebook.com/thagfir/"
};
