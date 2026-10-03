import "server-only";
import { cache } from "react";
import { getPayload } from "payload";
import { withCMSTiming } from "./cms-timing";
import config from "@payload-config";
import { cmsReady } from "./cms-ready";
import {
  PROJECTS,
  PORTFOLIO_CATEGORIES,
  NEWS_ITEMS,
  STUDIO_INFO,
  STUDIO_TEAM,
  STUDIO_AWARDS,
  STUDIO_COMPETITIONS,
} from "./data";
import type {
  Project as PublicProject,
  NewsItem,
  AwardItem,
  CompetitionItem,
} from "./data";
import type {
  Media,
  Project,
  News,
  PortfolioCategory,
  Award,
  Competition,
  SiteSetting,
} from "@/payload-types";
import type { StudioSettings } from "./SettingsContext";

// getPayload caches both the instance and its initialization promise by config.
export const cms = async () => withCMSTiming(await getPayload({ config }));

// A configured CMS is authoritative, even when DEMO_CONTENT is enabled.
// Missing configuration must not silently turn a production site into a demo,
// but on Vercel deployments without a cloud database, automatically use demo content.
function useDemoContent() {
  if (cmsReady()) return false;
  if (process.env.DEMO_CONTENT === "true" || Boolean(process.env.VERCEL)) return true;
  throw new Error(
    "CMS is not configured. Configure DATABASE_URI and PAYLOAD_SECRET, or explicitly set DEMO_CONTENT=true for a demo.",
  );
}
export function normalizeImageUrl(
  url: string | null | undefined,
  fallback: string = "/petta-logo-transparent.png",
): string {
  if (!url) return fallback;
  // If it's a full URL pointing to our own server (localhost, 127.0.0.1, or NEXT_PUBLIC_SITE_URL),
  // convert it to a relative pathname so Next.js <Image> treats it as a local asset.
  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      const parsed = new URL(url);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
        ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
        : null;
      if (
        parsed.hostname === "localhost" ||
        parsed.hostname === "127.0.0.1" ||
        parsed.hostname === "0.0.0.0" ||
        (siteUrl && parsed.host === siteUrl.host)
      ) {
        return `${parsed.pathname}${parsed.search}`;
      }
    } catch {
      // Keep as-is if parsing fails
    }
  }
  return url;
}

