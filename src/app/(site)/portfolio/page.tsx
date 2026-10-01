import { pageMetadata } from "@/lib/seo";
import { PortfolioView } from "./portfolio-view";

export const metadata = pageMetadata(
  "Architectural Portfolio",
  "Arsip lengkap karya arsitektur, masterplan kawasan terpadu, hunian privat, dan instalasi spasial Petta Desain di Sulawesi Tenggara dan nasional.",
  "/portfolio"
);

export default function PortfolioPage() {
  return <PortfolioView />;
}
