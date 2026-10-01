import 'server-only';
import { getPayload } from 'payload';
import config from '@payload-config';
import { cmsReady } from './cms-ready';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  order: number;
}

export async function getServices(): Promise<ServiceItem[]> {
  if (!cmsReady()) {
    if (process.env.DEMO_CONTENT === 'true') return [];
    throw new Error('CMS is not configured. Configure DATABASE_URI and PAYLOAD_SECRET, or explicitly set DEMO_CONTENT=true for a demo.');
  }
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: 'services',
    overrideAccess: false,
    depth: 0,
    pagination: false,
    sort: 'order',
    where: { active: { equals: true } },
  });
  return result.docs
    .filter(service => service.active === true)
    .map(service => ({ id: String(service.id), title: service.title, description: service.description, order: service.order ?? 0 }))
    .sort((a, b) => a.order - b.order);
}