export function imageUrl(
  media: number | Media | null | undefined,
  fallback?: string | null,
) {
  const raw = typeof media === "object" && media?.url
    ? media.url
    : fallback || "/petta-logo-transparent.png";
  return normalizeImageUrl(raw, fallback || "/petta-logo-transparent.png");
}
export function projectView(p: Project): PublicProject {
  const category = typeof p.category === "object" ? p.category : null;
  return {
    id: String(p.id),
    slug: p.slug,
    title: p.title,
    category: category?.title || "",
    categorySlug: category?.slug || "",
    location: p.location || "",
    year: p.year || "",
    status: p.status || "",
    architectInCharge: p.architectInCharge || "",
    siteArea: p.siteArea || "",
    constructedArea: p.constructedArea || "",
    stories: p.stories || "",
    shortIntro: p.shortIntro || "",
    description: p.description?.map((row) => row.paragraph) || [],
    heroImage: imageUrl(p.heroImage, p.heroImageUrl),
    gallery: p.gallery?.map((row) => imageUrl(row.image, row.imageUrl)) || [],
    featured: p.featured || false,
  };
}
export function newsView(n: News): NewsItem {
  return {
    id: String(n.id),
    slug: n.slug,
    title: n.title,
    date: n.date || "",
    category: n.category || "",
    excerpt: n.excerpt,
    coverImage: imageUrl(n.coverImage, n.coverImageUrl),
    featured: n.featured || false,
  };
}
export const getContent = cache(async () => {
  const fallback = {
    projects: PROJECTS,
    categories: PORTFOLIO_CATEGORIES.map((c) => ({
      ...c,
      count: PROJECTS.filter((p) => p.categorySlug === c.slug).length,
    })),
    news: NEWS_ITEMS,
    team: STUDIO_TEAM,
    awards: STUDIO_AWARDS,
    competitions: STUDIO_COMPETITIONS,
    settings: STUDIO_INFO as StudioSettings,
  };

  if (useDemoContent()) return fallback;

  try {
    const payload = await cms();
    const [
      projectResult,
      categoryResult,
      newsResult,
      settings,
      teamResult,
      awardResult,
      competitionResult,
      logoResult,
    ] = await Promise.all([
    payload.find({
      collection: "projects",
      overrideAccess: false,
      depth: 1,
      // Galleries and long descriptions are loaded only by getProject on detail pages.
      select: { gallery: false, description: false, seo: false },
      pagination: false,
      sort: "order",
      where: { _status: { equals: "published" } },
    }),
    payload.find({
      collection: "portfolioCategories",
      overrideAccess: false,
      depth: 1,
      pagination: false,
      sort: "order",
      where: { active: { equals: true } },
    }),
    payload.find({
      collection: "news",
      overrideAccess: false,
      depth: 1,
      select: { body: false, seo: false },
      pagination: false,
      sort: "-publishDate",
      where: { _status: { equals: "published" } },
    }),
    payload.findGlobal({
      slug: "siteSettings",
      overrideAccess: false,
      depth: 1,
    }),
    payload.find({
      collection: "team",
      overrideAccess: false,
      depth: 1,
      pagination: false,
      sort: "order",
      where: { active: { equals: true } },
    }),
    payload.find({
      collection: "awards",
      overrideAccess: false,
      depth: 0,
      pagination: false,
      sort: "order",
      where: { active: { equals: true } },
    }),
    payload.find({
      collection: "competitions",
      overrideAccess: false,
      depth: 0,
      pagination: false,
      sort: "order",
      where: { active: { equals: true } },
    }),
    payload.find({ collection: "brandLogos", overrideAccess: false, depth: 1, pagination: false, sort: "order", where: { active: { equals: true } } }),
  ]);

  const projects = projectResult.docs.map(projectView);
  const news = newsResult.docs.map(newsView);
  const team = teamResult.docs.map((member) => ({
    name: member.name,
    role: member.roleTitle,
    portrait: member.portrait || member.portraitUrl ? imageUrl(member.portrait, member.portraitUrl) : "",
    bio: member.bio || "",
    instagram: member.instagram || "",
  }));
  const awards: AwardItem[] = awardResult.docs.map((a: Award) => ({
    id: String(a.id),
    year: a.year,
    title: a.title,
    issuer: a.issuer,
    category: a.category,
    project: a.project,
    description: a.description,
  }));
  const competitions: CompetitionItem[] = competitionResult.docs.map(
    (c: Competition) => ({
      id: String(c.id),
      year: c.year,
      title: c.title,
      organizer: c.organizer,
      achievement: c.achievement,
      location: c.location,
      description: c.description,
    }),
  );

  const categories = categoryResult.docs.map((c: PortfolioCategory) => ({
    title: c.title,
    slug: c.slug,
    description: c.description,
    coverImage: imageUrl(c.coverImage, c.coverImageUrl),
    count: projects.filter((p) => p.categorySlug === c.slug).length,
  }));

  if (!settings) throw new Error("CMS site settings are missing.");
  const siteSettings = {
    editorial: {
      logos: logoResult.docs
        .filter((l) => l.active === true && typeof l.logo === "object" && Boolean(l.logo?.url))
        .map((l) => ({
          id: String(l.id),
          name: l.name,
          group: l.group,
          alt: l.alt || (typeof l.logo === "object" ? (l.logo as Media)?.alt : "") || l.name,
          image: imageUrl(typeof l.logo === "object" ? (l.logo as Media) : l.logo),
          url: l.url || undefined,
        })),
    },
    ...Object.fromEntries(
      Object.keys(STUDIO_INFO).map((key) => [
        key,
        (settings as unknown as Record<string, string>)[key],
      ]),
    ),
    customLogoUrl: (settings as SiteSetting).logo
      ? imageUrl((settings as SiteSetting).logo)
      : undefined,
  } as StudioSettings;

  return {
    projects,
    news,
    team,
    awards,
    competitions,
    categories,
    settings: siteSettings,
  };
  } catch (err) {
  if (process.env.VERCEL) {
    console.error("CMS read error on Vercel, falling back to static studio data:", err);
    return fallback;
  }
  throw err;
  }
  });

  export const getProject = cache(async (slug: string) => {
  const fallback = PROJECTS.find((p) => p.slug === slug);
  if (useDemoContent())
  return fallback ? { project: fallback, seo: null } : null;

  try {
  const payload = await cms();
  const result = await payload.find({
    collection: "projects",
    overrideAccess: false,
    depth: 1,
    limit: 1,
    pagination: false,
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }],
    },
  });
  if (result.docs[0])
    return { project: projectView(result.docs[0]), seo: result.docs[0].seo };
  return null;
  } catch (err) {
  if (process.env.VERCEL) {
    return fallback ? { project: fallback, seo: null } : null;
  }
  throw err;
  }
  });

  export const getNews = cache(async (slug: string) => {
  const fallback = NEWS_ITEMS.find((n) => n.slug === slug);
  if (useDemoContent())
  return fallback ? { item: fallback, body: null, seo: null } : null;

  try {
  const payload = await cms();
  const result = await payload.find({
    collection: "news",
    overrideAccess: false,
    depth: 1,
    limit: 1,
    pagination: false,
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }],
    },
  });
  const doc = result.docs[0];
  if (doc) return { item: newsView(doc), body: doc.body, seo: doc.seo };
  return null;
  } catch (err) {
  if (process.env.VERCEL) {
    return fallback ? { item: fallback, body: null, seo: null } : null;
  }
  throw err;
  }
  });
