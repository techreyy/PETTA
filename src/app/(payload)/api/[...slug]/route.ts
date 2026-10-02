import path from 'node:path';
import { readFile } from 'node:fs/promises';
import config from '@payload-config';
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST, REST_PUT } from '@payloadcms/next/routes';
import { cmsReady } from '@/lib/cms-ready';

function getMediaMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.webp': return 'image/webp';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.svg': return 'image/svg+xml';
    case '.avif': return 'image/avif';
    default: return 'application/octet-stream';
  }
}

type Context = { params: Promise<{ slug?: string[] }> };
function guarded(handler: (request: Request, context: Context) => Promise<Response>) {
  return async (request: Request, context: Context) => {
    const { slug = [] } = await context.params;

    // Gracefully serve uploaded media files from disk if CMS is unconfigured or offline
    if (request.method === 'GET' && slug[0] === 'media' && slug[1] === 'file' && slug[2]) {
      const filename = slug.slice(2).join('/');
      for (const dir of ['public/api/media/file', 'media']) {
        try {
          const filePath = path.join(/*turbopackIgnore: true*/ process.cwd(), dir, filename);
          const data = await readFile(filePath);
          return new Response(data, {
            status: 200,
            headers: {
              'Content-Type': getMediaMimeType(filename),
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          });
        } catch {
          // try next location
        }
      }
    }

    if (!cmsReady()) return Response.json({ message: 'CMS unavailable.' }, { status: 503 });
    if (slug[0] === 'users' && slug[1] === 'first-register') {
      const { getPayload } = await import('payload');
      const payload = await getPayload({ config });
      const count = await payload.count({ collection: 'users' });
      if (count.totalDocs > 0) return Response.json({ message: 'Registration disabled.' }, { status: 403 });
    }
    if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      const origin = request.headers.get('origin');
      if (origin) {
        const reqOrigin = new URL(request.url).origin;
        const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).origin : null;
        const isLocal = origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:');
        const isAllowed = origin === reqOrigin || (configuredOrigin && origin === configuredOrigin) || isLocal;
        if (!isAllowed) return Response.json({ message: 'Invalid origin.' }, { status: 403 });
      }
    }
    return handler(request, context);
  };
}
export const GET = guarded(REST_GET(config));
export const POST = guarded(REST_POST(config));
export const PATCH = guarded(REST_PATCH(config));
export const PUT = guarded(REST_PUT(config));
export const DELETE = guarded(REST_DELETE(config));
export const OPTIONS = guarded(REST_OPTIONS(config));
