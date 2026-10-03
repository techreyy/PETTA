import type { Metadata } from "next";
import { Suspense } from "react";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import "../globals.css";
import { getContent } from '@/lib/content';
import { MotionProvider } from '@/components/MotionProvider';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProjectProvider } from "@/lib/ProjectContext";
import { SettingsProvider } from "@/lib/SettingsContext";
import { NavigationProgress } from "@/components/NavigationProgress";
import { OfflineExperience } from "@/components/OfflineExperience";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: "PETTA — Building Beyond Spaces | Architectural Practice",
  description:
    "PETTA — Building Beyond Spaces. A contemporary architecture and design atelier dedicated to climate-responsive, tactile, and contextual spatial excellence.",
  icons: {
    icon: [
      { url: "/petta-icon-only.png?v=3", type: "image/png" }
    ],
    shortcut: "/petta-icon-only.png?v=3",
    apple: "/petta-icon-only.png?v=3",
  },
};

// Read current publishing state on each request until CMS cache invalidation is implemented.
export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getContent();
  return (
    <html
      lang="id"
      className={`${dmSans.variable} ${cormorant.variable} scroll-smooth antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" type="image/png" href="/petta-icon-only.png?v=3" />
        <link rel="shortcut icon" href="/petta-icon-only.png?v=3" />
        <link rel="apple-touch-icon" href="/petta-icon-only.png?v=3" />
      </head>
      <body
        className="min-h-screen flex flex-col bg-[#F9F8F6] text-[#14191E] font-sans selection:bg-[#14191E] selection:text-[#6A9D94]"
        suppressHydrationWarning
      >
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <OfflineExperience />
        <SettingsProvider settings={content.settings}>
          <ProjectProvider
            projects={content.projects}
            categories={content.categories}
            news={content.news}
            team={content.team}
            awards={content.awards}
            competitions={content.competitions}
          >
            <MotionProvider>
            <a className="skip-link" href="#main-content">Langsung ke konten</a>
            <Header />
            <main id="main-content" className="flex-1 w-full">{children}</main>
            <Footer />
            </MotionProvider>
          </ProjectProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
