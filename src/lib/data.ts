import { TEAM_ROSTER } from "./team-roster";
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
    "title": "Private House",
    "slug": "private-house",
    "count": 5,
    "description": "Rumah tinggal, villa, luxury residence.",
    "coverImage": "/api/media/file/petta-n-house-ac65b8abd8a6.webp"
  },
  {
    "title": "Residential & Housing",
    "slug": "residential-housing",
    "count": 0,
    "description": "Kos, townhouse, apartment, rusun, residential development.",
    "coverImage": "/petta-logo-transparent.png"
  },
  {
    "title": "Commercial Building",
    "slug": "commercial-building",
    "count": 1,
    "description": "Ruko, kantor, showroom, retail, commercial building.",
    "coverImage": "/category-covers/dfcc4790a91976c1.webp"
  },
  {
    "title": "Hospitality",
    "slug": "hospitality",
    "count": 1,
    "description": "Hotel, resort, café, restaurant, leisure.",
    "coverImage": "/api/media/file/petta-hotel-baraka-7c5898113a85.webp"
  },
  {
    "title": "Religious Architecture",
    "slug": "religious-architecture",
    "count": 0,
    "description": "Masjid, gereja, pura, vihara, klenteng, chapel, dan fasilitas pendukung ibadah.",
    "coverImage": "/petta-logo-transparent.png"
  },
  {
    "title": "Institutional & Public",
    "slug": "institutional-public",
    "count": 2,
    "description": "Sekolah, kampus, kantor pemerintahan, fasilitas kesehatan, fasilitas olahraga, dan fasilitas publik.",
    "coverImage": "/api/media/file/petta-gedung-rektorat-umkendari-78056dec24dc.webp"
  },
  {
    "title": "Interior Design",
    "slug": "interior-design",
    "count": 3,
    "description": "Interior rumah, kantor, retail, hospitality, commercial, dan public space.",
    "coverImage": "/api/media/file/petta-fakultas-ekonomi-dan-bisnis-islam-2c6f7ebd2aec.webp"
  },
  {
    "title": "Masterplanning & Urban Design",
    "slug": "masterplanning-residential",
    "count": 1,
    "description": "Masterplan kawasan, site planning, urban design, residential development.",
    "coverImage": "/category-covers/4336da6760f79ae7.webp"
  },
  {
    "title": "Renovation & Adaptive Reuse",
    "slug": "renovation-adaptive-reuse",
    "count": 0,
    "description": "Renovasi, revitalisasi, restorasi, perubahan fungsi bangunan.",
    "coverImage": "/petta-logo-transparent.png"
  },
  {
    "title": "Architecture Installation",
    "slug": "architecture-installation",
    "count": 1,
    "description": "Pavilion, exhibition, installation, temporary structure, architectural art installation.",
    "coverImage": "/category-covers/0261d9a27fa7ab24.webp"
  },
  {
    "title": "Social and Cultural Function Buildings",
    "slug": "social-cultural-function-buildings",
    "count": 1,
    "description": "Bangunan fungsi sosial dan budaya, ruang komunitas, serta fasilitas kegiatan sosial dan kebudayaan.",
    "coverImage": "/api/media/file/petta-smart-school-b4993f2e602b.webp"
  }
];

