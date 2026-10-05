import AwardsView from "@/components/AwardsView";
import { getPageContent } from "@/lib/get-page-content";

export const dynamic = "force-dynamic";

export default async function Page() {
  return <AwardsView copy={await getPageContent("awardsPageContent")} />;
}
