import { HomeView } from "@/components/HomeView";
import { getContent } from "@/lib/content";
import { studioStructuredData } from "@/lib/structured-data";
import { getHomepageContent } from "@/lib/get-homepage-content";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [{ settings }, homepageContent] = await Promise.all([getContent(), getHomepageContent()]);
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: studioStructuredData(settings, process.env.NEXT_PUBLIC_SITE_URL) }} />
    <HomeView homepageContent={homepageContent} />
  </>;
}
