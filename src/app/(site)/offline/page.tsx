import type { Metadata } from "next";
import { OfflineFallbackView } from "@/components/OfflineFallbackView";

export const metadata: Metadata = {
  title: "Koneksi Terputus | PETTA Architectural Practice",
  description: "Halaman status offline PETTA Architectural Practice.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OfflinePage() {
  return <OfflineFallbackView />;
}
