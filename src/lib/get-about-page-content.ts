import 'server-only';
import { cache } from 'react';
import { cms } from './content';
import { cmsReady } from './cms-ready';
import { resolveAboutPageContent } from './about-page-content';

// The About page is force-dynamic. Only deduplicate within a request, never cache saved copy across requests.
export const getAboutPageContent = cache(async () => {
  if (!cmsReady()) return resolveAboutPageContent();
  try {
    const payload = await cms();
    return resolveAboutPageContent(await payload.findGlobal({ slug: 'aboutPageContent', depth: 0, overrideAccess: false }));
  } catch {
    console.error('About Page Content unavailable; using existing about page copy.');
    return resolveAboutPageContent();
  }
});
