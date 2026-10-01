"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCard } from "@/components/ProjectCard";

import { useProjects } from "@/lib/ProjectContext";
import { filterProjects, PROJECT_STATUSES, type ProjectStatus } from "@/lib/project-status";

export function PortfolioView() {
  const { projects, categories: PORTFOLIO_CATEGORIES } = useProjects();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | "all">("all");
  const filteredProjects = filterProjects(projects, selectedCategory, selectedStatus);

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

        <div role="group" aria-label="Project status filters" className="flex flex-wrap gap-2 md:gap-3 mb-6">
          {(["all", ...PROJECT_STATUSES] as const).map((status) => (
            <button
              key={status}
              type="button"
              aria-pressed={selectedStatus === status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 text-xs tracking-[0.18em] uppercase rounded-sm border transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#39756B] ${selectedStatus === status ? "bg-[#14191E] text-white border-[#14191E] font-semibold" : "bg-white text-[#53606E] border-[#E5E2DC] hover:border-[#14191E]"}`}
            >
              {status.toUpperCase()} ({filterProjects(projects, selectedCategory, status).length})
            </button>
          ))}
        </div>

        {/* Category selection is independent of status. */}
        <div role="group" aria-label="Project category filters" className="flex flex-wrap gap-2 md:gap-3 pb-8 mb-8 border-b border-[#E5E2DC]">
          <button
            type="button"
            aria-pressed={selectedCategory === "all"}
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 text-xs tracking-[0.18em] uppercase transition-all duration-300 rounded-sm ${
              selectedCategory === "all"
                ? "bg-[#14191E] text-white font-semibold shadow-xs"
                : "bg-[#FFFFFF] text-[#6B7785] hover:text-[#14191E] border border-[#E5E2DC]"
            }`}
          >
            All Disciplines ({filterProjects(projects, "all", selectedStatus).length})
          </button>
          {PORTFOLIO_CATEGORIES.map((cat) => {
            const count = filterProjects(projects, cat.slug, selectedStatus).length;

            return (
              <button
                key={cat.slug}
                type="button"
                aria-pressed={selectedCategory === cat.slug}
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

        <p aria-live="polite" aria-atomic="true" className="text-sm text-[#53606E] mb-8">
          {filteredProjects.length} proyek ditampilkan
        </p>

        {/* Project Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          <AnimatePresence>
            {filteredProjects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                headingLevel={2}
                aspect={idx % 4 === 0 ? "portrait" : idx % 3 === 0 ? "wide" : "landscape"}
                priority={idx < 3}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-sm text-[#6B7785] uppercase tracking-widest">
              Belum ada proyek yang sesuai dengan kategori dan status ini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
