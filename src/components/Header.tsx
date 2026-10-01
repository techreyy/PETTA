"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, ChevronDown, ArrowUpRight } from "lucide-react";
import { useProjects } from "@/lib/ProjectContext";
import { useStudioSettings } from "@/lib/SettingsContext";
import { PettaLogo } from "@/components/PettaLogo";

/* Determine which nav key is active based on pathname */
function getActiveNavKey(pathname: string): string | null {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/portfolio")) return "projects";
  if (pathname === "/services" || pathname.startsWith("/services/")) return "services";
  if (pathname.startsWith("/awards")) return "awards";
  if (pathname.startsWith("/news")) return "news";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/contact")) return "contact";
  return null;
}

export function Header() {
  const pathname = usePathname();
  return <HeaderContent key={pathname} />;
}

function NavUnderline({ isActive, navKey, activeKey }: { isActive: boolean; navKey: string; activeKey: string | null }) {
  if (isActive && navKey === activeKey) {
    return (
      <motion.div
        layoutId="activeNavUnderline"
        className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#6A9D94] rounded-full shadow-[0_0_8px_rgba(106,157,148,0.5)]"
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      />
    );
  }
  return (
    <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#6A9D94] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
  );
}

function HeaderContent() {
  const { categories } = useProjects();
  const { settings } = useStudioSettings();
  const CATEGORY_ITEMS = useMemo(
    () => categories.map(c => ({ name: c.title, href: `/portfolio/category/${c.slug}` })),
    [categories]
  );
  const reducedMotion = useReducedMotion();
  const mobileRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const activeKey = getActiveNavKey(pathname);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
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

  const closeMobile = () => setIsOpen(false);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-3 md:pt-4 px-4 pointer-events-none">
        <header
          className={`pointer-events-auto w-full max-w-7xl transition-[background-color,border-color,box-shadow,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none backdrop-blur-md rounded-2xl border ${
            scrolled || isOpen
              ? "bg-[#14191E]/95 backdrop-blur-md border-[#242E38] py-3 px-6 md:px-8 shadow-2xl shadow-black/40"
              : "bg-[#14191E]/70 py-4 px-6 md:px-8 border-white/10 shadow-lg shadow-black/10"
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Authentic Logo with Clean Transparent Background */}
            <Link href="/" className="group flex items-center hover:opacity-90 transition-opacity">
              <PettaLogo className="h-9 md:h-11 w-auto" />
            </Link>

            {/* Desktop Navigation with Smooth Green Underline & Rounded Elements */}
            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-8 text-[13.5px] font-normal tracking-wide">
              {/* Home */}
              <Link
                href="/"
                className={`relative py-1.5 transition-colors duration-300 group ${
                  activeKey === "home" ? "text-[#FFFFFF] font-medium" : "text-[#E1E7EC] hover:text-[#FFFFFF]"
                }`}
              >
                <span>Home</span>
                <NavUnderline isActive={activeKey === "home"} navKey="home" activeKey={activeKey} />
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
                    activeKey === "projects" ? "text-[#FFFFFF] font-medium" : "text-[#E1E7EC] hover:text-[#FFFFFF]"
                  }`}
                >
                  <span>Projects</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${
                      dropdownOpen ? "rotate-180 text-[#6A9D94]" : "text-[#A2AFBD] group-hover:text-[#6A9D94]"
                    }`}
                  />
                  <NavUnderline isActive={activeKey === "projects"} navKey="projects" activeKey={activeKey} />
                </button>

                {/* Dropdown Card with Rounded Corners & Subtle Green Accent Border */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: reducedMotion ? 0 : 6, scale: reducedMotion ? 1 : 0.985 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: reducedMotion ? 0 : 4, scale: reducedMotion ? 1 : 0.985 }}
                      transition={{ duration: reducedMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                      id="project-navigation" className="absolute top-full left-0 mt-0 w-64 bg-white text-[#2B3540] shadow-2xl rounded-xl py-3 border border-[#E5E2DC] z-50 text-left max-h-[calc(100dvh-8rem)] overflow-y-auto overscroll-contain ring-1 ring-black/5"
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

              <Link
                href="/services"
                aria-current={activeKey === "services" ? "page" : undefined}
                className={`relative py-1.5 transition-colors duration-300 group ${activeKey === "services" ? "text-[#FFFFFF] font-medium" : "text-[#E1E7EC] hover:text-[#FFFFFF]"}`}
              >
                <span>Services</span>
                <NavUnderline isActive={activeKey === "services"} navKey="services" activeKey={activeKey} />
              </Link>

              {/* Awards & Competitions */}
              <Link
                href="/awards"
                className={`relative py-1.5 transition-colors duration-300 group ${
                  activeKey === "awards" ? "text-[#FFFFFF] font-medium" : "text-[#E1E7EC] hover:text-[#FFFFFF]"
                }`}
              >
                <span>Awards &amp; Sayembara</span>
                <NavUnderline isActive={activeKey === "awards"} navKey="awards" activeKey={activeKey} />
              </Link>

              {/* What's On */}
              <Link
                href="/news"
                className={`relative py-1.5 transition-colors duration-300 group ${
                  activeKey === "news" ? "text-[#FFFFFF] font-medium" : "text-[#E1E7EC] hover:text-[#FFFFFF]"
                }`}
              >
                <span>What&apos;s On</span>
                <NavUnderline isActive={activeKey === "news"} navKey="news" activeKey={activeKey} />
              </Link>

              {/* About Us */}
              <Link
                href="/about"
                className={`relative py-1.5 transition-colors duration-300 group ${
                  activeKey === "about" ? "text-[#FFFFFF] font-medium" : "text-[#E1E7EC] hover:text-[#FFFFFF]"
                }`}
              >
                <span>About Us</span>
                <NavUnderline isActive={activeKey === "about"} navKey="about" activeKey={activeKey} />
              </Link>

              {/* Contact Us */}
              <Link
                href="/contact"
                className={`relative py-1.5 transition-colors duration-300 group ${
                  activeKey === "contact" ? "text-[#FFFFFF] font-medium" : "text-[#E1E7EC] hover:text-[#FFFFFF]"
                }`}
              >
                <span>Contact Us</span>
                <NavUnderline isActive={activeKey === "contact"} navKey="contact" activeKey={activeKey} />
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
            initial={{ opacity: 0, y: reducedMotion ? 0 : -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
            transition={{ duration: reducedMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            ref={mobileRef} id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Navigasi utama"
            className="fixed inset-0 z-40 bg-[#14191E]/98 backdrop-blur-xl pt-28 px-8 flex flex-col justify-between gap-10 pb-12 lg:hidden border-b border-[#242E38] overflow-y-auto"
          >
            <div className="flex flex-col shrink-0 space-y-6">
              <button onClick={closeMobile} className="self-end p-2" aria-label="Tutup navigasi"><X /></button>
              <Link
                href="/"
                onClick={closeMobile}
                className={`text-xl tracking-wider uppercase font-light ${
                  activeKey === "home" ? "text-[#6A9D94] font-medium" : "text-[#A2AFBD]"
                }`}
              >
                Home
              </Link>

              {/* Mobile Projects Accordion */}
              <div>
                <button
                  aria-expanded={mobileProjectsOpen} aria-controls="mobile-project-navigation"
                  onClick={() => setMobileProjectsOpen(!mobileProjectsOpen)}
                  className={`w-full flex items-center justify-between text-xl tracking-wider uppercase font-light ${
                    activeKey === "projects" ? "text-[#6A9D94] font-medium" : "text-[#A2AFBD]"
                  }`}
                >
                  <span>Projects</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${mobileProjectsOpen ? "rotate-180" : ""}`} />
                </button>

                {mobileProjectsOpen && (
                  <div id="mobile-project-navigation" className="pl-4 pt-3 space-y-1 border-l-2 border-[#6A9D94]/40 mt-3">
                    <Link
                      href="/portfolio"
                      onClick={closeMobile}
                      className="block py-3 text-sm text-[#F4F3EF] hover:text-[#6A9D94]"
                    >
                      All Disciplines
                    </Link>
                    {CATEGORY_ITEMS.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={closeMobile}
                        className="block py-3 text-sm text-[#8E9BA5] hover:text-[#6A9D94]"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/services"
                onClick={closeMobile}
                aria-current={activeKey === "services" ? "page" : undefined}
                className={`text-xl tracking-wider uppercase font-light ${activeKey === "services" ? "text-[#6A9D94] font-medium" : "text-[#A2AFBD]"}`}
              >
                Services
              </Link>

              <Link
                href="/awards"
                onClick={closeMobile}
                className={`text-xl tracking-wider uppercase font-light ${
                  activeKey === "awards" ? "text-[#6A9D94] font-medium" : "text-[#A2AFBD]"
                }`}
              >
                Awards &amp; Sayembara
              </Link>

              <Link
                href="/news"
                onClick={closeMobile}
                className={`text-xl tracking-wider uppercase font-light ${
                  activeKey === "news" ? "text-[#6A9D94] font-medium" : "text-[#A2AFBD]"
                }`}
              >
                What&apos;s On
              </Link>

              <Link
                href="/about"
                onClick={closeMobile}
                className={`text-xl tracking-wider uppercase font-light ${
                  activeKey === "about" ? "text-[#6A9D94] font-medium" : "text-[#A2AFBD]"
                }`}
              >
                About Us
              </Link>

              <Link
                href="/contact"
                onClick={closeMobile}
                className={`text-xl tracking-wider uppercase font-light ${
                  activeKey === "contact" ? "text-[#6A9D94] font-medium" : "text-[#A2AFBD]"
                }`}
              >
                Contact Us
              </Link>
            </div>

            <div className="shrink-0 border-t border-[#242E38] pt-6 space-y-4">
              <p className="text-xs uppercase tracking-widest text-[#A2AFBD]">Kendari · Sulawesi Tenggara</p>
              <p className="text-sm font-light text-[#FFFFFF]">{settings.email}</p>
              <Link
                href="/contact"
                onClick={closeMobile}
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
