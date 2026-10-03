import test from 'node:test';
import assert from 'node:assert/strict';
import { parse } from 'pg-connection-string';
import { sanitizeDatabaseUri, getDatabaseConfig } from '../src/lib/db-config';

test('sanitizeDatabaseUri normalizes Neon sslmode=require to verify-full without deprecation warning', (t) => {
  const warnings: string[] = [];
  const onWarning = (warning: Error) => {
    warnings.push(warning.message);
  };
  process.on('warning', onWarning);

  t.after(() => {
    process.off('warning', onWarning);
  });

  const neonRequire = 'postgresql://user:pass@ep-cool-fog-123456.us-east-2.aws.neon.tech/neondb?sslmode=require';
  const sanitized = sanitizeDatabaseUri(neonRequire);

  assert.equal(
    sanitized,
    'postgresql://user:pass@ep-cool-fog-123456.us-east-2.aws.neon.tech/neondb?sslmode=verify-full'
  );

  // Parsing the sanitized URI with pg-connection-string must NOT emit any warning
  const parsed = parse(sanitized);
  assert.equal(parsed.sslmode, 'verify-full');
  assert.deepEqual(parsed.ssl, {});
  assert.equal(warnings.length, 0, 'No security deprecation warnings should be emitted');
});

test('sanitizeDatabaseUri preserves verify-full and enforces it on remote connections', () => {
  const remoteAlreadyVerifyFull = 'postgresql://user:pass@ep-123.ap-southeast-1.aws.neon.tech/neondb?sslmode=verify-full';
  assert.equal(sanitizeDatabaseUri(remoteAlreadyVerifyFull), remoteAlreadyVerifyFull);

  const remoteNoParam = 'postgresql://user:pass@ep-123.ap-southeast-1.aws.neon.tech/neondb';
  assert.equal(
    sanitizeDatabaseUri(remoteNoParam),
    'postgresql://user:pass@ep-123.ap-southeast-1.aws.neon.tech/neondb?sslmode=verify-full'
  );

  const remoteWithQuotes = ' "postgresql://user:pass@ep-123.ap-southeast-1.aws.neon.tech/neondb?sslmode=require" ';
  assert.equal(
    sanitizeDatabaseUri(remoteWithQuotes),
    'postgresql://user:pass@ep-123.ap-southeast-1.aws.neon.tech/neondb?sslmode=verify-full'
  );
});

test('sanitizeDatabaseUri leaves local connections unencrypted', () => {
  const localIp = 'postgresql://petta:pass@127.0.0.1:55432/petta';
  assert.equal(sanitizeDatabaseUri(localIp), localIp);

  const localhost = 'postgresql://petta:pass@localhost:5432/petta';
  assert.equal(sanitizeDatabaseUri(localhost), localhost);

  assert.equal(sanitizeDatabaseUri(''), '');
  assert.equal(sanitizeDatabaseUri(undefined), '');
});

test('getDatabaseConfig returns correct pool options for local vs remote', () => {
  const local = getDatabaseConfig('postgresql://petta:pass@127.0.0.1:55432/petta');
  assert.equal(local.isLocal, true);
  assert.equal(local.ssl, false);

  const remote = getDatabaseConfig('postgresql://user:pass@ep-123.aws.neon.tech/neondb?sslmode=require');
  assert.equal(remote.isLocal, false);
  assert.equal(remote.ssl, undefined);
  assert.ok(remote.connectionString.includes('sslmode=verify-full'));
});

test('Neon runtime uses the same endpoint through its pooler and preserves credentials and options', () => {
  const raw = 'postgresql://user:p%40ss@ep-cool-fog-123.us-east-2.aws.neon.tech/neondb?sslmode=verify-full&connect_timeout=10';
  const pooled = new URL(getDatabaseConfig(raw).connectionString);
  const original = new URL(raw);
  assert.equal(pooled.hostname, 'ep-cool-fog-123-pooler.us-east-2.aws.neon.tech');
  for (const key of ['username', 'password', 'pathname', 'search', 'port'] as const) assert.equal(pooled[key], original[key]);
  assert.equal(getDatabaseConfig(pooled.href).connectionString, pooled.href);
  for (const host of ['localhost', '127.0.0.1', 'db.example.com', 'ep-test.neon.tech.example.com']) {
    assert.equal(new URL(getDatabaseConfig(`postgresql://u:p@${host}/petta`).connectionString).hostname, host);
  }
});
