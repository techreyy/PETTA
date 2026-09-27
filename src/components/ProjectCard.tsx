"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Project } from "@/lib/data";

interface ProjectCardProps {
  project: Project;
  aspect?: "landscape" | "portrait" | "wide";
  priority?: boolean;
}

export function ProjectCard({ project, aspect = "landscape", priority = false }: ProjectCardProps) {
  const aspectClass =
    aspect === "portrait"
      ? "aspect-[3/4]"
      : aspect === "wide"
      ? "aspect-[16/9]"
      : "aspect-[4/3]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="group block cursor-pointer"
    >
      <Link href={`/portfolio/${project.slug}`}>
        {/* Image Container with architectural zoom */}
        <div className={`relative overflow-hidden bg-[#14191E] border border-[#E5E2DC] ${aspectClass}`}>
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-[#14191E]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Category Pill with dark backing & crisp white text */}
          <div className="absolute top-4 left-4">
            <span className="bg-[#14191E]/90 backdrop-blur-md border border-[#242E38] px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-medium text-white">
              {project.category}
            </span>
          </div>

          {/* Quick Year Pill in Sage Teal */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="bg-[#6A9D94] px-2.5 py-1 text-[10px] tracking-widest uppercase font-mono text-[#14191E] font-bold">
              {project.year}
            </span>
          </div>
        </div>

        {/* Text Info (Crisp Obsidian on luminous card) */}
        <div className="pt-4 flex items-start justify-between">
          <div>
            <h4 className="text-lg md:text-xl font-normal text-[#14191E] tracking-tight group-hover:text-[#39756B] transition-colors">
              {project.title}
            </h4>
            <p className="text-xs text-[#6B7785] tracking-wider font-light mt-1">
              {project.location}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full border border-[#E5E2DC] bg-[#FFFFFF] flex items-center justify-center text-[#6B7785] group-hover:text-[#14191E] group-hover:border-[#14191E] transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0 mt-1 shadow-2xs">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
