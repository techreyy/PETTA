import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import manifest from '../src/app/manifest';
import { metadata as offlineMetadata } from '../src/app/(site)/offline/page';

test('Service Worker: file exists, pre-caches offline fallback and excludes Payload/Admin/API routes', () => {
  const swPath = resolve(process.cwd(), 'public/sw.js');
  assert.ok(existsSync(swPath), 'public/sw.js must exist');

  const swContent = readFileSync(swPath, 'utf8');

  // Verify precache assets
  assert.ok(swContent.includes("'/offline'"), 'Service worker must precache /offline');
  assert.ok(swContent.includes("'/petta-icon-only.png?v=3'"), 'Service worker must precache app icon');

  // Verify critical exclusions
  assert.ok(swContent.includes("url.pathname.startsWith('/admin')"), 'Service worker must explicitly bypass /admin');
  assert.ok(swContent.includes("url.pathname.startsWith('/api')"), 'Service worker must explicitly bypass /api');
  assert.ok(swContent.includes("url.pathname.startsWith('/health')"), 'Service worker must explicitly bypass /health');
  assert.ok(swContent.includes("request.method !== 'GET'"), 'Service worker must bypass non-GET requests');

  // Verify offline fallback navigation handler
  assert.ok(swContent.includes("request.mode === 'navigate'"), 'Service worker must handle navigate requests');
  assert.ok(swContent.includes("match(OFFLINE_URL)"), 'Service worker must fallback to offline URL on network failure');
});

test('Offline page metadata enforces strict no-index for SEO preservation', () => {
  assert.equal(offlineMetadata.title, 'Koneksi Terputus | PETTA Architectural Practice');
  assert.deepEqual(offlineMetadata.robots, { index: false, follow: false });
});

test('Web App Manifest: returns valid architectural studio PWA configuration', () => {
  const pwaManifest = manifest();
  assert.equal(pwaManifest.name, 'PETTA — Building Beyond Spaces');
  assert.equal(pwaManifest.short_name, 'PETTA');
  assert.equal(pwaManifest.background_color, '#14191E');
  assert.equal(pwaManifest.theme_color, '#14191E');
  assert.ok(pwaManifest.icons && pwaManifest.icons.length >= 2);
  assert.equal(pwaManifest.icons[0].src, '/petta-icon-only.png?v=3');
});
