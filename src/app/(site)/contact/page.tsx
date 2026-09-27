"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/SocialIcons";
import { useStudioSettings } from "@/lib/SettingsContext";

export default function ContactPage() {
  const { settings } = useStudioSettings();
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "Jasa Arsitektur & Perencanaan (Rumah / Gedung)",
    message: "",
    website: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    setError('');
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Pesan belum tersimpan.');
      setSubmitted(true);
      setFormData({ fullName: '', email: '', phone: '', subject: 'Jasa Arsitektur & Perencanaan (Rumah / Gedung)', message: '', website: '' });
    } catch (error) { setError(error instanceof Error ? error.message : 'Koneksi bermasalah. Silakan coba lagi.'); }
    finally { setPending(false); }
  };

  return (
    <div className="pt-32 pb-36 min-h-screen bg-[#F9F8F6] text-[#14191E]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs uppercase tracking-[0.35em] text-[#39756B] font-semibold block mb-3">
            Konsultasi & Kemitraan Proyek
          </span>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-[#14191E] leading-tight">
            Hubungi {settings.name}
          </h1>
          <p className="text-[#6B7785] text-sm md:text-base font-light mt-4 leading-relaxed">
            Mulai dari perencanaan rumah tinggal, gedung institusi, desain interior eksekutif, hingga pengurusan PBG & SLF di Sulawesi Tenggara dan nasional.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Form */}
          <div className="lg:col-span-7 bg-white p-8 md:p-12 border border-[#E5E2DC] shadow-sm">
            {submitted ? (
              <div className="py-16 text-center space-y-4" role="status">
                <CheckCircle2 className="w-12 h-12 text-[#39756B] mx-auto" />
                <h3 className="text-2xl font-light text-[#14191E]">
                  Terima Kasih Atas Pertanyaan Anda
                </h3>
                <p className="text-xs text-[#6B7785] max-w-sm mx-auto leading-relaxed">
                  Pesan Anda telah tercatat di registri studio kami. Tim arsitek Petta Desain akan menghubungi Anda dalam waktu 1x24 jam.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs uppercase tracking-widest underline text-[#39756B] hover:text-[#14191E]"
                >
                  Kirim Pertanyaan Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" aria-busy={pending}>
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="contact-website">Website</label>
                  <input id="contact-website" tabIndex={-1} autoComplete="off" value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} />
                </div>
                {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
                <div>
                  <label htmlFor="contact-fullName" className="block text-xs uppercase tracking-widest text-[#6B7785] mb-2 font-medium">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text" autoComplete="name" maxLength={120}
                    required
                    id="contact-fullName" name="fullName" value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#F9F8F6] border border-[#E5E2DC] p-3.5 text-sm text-[#14191E] focus:outline-none focus:border-[#6A9D94] transition-colors"
                    placeholder="e.g. Bapak / Ibu..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact-email" className="block text-xs uppercase tracking-widest text-[#6B7785] mb-2 font-medium">
                      Alamat Email *
                    </label>
                    <input
                      type="email" autoComplete="email" maxLength={254}
                      required
                      id="contact-email" name="email" value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#F9F8F6] border border-[#E5E2DC] p-3.5 text-sm text-[#14191E] focus:outline-none focus:border-[#6A9D94] transition-colors"
                      placeholder="email@anda.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="block text-xs uppercase tracking-widest text-[#6B7785] mb-2 font-medium">
                      Nomor WhatsApp / HP (opsional)
                    </label>
                    <input
                      type="tel" autoComplete="tel" maxLength={40}
                      id="contact-phone" name="phone" value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#F9F8F6] border border-[#E5E2DC] p-3.5 text-sm text-[#14191E] focus:outline-none focus:border-[#6A9D94] transition-colors"
                      placeholder="+62 812 0000 0000"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs uppercase tracking-widest text-[#6B7785] mb-2 font-medium">
                    Layanan yang Dibutuhkan
                  </label>
                  <select
                    id="contact-subject" name="subject" value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#F9F8F6] border border-[#E5E2DC] p-3.5 text-sm text-[#14191E] focus:outline-none focus:border-[#6A9D94] transition-colors"
                  >
                    <option>Jasa Arsitektur & Perencanaan (Rumah / Gedung)</option>
                    <option>Desain Interior (Kantor / Rumah / Store)</option>
                    <option>Jasa Pengurusan PBG & SLF Resmi</option>
                    <option>Perhitungan Struktur Bangunan & Gempa</option>
                    <option>Visualisasi & Animasi 3D Sinematik</option>
                    <option>Konsultasi Kawasan / Masterplan</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs uppercase tracking-widest text-[#6B7785] mb-2 font-medium">
                    Deskripsi Kebutuhan & Lokasi Proyek *
                  </label>
                  <textarea
                    rows={5} minLength={20} maxLength={5000}
                    required
                    id="contact-message" name="message" value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#F9F8F6] border border-[#E5E2DC] p-3.5 text-sm text-[#14191E] focus:outline-none focus:border-[#6A9D94] transition-colors"
                    placeholder="Ceritakan rencana lokasi lahan (misal: Kendari, Kolaka, dll), perkiraan luas, tema rancangan, atau batas waktu..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={pending}
                  className="w-full py-4 bg-[#14191E] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#6A9D94] hover:text-[#14191E] transition-all flex items-center justify-center gap-2"
                >
                  {pending ? 'Mengirim...' : 'Kirimkan Pertanyaan Proyek'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Studios Info Sidebar */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.3em] text-[#39756B] font-semibold block">
                Kantor Pusat Studio
              </span>
              <h3 className="text-2xl font-light text-[#14191E]">
                {settings.name}
              </h3>
              <div className="text-sm font-light text-[#53606E] space-y-3 pt-2">
                <p className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#39756B] mt-0.5 shrink-0" />
                  <span>{settings.address}</span>
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#39756B] shrink-0" />
                  <a href={`tel:${settings.phone}`} className="hover:text-[#39756B] transition-colors">
                    {settings.phone}
                  </a>
                </p>
                <p className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#39756B] shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-[#39756B] transition-colors">
                    {settings.email}
                  </a>
                </p>
              </div>
            </div>

            <div className="p-6 border border-[#E5E2DC] bg-white space-y-3">
              <h4 className="text-xs uppercase tracking-widest text-[#14191E] font-medium">
                Kanal Media Sosial Resmi
              </h4>
              <div className="space-y-2 text-xs">
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 text-[#53606E] hover:text-[#39756B]"
                >
                  <InstagramIcon className="w-4 h-4 text-[#39756B]" />
                  <span>Instagram Studio: <strong>@pettadesain</strong></span>
                </a>
                <a
                  href={settings.instagramFounder}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 text-[#53606E] hover:text-[#39756B]"
                >
                  <InstagramIcon className="w-4 h-4 text-[#39756B]" />
                  <span>Founder: <strong>@aams_ir</strong> (Ir. Ar. AAMS)</span>
                </a>
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 text-[#53606E] hover:text-[#39756B]"
                >
                  <FacebookIcon className="w-4 h-4 text-[#39756B]" />
                  <span>Facebook: <strong>Andi Thagfir (Petta Desain)</strong></span>
                </a>
              </div>
            </div>

            <div className="p-6 border border-[#E5E2DC] bg-white space-y-2">
              <h4 className="text-xs uppercase tracking-widest text-[#14191E] font-medium">
                Waktu Konsultasi
              </h4>
              <p className="text-xs text-[#53606E] font-light leading-relaxed">
                Senin — Sabtu: 08:30 — 17:30 WITA<br />
                Konsultasi tatap muka di studio atau survei lokasi lahan dengan konfirmasi jadwal terlebih dahulu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
