import { spawn } from 'node:child_process';
import { Pool } from 'pg';

if (!process.env.DATABASE_URI) throw new Error('Configure PostgreSQL in .env.local before running tests.');
const pool = new Pool({ connectionString: process.env.DATABASE_URI });
const name = `petta_test_${Date.now()}`;
await pool.query(`CREATE DATABASE "${name}"`);
const uri = new URL(process.env.DATABASE_URI);
uri.pathname = `/${name}`;
let code = 1;
try {
  code = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['--import', 'tsx', '--test', '--test-force-exit', 'tests/inquiry-validation.test.ts', 'tests/cms.test.ts'], {
      stdio: 'inherit', env: { ...process.env, DATABASE_URI: uri.href, PETTA_TEST_DATABASE: name, PAYLOAD_MIGRATING: 'true' }, windowsHide: true,
    });
    child.on('error', reject);
    child.on('exit', value => resolve(value ?? 1));
  });
} finally {
  // The child has exited, so no CMS connection can reconnect to this disposable database.
  if (!/^petta_test_\d+$/.test(name)) throw new Error('Refusing to remove an unexpected database.');
  await pool.query(`DROP DATABASE "${name}"`);
  await pool.end();
}
process.exitCode = code;
