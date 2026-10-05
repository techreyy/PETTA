import ContactView from "@/components/ContactView";
import { getPageContent } from "@/lib/get-page-content";

export const dynamic = "force-dynamic";

export default async function Page() {
  return <ContactView copy={await getPageContent("contactPageContent")} />;
}
