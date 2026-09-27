import { getPayload } from 'payload';
import config from '../src/payload.config';
import { PROJECTS, PORTFOLIO_CATEGORIES, NEWS_ITEMS, STUDIO_INFO, STUDIO_TEAM } from '../src/lib/data';

const payload = await getPayload({ config });
try {
  const users = await payload.count({ collection: 'users' });
  if (!users.totalDocs) {
    const email = process.env.BOOTSTRAP_OWNER_EMAIL;
    const password = process.env.BOOTSTRAP_OWNER_PASSWORD;
    if (!email || !password || password.length < 16) throw new Error('Set BOOTSTRAP_OWNER_EMAIL and a password of at least 16 characters in .env.local.');
    await payload.create({ collection: 'users', overrideAccess: true, context: { bootstrapOwner: true }, data: { name: 'Petta Studio Owner', email, password, role: 'owner', active: true } });
    console.log('Owner created. Credentials remain in .env.local; no password was logged.');
  }
  const categoryIds = new Map<string, number>();
  for (const [order, category] of PORTFOLIO_CATEGORIES.entries()) {
    const existing = await payload.find({ collection: 'portfolioCategories', where: { slug: { equals: category.slug } }, limit: 1 });
    const doc = existing.docs[0] || await payload.create({ collection: 'portfolioCategories', data: { title: category.title, slug: category.slug, description: category.description, coverImageUrl: category.coverImage, order, active: true } });
    categoryIds.set(category.slug, doc.id);
  }
  for (const [order, project] of PROJECTS.entries()) {
    const existing = await payload.count({ collection: 'projects', where: { slug: { equals: project.slug } } });
    if (existing.totalDocs) continue;
    const { id, categorySlug, category: _category, heroImage, gallery, description, ...data } = project;
    void _category;
    await payload.create({ collection: 'projects', data: { ...data, legacyId: id, category: categoryIds.get(categorySlug)!, heroImageUrl: heroImage,
      gallery: gallery.map(imageUrl => ({ imageUrl })), description: description.map(paragraph => ({ paragraph })), order, _status: 'published' } });
  }
  for (const item of NEWS_ITEMS) {
    const existing = await payload.count({ collection: 'news', where: { slug: { equals: item.slug } } });
    if (!existing.totalDocs) {
      const { id: _id, coverImage, ...data } = item;
      void _id;
      await payload.create({ collection: 'news', data: { ...data, coverImageUrl: coverImage, _status: 'published' } });
    }
  }
  const settings = await payload.findGlobal({ slug: 'siteSettings' });
  for (const [order, member] of STUDIO_TEAM.entries()) {
    const existing = await payload.count({ collection: 'team', where: { name: { equals: member.name } } });
    if (!existing.totalDocs) await payload.create({ collection: 'team', data: { name: member.name, roleTitle: member.role, portraitUrl: member.portrait, bio: member.bio, instagram: member.instagram, order, active: true } });
  }
  if (!settings.createdAt) await payload.updateGlobal({ slug: 'siteSettings', data: STUDIO_INFO });
  console.log('Seed complete. Existing content was not overwritten.');
} finally { await payload.destroy(); }
process.exit(0);
