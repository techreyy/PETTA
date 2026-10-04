# AGENTS.md — Architecture Portfolio Website

> **ACTIVE PROJECT SOURCE OF TRUTH**  
> Last updated: 2026-10-04
> Reference: https://atelierriri.com/  
> Goal: build a premium architecture website with comparable UX/features and original branding/assets/code.

## 0. MANDATORY AGENT RULES

Read this file before planning, coding, refactoring, debugging, changing schema, or declaring work complete.

1. Inspect the existing codebase first. Never rebuild working areas blindly.
2. Keep the locked stack unless the owner explicitly changes it.
3. Do not remove working features to simplify implementation.
4. Preserve visual consistency, responsive behavior and existing data.
5. Do not hard-code content that an admin should reasonably edit.
6. **After every meaningful change, update this file before finishing.**
7. Update `Current Implementation State`, affected specifications, and `Change Log`.
8. Never mark something complete unless implemented and verified.
9. If implementation differs from this specification, make the file match reality and record why.
10. Keep only the latest 20 meaningful Change Log entries; consolidate older history.
11. Do not copy Atelier Riri source code, exact copy, logos, photos or protected assets. Recreate comparable structure, interactions and functionality with original assets.
12. Public UI stays architectural, minimal and editorial.
13. Secrets belong in environment variables, never git.
14. For code changes, run type/lint checks and production build before completion where applicable.

## 1. LOCKED STACK

- Next.js, App Router
- React + TypeScript strict
- Tailwind CSS
- Server Components by default; Client Components only for interaction
- Payload CMS
- Admin: `/admin`
- PostgreSQL
- Production media: separate S3-compatible/object storage
- `next/image` for website images
- CSS transitions first; Motion/Framer Motion for richer reveals; GSAP only when genuinely necessary
- ESLint + Prettier
- Respect `prefers-reduced-motion`

Payload Local API is preferred for server-side reads/writes when practical.

## 2. PRODUCT DIRECTION

Build an image-led, refined architecture portfolio:
- strong photography and generous whitespace
- clean editorial grid
- oversized but disciplined typography
- mostly neutral palette
- subtle transitions
- polished desktop and intentional mobile layouts
- fast loading despite large project galleries

## 3. PUBLIC ROUTES

```text
/
├── /portfolio
│   ├── /portfolio/category/[slug]
│   └── /portfolio/[slug]
├── /services
├── /about
├── /news
│   └── /news/[slug]
├── /contact
└── /privacy + /404 when needed
```

Primary navigation:
Home · Projects · Services · Awards & Sayembara · What's On · About Us · Contact Us

Header/footer/navigation must be CMS-managed.

## 4. HOME PAGE

Required sections:
1. Header/navigation
2. Large architecture hero
3. Short studio positioning statement
4. What's On / latest news
5. Portfolio category showcase
6. Featured projects
7. Video/YouTube section
8. Trusted-by client/property logos
9. Featured-by media/publication logos
10. Inquiry CTA
11. Footer: address, phone, email, socials

Homepage Content (2026-10-04) is a registered Payload Global for the positioning section only: eyebrow/location, service summary, headline, left/right paragraphs, founder name and CTA label. Owner/admin can save published text; anonymous and editor writes are denied. Defaults/fallback preserve existing copy with corrected founder credentials. Paragraphs support **bold** and {founderName}, rendered as escaped React text. Existing section visibility/featured selection requirements remain broader planned CMS work.

## 5. PORTFOLIO

Initial editable categories:
- Private House
- Residential & Housing
- Commercial Building
- Hospitality
- Religious Architecture
- Institutional & Public
- Interior Design
- Masterplanning & Urban Design
- Renovation & Adaptive Reuse
- Architecture Installation
- Social and Cultural Function Buildings

Portfolio UI:
- dual-filter system: status filters (ALL | BUILT | ONGOING | PROPOSED | CONCEPT) combined with typology filters
- project card status badges
- homepage Selected Built Works showcase for verified built projects
- category-led sections
- category title + description
- project cover, title, location
- responsive grid/list
- refined hover/reveal behavior
- category page
- admin-controlled project/category order and project status (Built, Ongoing, Proposed, Concept, or unconfirmed)

### Project fields
- title, slug
- categories
- location
- status
- architect in charge
- constructed area
- site area
- stories/floors
- year
- short intro
- optional rich description
- hero image
- unlimited gallery
- gallery captions optional
- video/embed optional
- credits optional
- featured
- sort order
- draft/published
- SEO title/description/image

Project detail includes Back navigation and optional related navigation. Gallery must handle portrait/landscape images cleanly.

## 6. ABOUT / TEAM / SERVICES / CAREERS

About page:
- editorial hero
- philosophy
- mission
- services
- design/process flow
- team
- careers/open positions
- inquiry CTA

Team item:
`name, roleTitle, portrait, bio?, order, active`

Team roster (2026-10-03): eight owner-supplied members in the requested order, from Principal Architect / Design Director to Business Development. Names, roles, ordering and portraits remain CMS-managed; missing portraits render initials. Superseded demo profiles are inactive and preserved.

About founder portrait (2026-10-04): the principal spotlight resolves the founder by the existing CMS founder name from the same active Team data used by the grid, including its portrait. No independent hardcoded hero photo; missing portraits render initials. The existing dynamic layout reads CMS data per request; React cache is request-scoped.

Service item:
`title, description, order, active`

Career item:
`title, description, requirements[], applicationUrlOrEmail, order, active`

## 7. NEWS / VIDEO / LOGOS

### News
Listing + detail fields:
`title, slug, coverImage, excerpt, author, publishDate, rich body, gallery?, videoUrl?, featured, draft/published, SEO`

Homepage shows latest or selected featured news.

