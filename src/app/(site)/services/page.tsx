import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getServices } from "@/lib/services";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Services | Petta Desain",
  description: "Kenali layanan dan kapabilitas Petta Desain. Diskusikan kebutuhan proyek Anda bersama studio kami.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="pt-32 pb-24 md:pb-36 min-h-screen bg-[#F9F8F6] text-[#14191E]">
      <section className="max-w-7xl mx-auto px-6 md:px-12" aria-labelledby="services-heading">
        <div className="h-px bg-[#E5E2DC] mb-12 md:mb-16">
          <div className="w-32 h-[2px] bg-[#6A9D94]" />
        </div>
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-16 md:mb-24">
          <div className="lg:col-span-7">
            <p className="text-xs uppercase tracking-[0.25em] text-[#39756B] mb-6">Kapabilitas Studio</p>
            <h1 id="services-heading" className="text-[clamp(3rem,7vw,6rem)] font-light tracking-[-0.045em] leading-[1.1]">Services<span className="text-[#6A9D94]">.</span></h1>
          </div>
          <p className="lg:col-span-5 text-sm text-[#53606E] leading-relaxed">Setiap proyek berawal dari kebutuhan yang berbeda. Temukan layanan studio kami dan diskusikan ruang lingkup yang sesuai dengan visi Anda.</p>
        </div>
        {services.length > 0 ? (
          <div className="border-t border-[#E5E2DC]">
            {services.map((service, index) => (
              <article key={service.id} className="grid md:grid-cols-12 gap-5 md:gap-8 py-8 md:py-12 border-b border-[#E5E2DC]">
                <span aria-hidden="true" className="md:col-span-1 text-xs font-mono text-[#39756B]">{String(index + 1).padStart(2, "0")}</span>
                <h2 className="md:col-span-5 text-2xl md:text-3xl font-light tracking-tight break-words">{service.title}</h2>
                {service.description && <p className="md:col-span-6 text-sm text-[#53606E] leading-relaxed whitespace-pre-line">{service.description}</p>}
              </article>
            ))}
          </div>
        ) : (
          <p className="py-10 border-y border-[#E5E2DC] text-sm text-[#53606E]">Hubungi studio untuk mendiskusikan layanan dan kebutuhan proyek Anda.</p>
        )}
        <div className="mt-16 md:mt-24 p-8 md:p-12 rounded-2xl bg-[#14191E] text-white flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#6A9D94] mb-4">Mulai Percakapan</p>
            <h2 className="text-2xl md:text-3xl font-light tracking-tight">Apa yang ingin Anda wujudkan?</h2>
          </div>
          <Link href="/contact" className="inline-flex items-center justify-center gap-3 rounded-full border border-[#6A9D94] px-6 py-4 text-xs uppercase tracking-widest hover:bg-[#6A9D94] hover:text-[#14191E] transition-colors shrink-0">
            Diskusikan Proyek <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
