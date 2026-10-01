import { HomeView } from "@/components/HomeView";
import { getContent } from "@/lib/content";
import { studioStructuredData } from "@/lib/structured-data";

export default async function HomePage() {
  const { settings } = await getContent();
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: studioStructuredData(settings, process.env.NEXT_PUBLIC_SITE_URL) }} />
    <HomeView />
  </>;
}
