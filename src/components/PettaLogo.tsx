"use client";

import React from "react";
import Image from "next/image";
import { useStudioSettings } from "@/lib/SettingsContext";

interface LogoProps {
  className?: string;
  variant?: "dark" | "light";
  withTagline?: boolean;
}

export function PettaLogo({
  className = "h-11 w-auto",
}: LogoProps) {
  const { settings } = useStudioSettings();

  const logoSrc = settings.customLogoUrl || "/petta-logo-transparent.png";

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <Image
        src={logoSrc}
        alt={settings.name || "PETTA — Building Beyond Spaces"}
        width={387}
        height={113}
        priority
        className="h-full w-auto object-contain"
      />
    </div>
  );
}
