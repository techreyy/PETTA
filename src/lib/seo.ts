import type { Metadata } from 'next';
export function pageMetadata(title: string, description: string, path: string, image?: string): Metadata {
  return { title: `${title} | Petta Desain`, description, alternates: { canonical: path },
    openGraph: { title, description, url: path, type: 'website', ...(image ? { images: [image] } : {}) } };
}
