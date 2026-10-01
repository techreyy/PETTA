This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Run the development server with its PostgreSQL readiness check:

```bash
npm run dev
```

This starts the configured local PostgreSQL instance when needed and waits for
it before starting Next.js. Keep the terminal open. `npm run dev:local` is an
alias; `npm run dev:next` starts Next.js alone for an already managed database.
For production performance checks, run `npm run build` and `npm start` with
PostgreSQL running; development mode includes compilation overhead.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

Public typography uses self-hosted DM Sans through `next/font`, with Cormorant Garamond for editorial accents.

## Demo dan pengelolaan konten

Untuk demo lokal termasuk unggah foto, gunakan `npm run dev`, lalu buka `/admin` dengan akun studio. Server produksi (`npm start`) mensyaratkan S3 untuk unggahan; konfigurasi lokal tanpa S3 sengaja menolak unggahan dalam mode produksi.

Tambah proyek: buka **Proyek > Buat Baru**, isi judul dan kategori, pilih status pembangunan, lalu buka **Foto & Galeri** untuk foto utama dan galeri. Alamat halaman dibuat dari judul jika dikosongkan saat menyimpan. Detail teknis dan tautan gambar lama tersedia dalam panel opsional. Gunakan **Simpan Draf** atau **Publikasikan perubahan** sesuai hak akses. Judul yang diubah tidak otomatis mengganti alamat lama. Jika judul sama dengan proyek lain, isi alamat yang unik.

Pemilik/admin dapat menerbitkan; editor hanya menyimpan draf. Uji otomatis memakai database sementara, bukan data studio. Jalankan `npm test`, `npm run typecheck`, `npm run lint`, dan `npm run build` sebelum rilis.

Batas implementasi: pengaturan homepage, navigasi, About, video dan karier belum seluruhnya tersedia di CMS. Pengiriman email pemulihan akun belum dikonfigurasi; pesan kontak tersimpan di **Pesan Masuk**. Siapkan PostgreSQL, penyimpanan S3, URL situs, dan email sebelum peluncuran produksi.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
