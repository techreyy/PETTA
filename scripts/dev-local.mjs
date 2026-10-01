import { spawn } from 'node:child_process';
import { Pool } from 'pg';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { startLocalSession } from './dev-local-runtime.mjs';

const envFile = resolve('.env.local');
if (existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

async function probe() {
  const uri = process.env.DATABASE_URI || 'postgresql://petta@127.0.0.1:55432/petta';
  const pool = new Pool({ connectionString: uri, connectionTimeoutMillis: 1000 });
  try {
    const res = await pool.query('SELECT 1');
    await pool.end();
    return res.rowCount ? 'ready' : 'busy';
  } catch (err) {
    await pool.end().catch(() => {});
    if (err && (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT')) return 'stopped';
    return 'busy';
  }
}

async function startDatabase() {
  const child = spawn(process.execPath, ['scripts/local-db.mjs'], {
    stdio: 'inherit',
    windowsHide: true,
  });
  return {
    stop: async () => {
      child.kill('SIGTERM');
    },
  };
}

async function startDev() {
  const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '-p', '3000'], {
    stdio: 'inherit',
    windowsHide: true,
  });
  return {
    stop: async () => {
      child.kill('SIGTERM');
    },
  };
}

const session = await startLocalSession({
  probe,
  startDatabase,
  startDev,
  timeoutMs: 30000,
});

process.on('SIGINT', async () => {
  await session.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await session.stop();
  process.exit(0);
});
