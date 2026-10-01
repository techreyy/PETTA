import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_brand_logos_group" AS ENUM('client', 'collaborator', 'media');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE TABLE IF NOT EXISTS "brand_logos" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "group" "enum_brand_logos_group" NOT NULL,
      "logo_id" integer NOT NULL,
      "alt" varchar NOT NULL,
      "url" varchar,
      "order" numeric DEFAULT 0,
      "active" boolean DEFAULT false,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "brand_logos_id" integer;

    DO $$ BEGIN
      ALTER TABLE "brand_logos" ADD CONSTRAINT "brand_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "brand_logos_logo_idx" ON "brand_logos" USING btree ("logo_id");
    CREATE INDEX IF NOT EXISTS "brand_logos_updated_at_idx" ON "brand_logos" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "brand_logos_created_at_idx" ON "brand_logos" USING btree ("created_at");

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_brand_logos_fk" FOREIGN KEY ("brand_logos_id") REFERENCES "public"."brand_logos"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_brand_logos_id_idx" ON "payload_locked_documents_rels" USING btree ("brand_logos_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "brand_logos" CASCADE;
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_brand_logos_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_brand_logos_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "brand_logos_id";
    DROP TYPE IF EXISTS "public"."enum_brand_logos_group";
  `);
}