export const PROJECTS: Project[] = [
  {
    "id": "1",
    "slug": "gedung-rektorat-fk-umkendari",
    "title": "Gedung Rektorat & Fakultas Kedokteran UM Kendari",
    "category": "Institutional & Public",
    "categorySlug": "institutional-public",
    "location": "Kota Kendari, Sulawesi Tenggara",
    "year": "2022",
    "status": "Completed / Under Phasing",
    "architectInCharge": "Ir. Ar. Andi Al-Mustaghfir Syah",
    "siteArea": "12,500 sqm",
    "constructedArea": "8,400 sqm",
    "stories": "6 Lantai + Plaza Akademik",
    "shortIntro": "Rancangan arsitektur berkonsep Modern Islami dan Green Building dengan fasad geometris modern yang megah.",
    "description": [
      "Gedung Rektorat & Fakultas Kedokteran Universitas Muhammadiyah Kendari dirancang sebagai representasi landmark peradaban pendidikan di Sulawesi Tenggara. Menggabungkan nafas nilai-nilai keislaman dengan arsitektur ramah lingkungan (green building).",
      "Fasad bangunan mengadopsi brise-soleil geometris islami modern yang berfungsi optimal mereduksi panas matahari tropis khatulistiwa, sekaligus menghadirkan pencahayaan alami dan efisiensi energi yang masif pada ruang-ruang kuliah dan administrasi."
    ],
    "heroImage": "/api/media/file/petta-gedung-rektorat-umkendari-78056dec24dc.webp",
    "gallery": [
      "/api/media/file/petta-gedung-rektorat-umkendari-78056dec24dc.webp",
      "/api/media/file/petta-gedung-rektorat-umkendari-6ed710b7245e.webp"
    ],
    "featured": true
  },
  {
    "id": "2",
    "slug": "baraka-hotel-kolaka",
    "title": "Baraka Hotel Kolaka",
    "category": "Hospitality",
    "categorySlug": "hospitality",
    "location": "Kabupaten Kolaka, Sulawesi Tenggara",
    "year": "2026",
    "status": "Completed",
    "architectInCharge": "Ir. Ar. Andi Al-Mustaghfir Syah & Tim",
    "siteArea": "2,200 sqm",
    "constructedArea": "3,800 sqm",
    "stories": "4 Lantai + Sky Lounge",
    "shortIntro": "Hotel transit modern yang memadukan kemewahan tropis dan efisiensi fungsional bagi para pelaku bisnis dan wisatawan.",
    "description": [
      "Terletak di pusat mobilitas strategis Kabupaten Kolaka, Baraka Hotel dirancang menghadirkan oase kenyamanan transit berstandar tinggi. Arsitektur eksterior mengekspresikan artikulasi modern tegas dengan sirip vertikal penahan silau matahari.",
      "Bagian interior mengintegrasikan lobby berplafon tinggi, restoran tropis terbuka, serta kamar-kamar yang didesain secara ergonomis dengan sentuhan kayu lokal dan tata cahaya hangat."
    ],
    "heroImage": "/api/media/file/petta-hotel-baraka-7c5898113a85.webp",
    "gallery": [
      "/api/media/file/petta-hotel-baraka-7c5898113a85.webp",
      "/api/media/file/petta-hotel-baraka-66d20a2ba9d1.webp",
      "/api/media/file/petta-hotel-baraka-d5b895fc0c1e.webp",
      "/api/media/file/petta-hotel-baraka-64c4fa3f718f.webp",
      "/api/media/file/petta-hotel-baraka-0df46069b836.webp"
    ],
    "featured": true
  },
  {
    "id": "3",
    "slug": "n-house-orinunggu-kendari",
    "title": "N-House Estate Orinunggu",
    "category": "Private House",
    "categorySlug": "private-house",
    "location": "Jl. Orinunggu, Kota Kendari",
    "year": "2024",
    "status": "In Progress / Built",
    "architectInCharge": "Ir. Ar. Andi Al-Mustaghfir Syah",
    "siteArea": "5,000 sqm",
    "constructedArea": "1,200 sqm",
    "stories": "2 Lantai + Private Landscape Park",
    "shortIntro": "Hunian prestisius bergaya Modern Klasik Tropis di atas lahan seluas 5.000 m² yang megah dan asri.",
    "description": [
      "Berdiri megah di atas lahan 5.000 meter persegi di koridor prestisius Jl. Orinunggu Kendari, N-House memadukan keanggunan proporsi simetri klasik dengan keterbukaan arsitektur tropis modern.",
      "Desain mengutamakan bentang halaman hijau yang luas, paviliun keluarga tepi kolam renang, serta bukaan kaca masif yang menghadirkan sirkulasi udara alami pegunungan Kendari ke setiap sudut ruangan utama."
    ],
    "heroImage": "/api/media/file/petta-n-house-ac65b8abd8a6.webp",
    "gallery": [
      "/api/media/file/petta-n-house-ac65b8abd8a6.webp",
      "/api/media/file/petta-n-house-c09a1bd19808.webp",
      "/api/media/file/petta-n-house-199a4ca34f79.webp",
      "/api/media/file/petta-n-house-d55cec2f15f6.webp",
      "/api/media/file/petta-n-house-7a1084a1f79d.webp"
    ],
    "featured": true
  },
  {
    "id": "4",
    "slug": "modern-executive-office-umkendari",
    "title": "Modern Executive Office UMKendari",
    "category": "Interior Design",
    "categorySlug": "interior-design",
    "location": "Gedung Rektorat UMKendari",
    "year": "2026",
    "status": "Completed",
    "architectInCharge": "Reza Alvared, Ir. Ar. Andi Al-Mustaghfir Syah",
    "siteArea": "180 sqm",
    "constructedArea": "180 sqm",
    "stories": "1 Lantai (Ruang Pimpinan)",
    "shortIntro": "Desain interior ruang pimpinan bernuansa profesional, kontemporer, dan berwibawa.",
    "description": [
      "Penataan interior ruang pimpinan eksekutif Universitas Muhammadiyah Kendari diciptakan untuk memfasilitasi pengambilan keputusan strategis dan audiensi kehormatan.",
      "Menampilkan perpaduan panel dinding kayu jati terkalibrasi, aksen strip pencahayaan LED tersembunyi (*cove lighting*), meja rapat ergonomis kustom, dan partisi akustik berkualitas prima."
    ],
    "heroImage": "/api/media/file/petta-rg-kerja-rektor-umkendari-cef5295f24b3.webp",
    "gallery": [
      "/api/media/file/petta-rg-kerja-rektor-umkendari-cef5295f24b3.webp",
      "/api/media/file/petta-rg-kerja-rektor-umkendari-ed3f27f41e1d.webp",
      "/api/media/file/petta-rg-kerja-rektor-umkendari-0f4935daf873.webp",
      "/api/media/file/petta-rg-kerja-rektor-umkendari-793f1798cb12.webp"
    ],
    "featured": true
  },
  {
    "id": "5",
    "slug": "ruko-urban-tropis-kolaka",
    "title": "Ruko Urban Tropis Kolaka",
    "category": "Commercial Building",
    "categorySlug": "commercial-building",
    "location": "Pusat Kota Kolaka, Sulawesi Tenggara",
    "year": "2023",
    "status": "Completed",
    "architectInCharge": "Aprial Rahmat, Ir. Ar. Andi Al-Mustaghfir Syah",
    "siteArea": "450 sqm",
    "constructedArea": "780 sqm",
    "stories": "3 Lantai",
    "shortIntro": "Konsep rumah toko fungsional vertikal yang menepis kesan monoton ruko konvensional.",
    "description": [
      "Menghadirkan redefinisi terhadap tipologi ruko di perkotaan Kolaka. Memadukan display komersial transparan di lantai dasar dengan fasad pelindung matahari kisi-kisi aluminium di lantai atas.",
      "Sirkulasi dan ventilasi silang diperhitungkan matang sehingga lantai atas tetap sejuk dan nyaman digunakan sebagai kantor kreatif maupun hunian pemilik."
    ],
    "heroImage": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=85",
    "gallery": [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=80"
    ],
    "featured": false
  },
  {
    "id": "6",
    "slug": "barokah-abadi-living-masterplan",
    "title": "Barokah Abadi Integrated Living Estate",
    "category": "Masterplanning & Urban Design",
    "categorySlug": "masterplanning-residential",
    "location": "Kota Kendari, Sulawesi Tenggara",
    "year": "2024",
    "status": "Ongoing Development",
    "architectInCharge": "Ir. Ar. Andi Al-Mustaghfir Syah",
    "siteArea": "35,000 sqm",
    "constructedArea": "15,400 sqm",
    "stories": "Masterplan Terpadu",
    "shortIntro": "Kawasan hunian terencana yang mengintegrasikan kantor studio kreatif, drainase resapan, dan taman komunal.",
    "description": [
      "Masterplan kawasan yang menempatkan keselarasan alam, aksesibilitas pedestrian, serta proteksi tata air sebagai prioritas utama perancangan lingkungan permukiman modern di Kendari."
    ],
    "heroImage": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1800&q=85",
    "gallery": [
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1400&q=80"
    ],
    "featured": false
  },
  {
    "id": "7",
    "slug": "gerbang-landmark-sulawesi-tenggara",
    "title": "Landmark & Fasad Parametrik Petta",
    "category": "Architecture Installation",
    "categorySlug": "architecture-installation",
    "location": "Sulawesi Tenggara",
    "year": "2024",
    "status": "Built / Exhibition",
    "architectInCharge": "Pratama Juna, Ir. Ar. Andi Al-Mustaghfir Syah",
    "siteArea": "120 sqm",
    "constructedArea": "90 sqm",
    "stories": "Landmark Structure",
    "shortIntro": "Eksplorasi tektonika fasad parametrik dan gerbang arsitektur berkarakter modern regionalis.",
    "description": [
      "Kajian visual 3D dan fabrikasi tektonika parametrik yang menonjolkan kekuatan identitas lokal Sulawesi Tenggara dalam bahasa arsitektur kontemporer masa kini."
    ],
    "heroImage": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1800&q=85",
    "gallery": [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80"
    ],
    "featured": false
  },
  {
    "id": "8",
    "slug": "sport-center",
    "title": "SPORT CENTER",
    "category": "Institutional & Public",
    "categorySlug": "institutional-public",
    "location": "",
    "year": "2025",
    "status": "",
    "architectInCharge": "",
    "siteArea": "",
    "constructedArea": "",
    "stories": "",
    "shortIntro": "",
    "description": [],
    "heroImage": "/api/media/file/petta-sport-center-113d306ae920.webp",
    "gallery": [
      "/api/media/file/petta-sport-center-113d306ae920.webp",
      "/api/media/file/petta-sport-center-56e75440fd94.webp",
      "/api/media/file/petta-sport-center-1638cac59aff.webp",
      "/api/media/file/petta-sport-center-31d9502b1043.webp",
      "/api/media/file/petta-sport-center-38dedcbb54c1.webp",
      "/api/media/file/petta-sport-center-ca916222dfd8.webp",
      "/api/media/file/petta-sport-center-0ba2c1192609.webp",
      "/api/media/file/petta-sport-center-bff12f7e3045.webp",
      "/api/media/file/petta-sport-center-611df83f2bc4.webp",
      "/api/media/file/petta-sport-center-8fb8afa02918.webp",
      "/api/media/file/petta-sport-center-996cefcf992a.webp",
      "/api/media/file/petta-sport-center-f2d7ec1d643a.webp",
      "/api/media/file/petta-sport-center-54e53d6dce0c.webp",
      "/api/media/file/petta-sport-center-410f6dde38e3.webp",
      "/api/media/file/petta-sport-center-f6cc64185ce7.webp",
      "/api/media/file/petta-sport-center-8f56766c2465.webp",
      "/api/media/file/petta-sport-center-865a9e176f08.webp",
      "/api/media/file/petta-sport-center-1e1a3a269034.webp",
      "/api/media/file/petta-sport-center-749f3e90a0ad.webp",
      "/api/media/file/petta-sport-center-dac511a601a8.webp",
      "/api/media/file/petta-sport-center-39534fe85093.webp"
    ],
    "featured": false
  },
  {
    "id": "9",
    "slug": "fakultas-ekonomi-dan-bisnis-islam",
    "title": "FAKULTAS EKONOMI DAN BISNIS ISLAM",
    "category": "Interior Design",
    "categorySlug": "interior-design",
    "location": "",
    "year": "2025",
    "status": "",
    "architectInCharge": "",
    "siteArea": "",
    "constructedArea": "",
    "stories": "",
    "shortIntro": "",
    "description": [],
    "heroImage": "/api/media/file/petta-fakultas-ekonomi-dan-bisnis-islam-2c6f7ebd2aec.webp",
    "gallery": [
      "/api/media/file/petta-fakultas-ekonomi-dan-bisnis-islam-2c6f7ebd2aec.webp",
      "/api/media/file/petta-fakultas-ekonomi-dan-bisnis-islam-8028f1039430.webp",
      "/api/media/file/petta-fakultas-ekonomi-dan-bisnis-islam-b87fcd7af169.webp",
      "/api/media/file/petta-fakultas-ekonomi-dan-bisnis-islam-6b9b9539631d.webp",
      "/api/media/file/petta-fakultas-ekonomi-dan-bisnis-islam-1a0601ae68aa.webp",
      "/api/media/file/petta-fakultas-ekonomi-dan-bisnis-islam-434a54115ad1.webp",
      "/api/media/file/petta-fakultas-ekonomi-dan-bisnis-islam-29e6e0d1aef3.webp",
      "/api/media/file/petta-fakultas-ekonomi-dan-bisnis-islam-43f558de0df1.webp"
    ],
    "featured": false
  },
  {
    "id": "10",
    "slug": "interior-lift-kantor-umkendari",
    "title": "INTERIOR LIFT KANTOR UMKendari",
    "category": "Interior Design",
    "categorySlug": "interior-design",
    "location": "",
    "year": "2026",
    "status": "",
    "architectInCharge": "",
    "siteArea": "",
    "constructedArea": "",
    "stories": "",
    "shortIntro": "",
    "description": [],
    "heroImage": "/api/media/file/petta-interior-lift-kantor-umkendari-909f136a6df8.webp",
    "gallery": [
      "/api/media/file/petta-interior-lift-kantor-umkendari-909f136a6df8.webp",
      "/api/media/file/petta-interior-lift-kantor-umkendari-ed60652c4788.webp",
      "/api/media/file/petta-interior-lift-kantor-umkendari-a35bdade20f4.webp"
    ],
    "featured": false
  },
  {
    "id": "11",
    "slug": "ca-house",
    "title": "CA-HOUSE",
    "category": "Private House",
    "categorySlug": "private-house",
    "location": "",
    "year": "2025",
    "status": "",
    "architectInCharge": "",
    "siteArea": "",
    "constructedArea": "",
    "stories": "",
    "shortIntro": "",
    "description": [],
    "heroImage": "/api/media/file/petta-ca-house-0c332e88458a.webp",
    "gallery": [
      "/api/media/file/petta-ca-house-0c332e88458a.webp",
      "/api/media/file/petta-ca-house-7d6f53ae5ccd.webp",
      "/api/media/file/petta-ca-house-98915b4b1ea2.webp",
      "/api/media/file/petta-ca-house-ea4801731f18.webp",
      "/api/media/file/petta-ca-house-e2ff6b4ec0a7.webp",
      "/api/media/file/petta-ca-house-1df27ccb9633.webp",
      "/api/media/file/petta-ca-house-ec2d72ca54fc.webp"
    ],
    "featured": false
  },
  {
    "id": "12",
    "slug": "f-house",
    "title": "F-HOUSE",
    "category": "Private House",
    "categorySlug": "private-house",
    "location": "",
    "year": "2026",
    "status": "",
    "architectInCharge": "",
    "siteArea": "",
    "constructedArea": "",
    "stories": "",
    "shortIntro": "",
    "description": [],
    "heroImage": "/api/media/file/petta-f-house-b555dcdf01bb.webp",
    "gallery": [
      "/api/media/file/petta-f-house-b555dcdf01bb.webp",
      "/api/media/file/petta-f-house-9d394879aa4f.webp"
    ],
    "featured": false
  },
  {
    "id": "13",
    "slug": "p-house",
    "title": "P-HOUSE",
    "category": "Private House",
    "categorySlug": "private-house",
    "location": "",
    "year": "2026",
    "status": "",
    "architectInCharge": "",
    "siteArea": "",
    "constructedArea": "",
    "stories": "",
    "shortIntro": "",
    "description": [],
    "heroImage": "/api/media/file/petta-p-house-d460056abb92.webp",
    "gallery": [
      "/api/media/file/petta-p-house-d460056abb92.webp",
      "/api/media/file/petta-p-house-92cdac7aed15.webp"
    ],
    "featured": false
  },
  {
    "id": "14",
    "slug": "r-house",
    "title": "R-HOUSE",
    "category": "Private House",
    "categorySlug": "private-house",
    "location": "",
    "year": "2026",
    "status": "",
    "architectInCharge": "",
    "siteArea": "",
    "constructedArea": "",
    "stories": "",
    "shortIntro": "",
    "description": [],
    "heroImage": "/api/media/file/petta-r-house-c2015b6e269d.webp",
    "gallery": [
      "/api/media/file/petta-r-house-c2015b6e269d.webp",
      "/api/media/file/petta-r-house-6ba8fd99cb48.webp",
      "/api/media/file/petta-r-house-45f350f2b824.webp",
      "/api/media/file/petta-r-house-c1f179b6970d.webp"
    ],
    "featured": false
  },
  {
    "id": "15",
    "slug": "smart-school",
    "title": "SMART SCHOOL",
    "category": "Social and Cultural Function Buildings",
    "categorySlug": "social-cultural-function-buildings",
    "location": "",
    "year": "2025",
    "status": "",
    "architectInCharge": "",
    "siteArea": "",
    "constructedArea": "",
    "stories": "",
    "shortIntro": "",
    "description": [],
    "heroImage": "/api/media/file/petta-smart-school-b4993f2e602b.webp",
    "gallery": [
      "/api/media/file/petta-smart-school-b4993f2e602b.webp",
      "/api/media/file/petta-smart-school-81efff213da7.webp",
      "/api/media/file/petta-smart-school-386c546841b3.webp",
      "/api/media/file/petta-smart-school-76f07d08ca2b.webp",
      "/api/media/file/petta-smart-school-3d8b666fb6a2.webp",
      "/api/media/file/petta-smart-school-ce0d1b4902f5.webp",
      "/api/media/file/petta-smart-school-9785d2014c13.webp",
      "/api/media/file/petta-smart-school-e54ddbbb0346.webp",
      "/api/media/file/petta-smart-school-7e256fb78d67.webp",
      "/api/media/file/petta-smart-school-0b3ea1ce59ed.webp",
      "/api/media/file/petta-smart-school-e6f7a9541c61.webp",
      "/api/media/file/petta-smart-school-fd70be5fdaea.webp"
    ],
    "featured": false
  }
];

