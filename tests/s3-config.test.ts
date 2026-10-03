import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeS3Config,
  isS3Configured,
  getMissingS3Vars,
  maskCredential,
  createSafeS3Logger,
} from '../src/lib/s3-config';

test('normalizeS3Config cleans and validates Cloudflare R2 parameters', () => {
  const cfg = normalizeS3Config({
    S3_BUCKET: ' petta-media ',
    S3_ENDPOINT: ' account123.r2.cloudflarestorage.com/petta-media/ ',
    S3_REGION: ' ',
    S3_ACCESS_KEY_ID: ' "abc123key" ',
    S3_SECRET_ACCESS_KEY: " 'secret456key' ",
  });

  assert.equal(cfg.bucket, 'petta-media');
  assert.equal(cfg.endpoint, 'https://account123.r2.cloudflarestorage.com');
  assert.equal(cfg.region, 'auto');
  assert.equal(cfg.accessKeyId, 'abc123key');
  assert.equal(cfg.secretAccessKey, 'secret456key');
  assert.equal(cfg.forcePathStyle, true, 'Cloudflare R2 strictly requires forcePathStyle: true');
  assert.equal(isS3Configured(cfg), true);
  assert.deepEqual(getMissingS3Vars(cfg), []);
});

test('getMissingS3Vars identifies missing required credentials', () => {
  const missingAll = normalizeS3Config({});
  assert.equal(isS3Configured(missingAll), false);
  assert.deepEqual(getMissingS3Vars(missingAll), [
    'S3_BUCKET',
    'S3_ENDPOINT',
    'S3_ACCESS_KEY_ID',
    'S3_SECRET_ACCESS_KEY',
  ]);

  const missingSecret = normalizeS3Config({
    S3_BUCKET: 'bucket',
    S3_ENDPOINT: 'https://acc.r2.cloudflarestorage.com',
    S3_ACCESS_KEY_ID: 'key',
  });
  assert.deepEqual(getMissingS3Vars(missingSecret), ['S3_SECRET_ACCESS_KEY']);
});

test('maskCredential masks tokens without exposing full secret', () => {
  assert.equal(maskCredential(''), '<empty>');
  assert.equal(maskCredential('1234'), '***');
  assert.equal(maskCredential('1234567890abcdef'), '1234...cdef');
});

test('createSafeS3Logger safely reports errors without leaking secrets', () => {
  const errors: string[] = [];
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    errors.push(args.map(String).join(' '));
  };

  try {
    const logger = createSafeS3Logger();
    logger.error({
      commandName: 'PutObjectCommand',
      input: {
        Bucket: 'petta-media',
        Key: 'projects/hero.webp',
      },
      error: {
        name: 'AccessDenied',
        message: 'Access Denied',
        $metadata: { httpStatusCode: 403, requestId: 'req-123' },
      },
    });

    assert.equal(errors.length, 1);
    assert.ok(errors[0].includes('Command=PutObjectCommand'));
    assert.ok(errors[0].includes('Bucket=petta-media'));
    assert.ok(errors[0].includes('Key=projects/hero.webp'));
    assert.ok(errors[0].includes('AccessDenied: Access Denied'));
    assert.ok(errors[0].includes('HTTP 403'));
    assert.ok(errors[0].includes('RequestId=req-123'));
    assert.ok(!errors[0].includes('secret'), 'Must never print secrets');
  } finally {
    console.error = originalError;
  }
});
