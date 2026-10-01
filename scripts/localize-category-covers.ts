import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { getPayload } from 'payload';
import sharp from 'sharp';
import config from '../src/payload.config';

// Preserve legacy category artwork while removing a runtime dependency on Unsplash.
const payload = await getPayload({ config });
try {
  const { docs } = await payload.find({ collection: 'portfolioCategories', pagination: false, depth: 0 });
  const pending = docs.filter(category => !category.coverImage && category.coverImageUrl?.startsWith('https://images.unsplash.com/'));
  await mkdir('.cache', { recursive: true });
  await writeFile(`.cache/category-covers-backup-${Date.now()}.json`, JSON.stringify(pending, null, 2));
  await mkdir('public/category-covers', { recursive: true });
  for (const category of pending) {
    const url = category.coverImageUrl!;
    const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
    if (!response.ok) throw new Error(`Cover download failed for ${category.slug}: ${response.status}`);
    const image = await sharp(Buffer.from(await response.arrayBuffer())).rotate().resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
    const name = `${createHash('sha256').update(url).digest('hex').slice(0, 16)}.webp`;
    await writeFile(`public/category-covers/${name}`, image);
    await payload.update({ collection: 'portfolioCategories', id: category.id, data: { coverImageUrl: `/category-covers/${name}` } });
    console.log(`${category.slug}: ${Math.round(image.length / 1024)} KB, localized`);
  }
  console.log(`Localized ${pending.length} category covers. Uploaded covers are preserved.`);
} finally {
  await payload.destroy();
}
process.exit(0);