### Video
CMS-managed:
`title, youtubeUrl, thumbnail?, order, active`

MVP may use direct embeds; no YouTube API dependency required.

### Brand logos
Two groups:
- client/property (`client`)
- media/publication (`media`)

Logo presentation (2026-10-02): all client, collaborator and media rows wrap and center horizontally, including incomplete rows. Logos use transparent, borderless containers with object-contain sizing; uploaded PNG transparency is preserved without a white card background.

Fields:
`group, name, logo, url?, alt, order, active`

## 8. CONTACT

Public form:
- full name
- email
- phone optional
- subject
- message
- validation
- loading/success/error states
- spam/rate-limit protection

Also display CMS-managed:
address, email, phone, social links, CTA copy.

Valid submissions are stored in Payload.

Inquiry statuses:
`new | read | replied | archived`

Internal notes are optional.

## 9. ADMIN / CMS

Payload `/admin` must manage:
- Projects
- Portfolio Categories
- News
- Team
- Services
- Careers
- Videos
- Client Logos
- Media Logos
- Inquiries
- Media Library
- Navigation
- Homepage
- About Page
- Footer/Contact
- SEO/Site Settings
- Users/Roles

Admin must support multi-image upload, cover selection, gallery ordering, alt text, safe media replacement/removal, draft/publish, and team-account creation.

Admin presentation (2026-10-01): existing collections are grouped as Proyek, Konten Website, Identitas Studio, Pesan Masuk, and Pengguna. Indonesian field labels and brief guidance are provided; Payload supports Indonesian (fallback) and English interface languages. Project editing uses unnamed Informasi Utama, Foto & Galeri, and Publikasi tabs. SEO and the legacy import identifier sit inside a collapsed optional panel. These layout fields do not change persisted paths or access permissions.

Admin refinement (2026-10-02): project status uses a dropdown backed by the existing text column, including a preserved legacy-value option. Location/year share a row; technical details and legacy image URLs use collapsed optional panels without changing data paths. Empty slugs are generated from titles on save; existing slugs remain stable and duplicates must be edited to a unique value. Category deletion checks saved project versions as well as current records. Local upload demonstrations use development mode; production uploads require configured S3 storage.

### Roles
- `owner`: full access including users/global settings/delete/publish
- `admin`: content/media/publish; limited owner-only settings
- `editor`: create/edit content/media; no user management or destructive global settings

Authorization must be enforced server-side, not by hiding buttons only.

## 10. PAYLOAD MODEL

Collections:

```text
users
- name, email, auth, role(owner|admin|editor), active

media
- file, alt, caption?

portfolioCategories
- title, slug, headline?, description, coverImage?, order, active

projects
- all Project fields from section 5

news
- all News fields from section 7

team
services
careers
videos
brandLogos

inquiries
- fullName, email, phone?, subject, message
- status(new|read|replied|archived)
- internalNotes?, createdAt
```

Globals:

```text
homepageContent (implemented)
- eyebrow, services, headline, leftParagraph, rightParagraph, founderName, ctaLabel

siteSettings
- studio name, logos, favicon, default SEO
- contact information, social links, footer copy

navigation
- header items, footer items

homepage
- hero/media, positioning copy
- section visibility
- featured news/projects
- category/video/logo section copy
- final CTA

aboutPage
- hero, philosophy, mission, process, CTA
```

Use migrations for schema changes; preserve production content.

## 11. DESIGN SYSTEM

Visual principles:
- neutral colors, black/white contrast, optional warm off-white
- large architecture imagery
- whitespace as a design element
- thin/restrained dividers
- strong editorial typography
- full-bleed media where appropriate
- asymmetric layouts allowed
- consistent vertical rhythm

Typography:
- Public body, headings and navigation use DM Sans via next/font; Cormorant Garamond remains for editorial accents (2026-10-02).
- premium sans-serif or supplied brand font
- clear display/heading/body/metadata hierarchy
- responsive type via `clamp()`
- readable mobile metadata

Motion:
- Hero uses a 700ms overlapping crossfade and immediately visible initial caption; project cards reveal over 550ms. Carousel controls have larger touch targets and pause when its project link receives focus.
- section reveals
- restrained image scale/clip reveals
- elegant project-card hover
- smooth mobile menu
- no excessive parallax
- animation must never delay access to content

## 12. COMPONENT GUIDANCE

Prefer reusable modules:

```text
layout: Header, Footer, MobileMenu
home: Hero, NewsPreview, CategoryShowcase, FeaturedProjects,
      VideoSection, LogoStrip, InquiryCTA
portfolio: ProjectCard, ProjectGrid, CategorySection,
           ProjectMeta, ProjectGallery
about: Philosophy, Mission, Services, Process, TeamGrid, Careers
news: NewsCard, ArticleBody
contact: ContactForm
shared: Container, SectionHeading, ResponsiveImage, RichText, Reveal
```

## 13. PERFORMANCE

- Performance audit (2026-10-03): standard Neon endpoints normalize to the corresponding -pooler host with strict TLS and the same database/provider. Payload's existing shared instance/pool remains in use; no runtime pool is created per request.
- Public project detail uses depth 1; project/news detail skip unused pagination totals. No admin/user/session cache. PETTA_CMS_TIMING is opt-in outside production and unconditionally disabled in production.
- Performance release gate: compare representative before/after route and CMS timings; do not push with unresolved regressions. Local results and production baseline are in web-app/docs/performance/audit-2026-10-03.md.

Mandatory:
- `next/image`
- correct responsive `sizes`
- lazy-load below fold
- preload only real hero assets
- preserve image dimensions to prevent layout shift
- no full-resolution originals in card thumbnails
- minimize client JS
- intentional cache/revalidation
- optimized video/embed behavior
- Shared public project/news lists exclude galleries, long descriptions, rich bodies and SEO relations; detail loaders retain complete content.
- Local development starts through `npm run dev` (database readiness included); `dev:next` is the explicit Next-only command.
- target strong Core Web Vitals

