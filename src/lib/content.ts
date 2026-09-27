import 'server-only';
import { cache } from 'react';
import { getPayload } from 'payload';
import config from '@payload-config';
import { cmsReady } from './cms-ready';
import { PROJECTS, PORTFOLIO_CATEGORIES, NEWS_ITEMS, STUDIO_INFO, STUDIO_TEAM, STUDIO_AWARDS, STUDIO_COMPETITIONS } from './data';
import type { Project as PublicProject, NewsItem, AwardItem, CompetitionItem } from './data';
import type { Media, Project, News, PortfolioCategory } from '@/payload-types';
import type { StudioSettings } from './SettingsContext';

export const cms = () => getPayload({ config });
export function imageUrl(media: number | Media | null | undefined, fallback?: string | null) {
  return typeof media === 'object' && media?.url ? media.url : fallback || '/petta-logo-transparent.png';
}
export function projectView(p: Project): PublicProject {
  const category = typeof p.category === 'object' ? p.category : null;
  return { id: String(p.id), slug: p.slug, title: p.title, category: category?.title || '', categorySlug: category?.slug || '',
    location: p.location || '', year: p.year || '', status: p.status || '', architectInCharge: p.architectInCharge || '',
    siteArea: p.siteArea || '', constructedArea: p.constructedArea || '', stories: p.stories || '', shortIntro: p.shortIntro || '',
    description: p.description?.map(row => row.paragraph) || [], heroImage: imageUrl(p.heroImage, p.heroImageUrl),
    gallery: p.gallery?.map(row => imageUrl(row.image, row.imageUrl)) || [], featured: p.featured || false,
  };
}
export function newsView(n: News): NewsItem {
  return { id: String(n.id), slug: n.slug, title: n.title, date: n.date || '', category: n.category || '',
    excerpt: n.excerpt, coverImage: imageUrl(n.coverImage, n.coverImageUrl), featured: n.featured || false };
}
export const getContent = cache(async () => {
  if (!cmsReady()) return {
    projects: PROJECTS,
    categories: PORTFOLIO_CATEGORIES.map(c => ({ ...c, count: PROJECTS.filter(p => p.categorySlug === c.slug).length })),
    news: NEWS_ITEMS,
    team: STUDIO_TEAM,
    awards: STUDIO_AWARDS,
    competitions: STUDIO_COMPETITIONS,
    settings: STUDIO_INFO as StudioSettings
  };
  const payload = await cms();
  const [projectResult, categoryResult, newsResult, settings, teamResult, awardResult, competitionResult] = await Promise.all([
    payload.find({ collection: 'projects', overrideAccess: false, depth: 2, pagination: false, sort: 'order', where: { _status: { equals: 'published' } } }),
    payload.find({ collection: 'portfolioCategories', overrideAccess: false, depth: 1, pagination: false, sort: 'order', where: { active: { equals: true } } }),
    payload.find({ collection: 'news', overrideAccess: false, depth: 1, pagination: false, sort: '-publishDate', where: { _status: { equals: 'published' } } }),
    payload.findGlobal({ slug: 'siteSettings', overrideAccess: false, depth: 1 }),
    payload.find({ collection: 'team', overrideAccess: false, depth: 1, pagination: false, sort: 'order', where: { active: { equals: true } } }),
    payload.find({ collection: 'awards', overrideAccess: false, depth: 0, pagination: false, sort: 'order', where: { active: { equals: true } } }).catch(() => ({ docs: [] })),
    payload.find({ collection: 'competitions', overrideAccess: false, depth: 0, pagination: false, sort: 'order', where: { active: { equals: true } } }).catch(() => ({ docs: [] })),
  ]);
  const projects = projectResult.docs.map(projectView);
  const awards: AwardItem[] = (awardResult.docs.length > 0)
    ? awardResult.docs.map((a: any) => ({ id: String(a.id), year: a.year, title: a.title, issuer: a.issuer, category: a.category, project: a.project, description: a.description }))
    : STUDIO_AWARDS;
  const competitions: CompetitionItem[] = (competitionResult.docs.length > 0)
    ? competitionResult.docs.map((c: any) => ({ id: String(c.id), year: c.year, title: c.title, organizer: c.organizer, achievement: c.achievement, location: c.location, description: c.description }))
    : STUDIO_COMPETITIONS;

  return { projects, news: newsResult.docs.map(newsView),
    team: teamResult.docs.map(member => ({ name: member.name, role: member.roleTitle, portrait: imageUrl(member.portrait, member.portraitUrl), bio: member.bio || "", instagram: member.instagram || "" })), 
    awards,
    competitions,
    categories: categoryResult.docs.map((c: PortfolioCategory) => ({ title: c.title, slug: c.slug, description: c.description,
      coverImage: imageUrl(c.coverImage, c.coverImageUrl), count: projects.filter(p => p.categorySlug === c.slug).length })),
    settings: { ...Object.fromEntries(Object.keys(STUDIO_INFO).map(key => [key, settings[key as keyof typeof STUDIO_INFO]])),
      customLogoUrl: settings.logo ? imageUrl(settings.logo) : undefined } as StudioSettings,
  };
});

export const getProject = cache(async (slug: string) => {
  if (!cmsReady()) {
    const project = PROJECTS.find(p => p.slug === slug);
    return project ? { project, seo: null } : null;
  }
  const payload = await cms();
  const result = await payload.find({ collection: 'projects', overrideAccess: false, depth: 2, limit: 1, where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] } });
  return result.docs[0] ? { project: projectView(result.docs[0]), seo: result.docs[0].seo } : null;
});

export const getNews = cache(async (slug: string) => {
  if (!cmsReady()) { const item = NEWS_ITEMS.find(n => n.slug === slug); return item ? { item, body: null, seo: null } : null; }
  const payload = await cms();
  const result = await payload.find({ collection: 'news', overrideAccess: false, depth: 1, limit: 1, where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] } });
  const doc = result.docs[0];
  return doc ? { item: newsView(doc), body: doc.body, seo: doc.seo } : null;
});
