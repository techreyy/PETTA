"use client";

import { useProjects } from "@/lib/ProjectContext";
import { useStudioSettings } from "@/lib/SettingsContext";
import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Compass,
  FileCheck2,
  Calculator,
  Video,
  Award,
  Layers
} from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/SocialIcons";
import {
  BUSINESS_ENTITIES,
  STUDIO_SERVICES,
  STUDIO_INFO
} from "@/lib/data";

const PILLARS = [
  {
    id: "01",
    tag: "Tectonic Truth",
    title: "Ketepatan Tektonika & Struktur",
    desc: "Kejujuran ekspresi material dan kalkulasi beban teknik sipil dengan mitigasi ketahanan gempa regional Sulawesi.",
  },
  {
    id: "02",
    tag: "Bioclimatic Sense",
    title: "Responsivitas Iklim Tropis",
    desc: "Menghormati angin pesisir teluk Kendari dan pergerakan matahari khatulistiwa melalui pembayangan pasif yang sejuk.",
  },
  {
    id: "03",
    tag: "Legal Rigor",
    title: "Akuntabilitas Regulasi PBG & SLF",
    desc: "Estetika yang berdiri di atas kepastian hukum, standar kode bangunan, dan kelaikan fungsi teknis sejak sketsa awal.",
  },
  {
    id: "04",
    tag: "Cultural Resonance",
    title: "Artikulasi Modern Nusantara",
    desc: "Menerjemahkan ketenangan spasial dan proporsi lokal Sulawesi Tenggara ke dalam bentukan arsitektur kontemporer.",
  }
];

