import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PETTA — Building Beyond Spaces',
    short_name: 'PETTA',
    description: 'A contemporary architecture and design atelier dedicated to climate-responsive, tactile, and contextual spatial excellence.',
    start_url: '/',
    display: 'standalone',
    background_color: '#14191E',
    theme_color: '#14191E',
    icons: [
      {
        src: '/petta-icon-only.png?v=3',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
