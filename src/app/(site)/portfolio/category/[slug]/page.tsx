

import React from "react";
import { getContent } from "@/lib/content";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";



interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const { projects, categories: PORTFOLIO_CATEGORIES } = await getContent();
  const category = PORTFOLIO_CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const categoryProjects = projects.filter(
    (p) =>
      p.categorySlug === slug ||
      p.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug
  );

  return (
    <div className="pt-32 pb-36 min-h-screen bg-[#F9F8F6] text-[#14191E]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#6B7785] hover:text-[#14191E] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#6A9D94]" />
            Back to All Disciplines
          </Link>
        </div>

        {/* Category Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs uppercase tracking-[0.35em] text-[#6A9D94] font-semibold block mb-3">
            Typology Archive
          </span>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-[#14191E] leading-tight">
            {category.title}
          </h1>
          <p className="text-[#6B7785] text-sm md:text-base font-light mt-4 leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* Category Filter Quick Bar */}
        <div className="flex flex-wrap gap-2 md:gap-3 pb-8 mb-12 border-b border-[#E5E2DC]">
          <Link
            href="/portfolio"
            className="px-4 py-2 text-xs tracking-[0.18em] uppercase bg-[#FFFFFF] text-[#6B7785] hover:text-[#14191E] border border-[#E5E2DC] transition-all"
          >
            All Disciplines ({projects.length})
          </Link>
          {PORTFOLIO_CATEGORIES.map((cat) => {
            const isCurrent = cat.slug === slug;
            const count = projects.filter(
              (p) =>
                p.categorySlug === cat.slug ||
                p.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") === cat.slug
            ).length;

            return (
              <Link
                key={cat.slug}
                href={`/portfolio/category/${cat.slug}`}
                className={`px-4 py-2 text-xs tracking-[0.18em] uppercase transition-all duration-300 ${
                  isCurrent
                    ? "bg-[#14191E] text-white font-semibold shadow-xs"
                    : "bg-[#FFFFFF] text-[#6B7785] hover:text-[#14191E] border border-[#E5E2DC]"
                }`}
              >
                {cat.title} ({count})
              </Link>
            );
          })}
        </div>

        {/* Projects Grid */}
        {categoryProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {categoryProjects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                aspect={idx % 2 === 0 ? "landscape" : "portrait"}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 border border-[#E5E2DC] bg-white text-center space-y-4">
            <h3 className="text-xl font-light text-[#14191E]">Current Commissions in Progress</h3>
            <p className="text-xs text-[#6B7785] max-w-md mx-auto leading-relaxed">
              Monograph photography and architectural documentation for {category.title} works are currently in curation.
            </p>
            <Link
              href="/portfolio"
              className="inline-block mt-2 px-6 py-2.5 bg-[#14191E] text-white text-xs uppercase tracking-widest font-semibold"
            >
              Browse Complete Archive
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
