

import React from "react";
import { getContent, getProject } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";


interface ProjectDetailProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProjectDetailProps) {
  const { slug } = await params;
  const result = await getProject(slug);
  return pageMetadata(result?.seo?.title || result?.project.title || "Proyek", result?.seo?.description || result?.project.shortIntro || "Portofolio Petta", `/portfolio/${slug}`, result?.project.heroImage);
}

export default async function ProjectDetailPage({ params }: ProjectDetailProps) {
  const { slug } = await params;
  const { projects } = await getContent();
  const project = (await getProject(slug))?.project;

  if (!project) {
    notFound();
  }

  // Related projects
  const related = projects.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <article className="pt-28 pb-36 bg-[#F9F8F6] text-[#14191E]">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#6B7785] hover:text-[#14191E] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#39756B]" />
          Back to Portfolio
        </Link>
      </div>

      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-12">
        <div className="flex flex-wrap items-center gap-3 text-xs tracking-[0.25em] uppercase text-[#39756B] font-semibold mb-3">
          <span>{project.category}</span>
          <span>·</span>
          <span>{project.location}</span>
          <span>·</span>
          <span>{project.year}</span>
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-[#14191E] max-w-4xl leading-tight">
          {project.title}
        </h1>
      </div>

      {/* Hero Image */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 mb-16">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#14191E] border border-[#E5E2DC] shadow-lg">
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
        </div>
      </div>

      {/* Meta Specifications Table & Editorial Narrative */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 py-12 border-y border-[#E5E2DC]">
          {/* Metadata Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-xs uppercase tracking-[0.3em] text-[#39756B] font-semibold">
              Project Data & Metrics
            </h3>
            <dl className="divide-y divide-[#E5E2DC] text-xs tracking-wider">
              <div className="py-2.5 flex flex-wrap justify-between gap-x-4 gap-y-1">
                <dt className="text-[#6B7785] uppercase">Status</dt>
                <dd className="font-medium text-[#14191E]">{project.status}</dd>
              </div>
              <div className="py-2.5 flex flex-wrap justify-between gap-x-4 gap-y-1">
                <dt className="text-[#6B7785] uppercase">Architect in Charge</dt>
                <dd className="font-medium text-[#14191E]">{project.architectInCharge}</dd>
              </div>
              <div className="py-2.5 flex flex-wrap justify-between gap-x-4 gap-y-1">
                <dt className="text-[#6B7785] uppercase">Site Area</dt>
                <dd className="font-medium text-[#14191E]">{project.siteArea}</dd>
              </div>
              <div className="py-2.5 flex flex-wrap justify-between gap-x-4 gap-y-1">
                <dt className="text-[#6B7785] uppercase">Constructed Area</dt>
                <dd className="font-medium text-[#14191E]">{project.constructedArea}</dd>
              </div>
              <div className="py-2.5 flex flex-wrap justify-between gap-x-4 gap-y-1">
                <dt className="text-[#6B7785] uppercase">Stories</dt>
                <dd className="font-medium text-[#14191E]">{project.stories}</dd>
              </div>
              <div className="py-2.5 flex flex-wrap justify-between gap-x-4 gap-y-1">
                <dt className="text-[#6B7785] uppercase">Completion Year</dt>
                <dd className="font-medium text-[#14191E]">{project.year}</dd>
              </div>
            </dl>
          </div>

          {/* Editorial Text */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-light text-[#14191E] leading-snug">
              {project.shortIntro}
            </h2>
            <div className="space-y-4 text-[#53606E] text-sm md:text-base font-light leading-relaxed">
              {project.description.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Gallery Plates */}
        <div className="pt-20 space-y-12">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-[0.3em] text-[#39756B] font-semibold">
              Photographic Monograph & Spatial Documentation
            </h3>
            <span className="text-xs font-mono text-[#6B7785]">{project.gallery?.length || 1} Plates</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(project.gallery || [project.heroImage]).map((img, idx) => (
              <div
                key={idx}
                className={`relative overflow-hidden bg-[#14191E] border border-[#E5E2DC] shadow-sm ${
                  idx % 3 === 0 ? "md:col-span-2 aspect-[16/9]" : "aspect-[4/3]"
                }`}
              >
                <Image
                  src={img}
                  alt={`${project.title} gallery plate ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 100vw"
                  className="object-cover hover:scale-105 transition-transform duration-700 ease-[0.16,1,0.3,1]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Related Projects */}
        <div className="pt-32 border-t border-[#E5E2DC] mt-28">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-2xl font-light text-[#14191E]">Related Explorations</h3>
            <Link
              href="/portfolio"
              className="text-xs uppercase tracking-[0.2em] text-[#6B7785] hover:text-[#14191E] flex items-center gap-1.5"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5 text-[#39756B]" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {related.map((rel) => (
              <Link key={rel.id} href={`/portfolio/${rel.slug}`} className="group block">
                <div className="relative aspect-[16/10] overflow-hidden bg-[#14191E] border border-[#E5E2DC] mb-4">
                  <Image
                    src={rel.heroImage}
                    alt={rel.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h4 className="text-lg font-normal text-[#14191E] group-hover:text-[#39756B] transition-colors">
                  {rel.title}
                </h4>
                <p className="text-xs text-[#6B7785] tracking-wider font-light mt-0.5">
                  {rel.location} · {rel.category}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
