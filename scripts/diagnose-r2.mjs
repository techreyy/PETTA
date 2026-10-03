#!/usr/bin/env node
/**
 * One-time diagnostic script to test Cloudflare R2 connectivity and operations.
 * Tests sequentially:
 * 1. HeadBucket
 * 2. PutObject (key: diagnostics/test.txt)
 * 3. HeadObject
 * 4. GetObject
 * 5. DeleteObject
 *
 * Safe: NEVER prints secrets, access keys, authorization headers, or credentials.
 */

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  S3Client,
  HeadBucketCommand,
  PutObjectCommand,
  HeadObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

// Attempt to load environment files if present
for (const envFile of ['.env.production', '.env.local', '.env']) {
  const fullPath = resolve(envFile);
  if (existsSync(fullPath)) {
    try {
      process.loadEnvFile(fullPath);
    } catch {
      // ignore
    }
  }
}

// Normalize configuration matching application logic in src/lib/s3-config.ts
const rawBucket = (process.env.S3_BUCKET || 'petta-media').trim().replace(/^["']|["']$/g, '');
let rawEndpoint = (process.env.S3_ENDPOINT || '').trim().replace(/^["']|["']$/g, '');

if (rawEndpoint) {
  if (!rawEndpoint.startsWith('http://') && !rawEndpoint.startsWith('https://')) {
    rawEndpoint = `https://${rawEndpoint}`;
  }
  rawEndpoint = rawEndpoint.replace(/\/+$/, '');
  if (rawBucket && rawEndpoint.endsWith(`/${rawBucket}`)) {
    rawEndpoint = rawEndpoint.slice(0, -(rawBucket.length + 1)).replace(/\/+$/, '');
  }
}

const rawRegion = (process.env.S3_REGION || 'auto').trim().replace(/^["']|["']$/g, '') || 'auto';
const rawAccessKeyId = (process.env.S3_ACCESS_KEY_ID || '').trim().replace(/^["']|["']$/g, '');
const rawSecretAccessKey = (process.env.S3_SECRET_ACCESS_KEY || '').trim().replace(/^["']|["']$/g, '');

function mask(str, visible = 4) {
  if (!str) return '<UNSET>';
  if (str.length <= visible * 2) return '***';
  return `${str.slice(0, visible)}...${str.slice(-visible)} (len=${str.length})`;
}

console.log('====================================================');
console.log('      CLOUDFLARE R2 S3 DIAGNOSTIC TEST SUITE        ');
console.log('====================================================\n');

console.log('--- Configuration Diagnostic ---');
console.log('S3_BUCKET:            ', rawBucket || '<UNSET>');
console.log('S3_ENDPOINT:          ', rawEndpoint || '<UNSET>');
console.log('S3_REGION:            ', rawRegion);
console.log('S3_ACCESS_KEY_ID:     ', mask(rawAccessKeyId));
console.log('S3_SECRET_ACCESS_KEY: ', rawSecretAccessKey ? `<CONFIGURED, len=${rawSecretAccessKey.length}>` : '<UNSET>');
console.log('forcePathStyle:        true (enforced for Cloudflare R2)\n');

const missing = [];
if (!rawBucket) missing.push('S3_BUCKET');
if (!rawEndpoint) missing.push('S3_ENDPOINT');
if (!rawAccessKeyId) missing.push('S3_ACCESS_KEY_ID');
if (!rawSecretAccessKey) missing.push('S3_SECRET_ACCESS_KEY');

if (missing.length > 0) {
  console.error('ERROR: Missing required environment variable(s):');
  for (const m of missing) {
    console.error(`  - ${m}`);
  }
  console.error('\nSilakan set environment variable berikut sebelum menjalankan script:');
  console.error('  export S3_BUCKET="petta-media"');
  console.error('  export S3_ENDPOINT="https://<ACCOUNT_ID>.r2.cloudflarestorage.com"');
  console.error('  export S3_REGION="auto"');
  console.error('  export S3_ACCESS_KEY_ID="<R2_ACCESS_KEY_ID>"');
  console.error('  export S3_SECRET_ACCESS_KEY="<R2_SECRET_ACCESS_KEY>"');
  console.error('\nAtau jalankan inline:');
  console.error('  S3_BUCKET="..." S3_ENDPOINT="..." S3_REGION="auto" S3_ACCESS_KEY_ID="..." S3_SECRET_ACCESS_KEY="..." node scripts/diagnose-r2.mjs');
  process.exit(1);
}

const client = new S3Client({
  endpoint: rawEndpoint,
  region: rawRegion,
  forcePathStyle: true,
  credentials: {
    accessKeyId: rawAccessKeyId,
    secretAccessKey: rawSecretAccessKey,
  },
});

const testKey = 'diagnostics/test.txt';
const results = [];

async function runStep(stepNumber, commandName, executeFn) {
  const startTime = Date.now();
  try {
    const res = await executeFn();
    const duration = Date.now() - startTime;
    const httpStatus = res?.$metadata?.httpStatusCode || 200;
    const requestId = res?.$metadata?.requestId || 'N/A';

    console.log(`[Step ${stepNumber}] SUCCESS - ${commandName}`);
    console.log(`  HTTP status: ${httpStatus}`);
    console.log(`  requestId:   ${requestId}`);
    console.log(`  duration:    ${duration}ms\n`);

    results.push({
      step: stepNumber,
      command: commandName,
      status: 'SUCCESS',
      httpStatus,
      requestId,
      duration,
    });
    return { success: true, res };
  } catch (err) {
    const duration = Date.now() - startTime;
    const httpStatus = err?.$metadata?.httpStatusCode || err?.statusCode || 'N/A';
    const requestId = err?.$metadata?.requestId || 'N/A';
    const errorName = err?.name || 'Error';
    const errorMessage = err?.message || String(err);

    console.log(`[Step ${stepNumber}] FAILED - ${commandName}`);
    console.log(`  error.name:    ${errorName}`);
    console.log(`  error.message: ${errorMessage}`);
    console.log(`  HTTP status:   ${httpStatus}`);
    console.log(`  requestId:     ${requestId}`);
    console.log(`  duration:      ${duration}ms\n`);

    results.push({
      step: stepNumber,
      command: commandName,
      status: 'FAILED',
      errorName,
      errorMessage,
      httpStatus,
      requestId,
      duration,
    });
    return { success: false, err };
  }
}

async function main() {
  console.log('--- Executing S3 Operations in Sequence ---\n');

  // 1. HeadBucket
  await runStep(1, 'HeadBucketCommand', () =>
    client.send(new HeadBucketCommand({ Bucket: rawBucket }))
  );

  // 2. PutObject
  await runStep(2, 'PutObjectCommand', () =>
    client.send(
      new PutObjectCommand({
        Bucket: rawBucket,
        Key: testKey,
        Body: Buffer.from(`Cloudflare R2 Diagnostic Check - ${new Date().toISOString()}`),
        ContentType: 'text/plain',
      })
    )
  );

  // 3. HeadObject
  await runStep(3, 'HeadObjectCommand', () =>
    client.send(new HeadObjectCommand({ Bucket: rawBucket, Key: testKey }))
  );

  // 4. GetObject
  await runStep(4, 'GetObjectCommand', () =>
    client.send(new GetObjectCommand({ Bucket: rawBucket, Key: testKey }))
  );

  // 5. DeleteObject
  await runStep(5, 'DeleteObjectCommand', () =>
    client.send(new DeleteObjectCommand({ Bucket: rawBucket, Key: testKey }))
  );

  console.log('====================================================');
  console.log('               DIAGNOSTIC SUMMARY                   ');
  console.log('====================================================\n');

  const failedSteps = results.filter((r) => r.status === 'FAILED');

  if (failedSteps.length === 0) {
    console.log('STATUS: SEMUA OPERASI SUKSES (5/5 PASS)');
    console.log('Konfigurasi Cloudflare R2 Anda 100% valid dan berfungsi dengan baik.');
    console.log('Bucket "petta-media" dapat diakses, ditulis, dibaca, dan dihapus tanpa kendala.');
    process.exit(0);
  }

  console.log(`STATUS: ${failedSteps.length} OPERASI GAGAL\n`);

  // Analyze specific root causes
  console.log('--- Analisis Akar Masalah Spesifik ---');

  const headBucketFail = results.find((r) => r.command === 'HeadBucketCommand' && r.status === 'FAILED');
  const putObjectFail = results.find((r) => r.command === 'PutObjectCommand' && r.status === 'FAILED');

  if (headBucketFail && !putObjectFail) {
    console.log('1. KASUS KHUSUS: HeadBucket GAGAL, tapi PutObject BERHASIL');
    console.log('   Penyebab: Cloudflare R2 API Token dibuat dengan permission "Object Read & Write".');
    console.log('   Penjelasan: Token ini hanya memiliki hak akses level objek (membaca dan mengunggah file),');
    console.log('   tetapi tidak memiliki hak akses level bucket (melihat metadata bucket / HeadBucket).');
    console.log('   Dampak pada Payload CMS: Upload sebenarnya TETAP AKAN BERJALAN, karena Payload CMS hanya');
    console.log('   menggunakan PutObjectCommand saat upload.');
    console.log('   Solusi opsional: Buat token R2 baru dengan template "Admin Read & Write" jika ingin');
    console.log('   HeadBucket juga diizinkan.');
  }

  if (putObjectFail) {
    const err = putObjectFail;
    const name = err.errorName || '';
    const msg = (err.errorMessage || '').toLowerCase();
    const status = err.httpStatus;

    if (status === 403 || name === 'AccessDenied' || msg.includes('access denied')) {
      console.log('1. AKAR MASALAH: TOKEN PERMISSION ATAU BUCKET SCOPE (HTTP 403 Forbidden)');
      console.log('   Penyebab: Cloudflare R2 API Token menolak operasi PutObject.');
      console.log('   Kemungkinan penyebab di Cloudflare Dashboard:');
      console.log('     a) Token permissions hanya "Read" (bukan "Object Read & Write" atau "Admin Read & Write").');
      console.log('     b) Saat membuat API token, opsi "Apply to specific bucket only" memilih bucket yang SALAH,');
      console.log(`        sehingga token tidak memiliki izin menulis ke bucket "${rawBucket}".`);
      console.log('   Langkah perbaikan:');
      console.log('     1. Buka Cloudflare Dashboard -> R2 -> Manage R2 API Tokens');
      console.log('     2. Buat API Token baru.');
      console.log('     3. Pilih Permissions: "Object Read & Write" (atau "Admin Read & Write").');
      console.log(`     4. Pada "Specify bucket", pilih "All buckets" atau secara spesifik bucket "${rawBucket}".`);
      console.log('     5. Salin Access Key ID dan Secret Access Key baru ke Hostinger Environment Variables.');
    } else if (name === 'SignatureDoesNotMatch' || msg.includes('signature')) {
      console.log('2. AKAR MASALAH: SIGNATURE / CREDENTIAL MISMATCH');
      console.log('   Penyebab: S3_SECRET_ACCESS_KEY tidak cocok dengan S3_ACCESS_KEY_ID.');
      console.log('   Langkah perbaikan:');
      console.log('     1. Buat token baru di Cloudflare R2.');
      console.log('     2. Pastikan Secret Access Key disalin utuh tanpa spasi atau karakter terpotong.');
    } else if (name === 'InvalidAccessKeyId' || msg.includes('access key')) {
      console.log('3. AKAR MASALAH: INVALID ACCESS KEY ID');
      console.log(`   Penyebab: S3_ACCESS_KEY_ID "${mask(rawAccessKeyId)}" tidak dikenali oleh Cloudflare R2.`);
    } else if (status === 404 || name === 'NoSuchBucket' || msg.includes('specified bucket does not exist')) {
      console.log('4. AKAR MASALAH: BUCKET NOT FOUND (HTTP 404)');
      console.log(`   Penyebab: Bucket dengan nama "${rawBucket}" tidak ditemukan pada akun Cloudflare R2.`);
      console.log('   Langkah perbaikan:');
      console.log(`     1. Buka Cloudflare Dashboard -> R2, pastikan bucket "${rawBucket}" sudah dibuat.`);
      console.log('     2. Pastikan penulisan S3_BUCKET tepat (huruf kecil/besar sensitif).');
      console.log('     3. Periksa Account ID pada S3_ENDPOINT, pastikan akun Cloudflare yang dituju sama.');
    } else if (name === 'TypeError' || name === 'ERR_INVALID_URL' || msg.includes('invalid url')) {
      console.log('5. AKAR MASALAH: FORMAT S3_ENDPOINT INVALID');
      console.log(`   Penyebab: Nilai S3_ENDPOINT "${rawEndpoint}" bukan URL yang valid.`);
      console.log('   Format yang benar: https://<ACCOUNT_ID>.r2.cloudflarestorage.com');
    } else {
      console.log(`6. AKAR MASALAH LAIN: ${name} (${msg}) - HTTP ${status}`);
    }
  }

  process.exit(1);
}

main();
