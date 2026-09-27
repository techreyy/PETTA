"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCard } from "@/components/ProjectCard";

import { useProjects } from "@/lib/ProjectContext";

export default function PortfolioPage() {
  const { projects, categories: PORTFOLIO_CATEGORIES } = useProjects();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter(
          (p) =>
            p.categorySlug === selectedCategory ||
            p.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") === selectedCategory
        );

  return (
    <div className="pt-32 pb-36 min-h-screen bg-[#F9F8F6] text-[#14191E]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs uppercase tracking-[0.35em] text-[#39756B] font-semibold block mb-3">
            Built &amp; Conceptual Works
          </span>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-[#14191E] leading-tight">
            Architectural Portfolio
          </h1>
          <p className="text-[#6B7785] text-sm md:text-base font-light mt-4 leading-relaxed">
            Arsip lengkap karya arsitektur, masterplan kawasan terpadu, hunian privat, dan instalasi spasial Petta Desain di Sulawesi Tenggara dan nasional.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2 md:gap-3 pb-8 mb-12 border-b border-[#E5E2DC]">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 text-xs tracking-[0.18em] uppercase transition-all duration-300 rounded-sm ${
              selectedCategory === "all"
                ? "bg-[#14191E] text-white font-semibold shadow-xs"
                : "bg-[#FFFFFF] text-[#6B7785] hover:text-[#14191E] border border-[#E5E2DC]"
            }`}
          >
            All Disciplines ({projects.length})
          </button>
          {PORTFOLIO_CATEGORIES.map((cat) => {
            const count = projects.filter(
              (p) =>
                p.categorySlug === cat.slug ||
                p.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") === cat.slug
            ).length;

            return (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 text-xs tracking-[0.18em] uppercase transition-all duration-300 rounded-sm ${
                  selectedCategory === cat.slug
                    ? "bg-[#14191E] text-white font-semibold shadow-xs"
                    : "bg-[#FFFFFF] text-[#6B7785] hover:text-[#14191E] border border-[#E5E2DC]"
                }`}
              >
                {cat.title} ({count})
              </button>
            );
          })}
        </div>

        {/* Project Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          <AnimatePresence>
            {filteredProjects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                aspect={idx % 4 === 0 ? "portrait" : idx % 3 === 0 ? "wide" : "landscape"}
                priority={idx < 3}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-sm text-[#6B7785] uppercase tracking-widest">
              Belum ada proyek dalam kategori ini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
