import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { getPayload } from 'payload';
import { z } from 'zod';
import config from '../src/payload.config';
import { STUDIO_INFO } from '../src/lib/data';

const file = process.argv[2];
if (!file) throw new Error('Usage: npm run import:legacy -- path/to/export.json [--replace]');
const schema = z.object({ projects: z.array(z.object({
  id: z.string(), title: z.string().min(1), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), categorySlug: z.string(),
  location: z.string(), year: z.string(), status: z.string(), architectInCharge: z.string(), siteArea: z.string(), constructedArea: z.string(), stories: z.string(),
  shortIntro: z.string(), description: z.array(z.string()), heroImage: z.string(), gallery: z.array(z.string()), featured: z.boolean().optional(),
})), settings: z.record(z.string(), z.unknown()) });
const data = schema.parse(JSON.parse(await readFile(file, 'utf8')));
const payload = await getPayload({ config });
const replace = process.argv.includes('--replace');
const mediaCache = new Map<string, number>();
async function image(value: string, alt: string): Promise<{ media?: number; url?: string }> {
  if (!value.startsWith('data:')) return { url: value };
  if (mediaCache.has(value)) return { media: mediaCache.get(value)! };
  const match = /^data:image\/(jpeg|png|webp|avif);base64,([A-Za-z0-9+/=]+)$/.exec(value);
  if (!match) throw new Error('Unsupported legacy image.');
  const bytes = Buffer.from(match[2], 'base64');
  if (bytes.length > 10 * 1024 * 1024) throw new Error('Legacy photo exceeds 10 MB. Resize it before import.');
  await sharp(bytes).metadata();
  const doc = await payload.create({ collection: 'media', data: { alt }, file: { data: bytes, size: bytes.length, mimetype: `image/${match[1]}`, name: `${randomUUID()}.${match[1]}` } });
  mediaCache.set(value, doc.id);
  return { media: doc.id };
}
try {
  const categories = await payload.find({ collection: 'portfolioCategories', pagination: false });
  for (const project of data.projects) {
    const category = categories.docs.find(c => c.slug === project.categorySlug);
    if (!category) throw new Error(`Unknown category: ${project.categorySlug}`);
    const existing = await payload.find({ collection: 'projects', where: { slug: { equals: project.slug } }, limit: 1 });
    if (existing.docs[0] && !replace) { console.log(`Skipped existing slug: ${project.slug}; use --replace to import changes as a draft.`); continue; }
    const cover = await image(project.heroImage, project.title);
    const gallery = await Promise.all(project.gallery.map(async value => { const result = await image(value, project.title); return { image: result.media, imageUrl: result.url }; }));
    const { id, categorySlug: _category, heroImage: _hero, description, gallery: _gallery, ...fields } = project;
    void _category; void _hero; void _gallery;
    const record = { ...fields, legacyId: id, category: category.id, heroImage: cover.media, heroImageUrl: cover.url,
      description: description.map(paragraph => ({ paragraph })), gallery, _status: 'draft' as const };
    if (existing.docs[0]) await payload.update({ collection: 'projects', id: existing.docs[0].id, draft: true, data: record });
    else await payload.create({ collection: 'projects', draft: true, data: record });
    console.log(`Imported draft: ${project.slug}`);
  }
  if (replace) {
    const settings: Partial<typeof STUDIO_INFO> = {};
    for (const key of Object.keys(STUDIO_INFO) as (keyof typeof STUDIO_INFO)[]) {
      if (typeof data.settings[key] === 'string') settings[key] = data.settings[key] as string;
    }
    const logo = typeof data.settings.customLogoUrl === 'string' && data.settings.customLogoUrl ? await image(data.settings.customLogoUrl, 'Petta Studio') : undefined;
    await payload.updateGlobal({ slug: 'siteSettings', data: { ...settings, ...(logo?.media ? { logo: logo.media } : {}) } });
  }
  console.log('Import complete. Publish reviewed project drafts in /admin. Browser data was not modified.');
} finally { await payload.destroy(); }
process.exit(0);
