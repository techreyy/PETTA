# CMS editable text batch - 2026-10-05

The existing copy is now editable through five text-only Payload Globals. No public sections, routes or content items were added.

| Admin label | Slug | Existing text fields |
| --- | --- | ---: |
| Layanan | `servicesPageContent` | 7 |
| Penghargaan & Sayembara | `awardsPageContent` | 22 |
| Berita / What's On | `newsPageContent` | 4 |
| Kontak | `contactPageContent` | 37 |
| Site Settings | `siteTextContent` | 32 |

Services covers the eyebrow, heading, intro, empty state and existing CTA. Awards covers its heading/intro, filters, section titles/count labels, empty states, item metadata labels and CTA. News covers its eyebrow, heading, intro and article button. Contact covers its heading/intro, labels, placeholders, displayed options, submit/pending/success/error copy, sidebar/social labels and consultation hours. Site Settings covers desktop/mobile navigation and all existing footer text and social link labels.

`siteSettings` already belongs to Profil & Kontak Studio and remains unchanged. Its contact details, studio/founder names and social URLs remain the source of truth. The new `siteTextContent` uses a distinct slug to avoid renaming or replacing it. Profile tokens (`{name}`, `{founder}`) and `{year}` keep dynamic values in footer/contact text. They render as escaped React text with the original text-node boundaries. Contact option values and all navigation paths remain fixed.

## Admin and runtime

- Beranda, Tentang Kami and the five new Globals appear in KONTEN WEBSITE. Existing content collections use Koleksi Konten so the Layanan collection and Layanan page settings are clearly separated. Collection labels, slugs and persisted data paths remain intact.
- Existing `canPublish` authorization permits active owner/admin updates. Anonymous, editor and inactive users cannot update these published Globals. Existing account/auth rules are unchanged.
- `getPageContent` uses Payload Local API with depth 0, public access and request-scoped React cache. Missing fields, empty strings, invalid values and query failures fall back independently to the original copy.
- The dynamic page/layout reads current text on each request. Saving invalidates the affected page, or the layout for navigation/footer. Reload/new visits show saved copy without deploying again. There is no live push into an already open tab and no admin/auth/session caching.
- Awards and Contact retain their interactive components behind small server page loaders. Existing collection loaders, media references, markup, CSS classes, typography, transitions and responsive rules remain unchanged.

## Migration

`src/migrations/20261005_100000_page_text_content.ts` is registered in the existing Payload migration runner. It creates five new tables and seeds a frozen snapshot of the original copy only when each table is empty. No ALTER, DROP, DELETE, TRUNCATE or UPDATE statements occur. Reruns preserve saved edits; rollback deliberately retains the additive tables and their content. Existing migrations and production data are untouched by this new migration.

No new environment variables or provider changes. Production uses the existing `prodMigrations` startup mechanism. Local migration status also showed the earlier Homepage/About migrations pending; those existing additive migrations were applied locally with this batch. No production database was accessed during QA.

## Verification

- `npm run typecheck`, `npm run lint`, `npm test` and `npm run build`: passed. `npm test` includes 40 database/unit checks plus four new rendering/loader/invalidation checks.
- Additional Services rendering/sitemap/navigation regression suite: 3 passed.
- Database checks save/read all 102 fields, deny unauthorized writes, repeat saves, rerun migration/rollback and compare existing collection records plus Profil & Kontak Studio before/after.
- Default render output for Services, Awards, News, Contact, Header and Footer equals the pre-change output. The comparison normalizes only newly explicit option value attributes, which preserve the browser's previous submitted values.
- Chrome at 390px/1440px: all four pages retain identical body text and layout dimensions; no horizontal overflow or JavaScript errors. Six screenshots match pixel-for-pixel. The remaining two mobile comparisons differ only in the existing Next.js development indicator (baseline captured its Compiling message).
- Browser admin QA uses a disposable local database and a production build. Repeated UI saves, reloads and client navigation are checked without rebuilding/restarting between saves; desktop/mobile navigation, Awards filters and contact persistence are included.
- Local authenticated PNG upload/media read is checked. Production without S3 credentials correctly retains the existing upload rejection. Live R2 uploads and deployed Hostinger health are outside this local verification; neither provider nor production accounts/data were modified.

Local evidence is in `.cache/browser-qa/batch-*`; automated regressions are in `tests/page-content*`, `tests/cms.test.ts` and `tests/services-page*`. ESLint now ignores the already git-ignored `.cache` scratch folder, which contained a pre-existing QA script lint error.

## Main files

- `src/cms/page-content.ts`, `src/lib/page-content.ts`, `src/lib/get-page-content.ts`
- `src/payload.config.ts`, `src/payload-types.ts`, `src/migrations/index.ts`, new migration
- Four route page files, `src/components/AwardsView.tsx`, `src/components/ContactView.tsx`
- `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/lib/SettingsContext.tsx`, site layout
- Existing Homepage/About admin labels, `src/cms/admin-presentation.ts`, tests, test runner, both AGENTS.md files
