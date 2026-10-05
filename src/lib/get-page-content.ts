import 'server-only';
import { cache } from 'react';
import { cms } from './content';
import { cmsReady } from './cms-ready';
import { resolvePageContent, type PageContentSlug } from './page-content';

// Request-scoped deduplication only; public routes read current copy on every request.
export const getPageContent = cache(async <S extends PageContentSlug>(slug: S) => {
  if (!cmsReady()) return resolvePageContent(slug);
  try {
    const payload = await cms();
    return resolvePageContent(slug, await payload.findGlobal({ slug, depth: 0, overrideAccess: false }));
  } catch {
    console.error(`${slug} unavailable; using existing website copy.`);
    return resolvePageContent(slug);
  }
});
