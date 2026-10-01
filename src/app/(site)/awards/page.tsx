"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Award, Landmark, MapPin, CheckCircle2, Sparkles, Building2 } from "lucide-react";
import { useProjects } from "@/lib/ProjectContext";
import Link from "next/link";

export default function AwardsPage() {
  const { awards, competitions } = useProjects();
  const [activeTab, setActiveTab] = useState<"all" | "awards" | "competitions">("all");

  return (
    <div className="pt-32 pb-36 min-h-screen bg-[#F9F8F6] text-[#14191E]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14191E]/5 border border-[#14191E]/10 text-xs font-mono uppercase tracking-[0.25em] text-[#39756B] mb-4">
            <Trophy className="w-3.5 h-3.5 text-[#6A9D94]" />
            <span>Honors &amp; Design Competitions</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-[#14191E] leading-tight">
            Awards &amp; Competitions
          </h1>
          <p className="text-[#6B7785] text-sm md:text-base font-light mt-4 leading-relaxed">
            Rekam jejak rekognisi profesi, penghargaan desain arsitektur, dan partisipasi sayembara gagasan spasial Petta Desain dalam mendorong standar tektonika tropis Indonesia.
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap gap-2 md:gap-3 pb-8 mb-12 border-b border-[#E5E2DC]">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-5 py-2.5 text-xs tracking-[0.18em] uppercase transition-all duration-300 rounded-sm cursor-pointer ${
              activeTab === "all"
                ? "bg-[#14191E] text-white font-semibold shadow-xs"
                : "bg-[#FFFFFF] text-[#6B7785] hover:text-[#14191E] border border-[#E5E2DC]"
            }`}
          >
            Semua ({awards.length + competitions.length})
          </button>
          <button
            onClick={() => setActiveTab("awards")}
            className={`px-5 py-2.5 text-xs tracking-[0.18em] uppercase transition-all duration-300 rounded-sm cursor-pointer flex items-center gap-2 ${
              activeTab === "awards"
                ? "bg-[#14191E] text-white font-semibold shadow-xs"
                : "bg-[#FFFFFF] text-[#6B7785] hover:text-[#14191E] border border-[#E5E2DC]"
            }`}
          >
            <Award className="w-3.5 h-3.5 text-[#6A9D94]" />
            Awards &amp; Recognitions ({awards.length})
          </button>
          <button
            onClick={() => setActiveTab("competitions")}
            className={`px-5 py-2.5 text-xs tracking-[0.18em] uppercase transition-all duration-300 rounded-sm cursor-pointer flex items-center gap-2 ${
              activeTab === "competitions"
                ? "bg-[#14191E] text-white font-semibold shadow-xs"
                : "bg-[#FFFFFF] text-[#6B7785] hover:text-[#14191E] border border-[#E5E2DC]"
            }`}
          >
            <Landmark className="w-3.5 h-3.5 text-[#6A9D94]" />
            Sayembara Arsitektur ({competitions.length})
          </button>
        </div>

        {/* Section 1: Awards */}
        {(activeTab === "all" || activeTab === "awards") && (
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#E5E2DC]">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6A9D94]" />
                <h2 className="text-xl md:text-2xl font-light tracking-tight text-[#14191E]">
                  Penghargaan &amp; Rekognisi Arsitektur
                </h2>
              </div>
              <span className="text-xs uppercase font-mono tracking-widest text-[#6B7785]">
                {awards.length} Penghargaan
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {awards.length === 0 && (
                <p className="col-span-full py-8 text-sm text-[#53606E]">
                  Belum ada penghargaan yang ditampilkan.
                </p>
              )}
              {awards.map((award, idx) => (
                <motion.div
                  key={award.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.1 }}
                  className="bg-white border border-[#E5E2DC] rounded-xl p-7 flex flex-col justify-between hover:shadow-lg hover:border-[#6A9D94]/50 transition-all duration-300 group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <span className="text-xs font-mono font-medium text-[#6A9D94] bg-[#6A9D94]/10 px-2.5 py-1 rounded-sm">
                        {award.year}
                      </span>
                      <span className="text-[11px] uppercase tracking-wider text-[#6B7785] font-light">
                        {award.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-medium text-[#14191E] leading-snug group-hover:text-[#39756B] transition-colors mb-3">
                      {award.title}
                    </h3>

                    <div className="space-y-1.5 mb-4 text-xs">
                      <div className="flex items-center gap-2 text-[#4A5568]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#6A9D94] shrink-0" />
                        <span className="font-medium text-[#14191E]">{award.issuer}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#6B7785]">
                        <Building2 className="w-3.5 h-3.5 text-[#6B7785] shrink-0" />
                        <span>Karya: {award.project}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#6B7785] font-light leading-relaxed">
                      {award.description}
                    </p>
                  </div>


                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Sayembara & Competitions */}
        {(activeTab === "all" || activeTab === "competitions") && (
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#E5E2DC]">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C89975]" />
                <h2 className="text-xl md:text-2xl font-light tracking-tight text-[#14191E]">
                  Sayembara &amp; Eksplorasi Gagasan
                </h2>
              </div>
              <span className="text-xs uppercase font-mono tracking-widest text-[#6B7785]">
                {competitions.length} Sayembara
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {competitions.length === 0 && (
                <p className="col-span-full py-8 text-sm text-[#53606E]">
                  Belum ada sayembara yang ditampilkan.
                </p>
              )}
              {competitions.map((comp, idx) => (
                <motion.div
                  key={comp.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.1 }}
                  className="bg-white border border-[#E5E2DC] rounded-xl p-7 flex flex-col justify-between hover:shadow-lg hover:border-[#C89975]/60 transition-all duration-300 group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <span className="text-xs font-mono font-medium text-[#C89975] bg-[#C89975]/10 px-2.5 py-1 rounded-sm">
                        {comp.year}
                      </span>
                      <span className="text-[11px] uppercase tracking-wider text-[#39756B] font-semibold">
                        {comp.achievement}
                      </span>
                    </div>

                    <h3 className="text-lg font-medium text-[#14191E] leading-snug group-hover:text-[#C89975] transition-colors mb-3">
                      {comp.title}
                    </h3>

                    <div className="space-y-1.5 mb-4 text-xs">
                      <div className="flex items-center gap-2 text-[#4A5568]">
                        <Sparkles className="w-3.5 h-3.5 text-[#C89975] shrink-0" />
                        <span className="font-medium text-[#14191E]">Penyelenggara: {comp.organizer}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#6B7785]">
                        <MapPin className="w-3.5 h-3.5 text-[#6B7785] shrink-0" />
                        <span>Lokasi: {comp.location}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#6B7785] font-light leading-relaxed">
                      {comp.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#F0EFEB] flex items-center justify-between text-[11px]">
                    <span className="text-[#C89975] font-mono tracking-wider uppercase">Gagasan Desain</span>
                    <span className="text-[#6B7785]">Sayembara Publik</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Strip */}
        <div className="mt-16 bg-[#14191E] text-white rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-[#242E38]">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#6A9D94]">Kolaborasi Desain</span>
            <h3 className="text-2xl md:text-3xl font-light">
              Ingin Merancang Bersama Petta Desain?
            </h3>
            <p className="text-xs md:text-sm text-[#A2AFBD] font-light leading-relaxed">
              Konsultasikan gagasan arsitektur, perencanaan kawasan, maupun interior berkelas Anda bersama biro konsultan arsitektur kami di Kendari.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              href="/portfolio"
              className="px-6 py-3 text-xs uppercase tracking-widest text-[#F9F8F6] border border-[#242E38] hover:border-white rounded-full text-center transition-colors"
            >
              Lihat Proyek
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 text-xs uppercase tracking-widest bg-[#6A9D94] text-[#14191E] font-medium rounded-full text-center hover:bg-[#7FB3AA] transition-colors"
            >
              Mulai Konsultasi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
