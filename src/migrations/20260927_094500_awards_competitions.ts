import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "awards" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "year" varchar NOT NULL,
      "issuer" varchar NOT NULL,
      "category" varchar NOT NULL,
      "project" varchar NOT NULL,
      "description" varchar NOT NULL,
      "order" numeric DEFAULT 0,
      "active" boolean DEFAULT true,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "competitions" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "year" varchar NOT NULL,
      "achievement" varchar NOT NULL,
      "organizer" varchar NOT NULL,
      "location" varchar NOT NULL,
      "description" varchar NOT NULL,
      "order" numeric DEFAULT 0,
      "active" boolean DEFAULT true,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "awards_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "competitions_id" integer;

    CREATE INDEX IF NOT EXISTS "awards_updated_at_idx" ON "awards" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "awards_created_at_idx" ON "awards" USING btree ("created_at");

    CREATE INDEX IF NOT EXISTS "competitions_updated_at_idx" ON "competitions" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "competitions_created_at_idx" ON "competitions" USING btree ("created_at");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "awards" CASCADE;
    DROP TABLE IF EXISTS "competitions" CASCADE;
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "awards_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "competitions_id";
  `);
}
