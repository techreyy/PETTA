"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, ArrowUpRight } from "lucide-react";
import { useProjects } from "@/lib/ProjectContext";
import { useStudioSettings } from "@/lib/SettingsContext";
import { PettaLogo } from "@/components/PettaLogo";



export function Header() {
  const pathname = usePathname();
  return <HeaderContent key={pathname} />;
}

function HeaderContent() {
  const { categories } = useProjects();
  const { settings } = useStudioSettings();
  const CATEGORY_ITEMS = categories.map(c => ({ name: c.title, href: `/portfolio/category/${c.slug}` }));
  const mobileRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = 'hidden';
    mobileRef.current?.querySelector<HTMLElement>('a, button')?.focus();
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
      if (event.key !== 'Tab') return;
      const elements = [...(mobileRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') || [])];
      const first = elements[0]; const last = elements.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', keyboard);
    return () => { document.body.style.overflow = originalOverflow; document.removeEventListener('keydown', keyboard); trigger?.focus(); };
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isProjectsActive = pathname.startsWith("/portfolio");

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-3 md:pt-4 px-4 pointer-events-none">
        <header
          className={`pointer-events-auto w-full max-w-7xl transition-all duration-500 rounded-2xl border ${
            scrolled
              ? "bg-[#14191E]/95 backdrop-blur-md border-[#242E38] py-3 px-6 md:px-8 shadow-2xl shadow-black/40"
              : "bg-[#14191E]/85 backdrop-blur-sm py-4 px-6 md:px-8 border-[#242E38]/80 shadow-lg shadow-black/20"
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Authentic Logo with Clean Transparent Background */}
            <Link href="/" className="group flex items-center hover:opacity-90 transition-opacity">
              <PettaLogo className="h-9 md:h-11 w-auto" />
            </Link>

            {/* Desktop Navigation with Smooth Green Underline & Rounded Elements */}
            <nav className="hidden lg:flex items-center space-x-8 text-[13.5px] font-normal tracking-wide">
              {/* Home */}
              <Link
                href="/"
                className={`relative py-1.5 transition-colors duration-300 group ${
                  pathname === "/" ? "text-[#FFFFFF] font-medium" : "text-[#A2AFBD] hover:text-[#FFFFFF]"
                }`}
              >
                <span>Home</span>
                {pathname === "/" ? (
                  <motion.div
                    layoutId="activeNavUnderline"
                    className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#6A9D94] rounded-full shadow-[0_0_8px_rgba(106,157,148,0.5)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#6A9D94] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                )}
              </Link>

              {/* Projects Dropdown Menu */}
              <div
                ref={dropdownRef}
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
                onKeyDown={e => { if (e.key === "Escape") { setDropdownOpen(false); dropdownRef.current?.querySelector("button")?.focus(); } }}
                onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setDropdownOpen(false); }}
              >
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  aria-expanded={dropdownOpen} aria-controls="project-navigation"
                  className={`flex items-center gap-1.5 py-1.5 transition-colors duration-300 cursor-pointer relative group ${
                    isProjectsActive ? "text-[#FFFFFF] font-medium" : "text-[#A2AFBD] hover:text-[#FFFFFF]"
                  }`}
                >
                  <span>Projects</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${
                      dropdownOpen ? "rotate-180 text-[#6A9D94]" : "text-[#A2AFBD] group-hover:text-[#6A9D94]"
                    }`}
                  />
                  {isProjectsActive ? (
                    <motion.div
                      layoutId="activeNavUnderline"
                      className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#6A9D94] rounded-full shadow-[0_0_8px_rgba(106,157,148,0.5)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  ) : (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#6A9D94] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  )}
                </button>

                {/* Dropdown Card with Rounded Corners & Subtle Green Accent Border */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      id="project-navigation" className="absolute top-full left-0 mt-0 w-64 bg-white text-[#2B3540] shadow-2xl rounded-xl py-3 border border-[#E5E2DC] z-50 text-left overflow-hidden ring-1 ring-black/5"
                    >
                      {/* Top subtle green accent indicator strip */}
                      <div className="h-[2px] w-full bg-[#6A9D94]/80 mb-1" />

                      <div className="flex flex-col space-y-0.5 px-1.5">
                        {CATEGORY_ITEMS.map((item) => {
                          const isSelected = pathname === item.href;
                          return (
                            <Link
                              key={item.name}
                              href={item.href}
                              className={`px-4 py-2.5 text-[13px] tracking-normal transition-all text-left block leading-snug rounded-lg ${
                                isSelected
                                  ? "text-[#14191E] font-semibold bg-[#F4F3EF] border-l-2 border-[#6A9D94]"
                                  : "text-[#4A5568] hover:text-[#14191E] hover:bg-neutral-50 hover:translate-x-1"
                              }`}
                            >
                              {item.name}
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Awards & Competitions */}
              <Link
                href="/awards"
                className={`relative py-1.5 transition-colors duration-300 group ${
                  pathname.startsWith("/awards") ? "text-[#FFFFFF] font-medium" : "text-[#A2AFBD] hover:text-[#FFFFFF]"
                }`}
              >
                <span>Awards &amp; Sayembara</span>
                {pathname.startsWith("/awards") ? (
                  <motion.div
                    layoutId="activeNavUnderline"
                    className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#6A9D94] rounded-full shadow-[0_0_8px_rgba(106,157,148,0.5)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#6A9D94] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                )}
              </Link>

              {/* What's On */}
              <Link
                href="/news"
                className={`relative py-1.5 transition-colors duration-300 group ${
                  pathname.startsWith("/news") ? "text-[#FFFFFF] font-medium" : "text-[#A2AFBD] hover:text-[#FFFFFF]"
                }`}
              >
                <span>What’s On</span>
                {pathname.startsWith("/news") ? (
                  <motion.div
                    layoutId="activeNavUnderline"
                    className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#6A9D94] rounded-full shadow-[0_0_8px_rgba(106,157,148,0.5)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#6A9D94] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                )}
              </Link>

              {/* About Us */}
              <Link
                href="/about"
                className={`relative py-1.5 transition-colors duration-300 group ${
                  pathname.startsWith("/about") ? "text-[#FFFFFF] font-medium" : "text-[#A2AFBD] hover:text-[#FFFFFF]"
                }`}
              >
                <span>About Us</span>
                {pathname.startsWith("/about") ? (
                  <motion.div
                    layoutId="activeNavUnderline"
                    className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#6A9D94] rounded-full shadow-[0_0_8px_rgba(106,157,148,0.5)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#6A9D94] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                )}
              </Link>

              {/* Contact Us */}
              <Link
                href="/contact"
                className={`relative py-1.5 transition-colors duration-300 group ${
                  pathname.startsWith("/contact") ? "text-[#FFFFFF] font-medium" : "text-[#A2AFBD] hover:text-[#FFFFFF]"
                }`}
              >
                <span>Contact Us</span>
                {pathname.startsWith("/contact") ? (
                  <motion.div
                    layoutId="activeNavUnderline"
                    className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#6A9D94] rounded-full shadow-[0_0_8px_rgba(106,157,148,0.5)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#6A9D94] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                )}
              </Link>
            </nav>

            {/* Inquire CTA Button with rounded style & green border */}
            <div className="hidden lg:flex items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs tracking-[0.18em] uppercase font-medium border border-[#6A9D94] text-[#FFFFFF] px-4 py-2 rounded-full hover:bg-[#6A9D94] hover:text-[#14191E] transition-all duration-300 shadow-xs"
              >
                Inquire
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              ref={triggerRef}
              aria-expanded={isOpen} aria-controls="mobile-navigation"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2 text-[#FFFFFF] focus-visible:outline rounded-lg"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </header>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            ref={mobileRef} id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Navigasi utama"
            className="fixed inset-0 z-40 bg-[#14191E]/98 backdrop-blur-xl pt-28 px-8 flex flex-col justify-between pb-12 lg:hidden border-b border-[#242E38] overflow-y-auto"
          >
            <div className="flex flex-col space-y-6">
              <button onClick={() => setIsOpen(false)} className="self-end p-2" aria-label="Tutup navigasi"><X /></button>
              <Link
                href="/"
                className={`text-xl tracking-wider uppercase font-light ${
                  pathname === "/" ? "text-[#6A9D94] font-medium" : "text-[#A2AFBD]"
                }`}
              >
                Home
              </Link>

              {/* Mobile Projects Accordion */}
              <div>
                <button
                  aria-expanded={mobileProjectsOpen}
                  onClick={() => setMobileProjectsOpen(!mobileProjectsOpen)}
                  className={`w-full flex items-center justify-between text-xl tracking-wider uppercase font-light ${
                    isProjectsActive ? "text-[#6A9D94] font-medium" : "text-[#A2AFBD]"
                  }`}
                >
                  <span>Projects</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${mobileProjectsOpen ? "rotate-180" : ""}`} />
                </button>

                {mobileProjectsOpen && (
                  <div className="pl-4 pt-3 space-y-3 border-l-2 border-[#6A9D94]/40 mt-3">
                    <Link
                      href="/portfolio"
                      className="block text-sm text-[#F4F3EF] hover:text-[#6A9D94]"
                    >
                      All Disciplines
                    </Link>
                    {CATEGORY_ITEMS.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block text-sm text-[#8E9BA5] hover:text-[#6A9D94]"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/awards"
                className={`text-xl tracking-wider uppercase font-light ${
                  pathname.startsWith("/awards") ? "text-[#6A9D94] font-medium" : "text-[#A2AFBD]"
                }`}
              >
                Awards &amp; Sayembara
              </Link>

              <Link
                href="/news"
                className={`text-xl tracking-wider uppercase font-light ${
                  pathname.startsWith("/news") ? "text-[#6A9D94] font-medium" : "text-[#A2AFBD]"
                }`}
              >
                What’s On
              </Link>

              <Link
                href="/about"
                className={`text-xl tracking-wider uppercase font-light ${
                  pathname.startsWith("/about") ? "text-[#6A9D94] font-medium" : "text-[#A2AFBD]"
                }`}
              >
                About Us
              </Link>

              <Link
                href="/contact"
                className={`text-xl tracking-wider uppercase font-light ${
                  pathname.startsWith("/contact") ? "text-[#6A9D94] font-medium" : "text-[#A2AFBD]"
                }`}
              >
                Contact Us
              </Link>
            </div>

            <div className="border-t border-[#242E38] pt-6 space-y-4">
              <p className="text-xs uppercase tracking-widest text-[#A2AFBD]">Kendari · Sulawesi Tenggara</p>
              <p className="text-sm font-light text-[#FFFFFF]">{settings.email}</p>
              <Link
                href="/contact"
                className="w-full flex items-center justify-center py-3.5 bg-[#6A9D94] text-[#14191E] text-xs tracking-widest uppercase font-semibold mt-4 rounded-xl"
              >
                Start a Conversation
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
