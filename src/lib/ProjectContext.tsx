"use client";
import { createContext, useContext } from 'react';
import type { Project, NewsItem, AwardItem, CompetitionItem } from './data';
import { PORTFOLIO_CATEGORIES, STUDIO_TEAM, STUDIO_AWARDS, STUDIO_COMPETITIONS } from './data';

export type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number];

interface ProjectContextType {
  projects: Project[];
  categories: PortfolioCategory[];
  news: NewsItem[];
  team: typeof STUDIO_TEAM;
  awards: AwardItem[];
  competitions: CompetitionItem[];
}

const ProjectContext = createContext<ProjectContextType>({
  projects: [],
  categories: [],
  news: [],
  team: [],
  awards: STUDIO_AWARDS,
  competitions: STUDIO_COMPETITIONS,
});

export function ProjectProvider({
  projects,
  categories,
  news,
  team,
  awards = STUDIO_AWARDS,
  competitions = STUDIO_COMPETITIONS,
  children
}: {
  projects: Project[];
  categories: PortfolioCategory[];
  news: NewsItem[];
  team: typeof STUDIO_TEAM;
  awards?: AwardItem[];
  competitions?: CompetitionItem[];
  children: React.ReactNode;
}) {
  return (
    <ProjectContext.Provider value={{ projects, categories, news, team, awards, competitions }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  return useContext(ProjectContext);
}