export default function AboutPage() {
  const { team: STUDIO_TEAM } = useProjects();
  const { settings } = useStudioSettings();
  const reducedMotion = useReducedMotion();
  const blueprintRef = useRef<HTMLDivElement>(null);
  const [activePillar, setActivePillar] = useState(0);

  // Scroll animations for architectural vector line
  const { scrollYProgress } = useScroll({
    target: blueprintRef,
    offset: ["start end", "end start"],
  });

  // Animated drawing progress of the original blueprint line
  const pathLength = useTransform(scrollYProgress, [0.08, 0.7], [0, 1]);
  const nodeOpacity = useTransform(scrollYProgress, [0.25, 0.65], [0, 1]);

  return (
    <div className="pt-32 pb-36 min-h-screen bg-[#F9F8F6] text-[#14191E] overflow-x-hidden">
      {/* 1. MONOGRAPH HERO HEADER — refined with glow accent */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-20">
        {/* Thin glowing accent line at top */}
        <div className="relative h-px mb-12 md:mb-16">
          <div className="absolute inset-0 bg-[#E5E2DC]" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-[2px] bg-[#6A9D94] shadow-[0_0_12px_2px_rgba(106,157,148,0.5)]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
          <div className="lg:col-span-8">
            <h1 className="text-[clamp(2.5rem,6vw,5.5rem)] font-light tracking-[-0.045em] text-[#14191E] leading-[1.1]">
              Arsitektur yang <br />
              <span className="font-serif italic font-normal text-[#39756B]">berpijak</span>{" "}
              <span className="text-[#6B7785] font-light">&amp;</span> bernapas.
            </h1>
          </div>
          <div className="lg:col-span-4 space-y-5 pb-2">
            <p className="text-sm text-[#53606E] font-normal leading-[1.8]">
              <strong className="text-[#14191E]">Petta Desain (Petta Studio)</strong> didirikan oleh arsitek{" "}
              <strong className="text-[#14191E]">{settings.founder}</strong>. Kami menolak perancangan yang sekadar dekoratif — setiap karya adalah harmoni terukur antara sains fisika bangunan, ketahanan gempa bumi, dan ketenangan jiwa manusia.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span className="w-6 h-[1.5px] bg-[#6A9D94] shadow-[0_0_6px_1px_rgba(106,157,148,0.4)]" />
              <span className="text-xs font-sans tracking-wide text-[#53606E]">
                Kontekstual · Terukur · Berkelanjutan
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ORIGINAL PETTA CONTINUOUS BLUEPRINT LINE CANVAS (BENTUK ORIGINAL TEKTONIK PETTA) */}
      <section ref={blueprintRef} className="max-w-7xl mx-auto px-6 md:px-12 relative py-16 mb-28">
        {/* Animated Custom SVG Blueprint Geometry - Distinctive Architectural Contour */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block">
          <svg
            viewBox="0 0 1200 760"
            fill="none"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            {/* SVG Glow filter definitions */}
            <defs>
              {/* Soft teal glow for the main line */}
              <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                <feColorMatrix in="blur" type="matrix"
                  values="0 0 0 0 0.416
                          0 0 0 0 0.616
                          0 0 0 0 0.580
                          0 0 0 0.55 0"
                  result="glowColor" />
                <feMerge>
                  <feMergeNode in="glowColor" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Stronger glow for coordinate nodes */}
              <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                <feColorMatrix in="blur" type="matrix"
                  values="0 0 0 0 0.416
                          0 0 0 0 0.616
                          0 0 0 0 0.580
                          0 0 0 0.7 0"
                  result="glowColor" />
                <feMerge>
                  <feMergeNode in="glowColor" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Background subtle reference grid trace */}
            <path
              d="M 60 70 
                 H 540 
                 L 640 170 
                 H 1120 
                 V 290 
                 L 1000 290 
                 L 940 230 
                 H 760 
                 L 700 290 
                 H 480 
                 V 370 
                 H 680 
                 L 740 430 
                 H 1120 
                 V 680 
                 H 820 
                 L 760 620 
                 L 600 620 
                 L 540 680 
                 H 60 
                 V 510 
                 L 160 510 
                 L 220 450 
                 L 340 450 
                 L 400 510 
                 H 480 
                 V 230 
                 L 380 230 
                 L 320 170 
                 H 60 
                 Z"
              stroke="#E5E2DC"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />

            {/* Foreground Main Dynamic Drawing Vector — with glow */}
            <motion.path
              d="M 60 70 
                 H 540 
                 L 640 170 
                 H 1120 
                 V 290 
                 L 1000 290 
                 L 940 230 
                 H 760 
                 L 700 290 
                 H 480 
                 V 370 
                 H 680 
                 L 740 430 
                 H 1120 
                 V 680 
                 H 820 
                 L 760 620 
                 L 600 620 
                 L 540 680 
                 H 60 
                 V 510 
                 L 160 510 
                 L 220 450 
                 L 340 450 
                 L 400 510 
                 H 480 
                 V 230 
                 L 380 230 
                 L 320 170 
                 H 60 
                 Z"
              stroke="#6A9D94"
              strokeWidth="1.75"
              strokeLinejoin="miter"
              filter="url(#lineGlow)"
              style={{ pathLength: reducedMotion ? 1 : pathLength }}
            />

            {/* Architectural Coordinate Nodes — with glow */}
            <motion.g style={{ opacity: reducedMotion ? 1 : nodeOpacity }}>
              {/* Node 1 */}
              <circle cx="540" cy="70" r="4" fill="#14191E" stroke="#6A9D94" strokeWidth="2" filter="url(#nodeGlow)" />
              <text x="555" y="65" fill="#6B7785" fontSize="10" fontFamily="monospace">NODE_01 (SUMBU UTAMA)</text>

              {/* Node 2 */}
              <circle cx="640" cy="170" r="4" fill="#14191E" stroke="#6A9D94" strokeWidth="2" filter="url(#nodeGlow)" />
              <text x="655" y="165" fill="#6B7785" fontSize="10" fontFamily="monospace">ELEVASI +3.60m</text>

              {/* Node 3 */}
              <circle cx="700" cy="290" r="4" fill="#14191E" stroke="#6A9D94" strokeWidth="2" filter="url(#nodeGlow)" />
              <text x="715" y="285" fill="#6B7785" fontSize="10" fontFamily="monospace">KANTILEVER TROPIS</text>

              {/* Node 4 */}
              <circle cx="760" cy="620" r="4" fill="#14191E" stroke="#6A9D94" strokeWidth="2" filter="url(#nodeGlow)" />
              <text x="775" y="615" fill="#6B7785" fontSize="10" fontFamily="monospace">PORTAL STRUKTUR GEMPA</text>
            </motion.g>
          </svg>
        </div>

        {/* Narrative Block 1: Philosophy in the Frame */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-28">
          <div className="lg:col-span-6 bg-white/95 backdrop-blur-md p-8 md:p-10 border border-[#E5E2DC] shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[2px] bg-[#6A9D94] shadow-[0_0_8px_2px_rgba(106,157,148,0.45)]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#6A9D94] font-mono font-semibold">
                Filosofi Tektonika
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-light text-[#14191E] tracking-tight">
              Philosophy
            </h2>

            <p className="text-xs md:text-sm text-[#53606E] font-light leading-relaxed pt-2">
              Bagi Petta Desain, arsitektur bukan sekadar membungkus ruang dengan fasad indah. Arsitektur adalah seni rekayasa lingkungan hidup: bagaimana bangunan menyerap sejuknya angin pagi dari Teluk Kendari, meredam radiasi matahari khatulistiwa lewat kisi-kisi pelindung (<em>brise-soleil</em>), serta berdiri kokoh dengan perhitungan beban gempa yang akurat.
            </p>
            <p className="text-xs md:text-sm text-[#53606E] font-light leading-relaxed">
              Setiap detail sambungan material, bayangan dinding bata, dan bukaan ventilasi dirancang memiliki tujuan fungsional nyata bagi kenyamanan penghuninya.
            </p>
          </div>

          <div className="lg:col-span-6 hidden lg:flex justify-end pt-8">
            <div className="bg-[#14191E] text-white p-6 border border-[#242E38] w-64 space-y-2 shadow-lg">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#6A9D94] block">
                Metric Specification
              </span>
              <p className="text-xs text-[#A2AFBD] font-light leading-relaxed">
                Integrasi denah tropis pasif, pencahayaan alami 80%, dan reduksi beban pendingin ruangan buatan.
              </p>
            </div>
          </div>
        </div>

        {/* Narrative Block 2: Mission in the Lower Geometry */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 hidden lg:block pl-6">
            <div className="border-l-2 border-[#6A9D94] pl-6 space-y-2" style={{ boxShadow: '-2px 0 10px 0 rgba(106,157,148,0.35)' }}>
              <span className="text-xs font-mono text-[#6A9D94] uppercase tracking-widest block font-semibold">
                Akuntabilitas Studio
              </span>
              <p className="text-xs text-[#6B7785] leading-relaxed">
                Kepatuhan hukum tata ruang, sertifikasi arsitek berlisensi IAI, dan ketepatan dokumen teknis perizinan PBG &amp; SLF.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white/95 backdrop-blur-md p-8 md:p-10 border border-[#E5E2DC] shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[2px] bg-[#6A9D94] shadow-[0_0_8px_2px_rgba(106,157,148,0.45)]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#6A9D94] font-mono font-semibold">
                Misi &amp; Standar Operasional
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-light text-[#14191E] tracking-tight">
              Mission
            </h2>

            <p className="text-xs md:text-sm text-[#53606E] font-light leading-relaxed pt-2">
              Menghadirkan layanan perancangan komprehensif dari hulu ke hilir: mulai dari studi kelayakan tapak, konsepsi tata ruang modern Islami dan tropis, perhitungan struktur teknik sipil, hingga pendampingan legalitas izin Persetujuan Bangunan Gedung (PBG) serta Sertifikat Laik Fungsi (SLF).
            </p>
            <p className="text-xs md:text-sm text-[#53606E] font-light leading-relaxed">
              Melalui sinergi <strong>Petta Desain</strong>, <strong>Petta Konstruksi</strong>, dan <strong>Petta Printlab</strong>, kami memastikan setiap visi arsitektural dapat dieksekusi secara presisi, hemat biaya, dan tahan lama.
            </p>

            <div className="pt-3 flex items-center justify-between text-xs font-mono text-[#6A9D94]">
              <span>PETTA STUDIO · KENDARI</span>
              <span>EST. 2019</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR TECTONIC PILLARS MATRIX */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-32">
        <div className="bg-[#14191E] text-white p-8 md:p-14 border border-[#242E38] shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#242E38] pb-6 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.35em] text-[#6A9D94] font-semibold block mb-2 font-mono">
                Prinsip Desain
              </span>
              <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight">
                Empat Pilar Praktik Petta
              </h2>
            </div>
            <p className="text-xs text-[#A2AFBD] max-w-xs font-light">
              Sentuh atau arahkan kursor ke tiap pilar untuk melihat fokus perancangan studio kami.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map((pillar, idx) => {
              const isActive = activePillar === idx;
              return (
                <div
                  key={pillar.id}
                  onMouseEnter={() => setActivePillar(idx)}
                  className={`p-6 border transition-all duration-500 relative ${
                    isActive
                      ? "border-[#6A9D94] bg-[#1C252E] shadow-lg"
                      : "border-[#242E38] bg-[#14191E]/60 hover:border-[#6A9D94]/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-[#6A9D94]">
                      /{pillar.id}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-[#A2AFBD] font-mono">
                      {pillar.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-normal text-white mb-3 leading-snug">
                    <button
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setActivePillar(idx)}
                      className="text-left cursor-pointer after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A9D94] focus-visible:ring-offset-4 focus-visible:ring-offset-[#14191E]"
                    >
                      {pillar.title}
                    </button>
                  </h3>
                  <p className="text-xs text-[#A2AFBD] font-light leading-relaxed">
                    {pillar.desc}
                  </p>
                  <div className="mt-6 pt-4 border-t border-[#242E38] flex items-center justify-between text-[11px] text-[#6A9D94]">
                    <span>Prinsip Ke-{idx + 1}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6A9D94]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FOUNDER SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-32">
        <div className="bg-[#14191E] text-white border border-[#242E38] shadow-2xl p-8 md:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Foto Portrait Pendiri */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#1C252E] border border-[#242E38]">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
                  alt={settings.founder}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-[#14191E]/95 backdrop-blur-md p-3.5 border border-[#242E38] text-center">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#6A9D94] block font-semibold">
                    Andi Thagfir · @aams_ir
                  </span>
                  <span className="text-[11px] text-[#A2AFBD] block mt-0.5">
                    IAI Professional License Holder
                  </span>
                </div>
              </div>
            </div>

            {/* Narasi Kepemimpinan & Akademisi */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#6A9D94] font-semibold font-mono">
                <Award className="w-4 h-4" />
                <span>{STUDIO_TEAM.find((member) => member.name === settings.founder)?.role || "Principal Architect / Design Director"}</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-light text-white leading-tight">
                {settings.founder}
              </h2>

              <p className="text-xs tracking-widest uppercase text-[#A2AFBD] font-mono">
                Anggota Ikatan Arsitek Indonesia · Praktisi Arsitektur · Akademisi &amp; Dosen
              </p>

              <div className="space-y-4 text-sm text-[#A2AFBD] font-light leading-relaxed pt-2">
                <p>
                  Sebagai arsitek profesional berlisensi IAI yang juga mendedikasikan diri di dunia akademis,
                  Andi Al-Mustaghfir Syah memadukan ketajaman riset teoritis desain dengan kapabilitas teknis implementasi di lapangan.
                </p>
                <p>
                  Melalui Petta Desain, beliau memimpin perancangan karya-karya strategis di Sulawesi Tenggara—termasuk
                  Gedung Rektorat &amp; Fakultas Kedokteran UM Kendari, Baraka Hotel Kolaka, hingga perumahan residensial seluas ribuan meter persegi.
                </p>
              </div>

              {/* Tautan Media Sosial Resmi Founder */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <a
                  href={STUDIO_INFO.instagramFounder}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#6A9D94] text-xs uppercase tracking-wider text-[#6A9D94] hover:bg-[#6A9D94] hover:text-[#14191E] transition-all"
                >
                  <InstagramIcon className="w-4 h-4" />
                  Instagram @aams_ir
                </a>
                <a
                  href={STUDIO_INFO.facebook}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#242E38] text-xs uppercase tracking-wider text-[#A2AFBD] hover:border-white hover:text-white transition-all"
                >
                  <FacebookIcon className="w-4 h-4" />
                  Facebook Profil
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PETTA GROUP INTEGRATED UNITS */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-32">
        <div className="max-w-xl mb-12">
          <span className="text-xs uppercase tracking-[0.35em] text-[#6A9D94] font-semibold block mb-2 font-mono">
            Sinergi Unit Bisnis
          </span>
          <h2 className="text-3xl md:text-5xl font-light text-[#14191E]">
            Ekosistem Petta Group
          </h2>
          <p className="text-xs md:text-sm text-[#6B7785] mt-2">
            Tiga pilar operasional untuk memastikan kualitas perancangan, kekuatan struktur fisik, hingga dokumentasi teknis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BUSINESS_ENTITIES.map((ent, idx) => (
            <div
              key={ent.name}
              className="p-8 bg-white border border-[#E5E2DC] space-y-4 hover:border-[#6A9D94] transition-colors shadow-2xs group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#6A9D94] font-semibold">0{idx + 1}</span>
                <span className="text-[10px] uppercase tracking-widest bg-[#F9F8F6] px-2.5 py-1 border border-[#E5E2DC] text-[#6B7785]">
                  Active Entity
                </span>
              </div>
              <h3 className="text-2xl font-medium text-[#14191E] group-hover:text-[#6A9D94] transition-colors">
                {ent.name}
              </h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6A9D94]">
                {ent.focus}
              </p>
              <p className="text-xs text-[#53606E] font-light leading-relaxed">
                {ent.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. DESIGN COLLECTIVE & COLLABORATORS */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.35em] text-[#6A9D94] font-semibold block mb-2 font-mono">
              Tim Perancang
            </span>
            <h2 className="text-3xl md:text-5xl font-light text-[#14191E]">
              Kolektif Studio &amp; Kolaborator
            </h2>
          </div>
          <p className="text-xs text-[#6B7785] max-w-sm">
            Berkolaborasi erat bersama jejaring <strong>Archtech Kendari</strong> &amp; <strong>Arsitek Kendari Network</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STUDIO_TEAM.map((member) => (
            <div
              key={member.name}
              className="group bg-white p-4 border border-[#E5E2DC] shadow-2xs hover:border-[#6A9D94] transition-all"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#14191E] mb-4">
                {member.portrait ? <Image
                  src={member.portrait}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                /> : <div aria-hidden="true" className="flex h-full items-center justify-center text-5xl font-light tracking-widest text-[#6A9D94]">
                  {member.name.split(",")[0].split(" ").filter((part) => !part.endsWith(".")).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}
                </div>}
              </div>
              <h3 className="text-base font-medium text-[#14191E] leading-snug">
                {member.name}
              </h3>
              <p className="text-xs text-[#6A9D94] font-medium tracking-wide mt-1">
                {member.role}
              </p>
              <p className="text-[11px] font-mono text-[#6B7785] mt-0.5">
                {/^@?[A-Za-z0-9_.]{1,30}$/.test(member.instagram || "") ? (
                  <a
                    href={`https://www.instagram.com/${member.instagram.replace(/^@/, "")}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Instagram ${member.name} (tab baru)`}
                    className="underline underline-offset-4 hover:text-[#39756B] focus-visible:ring-2 focus-visible:ring-[#39756B]"
                  >
                    {member.instagram}
                  </a>
                ) : member.instagram}
              </p>
              <p className="text-xs text-[#53606E] font-light leading-relaxed mt-3 border-t border-[#E5E2DC] pt-3">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. 5 CORE SERVICES */}
      <section className="py-24 bg-[#14191E] text-white border-y border-[#242E38] mb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-xl mb-16">
            <span className="text-xs uppercase tracking-[0.35em] text-[#6A9D94] font-semibold block mb-2 font-mono">
              Lingkup Praktik
            </span>
            <h2 className="text-3xl md:text-5xl font-light text-white">
              5 Layanan Spesialisasi Petta
            </h2>
            <p className="text-xs text-[#A2AFBD] mt-3 font-light">
              Dari konsepsi denah, izin legal PBG/SLF, kalkulasi gempa struktur sipil, hingga visual 3D fotorealistik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {STUDIO_SERVICES.map((srv, idx) => {
              const IconComp = [Compass, Layers, FileCheck2, Calculator, Video][idx % 5];
              return (
                <div
                  key={srv.title}
                  className="p-8 border border-[#242E38] bg-[#1C252E] space-y-4 hover:border-[#6A9D94] transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#6A9D94] font-semibold">
                      {srv.number}
                    </span>
                    <IconComp className="w-5 h-5 text-[#6A9D94] group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-xl font-normal text-white group-hover:text-[#6A9D94] transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-[#A2AFBD] font-light leading-relaxed">
                    {srv.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. STUDIO LOCATION & REACH */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-20">
        <h2 className="sr-only">Lokasi &amp; Jangkauan Studio</h2>
        <div className="bg-white p-8 md:p-12 border border-[#E5E2DC] shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-[#6A9D94] font-semibold block font-mono">
                Kantor Pusat Studio
              </span>
              <h3 className="text-xl font-medium text-[#14191E]">Barokah Abadi, Kendari</h3>
              <p className="text-xs text-[#53606E] leading-relaxed">
                {STUDIO_INFO.address}
              </p>
            </div>

            <div className="space-y-3 border-t md:border-t-0 md:border-l border-[#E5E2DC] pt-6 md:pt-0 md:pl-8">
              <span className="text-xs uppercase tracking-[0.25em] text-[#6A9D94] font-semibold block font-mono">
                Wilayah Jangkauan Kerja
              </span>
              <h3 className="text-xl font-medium text-[#14191E]">Sulawesi Tenggara &amp; Nasional</h3>
              <p className="text-xs text-[#53606E] leading-relaxed">
                {STUDIO_INFO.workingAreas}
              </p>
            </div>

            <div className="space-y-3 border-t md:border-t-0 md:border-l border-[#E5E2DC] pt-6 md:pt-0 md:pl-8">
              <span className="text-xs uppercase tracking-[0.25em] text-[#6A9D94] font-semibold block font-mono">
                Kanal Sosial Resmi
              </span>
              <div className="space-y-2 text-xs">
                <a
                  href={STUDIO_INFO.instagram}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-2 text-[#14191E] hover:text-[#6A9D94] font-medium"
                >
                  <InstagramIcon className="w-4 h-4 text-[#6A9D94]" />
                  @pettadesain (Official)
                </a>
                <a
                  href={STUDIO_INFO.facebook}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-2 text-[#14191E] hover:text-[#6A9D94] font-medium"
                >
                  <FacebookIcon className="w-4 h-4 text-[#6A9D94]" />
                  Petta Desain (Facebook)
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. INQUIRY BANNER */}
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="p-8 md:p-12 bg-white border border-[#14191E] text-center space-y-4 shadow-lg">
          <span className="text-xs uppercase tracking-[0.3em] text-[#6A9D94] font-semibold block font-mono">
            Rencanakan Bangunan Anda Bersama Petta Desain
          </span>
          <h2 className="text-2xl md:text-4xl font-light text-[#14191E]">
            Konsultasikan Gagasan Arsitektur &amp; Perizinan PBG/SLF
          </h2>
          <p className="text-xs text-[#6B7785] max-w-xl mx-auto font-light leading-relaxed">
            Tim arsitek dan tenaga ahli struktur kami siap mewujudkan ruang impian Anda dengan perhitungan presisi, estetika tinggi, dan efisiensi biaya.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#14191E] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#6A9D94] hover:text-[#14191E] transition-all duration-300"
            >
              Mulai Konsultasi Proyek
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
