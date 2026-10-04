"use client";

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
  Layers,
} from "lucide-react";
import { useProjects } from "@/lib/ProjectContext";
import { useStudioSettings } from "@/lib/SettingsContext";
import { InstagramIcon, FacebookIcon } from "@/components/SocialIcons";
import {
  BUSINESS_ENTITIES,
  STUDIO_SERVICES,
  STUDIO_INFO,
} from "@/lib/data";
import { resolveAboutPageContent, type AboutPageCopy } from "@/lib/about-page-content";

function renderAboutHeroTitle(text: string) {
  const lines = text.split('\n');
  return lines.map((line, lineIndex) => {
    const parts = line.split(/(\*\*[^*]+\*\*|&)/g);
    return (
      <React.Fragment key={lineIndex}>
        {lineIndex > 0 && <br />}
        {parts.map((part, partIndex) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <span key={partIndex} className="font-serif italic font-normal text-[#39756B]">
                {part.slice(2, -2)}
              </span>
            );
          }
          if (part === '&') {
            return (
              <span key={partIndex} className="text-[#6B7785] font-light">
                &amp;
              </span>
            );
          }
          return part;
        })}
      </React.Fragment>
    );
  });
}

function formatAboutText(text: string, founderName?: string, boldClass?: string) {
  const withFounder = founderName ? text.replaceAll('{founderName}', founderName) : text;
  return withFounder.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className={boldClass}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

export function AboutView({ aboutContent }: { aboutContent?: AboutPageCopy } = {}) {
  const copy = resolveAboutPageContent(aboutContent);
  const { team: STUDIO_TEAM } = useProjects();
  const { settings } = useStudioSettings();
  const founderDisplayName = copy.principalName || settings.founder;
  const founder = STUDIO_TEAM.find((member) => member.name === founderDisplayName || member.name === settings.founder);
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

  const pillars = [
    { id: "01", tag: copy.pillar1Tag, title: copy.pillar1Title, desc: copy.pillar1Desc },
    { id: "02", tag: copy.pillar2Tag, title: copy.pillar2Title, desc: copy.pillar2Desc },
    { id: "03", tag: copy.pillar3Tag, title: copy.pillar3Title, desc: copy.pillar3Desc },
    { id: "04", tag: copy.pillar4Tag, title: copy.pillar4Title, desc: copy.pillar4Desc },
  ];

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
              {renderAboutHeroTitle(copy.heroTitle)}
            </h1>
          </div>
          <div className="lg:col-span-4 space-y-5 pb-2">
            <p className="text-sm text-[#53606E] font-normal leading-[1.8]">
              {formatAboutText(copy.heroIntro, founderDisplayName, "text-[#14191E]")}
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span className="w-6 h-[1.5px] bg-[#6A9D94] shadow-[0_0_6px_1px_rgba(106,157,148,0.4)]" />
              <span className="text-xs font-sans tracking-wide text-[#53606E]">
                {copy.heroTagline}
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
                {copy.philosophyEyebrow}
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-light text-[#14191E] tracking-tight">
              {copy.philosophyTitle}
            </h2>

            <p className="text-xs md:text-sm text-[#53606E] font-light leading-relaxed pt-2">
              {formatAboutText(copy.philosophyText1)}
            </p>
            <p className="text-xs md:text-sm text-[#53606E] font-light leading-relaxed">
              {formatAboutText(copy.philosophyText2)}
            </p>
          </div>

          <div className="lg:col-span-6 hidden lg:flex justify-end pt-8">
            <div className="bg-[#14191E] text-white p-6 border border-[#242E38] w-64 space-y-2 shadow-lg">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#6A9D94] block">
                {copy.philosophyMetricLabel}
              </span>
              <p className="text-xs text-[#A2AFBD] font-light leading-relaxed">
                {copy.philosophyMetricText}
              </p>
            </div>
          </div>
        </div>

        {/* Narrative Block 2: Mission in the Lower Geometry */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 hidden lg:block pl-6">
            <div className="border-l-2 border-[#6A9D94] pl-6 space-y-2" style={{ boxShadow: '-2px 0 10px 0 rgba(106,157,148,0.35)' }}>
              <span className="text-xs font-mono text-[#6A9D94] uppercase tracking-widest block font-semibold">
                {copy.missionAccountabilityLabel}
              </span>
              <p className="text-xs text-[#6B7785] leading-relaxed">
                {copy.missionAccountabilityText}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white/95 backdrop-blur-md p-8 md:p-10 border border-[#E5E2DC] shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[2px] bg-[#6A9D94] shadow-[0_0_8px_2px_rgba(106,157,148,0.45)]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#6A9D94] font-mono font-semibold">
                {copy.missionEyebrow}
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-light text-[#14191E] tracking-tight">
              {copy.missionTitle}
            </h2>

            <p className="text-xs md:text-sm text-[#53606E] font-light leading-relaxed pt-2">
              {formatAboutText(copy.missionText1)}
            </p>
            <p className="text-xs md:text-sm text-[#53606E] font-light leading-relaxed">
              {formatAboutText(copy.missionText2)}
            </p>

            <div className="pt-3 flex items-center justify-between text-xs font-mono text-[#6A9D94]">
              <span>{copy.missionStudioTag}</span>
              <span>{copy.missionEstTag}</span>
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
                {copy.pillarsEyebrow}
              </span>
              <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight">
                {copy.pillarsHeading}
              </h2>
            </div>
            <p className="text-xs text-[#A2AFBD] max-w-xs font-light">
              {copy.pillarsSubtitle}
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, idx) => {
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
                {founder?.portrait ? (
                  <Image
                    src={founder.portrait}
                    alt={founderDisplayName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                ) : (
                  <div aria-hidden="true" className="flex h-full items-center justify-center text-5xl font-light tracking-widest text-[#6A9D94]">
                    {founderDisplayName.split(",")[0].split(" ").filter((part) => !part.endsWith(".")).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}
                  </div>
                )}
                <div className="absolute bottom-4 left-4 right-4 bg-[#14191E]/95 backdrop-blur-md p-3.5 border border-[#242E38] text-center">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#6A9D94] block font-semibold">
                    {copy.principalBadgeTitle}
                  </span>
                  <span className="text-[11px] text-[#A2AFBD] block mt-0.5">
                    {copy.principalBadgeSubtitle}
                  </span>
                </div>
              </div>
            </div>

            {/* Narasi Kepemimpinan & Akademisi */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#6A9D94] font-semibold font-mono">
                <Award className="w-4 h-4" />
                <span>{copy.principalRole || founder?.role || "Principal Architect / Design Director"}</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-light text-white leading-tight">
                {founderDisplayName}
              </h2>

              <p className="text-xs tracking-widest uppercase text-[#A2AFBD] font-mono">
                {copy.principalCredentials}
              </p>

              <div className="space-y-4 text-sm text-[#A2AFBD] font-light leading-relaxed pt-2">
                <p>
                  {formatAboutText(copy.principalBio1)}
                </p>
                <p>
                  {formatAboutText(copy.principalBio2)}
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
                  {copy.principalInstagramLabel}
                </a>
                <a
                  href={STUDIO_INFO.facebook}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#242E38] text-xs uppercase tracking-wider text-[#A2AFBD] hover:border-white hover:text-white transition-all"
                >
                  <FacebookIcon className="w-4 h-4" />
                  {copy.principalFacebookLabel}
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
            {copy.entitiesEyebrow}
          </span>
          <h2 className="text-3xl md:text-5xl font-light text-[#14191E]">
            {copy.entitiesHeading}
          </h2>
          <p className="text-xs md:text-sm text-[#6B7785] mt-2">
            {copy.entitiesSubtitle}
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
              {copy.teamEyebrow}
            </span>
            <h2 className="text-3xl md:text-5xl font-light text-[#14191E]">
              {copy.teamHeading}
            </h2>
          </div>
          <p className="text-xs text-[#6B7785] max-w-sm">
            {formatAboutText(copy.teamIntro)}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STUDIO_TEAM.map((member) => (
            <div
              key={member.name}
              className="group bg-white p-4 border border-[#E5E2DC] shadow-2xs hover:border-[#6A9D94] transition-all"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#14191E] mb-4">
                {member.portrait ? (
                  <Image
                    src={member.portrait}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div aria-hidden="true" className="flex h-full items-center justify-center text-5xl font-light tracking-widest text-[#6A9D94]">
                    {member.name.split(",")[0].split(" ").filter((part) => !part.endsWith(".")).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}
                  </div>
                )}
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
              {copy.servicesEyebrow}
            </span>
            <h2 className="text-3xl md:text-5xl font-light text-white">
              {copy.servicesHeading}
            </h2>
            <p className="text-xs text-[#A2AFBD] mt-3 font-light">
              {copy.servicesSubtitle}
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
        <h2 className="sr-only">{copy.locationHeading}</h2>
        <div className="bg-white p-8 md:p-12 border border-[#E5E2DC] shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-[#6A9D94] font-semibold block font-mono">
                Kantor Pusat Studio
              </span>
              <h3 className="text-xl font-medium text-[#14191E]">{copy.locationOfficeTitle}</h3>
              <p className="text-xs text-[#53606E] leading-relaxed">
                {STUDIO_INFO.address}
              </p>
            </div>

            <div className="space-y-3 border-t md:border-t-0 md:border-l border-[#E5E2DC] pt-6 md:pt-0 md:pl-8">
              <span className="text-xs uppercase tracking-[0.25em] text-[#6A9D94] font-semibold block font-mono">
                Wilayah Jangkauan Kerja
              </span>
              <h3 className="text-xl font-medium text-[#14191E]">{copy.locationAreasTitle}</h3>
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
            {copy.ctaEyebrow}
          </span>
          <h2 className="text-2xl md:text-4xl font-light text-[#14191E]">
            {copy.ctaHeading}
          </h2>
          <p className="text-xs text-[#6B7785] max-w-xl mx-auto font-light leading-relaxed">
            {copy.ctaText}
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#14191E] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#6A9D94] hover:text-[#14191E] transition-all duration-300"
            >
              {copy.ctaButtonLabel}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
