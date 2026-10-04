import { AboutView } from "@/components/AboutView";
import { getAboutPageContent } from "@/lib/get-about-page-content";

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const aboutContent = await getAboutPageContent();
  return <AboutView aboutContent={aboutContent} />;
}
