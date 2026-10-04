import { sql, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { DEFAULT_HOMEPAGE_CONTENT as copy } from '../lib/homepage-content';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "homepage_content" (
      "id" serial PRIMARY KEY NOT NULL,
      "eyebrow" varchar NOT NULL,
      "services" varchar NOT NULL,
      "headline" varchar NOT NULL,
      "left_paragraph" varchar NOT NULL,
      "right_paragraph" varchar NOT NULL,
      "founder_name" varchar NOT NULL,
      "cta_label" varchar NOT NULL,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );
  `);
  await db.execute(sql`
    INSERT INTO "homepage_content" ("eyebrow", "services", "headline", "left_paragraph", "right_paragraph", "founder_name", "cta_label", "updated_at", "created_at")
    SELECT ${copy.eyebrow}, ${copy.services}, ${copy.headline}, ${copy.leftParagraph}, ${copy.rightParagraph}, ${copy.founderName}, ${copy.ctaLabel}, now(), now()
    WHERE NOT EXISTS (SELECT 1 FROM "homepage_content");
  `);
}

export async function down(): Promise<void> {
  // Keep the additive table and all owner-edited content on rollback.
}
