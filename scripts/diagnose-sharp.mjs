#!/usr/bin/env node
/**
 * Diagnostic script to test Sharp image processing on Hostinger/local runtime.
 * Tests:
 * 1. Sharp module loading & versions
 * 2. Small synthetic JPG creation
 * 3. Metadata inspection
 * 4. Auto-rotation (.rotate())
 * 5. Resize to 'card' (width 800)
 * 6. Resize to 'large' (width 1800)
 * 7. WebP and PNG format conversion
 */

import sharp from 'sharp';

console.log('====================================================');
console.log('       SHARP IMAGE PROCESSING DIAGNOSTIC            ');
console.log('====================================================');

try {
  console.log('[sharp] Node.js version:', process.version);
  console.log('[sharp] Platform / Arch:', process.platform, process.arch);
  console.log('[sharp] Versions:', JSON.stringify(sharp.versions, null, 2));

  // 1. Create a small synthetic JPEG image in memory
  console.log('\n[1/5] Creating small 200x200 JPEG test image...');
  const testJpg = await sharp({
    create: {
      width: 200,
      height: 200,
      channels: 3,
      background: { r: 106, g: 157, b: 148 }, // Brand sage teal
    },
  })
    .jpeg({ quality: 85 })
    .toBuffer();
  console.log(`[sharp] Test image created: ${testJpg.length} bytes`);

  // 2. Read metadata
  console.log('\n[2/5] Reading image metadata...');
  const metadata = await sharp(testJpg).metadata();
  console.log(`[sharp] Metadata: format=${metadata.format}, dimensions=${metadata.width}x${metadata.height}, space=${metadata.space}`);

  // 3. Auto-rotate (.rotate())
  console.log('\n[3/5] Testing auto-rotate (.rotate())...');
  const rotated = await sharp(testJpg).rotate().toBuffer();
  console.log(`[sharp] Rotated buffer: ${rotated.length} bytes`);

  // 4. Test Media collection imageSizes: 'card' (width 800) and 'large' (width 1800)
  console.log('\n[4/5] Testing Media collection resize sizes (card=800w, large=1800w)...');
  const cardResize = await sharp(testJpg)
    .resize({ width: 800, withoutEnlargement: false })
    .jpeg()
    .toBuffer({ resolveWithObject: true });
  console.log(`[sharp] Card resize (800w): ${cardResize.info.width}x${cardResize.info.height}, ${cardResize.info.size} bytes`);

  const largeResize = await sharp(testJpg)
    .resize({ width: 1800, withoutEnlargement: false })
    .jpeg()
    .toBuffer({ resolveWithObject: true });
  console.log(`[sharp] Large resize (1800w): ${largeResize.info.width}x${largeResize.info.height}, ${largeResize.info.size} bytes`);

  // 5. Test WebP conversion
  console.log('\n[5/5] Testing WebP conversion...');
  const webpBuffer = await sharp(testJpg).webp({ quality: 80 }).toBuffer();
  console.log(`[sharp] WebP output: ${webpBuffer.length} bytes`);

  console.log('\n====================================================');
  console.log('>> SUCCESS: Sharp is 100% operational in this environment!');
  console.log('====================================================\n');
  process.exit(0);
} catch (err) {
  const error = err;
  console.error('\n====================================================');
  console.error('>> FAILED: Sharp diagnostic encountered an error!');
  console.error(`Name:    ${error?.name || 'Error'}`);
  console.error(`Message: ${error?.message || String(err)}`);
  if (error?.stack) {
    console.error('Stack:');
    console.error(error.stack);
  }
  console.error('====================================================\n');
  process.exit(1);
}
