import type { MetadataRoute } from 'next';
import { getContent } from '@/lib/content';
export const dynamic = 'force-dynamic';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const { projects, categories, news } = await getContent();
  return ['/', '/about', '/services', '/contact', '/portfolio', '/news', ...projects.map(p => `/portfolio/${p.slug}`), ...categories.map(c => `/portfolio/category/${c.slug}`), ...news.map(n => `/news/${n.slug}`)].map(path => ({ url: new URL(path, base).href }));
}
