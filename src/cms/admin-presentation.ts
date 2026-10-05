import type { CollectionConfig, Field } from 'payload';

const labels: Record<string, string> = {
  title: 'Judul', name: 'Nama', slug: 'Alamat halaman', order: 'Urutan tampil',
  description: 'Deskripsi', active: 'Aktif', category: 'Kategori', year: 'Tahun',
  location: 'Lokasi', architectInCharge: 'Arsitek penanggung jawab', siteArea: 'Luas tapak',
  constructedArea: 'Luas bangunan', stories: 'Jumlah lantai', shortIntro: 'Pengantar singkat',
  paragraph: 'Paragraf', heroImage: 'Foto utama', coverImage: 'Foto sampul', image: 'Foto',
  gallery: 'Galeri foto', caption: 'Keterangan foto', featured: 'Tampilkan sebagai pilihan',
  legacyId: 'ID impor lama', seo: 'Tampilan di mesin pencari (opsional)',
  alt: 'Deskripsi gambar', roleTitle: 'Jabatan', portrait: 'Foto anggota tim', bio: 'Biografi',
  author: 'Penulis', publishDate: 'Tanggal terbit', body: 'Isi artikel', excerpt: 'Ringkasan',
  fullName: 'Nama lengkap', phone: 'Nomor telepon / WhatsApp', subject: 'Subjek',
  message: 'Pesan', internalNotes: 'Catatan internal', role: 'Hak akses',
  established: 'Tahun berdiri', founder: 'Pendiri', address: 'Alamat studio',
  workingAreas: 'Wilayah layanan', instagramFounder: 'Instagram pendiri',
};

const descriptions: Record<string, string> = {
  slug: 'Otomatis dari judul saat disimpan jika dikosongkan. Bisa diisi sendiri, misalnya rumah-tropis. Jangan ubah alamat yang sudah dibagikan.',
  order: 'Angka lebih kecil tampil lebih awal.',
  alt: 'Jelaskan isi gambar secara singkat untuk pembaca layar.',
  gallery: 'Tambahkan foto, lalu geser baris untuk mengatur urutannya. Keterangan foto boleh dikosongkan.',
  featured: 'Masukkan konten ini ke daftar pilihan di website.',
  internalNotes: 'Hanya untuk tim studio; tidak ditampilkan di website.',
};

// Presentation only: field names, option values and access rules remain unchanged.
export function adminFields(fields: Field[]): Field[] {
  return fields.map(field => {
    if (field.type === 'tabs') return { ...field, tabs: field.tabs.map(tab => ({ ...tab, fields: adminFields(tab.fields) })) };
    const result = { ...field };
    if (result.type === 'array' && result.name === 'description') result.labels = { singular: 'Paragraf', plural: 'Paragraf' };
    if (result.type === 'array' && result.name === 'gallery') result.labels = { singular: 'Foto', plural: 'Foto' };
    if ('fields' in result) result.fields = adminFields(result.fields);
    if ('name' in result && result.name) {
      const name = result.name;
      if (result.type !== 'ui' && result.label === undefined && labels[name]) result.label = labels[name];
      if (descriptions[name] && result.type !== 'ui') result.admin = { ...result.admin, description: result.admin?.description ?? descriptions[name] };
    }
    return result;
  });
}

const menus: Record<string, [string, string, string, string]> = {
  projects: ['Proyek', 'Proyek', 'Proyek', 'Isi informasi utama, tambahkan foto, lalu simpan draf atau terbitkan sesuai hak akses Anda.'],
  portfolioCategories: ['Kategori Proyek', 'Kategori Proyek', 'Proyek', 'Kelompokkan proyek berdasarkan jenis bangunannya.'],
  news: ['Artikel', 'Berita & Artikel', 'Koleksi Konten', 'Kelola kabar studio. Simpan draf untuk ditinjau sebelum diterbitkan.'],
  services: ['Layanan', 'Layanan', 'Koleksi Konten', 'Layanan aktif tampil di halaman Services.'],
  awards: ['Penghargaan', 'Penghargaan', 'Koleksi Konten', 'Catat penghargaan yang diterima studio.'],
  competitions: ['Sayembara', 'Sayembara', 'Koleksi Konten', 'Kelola gagasan desain dan pencapaian sayembara.'],
  media: ['Berkas', 'Foto & Berkas', 'Koleksi Konten', 'Unggah foto maksimal 10 MB per berkas. Isi deskripsi gambar sebelum menyimpan.'],
  team: ['Anggota Tim', 'Tim Studio', 'Identitas Studio', 'Kelola profil dan foto anggota studio.'],
  brandLogos: ['Logo Mitra', 'Logo Klien & Mitra', 'Identitas Studio', 'Unggah logo, pilih kelompoknya, lalu aktifkan agar tampil di website.'],
  inquiries: ['Pesan', 'Pesan Masuk', 'Pesan Masuk', 'Pesan dari formulir kontak. Perbarui status dan gunakan catatan internal untuk tindak lanjut.'],
  users: ['Pengguna', 'Akun Pengguna', 'Pengguna', 'Pemilik mengelola akun dan hak akses tim. Editor dapat menyimpan draf; admin dan pemilik dapat menerbitkan.'],
};

export function adminCollection(collection: CollectionConfig): CollectionConfig {
  const [singular, plural, group, description] = menus[collection.slug];
  return { ...collection, labels: { singular, plural }, admin: { ...collection.admin, group, description }, fields: adminFields(collection.fields) };
}
