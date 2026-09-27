import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { getContent } from '@/lib/content';
import { MotionProvider } from '@/components/MotionProvider';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProjectProvider } from "@/lib/ProjectContext";
import { SettingsProvider } from "@/lib/SettingsContext";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
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

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getContent();
  return (
    <html lang="id" className={`${jakartaSans.variable} scroll-smooth antialiased`}>
      <head>
        <link rel="icon" type="image/png" href="/petta-icon-only.png?v=3" />
        <link rel="shortcut icon" href="/petta-icon-only.png?v=3" />
        <link rel="apple-touch-icon" href="/petta-icon-only.png?v=3" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#F9F8F6] text-[#14191E] font-sans selection:bg-[#14191E] selection:text-[#6A9D94]">
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