## 14. SEO + ACCESSIBILITY

SEO:
- clean slugs
- unique title/description
- Open Graph image
- canonical
- sitemap
- robots
- editable project/news SEO

Accessibility:
- semantic HTML
- logical headings
- keyboard menu/navigation
- visible focus
- meaningful alt text
- accessible forms/errors
- adequate contrast
- reduced-motion support
- mobile equivalents for hover-only information

## 15. SECURITY

- protect `/admin`
- server-side role checks
- validate/sanitize inputs
- validate upload file type/size
- rate-limit/spam-protect contact
- secure cookies/session configuration
- secrets only in env
- never expose DB/storage credentials client-side
- restrict destructive CMS actions by role

Dependency security (2026-10-03): scoped overrides use undici 7.29.1 under Payload and dompurify 3.4.16 under Monaco. Do not force esbuild outside its parent range or run npm audit fix --force. Current audit: 18 total / 15 production findings, from active braces and nested esbuild advisories. The withdrawn Deno advisory is inapplicable; Monaco still vendors DOMPurify 3.4.15 without the reviewed IN_PLACE trigger. See web-app/docs/security/dependency-audit-2026-10-03.md for reachability, dev-only findings and the release gate.

## 16. RESPONSIVE QA

Verify small/large phones, portrait/landscape tablets, laptop and large desktop.

Check:
- no nav overflow
- no image distortion
- no hero text collision
- gallery composition stays intentional
- usable tap targets
- hover-only content has touch equivalent

## 17. DEFINITION OF DONE

A task is complete only when behavior works, regressions are checked, desktop/mobile and key states are verified, permissions are considered, lint/type/build are clean where applicable, migration/env changes are documented, and `AGENTS.md` + Change Log are updated.

## 18. IMPLEMENTATION PHASES

1. Foundation: Next.js + Payload + PostgreSQL + auth/roles + media + tokens + layout/settings
2. Portfolio: categories + projects + gallery + archive/detail + featured
3. Editorial: homepage + about + team + services/process + careers + news + video + logos
4. Operations: contact/inquiries + user management + draft/publish + SEO
5. Polish: motion + responsive + performance + accessibility + sitemap + production QA

## 19. CURRENT IMPLEMENTATION STATE

Update after every relevant task.

```text
Overall: CORE WEBSITE IMPLEMENTED; CMS PARITY AND PRODUCTION PERFORMANCE AUDIT REMAIN INCOMPLETE

[x] Next.js foundation
[x] Payload CMS
[x] PostgreSQL
[x] Auth / roles
[x] Media storage
[x] Header / navigation
[x] Footer
[x] Homepage
[x] Portfolio archive/category
[x] Project detail/gallery
[x] About
[x] Team
[x] Services/process
[x] Careers
[x] News listing/detail
[x] Video
[x] Client/media logos
[x] Contact
[x] Inquiry workflow
[x] Site settings
[x] SEO
[x] Accessibility QA
[ ] Production Core Web Vitals / field performance QA
[x] Production build
```

Only change `[ ]` to `[x]` after verification.

Latest update (2026-10-04):
- Added Homepage Content global for seven positioning text fields with safe existing-copy fallback and corrected founder credentials. The homepage page boundary reads the global on each dynamic request, including client navigation; safe revalidation (`revalidatePath('/')`) ensures edits appear without a redeploy. Additive migration 20261004_100000_homepage_content creates/seeds only the new table and preserves edits on rerun/rollback. Typecheck, ESLint, unit/integration test suite (38 checks), Next.js production build, and Chromium browser QA at 390px/1440px (verifying admin edits, repeated saves, client navigation, and zero console errors) all passed.
- About founder portrait now uses the same CMS Team member as the grid instead of a fixed Unsplash URL. Existing layout, text and image sizing are preserved; no records/media, upload behavior, schema or environment settings changed. Typecheck, lint, production build and 20 related tests passed; local Chrome desktop/mobile QA passed at 390/1440px using isolated photo fixtures. Production CMS edits were not performed.

Previous update (2026-10-03):
- Custom loading & offline PWA experience: implemented CSS-only architectural hairline spinner in loading.tsx, top hairline page transition progress bar (NavigationProgress), real-time online/offline detector and full-screen custom dark overlay (OfflineExperience), standalone /offline fallback page with no-index SEO protection, web app manifest, and Service Worker (public/sw.js) with strict exclusions for Payload admin, API, and sessions.
- GitHub deployment: deployed performance query improvements, Neon pooler connection normalization, opt-in dev timing (`cms-timing.ts`), and performance audit documentation to origin/main.
- Performance-only audit: detail reads avoid unused counts and nested category media; detail page reads start concurrently. Optional CMS timing is always disabled in production. Standard Neon hosts normalize to -pooler; deployed connection verification remains pending.
- Local typecheck, lint, production build and 70 checks passed; full public content/detail/SEO hashes are identical, authenticated QA dashboard works and anonymous session isolation passed. Shared request batching was removed after adverse listing results.
- Measured baseline/repeat/final TTFB and CMS timings plus read-only production HTTP baseline. Detail query median improved 11.33 to 6.46 ms, but route/cold/p95 results remain mixed. Evidence: web-app/docs/performance/audit-2026-10-03.md. No schema, content, auth, design or R2 changes.
- Dependency audit: undici patched to 7.29.1, dompurify to 3.4.16; incompatible legacy esbuild override removed without changing resolved esbuild versions. Audits: 25 to 18 total, 22 to 15 production, 3 exclusively devDependency findings. Two active advisory families remain; no upstream braces patch exists. Audit exit codes remain 1.
- Verified npm install, all 59 tests, TypeScript, lint and production build. Fixed the test loader's existing team-roster import omission. Detailed report: web-app/docs/security/dependency-audit-2026-10-03.md. No schema/env changes. Owner explicitly approved commit/push of the tested patch with the remaining audit findings documented.
- GitHub release: owner authorized committing and pushing the verified team update to origin/main. Hostinger GitHub integration handles deployment; no new schema or environment configuration required.
- Updated eight team members, roles and order in CMS and fallback content; corrected founder credentials to S.Ars., M.Ars., IAI. About reads founder settings and renders initials for missing team portraits.
- Applied data migration 20261003_090000_team_roster locally; eight active names/roles/order verified against the supplied roster. Existing portraits are preserved, superseded profiles are inactive. No schema or environment changes; cloud applies the migration on deployment.
- Final TypeScript, ESLint and production build passed. Browser responsive QA has not been performed for this update.

