import { getPageContent } from "@/lib/get-page-content";
import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Kabar Studio", "Kabar dan catatan arsitektur Petta Desain.", "/news");

export default async function NewsPage() {
  const [{ news: NEWS_ITEMS }, copy] = await Promise.all([getContent(), getPageContent("newsPageContent")]);
  return (
    <div className="pt-32 pb-36 min-h-screen bg-[#161F26] text-[#F4F3EF]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Title */}
        <div className="max-w-2xl mb-16">
          <span className="text-xs uppercase tracking-[0.35em] text-[#6A9D94] font-semibold block mb-3">
            {copy.eyebrow}
          </span>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-[#F4F3EF] leading-tight">
            {copy.heading}
          </h1>
          <p className="text-[#8E9BA5] text-sm md:text-base font-light mt-4 leading-relaxed">
            {copy.intro}
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {NEWS_ITEMS.map((item) => (
            <article key={item.id} className="group flex flex-col justify-between">
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-[#1E2831] border border-[#2A3642] mb-5">
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="flex items-center gap-3 text-xs tracking-wider uppercase text-[#8E9BA5] mb-2">
                  <span className="text-[#6A9D94] font-medium">{item.category}</span>
                  <span>·</span>
                  <span>{item.date}</span>
                </div>
                <h2 className="text-xl font-normal text-[#F4F3EF] leading-snug group-hover:text-[#6A9D94] transition-colors mb-3">
                  {item.title}
                </h2>
                <p className="text-xs text-[#8E9BA5] font-light leading-relaxed">
                  {item.excerpt}
                </p>
              </div>

              <div className="pt-6">
                <Link href={`/news/${item.slug}`} className="inline-flex items-center gap-1.5 text-xs tracking-[0.2em] uppercase font-semibold text-[#6A9D94] group-hover:translate-x-1 transition-transform">
                  {copy.articleLabel + " "}<ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
