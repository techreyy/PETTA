"use client";
import { createContext, useContext } from 'react';
import { STUDIO_INFO } from './data';
export type StudioSettings = typeof STUDIO_INFO & { customLogoUrl?: string };
const SettingsContext = createContext<{ settings: StudioSettings }>({ settings: STUDIO_INFO });
export function SettingsProvider({ settings, children }: { settings: StudioSettings; children: React.ReactNode }) {
  return <SettingsContext.Provider value={{ settings }}>{children}</SettingsContext.Provider>;
}
export function useStudioSettings() { return useContext(SettingsContext); }
