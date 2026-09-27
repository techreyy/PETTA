'use client';
import { useState } from 'react';
export default function LegacyExport() {
  const [status, setStatus] = useState('');
  function exportData() {
    try {
      const projects = localStorage.getItem('petta_projects_store_v1');
      const settings = localStorage.getItem('petta_studio_settings_v1');
      if (!projects && !settings) { setStatus('Tidak ada data lama di browser ini.'); return; }
      const data = { projects: projects ? JSON.parse(projects) : [], settings: settings ? JSON.parse(settings) : {} };
      const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
      const link = document.createElement('a'); link.href = url; link.download = 'petta-legacy-content.json'; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus('Ekspor selesai. Data browser tetap disimpan. Akun dan password lama tidak disertakan.');
    } catch { setStatus('Data lama tidak dapat dibaca. Jangan hapus penyimpanan browser; hubungi pengelola.'); }
  }
  return <section className="max-w-2xl mx-auto px-6 pt-40 pb-24 space-y-6"><h1 className="text-3xl">Ekspor konten admin lama</h1>
    <p>Buka halaman ini di browser dan alamat website yang dahulu dipakai mengedit proyek. File hasil ekspor dapat dipindahkan ke CMS menggunakan perintah impor di README.</p>
    <button onClick={exportData} className="bg-[#14191E] text-white px-6 py-3">Unduh cadangan konten</button><p role="status">{status}</p>
  </section>;
}
