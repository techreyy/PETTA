"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";
import { getProjectStatus } from "@/lib/project-status";
import { useProjects } from "@/lib/ProjectContext";
import {
  BUSINESS_ENTITIES
} from "@/lib/data";

import { useStudioSettings } from "@/lib/SettingsContext";
import { resolveHomepageContent, type HomepageCopy } from "@/lib/homepage-content";

function homepageParagraph(text: string, founderName: string) {
  // Support the existing bold emphasis without interpreting editor input as HTML.
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    const bold = part.startsWith('**') && part.endsWith('**');
    const value = (bold ? part.slice(2, -2) : part).replaceAll('{founderName}', founderName);
    return bold ? <strong key={index}>{value}</strong> : value;
  });
}

function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) return null;
    let videoId: string | null = null;
    if (
      parsed.hostname === "www.youtube.com" ||
      parsed.hostname === "youtube.com" ||
      parsed.hostname === "m.youtube.com"
    ) {
      videoId = parsed.searchParams.get("v");
    } else if (parsed.hostname === "youtu.be") {
      videoId = parsed.pathname.slice(1);
    }
    if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return `https://www.youtube-nocookie.com/embed/${videoId}`;
    }
  } catch {
    return null;
  }
  return null;
}

export function HomeView({ homepageContent }: { homepageContent?: HomepageCopy } = {}) {
  const { settings } = useStudioSettings();
  const logos = settings.editorial?.logos || [];
  const homepage = settings.editorial?.homepage;
  const copy = resolveHomepageContent(homepageContent || {
    headline: homepage?.positioningTitle,
    leftParagraph: homepage?.positioningHeadline,
    rightParagraph: homepage?.positioningText,
  });
  const { projects, categories: PORTFOLIO_CATEGORIES, news: NEWS_ITEMS } = useProjects();
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Only published project data supplies hero slides.
  const heroSlides = projects
    .filter((p) => p.heroImage && p.heroImage.length > 0)
    .slice(0, 5)
    .map((p) => ({
      image: p.heroImage,
      title: p.title,
      category: `${p.category} — ${p.location}`,
      statusLabel: getProjectStatus(p.status)?.toUpperCase() || p.status?.trim(),
      slug: p.slug
    }));

  const activeSlides = heroSlides;
  const activeSlide = activeSlides.length > 0 ? activeSlides[currentSlide % activeSlides.length] : undefined;

  useEffect(() => {
    if (reducedMotion || paused || activeSlides.length < 2) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [activeSlides.length, reducedMotion, paused]);

  const featuredProjects = projects.filter((p) => p.featured !== false);
  const builtProjects = featuredProjects.filter((p) => getProjectStatus(p.status) === "built").slice(0, 3);

  return (
    <div className="w-full bg-[#F9F8F6] text-[#14191E]">
      {/* 1. HERO SLIDER */}
      <section onFocusCapture={event => { if (event.target instanceof HTMLAnchorElement) setPaused(true); }} className="relative h-svh min-h-[640px] w-full overflow-hidden bg-[#14191E]">
        {activeSlide && <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide}
            initial={reducedMotion ? false : { opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={activeSlide.image}
              alt={activeSlide.title}
              fill
              preload={currentSlide === 0}
              className="object-cover opacity-85"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#14191E] via-[#14191E]/30 to-[#14191E]/50" />
          </motion.div>
        </AnimatePresence>}

        {/* Hero Captions & Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-end pb-24 md:pb-28">
          <motion.div
            key={`caption-${currentSlide}`}
            initial={currentSlide === 0 || reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl text-white space-y-4"
          >
            <span className="inline-block text-xs uppercase tracking-[0.35em] text-[#6A9D94] font-semibold">
              {activeSlide ? `Karya Pilihan · ${activeSlide.category}` : "Petta Desain · Kendari"}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.08] text-white">
              {activeSlide?.title || "Building Beyond Spaces"}
            </h1>
            {activeSlide?.statusLabel && (
              <span aria-label={`Project status: ${activeSlide.statusLabel}`} className="inline-block bg-[#14191E]/90 border border-white/30 px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-white">
                {activeSlide.statusLabel}
              </span>
            )}
            <div className="pt-2">
              <Link
                href={activeSlide ? `/portfolio/${activeSlide.slug}` : "/portfolio"}
                className="inline-flex items-center gap-3 text-xs tracking-[0.25em] uppercase font-medium text-white hover:text-[#6A9D94] group transition-colors"
              >
                {activeSlide ? "Lihat Dokumentasi Karya" : "Jelajahi Portofolio"}
                <span className="w-8 h-[1px] bg-[#6A9D94] group-hover:w-12 transition-all duration-300" />
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform text-[#6A9D94]" />
              </Link>
            </div>
          </motion.div>

          {/* Slider Indicators */}
          {activeSlides.length > 1 && <div className="flex items-center justify-between pt-12 border-t border-white/20 mt-12 text-white">
            <div className="flex items-center gap-1">
              <button className="min-h-11 px-2 text-xs" onClick={() => setPaused(!paused)} aria-label={paused ? "Putar slideshow" : "Jeda slideshow"}>{paused ? "Putar" : "Jeda"}</button>
              {activeSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className="w-7 min-h-11 flex items-center justify-center"
                  aria-pressed={currentSlide === idx}
                  aria-label={`Slide ${idx + 1}`}
                ><span className={`h-0.5 w-5 transition-colors duration-300 ${currentSlide === idx ? 'bg-[#6A9D94]' : 'bg-white/40'}`} /></button>
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
          </div>}
        </div>
      </section>

      {/* 2. POSITIONING STATEMENT (PETTA DESAIN KENDARI) */}
      {homepage?.showPositioning !== false && (
        <section className="py-24 md:py-36 bg-[#F9F8F6] border-b border-[#E5E2DC]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-4">
                <span className="text-xs uppercase tracking-[0.35em] text-[#6A9D94] font-semibold block mb-2">
                  {copy.eyebrow}
                </span>
                <p className="text-[#6B7785] text-sm tracking-widest uppercase">
                  {copy.services}
                </p>
              </div>

              <div className="lg:col-span-8 space-y-8">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-light leading-[1.25] text-[#14191E] tracking-tight">
                  {copy.headline}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[#53606E] text-sm font-light leading-relaxed pt-4 border-t border-[#E5E2DC]">
                  <p>
                    {homepageParagraph(copy.leftParagraph, copy.founderName)}
                  </p>
                  <p>
                    {homepageParagraph(copy.rightParagraph, copy.founderName)}
                  </p>
                </div>
                <div>
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-semibold text-[#14191E] border-b-2 border-[#6A9D94] pb-1 hover:text-[#6A9D94] transition-colors"
                  >
                    {copy.ctaLabel}
                    <ArrowRight className="w-3.5 h-3.5 text-[#6A9D94]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. BUSINESS ENTITIES OVERVIEW */}
      {homepage?.showBusiness !== false && (
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
                <div
                  key={ent.name}
                  className="p-6 border border-[#E5E2DC] bg-[#F9F8F6] space-y-3"
                >
                  <span className="text-xs font-mono text-[#6A9D94]">
                    0{idx + 1}
                  </span>
                  <h4 className="text-lg font-medium text-[#14191E]">
                    {ent.name}
                  </h4>
                  <p className="text-xs text-[#6A9D94] font-medium uppercase tracking-wider">
                    {ent.focus}
                  </p>
                  <p className="text-xs text-[#53606E] font-light leading-relaxed">
                    {ent.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {homepage?.showProjects !== false && builtProjects.length > 0 && (
        <section aria-labelledby="selected-built-heading" className="py-20 bg-[#F9F8F6] border-b border-[#E5E2DC]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <h2 id="selected-built-heading" className="text-3xl md:text-5xl font-light tracking-tight mb-4">Selected Built Works</h2>
            <p className="text-sm text-[#53606E] mb-10">Karya pilihan dengan status pembangunan selesai.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {builtProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
            </div>
          </div>
        </section>
      )}

      {/* 4. FEATURED PROJECTS SHOWCASE (PORTFOLIO RESMI) */}
      {homepage?.showProjects !== false && (
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
              {featuredProjects.slice(0, 6).map((project, idx) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  aspect={idx % 3 === 0 ? "wide" : "landscape"}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. TYPOLOGY SHOWCASE */}
      {homepage?.showCategories !== false && (
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
                Jelajahi karya rancangan kami mulai dari rumah tinggal privat,
                komplek masterplan, interior ruang pimpinan, hingga gedung
                komersial publik.
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
      )}

      {/* 6. WHAT'S ON / NEWS */}
      {homepage?.showNews !== false && (
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
              {NEWS_ITEMS.slice(0, 3).map((item, idx) => (
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
                      <span className="text-[#6A9D94] font-semibold">
                        {item.category}
                      </span>
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
                    <Link
                      href={`/news/${item.slug}`}
                      className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.2em] uppercase font-semibold text-[#14191E] group-hover:text-[#6A9D94]"
                    >
                      Baca Selengkapnya{" "}
                      <ArrowRight className="w-3 h-3 text-[#6A9D94]" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* VIDEO SECTION */}
      {(() => {
        if (!homepage?.showVideo) return null;
        const embedUrl = getYouTubeEmbedUrl(homepage.videoUrl);
        if (!embedUrl) return null;
        return (
          <section className="py-24 bg-[#14191E] text-white border-b border-[#242E38]">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs uppercase tracking-[0.35em] text-[#6A9D94] font-semibold block mb-2">
                  Dokumentasi Audiovisual
                </span>
                <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white">
                  {homepage.videoTitle || "Studio Film & Profil Arsitektur"}
                </h2>
              </div>
              <div className="relative aspect-video max-w-4xl mx-auto overflow-hidden rounded-lg border border-[#242E38] shadow-2xl bg-black">
                <iframe
                  src={embedUrl}
                  loading="lazy"
                  title={homepage.videoTitle || "Petta Studio Film"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          </section>
        );
      })()}

      {/* 7. CLIENTS / COLLABORATORS / MEDIA LOGOS */}
      {["client", "collaborator", "media"].map((group) => {
        const items = logos.filter((logo) => logo.group === group);
        if (!items.length) return null;
        return (
          <section
            key={group}
            className="py-20 bg-[#F9F8F6] border-b border-[#E5E2DC]"
          >
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <h2 className="text-xs uppercase tracking-[0.3em] text-[#6A9D94] text-center mb-10">
                {group === "client"
                  ? "Klien"
                  : group === "media"
                    ? "Publikasi & Media"
                    : "Mitra Kolaborasi Studio"}
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-10 md:gap-x-12">
                {items.map((logo) => {
                  const image = (
                    <Image
                      src={logo.image}
                      alt={logo.alt}
                      width={240}
                      height={120}
                      sizes="(max-width: 768px) 40vw, 160px"
                      className="w-full h-24 object-contain"
                    />
                  );
                  return (
                    <div
                      key={logo.id}
                      className="w-[calc((100%-2rem)/2)] max-w-40 md:w-40 flex items-center justify-center"
                    >
                      {logo.url ? (
                        <a
                          href={logo.url}
                          className="block w-full"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {image}
                        </a>
                      ) : (
                        image
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      {/* 8. INQUIRY / CONSULTATION CTA */}
      {homepage?.showCta !== false && (
        <section className="py-24 md:py-32 bg-[#14191E] text-white border-b border-[#242E38]">
          <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <span className="text-xs uppercase tracking-[0.35em] text-[#6A9D94] font-semibold block">
                Konsultasi & Perencanaan Arsitektur
              </span>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-white leading-tight">
                {homepage?.ctaTitle || "Punya Rencana Membangun? Mari Diskusikan."}
              </h2>
              <p className="text-sm md:text-base text-[#A2AFBD] font-light max-w-xl mx-auto leading-relaxed">
                Wujudkan gagasan hunian privat, bangunan komersial, atau masterplan kawasan Anda bersama tim arsitek Petta Desain.
              </p>
              <div className="pt-6">
                <Link
                  href={homepage?.ctaUrl || "/contact"}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-[#6A9D94] text-white text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#5A8D84] transition-all group shadow-lg"
                >
                  {homepage?.ctaLabel || "Konsultasi Studio"}
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
