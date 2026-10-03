import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Additive only: @payloadcms/plugin-cloud-storage (via @payloadcms/storage-s3 clientUploads)
 * injects a hidden `_objectKey` text field into `media`; Payload maps it to column `_objectkey`.
 * Idempotent (IF NOT EXISTS) and non-destructive. The legacy focal_x/focal_y/sizes_* columns
 * are intentionally left in place so no existing data is dropped.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "_objectkey" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" DROP COLUMN IF EXISTS "_objectkey";`)
}
