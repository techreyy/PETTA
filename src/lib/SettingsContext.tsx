"use client";
import { createContext, useContext } from 'react';
import { PAGE_CONTENT_DEFAULTS, type PageContent } from './page-content';
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
const SettingsContext = createContext<{ settings: StudioSettings; siteCopy: PageContent<"siteTextContent"> }>({ settings: STUDIO_INFO, siteCopy: PAGE_CONTENT_DEFAULTS.siteTextContent });
export function SettingsProvider({ settings, siteCopy = PAGE_CONTENT_DEFAULTS.siteTextContent, children }: { settings: StudioSettings; siteCopy?: PageContent<"siteTextContent">; children: React.ReactNode }) {
  return <SettingsContext.Provider value={{ settings, siteCopy }}>{children}</SettingsContext.Provider>;
}
export function useStudioSettings() { return useContext(SettingsContext); }
