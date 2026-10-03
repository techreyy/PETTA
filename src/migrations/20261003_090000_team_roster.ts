import type { MigrateUpArgs } from '@payloadcms/db-postgres';
import { TEAM_ROSTER } from '../lib/team-roster';

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  for (const [order, member] of TEAM_ROSTER.entries()) {
    const existing = await payload.find({
      collection: 'team', depth: 0, pagination: false, req,
      where: { name: { in: [member.name, member.previousName].filter(Boolean) } },
    });
    const current = existing.docs.find((doc) => doc.name === member.previousName)
      || existing.docs.find((doc) => doc.active) || existing.docs[0];
    const data = { name: member.name, roleTitle: member.role, order, active: true };
    if (current) {
      await payload.update({ collection: 'team', id: current.id, req, data: {
        ...data,
        ...(current.name === member.previousName && current.roleTitle !== member.role ? { bio: '' } : {}),
      } });
      for (const duplicate of existing.docs.filter((doc) => doc.id !== current.id)) {
        await payload.update({ collection: 'team', id: duplicate.id, req, data: { active: false } });
      }
    } else {
      await payload.create({ collection: 'team', req, data });
    }
  }
  // Keep the superseded demo profile available in the CMS without assuming identity.
  await payload.update({ collection: 'team', req, where: { name: { equals: 'Pratama Juna' } }, data: { active: false } });
  const settings = await payload.findGlobal({ slug: 'siteSettings', req });
  if (settings.founder === TEAM_ROSTER[0].previousName) {
    await payload.updateGlobal({ slug: 'siteSettings', req, data: { founder: TEAM_ROSTER[0].name } });
  }
}

export async function down(): Promise<void> {
  // Preserve owner-approved content and any subsequent CMS edits.
}
