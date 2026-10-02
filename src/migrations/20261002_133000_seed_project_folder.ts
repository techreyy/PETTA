import { MigrateUpArgs } from '@payloadcms/db-postgres';
import {
  PORTFOLIO_CATEGORIES,
  PROJECTS,
  STUDIO_SERVICES,
  STUDIO_TEAM,
  STUDIO_AWARDS,
  STUDIO_COMPETITIONS,
  NEWS_ITEMS,
  STUDIO_INFO,
} from '../lib/data';

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  payload.logger.info({ msg: 'Seeding portfolio categories and projects into database...' });

  const categoryIds = new Map<string, number>();

  // 1. Seed all 11 Categories
  for (const [order, category] of PORTFOLIO_CATEGORIES.entries()) {
    try {
      const existing = await payload.find({
        collection: 'portfolioCategories',
        where: { slug: { equals: category.slug } },
        limit: 1,
        req,
      });

      if (existing.docs[0]) {
        categoryIds.set(category.slug, Number(existing.docs[0].id));
      } else {
        const created = await payload.create({
          collection: 'portfolioCategories',
          data: {
            title: category.title,
            slug: category.slug,
            description: category.description,
            coverImageUrl: category.coverImage,
            order,
            active: true,
          },
          req,
        });
        categoryIds.set(category.slug, Number(created.id));
      }
    } catch (err: unknown) {
      payload.logger.warn({ msg: `Failed to seed category ${category.title}: ${getErrorMessage(err)}` });
    }
  }

  // 2. Seed all 15 Projects
  for (const [order, project] of PROJECTS.entries()) {
    try {
      const existing = await payload.find({
        collection: 'projects',
        where: { slug: { equals: project.slug } },
        limit: 1,
        req,
      });

      if (!existing.docs[0]) {
        const catId = categoryIds.get(project.categorySlug) || 1;
        await payload.create({
          collection: 'projects',
          draft: false,
          data: {
            title: project.title,
            slug: project.slug,
            category: catId,
            location: project.location || '',
            year: project.year || '',
            status: project.status || '',
            architectInCharge: project.architectInCharge || '',
            siteArea: project.siteArea || '',
            constructedArea: project.constructedArea || '',
            stories: project.stories || '',
            shortIntro: project.shortIntro || '',
            description: (project.description || []).map((paragraph) => ({ paragraph })),
            heroImageUrl: project.heroImage || '',
            gallery: (project.gallery || []).map((imageUrl) => ({ imageUrl })),
            featured: Boolean(project.featured),
            order: order + 1,
            _status: 'published',
          },
          req,
        });
      }
    } catch (err: unknown) {
      payload.logger.warn({ msg: `Failed to seed project ${project.title}: ${getErrorMessage(err)}` });
    }
  }

  // 3. Seed all 7 Services
  for (const [idx, service] of STUDIO_SERVICES.entries()) {
    try {
      const existing = await payload.find({
        collection: 'services',
        where: { title: { equals: service.title } },
        limit: 1,
        req,
      });

      if (!existing.docs[0]) {
        await payload.create({
          collection: 'services',
          data: {
            title: service.title,
            description: service.desc,
            order: idx + 1,
            active: true,
          },
          req,
        });
      }
    } catch (err: unknown) {
      payload.logger.warn({ msg: `Failed to seed service ${service.title}: ${getErrorMessage(err)}` });
    }
  }

  // 4. Seed Studio Team
  for (const [order, member] of STUDIO_TEAM.entries()) {
    try {
      const existing = await payload.find({
        collection: 'team',
        where: { name: { equals: member.name } },
        limit: 1,
        req,
      });

      if (!existing.docs[0]) {
        await payload.create({
          collection: 'team',
          data: {
            name: member.name,
            roleTitle: member.role,
            portraitUrl: member.portrait,
            bio: member.bio,
            instagram: member.instagram,
            order,
            active: true,
          },
          req,
        });
      }
    } catch (err: unknown) {
      payload.logger.warn({ msg: `Failed to seed team ${member.name}: ${getErrorMessage(err)}` });
    }
  }

  // 5. Seed Awards
  for (const [order, award] of STUDIO_AWARDS.entries()) {
    try {
      const existing = await payload.find({
        collection: 'awards',
        where: { title: { equals: award.title } },
        limit: 1,
        req,
      });

      if (!existing.docs[0]) {
        await payload.create({
          collection: 'awards',
          data: {
            title: award.title,
            year: award.year,
            issuer: award.issuer,
            category: award.category,
            project: award.project,
            description: award.description,
            order,
            active: true,
          },
          req,
        });
      }
    } catch (err: unknown) {
      payload.logger.warn({ msg: `Failed to seed award ${award.title}: ${getErrorMessage(err)}` });
    }
  }

  // 6. Seed Competitions
  for (const [order, comp] of STUDIO_COMPETITIONS.entries()) {
    try {
      const existing = await payload.find({
        collection: 'competitions',
        where: { title: { equals: comp.title } },
        limit: 1,
        req,
      });

      if (!existing.docs[0]) {
        await payload.create({
          collection: 'competitions',
          data: {
            title: comp.title,
            year: comp.year,
            achievement: comp.achievement,
            organizer: comp.organizer,
            location: comp.location,
            description: comp.description,
            order,
            active: true,
          },
          req,
        });
      }
    } catch (err: unknown) {
      payload.logger.warn({ msg: `Failed to seed competition ${comp.title}: ${getErrorMessage(err)}` });
    }
  }

  // 7. Seed News
  for (const item of NEWS_ITEMS) {
    try {
      const existing = await payload.find({
        collection: 'news',
        where: { slug: { equals: item.slug } },
        limit: 1,
        req,
      });

      if (!existing.docs[0]) {
        await payload.create({
          collection: 'news',
          draft: false,
          data: {
            title: item.title,
            slug: item.slug,
            date: item.date,
            category: item.category,
            excerpt: item.excerpt,
            coverImageUrl: item.coverImage,
            _status: 'published',
          },
          req,
        });
      }
    } catch (err: unknown) {
      payload.logger.warn({ msg: `Failed to seed news ${item.title}: ${getErrorMessage(err)}` });
    }
  }

  // 8. Seed Site Settings
  try {
    const settings = await payload.findGlobal({ slug: 'siteSettings', req });
    if (!settings?.createdAt) {
      await payload.updateGlobal({
        slug: 'siteSettings',
        data: STUDIO_INFO,
        req,
      });
    }
  } catch (err: unknown) {
    payload.logger.warn({ msg: `Failed to seed siteSettings: ${getErrorMessage(err)}` });
  }

  payload.logger.info({ msg: 'Seed migration completed successfully.' });
}

export async function down(): Promise<void> {
  // Irreversible seed migration - preserving user edits
}
