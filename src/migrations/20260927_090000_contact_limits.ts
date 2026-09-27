import { sql, type MigrateUpArgs, type MigrateDownArgs } from '@payloadcms/db-postgres';
export async function up({ db }: MigrateUpArgs) {
  await db.execute(sql`CREATE TABLE IF NOT EXISTS petta_contact_limits (
    key text PRIMARY KEY, count integer NOT NULL, expires_at timestamptz NOT NULL
  ); CREATE INDEX IF NOT EXISTS petta_contact_limits_expiry ON petta_contact_limits (expires_at);`);
}
export async function down({ db }: MigrateDownArgs) { await db.execute(sql`DROP TABLE IF EXISTS petta_contact_limits;`); }