export const STUDIO_TEAM = TEAM_ROSTER.map((member) => ({ name: member.name, role: member.role, instagram: "", portrait: "", bio: "" }));

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
    "number": "01",
    "title": "Architecture",
    "desc": "Perancangan arsitektur yang merespons kebutuhan, tapak, iklim, dan karakter pengguna."
  },
  {
    "number": "02",
    "title": "Interior Design",
    "desc": "Perencanaan ruang interior, material, pencahayaan, dan detail untuk hunian maupun ruang usaha."
  },
  {
    "number": "03",
    "title": "Masterplanning & Urban Design",
    "desc": "Perencanaan kawasan, tata massa, sirkulasi, ruang terbuka, dan pengembangan tapak."
  },
  {
    "number": "04",
    "title": "BIM & Technical Documentation",
    "desc": "Pemodelan informasi bangunan dan penyusunan dokumentasi teknis untuk koordinasi desain."
  },
  {
    "number": "05",
    "title": "3D Visualization",
    "desc": "Visualisasi tiga dimensi untuk mengomunikasikan ruang, material, dan suasana rancangan."
  },
  {
    "number": "06",
    "title": "Construction Supervision",
    "desc": "Pendampingan dan pengawasan pelaksanaan agar pekerjaan selaras dengan dokumen perancangan."
  },
  {
    "number": "07",
    "title": "Project Management",
    "desc": "Koordinasi lingkup pekerjaan, jadwal, dan pihak terkait sepanjang proses proyek."
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
  founder: TEAM_ROSTER[0].name,
  address: "Barokah Abadi Blok C-12, Kota Kendari, Sulawesi Tenggara 93118",
  workingAreas: "Kendari, Kolaka, Sulawesi Tenggara, serta layanan daring ke seluruh Indonesia",
  phone: "+62 822 9318 8899",
  email: "pettadesain@gmail.com",
  instagram: "https://www.instagram.com/pettadesain/",
  instagramFounder: "https://www.instagram.com/aams_ir/",
  facebook: "https://www.facebook.com/thagfir/"
};
