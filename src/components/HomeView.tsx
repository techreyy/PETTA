"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";
import { useProjects } from "@/lib/ProjectContext";
import {
  BRAND_LOGOS,
  BUSINESS_ENTITIES
} from "@/lib/data";

const DEFAULT_HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=90",
    title: "Gedung Rektorat & FK UM Kendari",
    category: "Commercial / Campus — Kota Kendari",
    slug: "gedung-rektorat-fk-umkendari"
  },
  {
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2000&q=90",
    title: "Baraka Hotel Kolaka",
    category: "Hospitality — Kabupaten Kolaka",
    slug: "baraka-hotel-kolaka"
  },
  {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=90",
    title: "N-House Estate Orinunggu",
    category: "Private House — 5.000 m² Kendari",
    slug: "n-house-orinunggu-kendari"
  }
];

export function HomeView() {
  const { projects, categories: PORTFOLIO_CATEGORIES, news: NEWS_ITEMS } = useProjects();
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Dynamic slides combining uploaded projects with hero fallback
  const heroSlides = projects.slice(0, 5).map((p) => ({
    image: p.heroImage,
    title: p.title,
    category: `${p.category} — ${p.location}`,
    slug: p.slug
  }));

  const activeSlides = heroSlides.length > 0 ? heroSlides : DEFAULT_HERO_SLIDES;

  useEffect(() => {
    if (reducedMotion || paused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [activeSlides.length, reducedMotion, paused]);

  const featuredProjects = projects.filter((p) => p.featured !== false);

  return (
    <div className="w-full bg-[#F9F8F6] text-[#14191E]">
      {/* 1. HERO SLIDER */}
      <section className="relative h-screen min-h-[640px] w-full overflow-hidden bg-[#14191E]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={activeSlides[currentSlide % activeSlides.length]?.image || DEFAULT_HERO_SLIDES[0].image}
              alt={activeSlides[currentSlide % activeSlides.length]?.title || "Petta Architecture"}
              fill
              priority
              className="object-cover opacity-85"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#14191E] via-[#14191E]/30 to-[#14191E]/50" />
          </motion.div>
        </AnimatePresence>

        {/* Hero Captions & Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-end pb-24 md:pb-28">
          <motion.div
            key={`caption-${currentSlide}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl text-white space-y-4"
          >
            <span className="inline-block text-xs uppercase tracking-[0.35em] text-[#6A9D94] font-semibold">
              Karya Pilihan · {activeSlides[currentSlide % activeSlides.length]?.category}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.08] text-white">
              {activeSlides[currentSlide % activeSlides.length]?.title}
            </h1>
            <div className="pt-2">
              <Link
                href={`/portfolio/${activeSlides[currentSlide % activeSlides.length]?.slug}`}
                className="inline-flex items-center gap-3 text-xs tracking-[0.25em] uppercase font-medium text-white hover:text-[#6A9D94] group transition-colors"
              >
                Lihat Dokumentasi Karya
                <span className="w-8 h-[1px] bg-[#6A9D94] group-hover:w-12 transition-all duration-300" />
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform text-[#6A9D94]" />
              </Link>
            </div>
          </motion.div>

          {/* Slider Indicators */}
          <div className="flex items-center justify-between pt-12 border-t border-white/20 mt-12">
            <div className="flex items-center gap-3">
              <button onClick={() => setPaused(!paused)} aria-label={paused ? "Putar slideshow" : "Jeda slideshow"}>{paused ? "Putar" : "Jeda"}</button>
              {activeSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1 transition-all duration-500 rounded-full ${
                    currentSlide === idx ? "w-10 bg-[#6A9D94]" : "w-3 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 text-white">
              <button
                onClick={() =>
                  setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)
                }
                className="w-10 h-10 border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setCurrentSlide((prev) => (prev + 1) % activeSlides.length)
                }
                className="w-10 h-10 border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POSITIONING STATEMENT (PETTA DESAIN KENDARI) */}
      <section className="py-24 md:py-36 bg-[#F9F8F6] border-b border-[#E5E2DC]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-4">
              <span className="text-xs uppercase tracking-[0.35em] text-[#6A9D94] font-semibold block mb-2">
                Petta Desain · Kendari
              </span>
              <p className="text-[#6B7785] text-sm tracking-widest uppercase">
                Arsitektur · Interior · Struktur Sipil
              </p>
            </div>

            <div className="lg:col-span-8 space-y-8">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-light leading-[1.25] text-[#14191E] tracking-tight">
                Studio konsultan perancangan arsitektur berlisensi IAI yang berbasis di Kota Kendari, merajut estetika tropis modern dan ketahanan struktural.
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[#53606E] text-sm font-light leading-relaxed pt-4 border-t border-[#E5E2DC]">
                <p>
                  Didirikan oleh <strong>Ir. Ar. Andi Al-Mustaghfir Syah, MT., IAI</strong>, Petta Desain aktif berkarya sejak 2019 menangani perancangan kampus institusi, hotel transit, hingga hunian tapak prestisius.
                </p>
                <p>
                  Melalui ekosistem <strong>Petta Desain</strong>, <strong>Petta Konstruksi</strong>, dan <strong>Petta Printlab</strong>, kami menyediakan layanan lengkap mulai dari studi konseptual, gambar kerja teknis, pengurusan PBG & SLF, hingga perhitungan ketahanan gempa.
                </p>
              </div>
              <div>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-semibold text-[#14191E] border-b-2 border-[#6A9D94] pb-1 hover:text-[#6A9D94] transition-colors"
                >
                  Kenali Studio, Pendiri & Tim Petta Desain
                  <ArrowRight className="w-3.5 h-3.5 text-[#6A9D94]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BUSINESS ENTITIES OVERVIEW */}
      <section className="py-20 bg-white border-b border-[#E5E2DC]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.3em] text-[#6A9D94] font-semibold block mb-2">
              Ekosistem Terintegrasi
            </span>
            <h3 className="text-2xl md:text-3xl font-light text-[#14191E]">
              Unit Bisnis Petta Group
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BUSINESS_ENTITIES.map((ent, idx) => (
              <div key={ent.name} className="p-6 border border-[#E5E2DC] bg-[#F9F8F6] space-y-3">
                <span className="text-xs font-mono text-[#6A9D94]">0{idx + 1}</span>
                <h4 className="text-lg font-medium text-[#14191E]">{ent.name}</h4>
                <p className="text-xs text-[#6A9D94] font-medium uppercase tracking-wider">{ent.focus}</p>
                <p className="text-xs text-[#53606E] font-light leading-relaxed">{ent.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROJECTS SHOWCASE (PORTFOLIO RESMI) */}
      <section className="py-24 md:py-36 bg-[#FFFFFF] border-b border-[#E5E2DC]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs uppercase tracking-[0.35em] text-[#6A9D94] font-semibold block mb-2">
                Portofolio Pilihan
              </span>
              <h3 className="text-3xl md:text-5xl font-light tracking-tight text-[#14191E]">
                Karya Arsitektur Petta Desain
              </h3>
            </div>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-medium text-[#6B7785] hover:text-[#14191E] border-b border-[#E5E2DC] pb-1"
            >
              Lihat Seluruh Arsip Proyek
              <ArrowRight className="w-4 h-4 text-[#6A9D94]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {featuredProjects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                aspect={idx % 3 === 0 ? "wide" : "landscape"}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. TYPOLOGY SHOWCASE */}
      <section className="py-24 md:py-36 bg-[#F9F8F6] border-b border-[#E5E2DC]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-xl mb-16">
            <span className="text-xs uppercase tracking-[0.35em] text-[#6A9D94] font-semibold block mb-2">
              Tipologi Ruang
            </span>
            <h3 className="text-3xl md:text-5xl font-light tracking-tight text-[#14191E]">
              Kategori & Disiplin Perancangan
            </h3>
            <p className="text-[#6B7785] text-sm font-light mt-3 leading-relaxed">
              Jelajahi karya rancangan kami mulai dari rumah tinggal privat, komplek masterplan, interior ruang pimpinan, hingga gedung komersial publik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PORTFOLIO_CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
              >
                <Link
                  href={`/portfolio/category/${cat.slug}`}
                  className="group block relative overflow-hidden bg-[#14191E] border border-[#242E38] text-white aspect-[4/5] p-8 flex flex-col justify-between shadow-md"
                >
                  <Image
                    src={cat.coverImage}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover opacity-65 group-hover:scale-105 group-hover:opacity-45 transition-all duration-700 ease-[0.16,1,0.3,1]"
                  />
                  <div className="relative z-10 flex justify-between items-start">
                    <span className="text-xs tracking-[0.25em] font-mono text-[#6A9D94] font-semibold">
                      0{idx + 1}
                    </span>
                    <span className="text-[11px] tracking-widest uppercase bg-[#14191E]/90 border border-[#242E38] px-2.5 py-1 text-white">
                      {cat.count} Karya
                    </span>
                  </div>

                  <div className="relative z-10 space-y-2">
                    <h4 className="text-2xl font-light tracking-tight text-white group-hover:text-[#6A9D94] transition-colors duration-300">
                      {cat.title}
                    </h4>
                    <p className="text-xs text-[#A2AFBD] font-light line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                    <div className="pt-2 flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-medium text-[#6A9D94]">
                      <span>Buka Kategori</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHAT'S ON / NEWS */}
      <section className="py-24 md:py-32 bg-[#FFFFFF] border-b border-[#E5E2DC]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs uppercase tracking-[0.35em] text-[#6A9D94] font-semibold block mb-2">
                Kabar Studio & Artikel
              </span>
              <h3 className="text-3xl md:text-5xl font-light tracking-tight text-[#14191E]">
                What’s On
              </h3>
            </div>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-medium text-[#6B7785] hover:text-[#14191E] transition-colors"
            >
              Semua Artikel & Kabar
              <ArrowRight className="w-4 h-4 text-[#6A9D94]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {NEWS_ITEMS.map((item, idx) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#14191E] mb-5 border border-[#E5E2DC]">
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="flex items-center gap-3 text-xs tracking-wider uppercase text-[#6B7785] mb-2">
                    <span className="text-[#6A9D94] font-semibold">{item.category}</span>
                    <span>·</span>
                    <span>{item.date}</span>
                  </div>
                  <h4 className="text-lg font-normal text-[#14191E] leading-snug group-hover:text-[#6A9D94] transition-colors mb-3">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#53606E] font-light leading-relaxed line-clamp-2">
                    {item.excerpt}
                  </p>
                </div>
                <div className="pt-4">
                  <Link href={`/news/${item.slug}`} className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.2em] uppercase font-semibold text-[#14191E] group-hover:text-[#6A9D94]">
                    Baca Selengkapnya <ArrowRight className="w-3 h-3 text-[#6A9D94]" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CLIENTS & NETWORKS */}
      <section className="py-20 bg-[#F9F8F6]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
          <div>
            <span className="text-[11px] uppercase tracking-[0.35em] text-[#6A9D94] font-semibold block text-center mb-8">
              Klien & Mitra Kolaborasi Studio
            </span>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center text-center">
              {BRAND_LOGOS.clients.map((c) => (
                <div
                  key={c.name}
                  className="p-4 border border-[#E5E2DC] bg-[#FFFFFF] hover:border-[#6A9D94] transition-colors shadow-2xs"
                >
                  <span className="text-xs md:text-sm font-semibold tracking-[0.2em] text-[#53606E] hover:text-[#14191E] transition-colors">
                    {c.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
