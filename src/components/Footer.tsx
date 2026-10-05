"use client";

import { fillCopyTemplate } from "@/lib/page-content";
import React from "react";
import Link from "next/link";
import { PettaLogo } from "@/components/PettaLogo";
import { MapPin, Phone, Mail } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/SocialIcons";
import { useStudioSettings } from "@/lib/SettingsContext";

export function Footer() {
  const { settings, siteCopy: copy } = useStudioSettings();

  return (
    <footer className="bg-[#14191E] text-white border-t border-[#242E38] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-[#242E38]">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-6">
            <PettaLogo className="h-10 md:h-12 w-auto" />
            <p className="text-xs text-[#A2AFBD] font-light leading-relaxed max-w-sm">
              {fillCopyTemplate(copy.footerDescription, { name: settings.name, founder: settings.founder })}
            </p>
            <div className="flex items-center gap-4 text-[#A2AFBD]">
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="w-9 h-9 rounded-full border border-[#242E38] flex items-center justify-center hover:text-[#6A9D94] hover:border-[#6A9D94] transition-colors"
                title={copy.footerInstagramLabel}
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={settings.instagramFounder}
                target="_blank"
                rel="noreferrer noopener"
                className="w-9 h-9 rounded-full border border-[#242E38] flex items-center justify-center hover:text-[#6A9D94] hover:border-[#6A9D94] transition-colors"
                title={copy.footerFounderInstagramLabel}
              >
                <InstagramIcon className="w-4 h-4 text-[#6A9D94]" />
              </a>
              <a
                href={settings.facebook}
                target="_blank"
                rel="noreferrer noopener"
                className="w-9 h-9 rounded-full border border-[#242E38] flex items-center justify-center hover:text-[#6A9D94] hover:border-[#6A9D94] transition-colors"
                title={copy.footerFacebookLabel}
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#6A9D94] font-semibold">
              {copy.footerExplore}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A2AFBD]">
              <li>
                <Link href="/portfolio" className="hover:text-white transition-colors">
                  {copy.footerPortfolio}
                </Link>
              </li>
              <li>
                <Link href="/portfolio/category/private-house" className="hover:text-white transition-colors">
                  {copy.footerPrivateHouse}
                </Link>
              </li>
              <li>
                <Link href="/portfolio/category/commercial-building" className="hover:text-white transition-colors">
                  {copy.footerCommercial}
                </Link>
              </li>
              <li>
                <Link href="/portfolio/category/interior-design" className="hover:text-white transition-colors">
                  {copy.footerInterior}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  {copy.footerServices}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {copy.footerAbout}
                </Link>
              </li>
              <li>
                <Link href="/awards" className="hover:text-white transition-colors">
                  {copy.footerAwards}
                </Link>
              </li>
            </ul>
          </div>

          {/* Group Entities */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#6A9D94] font-semibold">
              {copy.footerGroup}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A2AFBD]">
              <li className="text-white font-medium">{copy.footerDesign}</li>
              <li className="text-white font-medium">{copy.footerConstruction}</li>
              <li className="text-white font-medium">{copy.footerPrintlab}</li>
              <li className="pt-2 text-[11px] text-[#6B7785]">{copy.footerArchtech}</li>
              <li className="text-[11px] text-[#6B7785]">{copy.footerNetwork}</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#6A9D94] font-semibold">
              {copy.footerOffice}
            </h4>
            <div className="space-y-3 text-xs text-[#A2AFBD] font-light">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#6A9D94] mt-0.5 shrink-0" />
                <span>{settings.address}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#6A9D94] shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-[#6A9D94] transition-colors">
                  {settings.phone}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#6A9D94] shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-[#6A9D94] transition-colors">
                  {settings.email}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#6B7785] gap-4">
          <p>{fillCopyTemplate(copy.footerCopyright, { year: String(new Date().getFullYear()), name: settings.name })}</p>
          <div className="flex items-center gap-6">
            <span>{settings.founder}</span>
            <span>{copy.footerLocation}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