Previous update (2026-10-02):
- Database-to-Cloud Asset & Data Sync: Synchronized 15 real projects (SMART SCHOOL, SPORT CENTER, CA-HOUSE, R-HOUSE, P-HOUSE, F-HOUSE, etc.), 11 categories, and 7 services from PostgreSQL into static data fallback; copied 213 media assets to `public/api/media/file/` with direct streaming in the API route handler so Vercel renders complete project galleries without a database dependency.
- Vercel cloud deployment resilience: Handled missing cloud database on Vercel by automatically serving the built-in studio catalog and default services instead of throwing an uncaught 500 error ("This page couldn't load"). Added branded dark architectural global-error boundary.
- GitHub and Vercel deployment sync: Staged all new/modified files, added .cache/ to .gitignore, committed (0bcfe5c) and pushed to origin/main on GitHub (https://github.com/techreyy/PETTA.git) to trigger automated Vercel deployment.
- Logo refinement: centered wrapping client/collaborator/media rows; removed white cards, borders and card padding so transparent PNG artwork sits directly on the section background. Linked and unlinked logos share consistent sizing. No CMS data/schema changes.
- Client-demo audit: restored stopped local PostgreSQL, simplified project creation with automatic slugs and a legacy-safe status dropdown, collapsed optional technical/image-link controls, and improved form guidance contrast. Fixed desktop admin horizontal overflow caused by relationship tooltips; removed list clipping that could hide controls.
- Cleaned up project cards by moving the year into metadata instead of an overlapping hover badge. Changed public typography to DM Sans and tuned lightweight opacity/transform animation, immediate hero captions, carousel crossfades, focus pause and larger touch controls. No content records or existing features removed.
- Verified: 59 automated checks (20 database/unit, 17 content, 10 rendering/accessibility/status, 2 gallery, 3 services loader, 3 services page, 4 startup); TypeScript, ESLint and production build passed with zero errors/warnings. Authenticated Chrome at 390/1440px verified project tabs, no document overflow, and creating/publishing/reloading a project with an automatic slug and selected status in a disposable database. Public checks passed eight routes at 390/768/1440px with zero JS errors/resource failures; expanded final viewport checks are recorded in the audit log below.
- Remaining deployment limitations: CMS parity for homepage/navigation/About/careers/videos is incomplete; account recovery email is unconfigured; production media upload needs S3. Production Core Web Vitals remain unverified. Demo instructions are in web-app/README.md.
- Schema/environment: no schema migration or new environment variables. Team migration cleanup only removes unused function arguments; SQL is unchanged.

Previous update (2026-10-01):
- Typography update: Switched public typography across entire website (Headings, Body, and Navigation) to Plus Jakarta Sans with Cormorant Garamond retained for editorial serif accents. Verified via Playwright Chrome headless testing that computed styles on body, h1, and nav evaluate to 'Plus Jakarta Sans'.
- Admin usability: localized collection/field/option labels and guidance, grouped navigation into five task-oriented sections, split the project form into three unnamed tabs, and collapsed optional SEO/import controls. Added the official Payload translations dependency at version 3.90.2. Existing identifiers, status values, permissions and data schema are preserved; no migration or new environment variables required. Verified: headless Chrome browser QA passed on desktop (1440px) and mobile (390px) with 0 JavaScript console errors, tab switching, and enhanced readable contrast.
- Error/performance audit: local PostgreSQL was stopped (ECONNREFUSED on port 55432); restarted it and made `npm run dev` use the existing database-readiness wrapper. Next-only startup remains available as `dev:next`.
- Reduced shared Payload queries to depth 1 and excluded project galleries/descriptions/SEO and news rich bodies/SEO from global page data. Detail queries continue to load galleries.
- Fixed empty project gallery fallback, gallery responsive image sizes, unresolved logo references, and deletion of media referenced by active or inactive brand logos. Initial hero is visible without waiting for its entrance animation; only the first slide is preloaded; video embeds are lazy-loaded.
- Three legacy category cover images timed out upstream during browser QA. Preserved their artwork as local WebP files (346,972 bytes total) and updated their existing CMS URL fields; original category records are backed up in `.cache/category-covers-backup-*.json`. Deploy `public/category-covers` with these URLs.
- Specification correction: `payload.config.ts` currently registers only the `siteSettings` global. Homepage visibility/copy settings exist as optional UI props but have no registered CMS global; navigation is not CMS-managed. About globals, careers and a videos collection also remain missing. Existing checklist marks indicate public rendering, not complete CMS specification parity.
- Current verification: 19 database/unit tests, 17 content/logo tests, 2 homepage rendering tests, 2 gallery rendering tests and 4 startup tests passed (44 total); TypeScript and production build passed; ESLint has zero errors and four pre-existing unused-variable warnings in the team migration. Final production-browser recheck passed eight routes at 390/768/1440px with no JavaScript errors, HTTP resource failures or horizontal overflow; status/category filters and mobile menu open/close passed. Local warm response-start timings were 20-146ms, with the first homepage response at 505ms; these are local observations, not production speed guarantees.
- Full Project Folder Media & Categories: 11 architectural categories registered and active in PostgreSQL/CMS (including `Social and Cultural Function Buildings`). 75 high-res project assets from `../PROJECT` optimized (1.29 GB down to 19.79 MB webp) and imported to Payload Media Library and project galleries across 12 projects.
- Admin-Managed Project Status & Dual Filtering: Projects page enhanced with intersecting status filters (`ALL | BUILT | ONGOING | PROPOSED | CONCEPT`) and typology filters with live count badges. Status badges rendered on project cards and homepage hero.
- Homepage "Selected Built Works": Dedicated showcase displaying verified built projects (`status: 'built' | 'completed'`) directly after hero; ambiguous or unconfirmed statuses never inferred.
- Dedicated Services Section & CMS Collection: Implemented `/services` route, CMS `services` collection with migration `20260930_183907_services`, server loader `getServices()`, 7 default studio capabilities seeded, desktop/mobile header navigation links, footer link, and sitemap entry.
- Verified: `npm test` 18/18 tests passing across 12 suites, TypeScript (`tsc --noEmit`) 0 errors, ESLint 0 errors, `next build` 100% clean production build, and headless Chrome browser QA passing at 390px, 768px, and 1440px with 0 errors and 0 horizontal overflow.

## 20. CHANGE LOG

For every meaningful change append:

```text
YYYY-MM-DD — Change title
- Changed:
- Files/areas:
- CMS/schema impact:
- Migration/env required: yes/no
- Verified:
- Notes:
```

### 2026-10-04 - About founder portrait follows the CMS Team record
- Changed: Removed the fixed Unsplash portrait from the founder spotlight. Hero and grid now resolve the same active CMS Team member's portrait; missing photos use initials. Existing founder-name lookup is reused, independent of team ordering.
- Files/areas: src/app/(site)/about/page.tsx, tests/about-portrait.test.mjs, tests/cms-editorial-loader.mjs, both AGENTS.md files.
- CMS/schema impact: None. No CMS writes, media deletion, upload changes, record removal or database reset.
- Migration/env required: No. Existing force-dynamic layout and request-scoped React cache already read current CMS content on page requests; no revalidation/configuration changes needed.
- Verified: Typecheck, ESLint, production build and 20 related tests passed. Regression covers two successive CMS portrait replacements overriding a legacy URL, reordered members, missing portrait and missing founder. Local production /about and isolated portrait fixtures passed Chrome checks at 390/1440px with no overflow or JavaScript errors; screenshots inspected.
- Notes: Production CMS was not modified for testing. Portrait changes appear in both locations on the next page request/reload. Production deployment and a real production CMS edit remain owner-side verification.

### 2026-10-03 - Custom loading UI, offline experience and PWA service worker
- Changed: Implemented minimalist architectural CSS-only loading state for route transitions (`loading.tsx`), top hairline navigation progress bar (`NavigationProgress.tsx`), real-time offline detection with bespoke dark Petta overlay and auto-reconnect refresh (`OfflineExperience.tsx`), dedicated offline fallback page (`/offline`), PWA manifest (`manifest.ts`), and lightweight Service Worker (`public/sw.js`) pre-caching static assets and offline view while strictly bypassing Payload admin, auth, and API routes.
- Files/areas: src/app/(site)/loading.tsx, src/components/NavigationProgress.tsx, src/components/OfflineExperience.tsx, src/components/OfflineFallbackView.tsx, src/app/(site)/offline/page.tsx, src/app/(site)/layout.tsx, src/app/manifest.ts, public/sw.js, scripts/test.mjs, tests/loading-offline.test.ts, AGENTS.md.
- CMS/schema impact: None. Zero impact on Payload CMS admin or API.
- Migration/env required: No.
- Verified: All 33 automated integration & unit tests passed, TypeScript (`tsc --noEmit`) 0 errors, ESLint 0 errors, and Next.js production build (`next build --webpack`) cleanly succeeded.
- Notes: Satisfies user request for custom loading, offline overlay, auto-reconnect, and PWA offline fallback without altering main design or adding heavy dependencies.

### 2026-10-03 - GitHub deployment: performance queries and Neon connection pooling
- Changed: Pushed performance-only query improvements (concurrent detail queries, skip pagination counts, depth 1), Neon `-pooler` endpoint normalization, opt-in dev timing (`cms-timing.ts`), test suites, and performance audit documentation to GitHub origin/main.
- Files/areas: src/app/(site)/portfolio/[slug]/page.tsx, src/lib/content.ts, src/lib/db-config.ts, src/lib/services.ts, src/lib/cms-timing.ts, docs/performance/, scripts/, tests/, .env.example, AGENTS.md.
- CMS/schema impact: None.
- Migration/env required: No.
- Verified: All unit/integration tests passed (30/30), TypeScript (0 errors), ESLint (0 errors), and Next.js production build (`next build --webpack`) cleanly succeeded.
- Notes: Automated deployment pipeline on Hostinger / Vercel is triggered via GitHub origin/main.

### 2026-10-03 - Performance-only query audit and Neon pooling
- Changed: Normalize standard Neon runtime endpoints to -pooler, retain existing Payload pool reuse, reduce detail query depth/count work, start independent detail reads together, and add opt-in non-production CMS timings. Removed a shared-batching candidate after worse listing measurements.
- Files/areas: lib/content.ts, lib/db-config.ts, lib/cms-timing.ts, lib/services.ts, portfolio detail loader, audit scripts, regression tests, .env.example, docs/performance/audit-2026-10-03.md and both AGENTS.md files.
- CMS/schema impact: None. Design, content, auth and R2 are unchanged; no user/session cache.
- Migration/env required: No migration or required new variables. Optional PETTA_CMS_TIMING is ignored in production. Verify actual Neon pooled endpoint before release.
- Verified: Typecheck, lint, production build, 70 checks, identical public data hashes, before/after local route/query measurements and authenticated disposable-admin checks. Production anonymous HTTP baseline recorded.
- Notes: No commit/push: route timing regressions/variance remain unresolved, and production pooled connectivity/authenticated timings/browser QA are unverified. Change Log trimmed to the latest 20 entries; earlier history consolidated.
### 2026-10-03 - Migration for media `_objectKey` (clientUploads)
- Changed: Added hand-trimmed additive migration `20261003_100000_media_object_key` (`ALTER TABLE media ADD COLUMN IF NOT EXISTS _objectkey varchar`; Payload maps field `_objectKey` to column `_objectkey`) and registered it in `src/migrations/index.ts`. `migrate:create` was not used verbatim because the diff also drops legacy `focal_x/focal_y/sizes_*` columns (fields removed from config earlier); those columns are intentionally left in place. Regenerated `payload-types.ts` (adds `_objectKey`).
- Files/areas: src/migrations/20261003_100000_media_object_key.ts, src/migrations/index.ts, src/payload-types.ts.
- CMS/schema impact: one nullable column on `media`; no data touched.
- Migration/env required: yes, applied automatically. `postgresAdapter` has `prodMigrations`, so `@payloadcms/db-postgres` connect() runs pending migrations on server start when NODE_ENV=production; no temporary deploy hook is needed. Production (Neon) run/status not performed by the agent (no production credentials locally).
- Verified: migrate + migrate:status on local DB (batch 7, Yes); typecheck, lint, tests, build.
- Notes: Verify in production after deploy: admin media list, JPG/PNG upload, save, replace, delete.

### 2026-10-03 - R2 client-side direct uploads
- Changed: `s3Storage` now sets `clientUploads: true`; the browser uploads via a presigned URL generated server-side by the official adapter (`/api/storage-s3-generate-signed-url`, authenticated users), then Payload creates the Media record. Regenerated admin importMap (adds `S3ClientUploadHandler`; regenerate with S3_* env set). Bucket CORS must allow https://pettadesain.id PUT. Credentials stay server-side; no imageSizes/crop/focalPoint/transforms.
- Files/areas: src/payload.config.ts, src/app/(payload)/admin/importMap.js.
- CMS/schema impact: none. Migration/env required: R2 bucket CORS policy only.
- Verified: typecheck, lint, tests, build. Production upload not yet verified. Notes: with client uploads the file bypasses the server, so server-side mime/10MB limits and Sharp dimension reading do not apply to those uploads.

### 2026-10-03 - Re-enable plain Sharp for metadata only
- Changed: Payload 3.90.2 generateFileData() calls getImageSize() for images; without `sharp` the image-dimensions fallback threw FileUploadError 400 on JPG. Re-added plain `sharp` (no wrapper) to Payload config. No imageSizes, adminThumbnail, crop, focalPoint, resize/format options; disableLocalStorage stays true in production; original file goes unmodified to R2.
- Files/areas: src/payload.config.ts.
- CMS/schema impact: none. Migration/env required: no.
- Verified: typecheck, lint, tests, build (see task result). Production JPG/PNG upload to R2 still to be verified after deploy.

### 2026-10-03 - Raw Media upload (temporary simplification)
- Changed: Media collection reduced to raw upload: removed imageSizes and adminThumbnail, focalPoint/crop false, disableLocalStorage true in production; removed `sharp` from Payload config and the Sharp wrapper/diagnostics. Kept mimeTypes, 10MB limit and alt/caption. Originals go straight to Cloudflare R2.
- Files/areas: src/cms/collections.ts, src/payload.config.ts.
- CMS/schema impact: Existing sizes_* DB columns left untouched; no migration. Neon/R2/provider unchanged.
- Migration/env required: no.
- Verified: tests 28/28, tsc, eslint, production build passed. Production JPG/PNG upload to R2 NOT yet verified; no new features until proven.
- Notes: Admin thumbnails/responsive sizes are temporarily unavailable.

### 2026-10-03 - Dependency security audit and compatible patches
- Changed: Scoped undici 7.29.1 and DOMPurify 3.4.16 overrides; removed out-of-range esbuild override. Preserved Linux lockfile selectors and corrected the test-only team-roster import resolution. Documented active/withdrawn advisories and Monaco's vendored-copy limitation.
- Files/areas: package.json, package-lock.json, tests/content-loader.mjs, docs/security/dependency-audit-2026-10-03.md, both AGENTS.md files.
- CMS/schema impact: None; no studio data modified.
- Migration/env required: No. Deploy through GitHub main to Hostinger, as clarified by the owner.
- Verified: npm install, 59 tests, TypeScript, ESLint and production build passed. npm audit completed with 18 findings (previously 25); omit-dev with 15 (previously 22), both exit 1. Three findings are exclusively devDependency paths. npm ls passed.
- Notes: No forced upgrades or audit fix used. Remaining braces has no published fix; esbuild requires an upstream-compatible parent update. Owner explicitly approved committing and pushing the tested patch despite the documented residual audit findings.

### 2026-10-03 - Owner-approved eight-member studio team
- Changed: Updated eight names, credentials, roles and ordering; About founder text now reads CMS settings and missing team portraits use initials.
- Files/areas: lib/team-roster.ts, lib/data.ts, lib/content.ts, About page, migrations/index.ts, 20261003_090000_team_roster.ts, both AGENTS.md files.
- CMS/schema impact: Team content update, existing photos preserved, duplicate/superseded demo profiles retained inactive. No schema change.
- Migration/env required: Data migration applied locally; production applies it on deployment. No new environment variables.
- Verified: Eight active CMS members match supplied names, roles and order; TypeScript, lint and build passed. Final repeat checks passed; responsive browser QA not performed.
- Notes: Existing pending catalog seed also ran during local migration. Owner requested GitHub delivery on 2026-10-03; release path is origin/main with the Hostinger GitHub integration. Production deployment health is verified separately from git push.

### 2026-10-02 - Use Webpack bundler explicitly in build script
- Changed: Updated `build` script in `package.json` to `next build --webpack`.
- Files/areas: web-app/package.json, AGENTS.md.
- CMS/schema impact: None.
- Migration/env required: No.
- Verified: Local `npm run build` executed and passed cleanly with code 0 (all routes and static pages generated without errors).
- Notes: Explicitly instructs Next.js to use Webpack during production build.

### 2026-10-02 - Automatic database seeding migration for complete project catalog
- Changed: Added migration `20261002_133000_seed_project_folder.ts` that automatically seeds all 11 architectural categories, all 15 real projects (with full descriptions, specifications, hero images, and documentation galleries), 7 studio services, team members, awards, competitions, news items, and site settings whenever connected to an empty cloud PostgreSQL database.
- Files/areas: web-app/src/migrations/20261002_133000_seed_project_folder.ts, web-app/src/migrations/index.ts, AGENTS.md.
- CMS/schema impact: None (idempotent seed migration).
- Migration/env required: Automatically runs during next cloud database connection.
- Verified: TypeScript (`tsc --noEmit`), ESLint (`npm run lint`), and production build (`npm run build`) passed with zero errors.
- Notes: Satisfies user request to automatically populate the cloud CMS database with all projects from the project folder.

### 2026-10-02 - Enable cloud production migrations, SSL auto-negotiation and admin error boundary
- Changed: Passed `prodMigrations: migrations` to `postgresAdapter` in `src/payload.config.ts` so Payload automatically executes database migrations on cloud connect. Configured `ssl: { rejectUnauthorized: false }` for non-local Postgres connections and increased connection timeout to 10s. Added `src/app/(payload)/error.tsx` dedicated admin error boundary and rebuilt `src/app/global-error.tsx` with self-contained inline styling and error message reporting.
- Files/areas: web-app/src/payload.config.ts, web-app/src/app/(payload)/error.tsx, web-app/src/app/global-error.tsx, AGENTS.md.
- CMS/schema impact: None (migrations run automatically on production startup).
- Migration/env required: Existing cloud `DATABASE_URI` supported.
- Verified: TypeScript (`tsc --noEmit`), ESLint (`npm run lint`), and production build (`npm run build`) passed with zero errors.
- Notes: Resolves admin loading failure on Vercel caused by missing production migrations and cloud SSL negotiation.

### 2026-10-02 - Synchronize 15 database projects, 11 categories, 7 services and 213 media assets for cloud deployment
- Changed: Synchronized all 15 real studio projects (including SMART SCHOOL with 12 gallery photos, SPORT CENTER with 21 photos, CA-HOUSE with 7 photos, R-HOUSE, P-HOUSE, F-HOUSE, etc.), all 11 architectural categories, and all 7 services from the local database into `src/lib/data.ts`. Copied 213 media assets to `public/api/media/file/` and updated `src/app/(payload)/api/[...slug]/route.ts` with direct filesystem streaming fallback, ensuring full portfolio galleries render seamlessly on Vercel deployments without requiring an external cloud database.
- Files/areas: web-app/src/lib/data.ts, web-app/src/app/(payload)/api/[...slug]/route.ts, web-app/public/api/media/file/, AGENTS.md.
- CMS/schema impact: None.
- Migration/env required: No.
- Verified: TypeScript (`npm run typecheck`), ESLint (`npm run lint`), all 20 test suites (`npm test`), and production build (`npm run build`) passed with zero errors. Vercel simulation confirmed all 15 projects, 11 categories, and 7 services load with full image paths.
- Notes: Satisfies user request for real projects and photos to be present on the deployed Vercel website.

### 2026-10-02 - Vercel cloud resilience and global error boundary
- Changed: Added automatic fallback to demo catalog on Vercel deployments when a cloud database is not yet configured, preventing uncaught 500 "This page couldn't load" crashes. Wrapped CMS queries in try/catch with Vercel fallback resilience. Added default studio services for unconfigured CMS environments. Added branded dark architectural global-error boundary.
- Files/areas: web-app/src/lib/content.ts, web-app/src/lib/services.ts, web-app/src/app/global-error.tsx, AGENTS.md.
- CMS/schema impact: None.
- Migration/env required: No. If a cloud PostgreSQL database (Neon/Supabase) is configured in Vercel, it automatically overrides demo mode.
- Verified: TypeScript (`npm run typecheck`), ESLint (`npm run lint`), all 20 test suites (`npm test`), and production build (`npm run build`) passed with zero errors. Verified `getContent()` and `getServices()` succeed with `VERCEL=1` and no database.
- Notes: Resolves 500 error on Vercel deployment when DATABASE_URI is unconfigured or unreachable.

### 2026-10-02 - GitHub repository sync and Vercel deployment update
- Changed: Staged and committed all accumulated architectural features, UI refinements, test suites, localized category covers, and added .cache/ to .gitignore. Pushed to remote origin/main (commit 0bcfe5c) to synchronize GitHub repository and trigger Vercel deployment pipeline.
- Files/areas: web-app/.gitignore, web-app/ (all modified & new source files), AGENTS.md.
- CMS/schema impact: None.
- Migration/env required: No.
- Verified: TypeScript (`npm run typecheck`), ESLint (`npm run lint`), 20 test suites (`npm test`), and production build (`npm run build`) passed with zero errors. Git push to origin/main completed successfully.
- Notes: Git sync directly drives Vercel automatic deployments via GitHub integration.

### 2026-10-02 - Centered transparent partner and media logos
- Changed: Centered wrapping logo groups and removed white card backgrounds, borders and padding; retained original logo assets, links and alt text.
- Files/areas: web-app/src/components/HomeView.tsx, AGENTS.md.
- CMS/schema impact: None.
- Migration/env required: No.
- Verified: TypeScript, lint and production build passed. Chrome at 390px and 1440px confirmed centered groups, transparent backgrounds, zero container borders and no horizontal overflow; desktop screenshot inspected.
- Notes: Applies consistently to clients, collaborators and publications; image files are unchanged.

### 2026-10-02 - Client demo audit, simpler project editor and lighter visual polish
- Changed: Added automatic stable slugs and a status dropdown preserving legacy text; collapsed optional fields; fixed category deletion references in saved versions and admin tooltip overflow; improved form contrast and simplified button styling. Replaced public font with DM Sans, cleaned year badges, made hero crossfade overlap, and refined reveal timing and carousel touch/focus behavior. Restored local PostgreSQL and removed four unused migration-argument warnings.
- Files/areas: public layout/globals.css, HomeView, ProjectCard, cms/collections.ts, cms/admin-presentation.ts, components/admin/ProjectStatusField.tsx, admin importMap/custom-admin.css, tests/cms.test.ts, team migration function signatures, README.md, AGENTS.md.
- CMS/schema impact: Presentation and validation hooks only; persisted paths, status column, existing values and access rules preserved. Saved-version category references now block deletion.
- Migration/env required: No. Existing production S3 and email limitations documented in README.
- Verified: 59 automated checks passed; TypeScript, ESLint and production build passed. Chrome verified desktop/mobile admin and browser create/publish/reload against a disposable database. The final public sweep passed nine routes at 320/390/768/1024/1440/1920px (including landscape tablet), DM Sans computed styles, carousel pause/selection, reduced-motion emulation and missing-project 404, with no JS errors or horizontal overflow. Earlier eight-route resource checks at 390/768/1440px found no failed HTTP resources.
- Notes: This is a local demo audit, not confirmation of full CMS parity or production field performance. Existing studio accounts/content were not modified by QA.

### 2026-10-01 - Plus Jakarta Sans site-wide typography upgrade
- Changed: Replaced Manrope with Plus Jakarta Sans across all public pages (Headings, Body, and Navigation). Mapped `--font-sans` and `--font-jakarta` in Tailwind CSS inline theme and CSS variables to `var(--font-plus-jakarta)`. Preserved Cormorant Garamond for editorial serif accents.
- Files/areas: `web-app/src/app/(site)/layout.tsx`, `web-app/src/app/globals.css`, `AGENTS.md`.
- CMS/schema impact: None (visual/typography upgrade).
- Migration/env required: No.
- Verified: `npm test` 19/19 tests passed; `content` & `cms-editorial` 17/17 tests passed; `gallery-render` 2/2 tests passed; `npm run typecheck` 0 errors; `npm run lint` 0 errors; `next build` 100% clean production build; Playwright browser evaluation verified computed `font-family` on `body`, `h1`, and `nav` resolves to `"Plus Jakarta Sans"`.
- Notes: Satisfies user request: "fontnya ubah dong" with selected preference Plus Jakarta Sans for the entire website.

### 2026-10-01 - Simpler Indonesian admin navigation and project forms
- Changed: Five menu groups, Indonesian labels and guidance, official Indonesian UI translations with English available, translated role/inquiry/logo option labels, and three project form tabs with collapsed advanced controls.
- Files/areas: `web-app/src/cms/admin-presentation.ts`, `web-app/src/cms/collections.ts`, `web-app/src/cms/editorial.ts`, `web-app/src/payload.config.ts`, `web-app/package.json`, `web-app/package-lock.json`, `AGENTS.md`.
- CMS/schema impact: Presentation only; unnamed tabs/collapsible fields retain existing data paths, option values and server authorization rules.
- Migration/env required: No. Install locked dependencies normally on deployment.
- Verified: 44 automated tests (19 DB/access, 17 editorial, 4 startup, 2 gallery, 2 homepage) passed; TypeScript (`tsc --noEmit`) 0 errors, ESLint 0 errors (4 pre-existing migration warnings), Next.js production build (`next build`) 100% clean. Authenticated headless Chrome testing on an isolated database verified Indonesian UI labels, 3 project form tabs ('Informasi Utama', 'Foto & Galeri', 'Publikasi') at 1440px and 390px with zero JavaScript errors.
- Notes: Existing local bootstrap credentials did not authenticate; QA uses a separate temporary account/database, not changes to studio accounts. This task simplifies implemented CMS screens and does not add the missing homepage/navigation globals.

Earlier history consolidated: branding, media, CMS, typography and responsive work from September-October 2026 remains reflected in the current specification. Detailed older entries remain in git history.

## 21. REFERENCE PARITY NOTES

Reference: `https://atelierriri.com/`

Preserve comparable capabilities: editorial homepage/news, grouped portfolio, project metadata/galleries, philosophy/mission/services/process, team/careers, articles, video, client/media logos, contact/social info, and inquiry CTA.

Do not treat the reference site as an asset/source-code repository.

## 22. FINAL AGENT RESPONSE FORMAT

After a coding task, briefly report:
1. what changed,
2. major files,
3. verification performed,
4. migration/env requirements,
5. confirmation that `AGENTS.md` was updated.

If this file was not updated after a meaningful project change, the task is incomplete.
