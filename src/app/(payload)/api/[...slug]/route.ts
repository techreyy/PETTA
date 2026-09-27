import config from '@payload-config';
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST, REST_PUT } from '@payloadcms/next/routes';
import { cmsReady } from '@/lib/cms-ready';

type Context = { params: Promise<{ slug?: string[] }> };
function guarded(handler: (request: Request, context: Context) => Promise<Response>) {
  return async (request: Request, context: Context) => {
    if (!cmsReady()) return Response.json({ message: 'CMS unavailable.' }, { status: 503 });
    const { slug = [] } = await context.params;
    if (slug[0] === 'users' && slug[1] === 'first-register') {
      const { getPayload } = await import('payload');
      const payload = await getPayload({ config });
      const count = await payload.count({ collection: 'users' });
      if (count.totalDocs > 0) return Response.json({ message: 'Registration disabled.' }, { status: 403 });
    }
    if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      const origin = request.headers.get('origin');
      const allowed = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
      if (origin && origin !== new URL(allowed).origin) return Response.json({ message: 'Invalid origin.' }, { status: 403 });
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
