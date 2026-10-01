import type { NextConfig } from "next";
import { withPayload } from '@payloadcms/next/withPayload';

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      ...(process.env.NEXT_PUBLIC_SITE_URL ? (() => {
        try {
          const u = new URL(process.env.NEXT_PUBLIC_SITE_URL);
          return [{
            protocol: (u.protocol.replace(':', '') || 'https') as 'http' | 'https',
            hostname: u.hostname,
            ...(u.port ? { port: u.port } : {}),
          }];
        } catch {
          return [];
        }
      })() : []),
      ...(process.env.S3_ENDPOINT ? (() => {
        try {
          const endpoint = process.env.S3_ENDPOINT.startsWith('http') ? process.env.S3_ENDPOINT : `https://${process.env.S3_ENDPOINT}`;
          const u = new URL(endpoint);
          return [{
            protocol: (u.protocol.replace(':', '') || 'https') as 'http' | 'https',
            hostname: u.hostname,
            ...(u.port ? { port: u.port } : {}),
          }];
        } catch {
          return [];
        }
      })() : []),
    ],
  },
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ] }];
  },
};

export default withPayload(nextConfig);
