"use client";
import { createContext, useContext } from 'react';
import { STUDIO_INFO } from './data';
export type StudioSettings = typeof STUDIO_INFO & {
  customLogoUrl?: string;
  editorial?: {
    logos: { id: string; name: string; group: string; alt: string; image: string; url?: string }[];
    homepage?: {
      showPositioning?: boolean;
      positioningTitle?: string;
      positioningHeadline?: string;
      positioningText?: string;
      showBusiness?: boolean;
      showProjects?: boolean;
      showCategories?: boolean;
      showNews?: boolean;
      showVideo?: boolean;
      videoTitle?: string;
      videoUrl?: string;
      showCta?: boolean;
      ctaTitle?: string;
      ctaLabel?: string;
      ctaUrl?: string;
    };
  };
};
const SettingsContext = createContext<{ settings: StudioSettings }>({ settings: STUDIO_INFO });
export function SettingsProvider({ settings, children }: { settings: StudioSettings; children: React.ReactNode }) {
  return <SettingsContext.Provider value={{ settings }}>{children}</SettingsContext.Provider>;
}
export function useStudioSettings() { return useContext(SettingsContext); }
