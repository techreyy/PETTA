import 'server-only';
import { cache } from 'react';
import { cms } from './content';
import { cmsReady } from './cms-ready';
import { resolveHomepageContent } from './homepage-content';

// The homepage is force-dynamic. Only deduplicate within a request, never cache saved copy across requests.
export const getHomepageContent = cache(async () => {
  if (!cmsReady()) return resolveHomepageContent();
  try {
    const payload = await cms();
    return resolveHomepageContent(await payload.findGlobal({ slug: 'homepageContent', depth: 0, overrideAccess: false }));
  } catch {
    console.error('Homepage Content unavailable; using existing homepage copy.');
    return resolveHomepageContent();
  }
});
