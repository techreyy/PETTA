import EmbeddedPostgres from 'embedded-postgres';
import { randomBytes } from 'node:crypto';
import { existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const envFile = resolve('.env.local');
if (!existsSync(envFile)) {
  const password = randomBytes(24).toString('hex');
  writeFileSync(envFile, [
    `DATABASE_URI=postgresql://petta:${password}@127.0.0.1:55432/petta`,
    `PAYLOAD_SECRET=${randomBytes(48).toString('hex')}`,
    'NEXT_PUBLIC_SITE_URL=http://localhost:3000',
    'BOOTSTRAP_OWNER_EMAIL=pettadesain@gmail.com',
    `BOOTSTRAP_OWNER_PASSWORD=${randomBytes(24).toString('base64url')}`,
    '',
  ].join('\n'), { mode: 0o600, flag: 'wx' });
  console.log('Local server configuration created in .env.local (secrets are not printed).');
}
process.loadEnvFile(envFile);
const uri = new URL(process.env.DATABASE_URI);
if (uri.hostname !== '127.0.0.1' || uri.port !== '55432') {
  throw new Error('Local runner requires 127.0.0.1:55432. Use your configured external PostgreSQL directly.');
}
mkdirSync('.local', { recursive: true });
const databaseDir = resolve('.local/postgres');
const pg = new EmbeddedPostgres({ databaseDir, port: 55432, user: decodeURIComponent(uri.username), password: decodeURIComponent(uri.password),
  authMethod: 'scram-sha-256', persistent: true, postgresFlags: ['-h', '127.0.0.1'],
  onLog: () => {}, onError: (message) => { if (String(message).includes('FATAL')) console.error(String(message)); },
});
if (!existsSync(resolve(databaseDir, 'PG_VERSION'))) await pg.initialise();
await pg.start();
const client = pg.getPgClient();
await client.connect();
const name = uri.pathname.slice(1);
if (!/^[a-z][a-z0-9_]*$/.test(name)) throw new Error('Invalid local database name.');
const existing = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [name]);
if (!existing.rowCount) await pg.createDatabase(name);
await client.end();
console.log('PostgreSQL ready on 127.0.0.1:55432. Keep this terminal running.');
const stop = async () => { await pg.stop(); process.exit(0); };
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
// Keep the parent alive; PostgreSQL data survives shutdown.
setInterval(() => {}, 60000);
