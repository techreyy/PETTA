# AGENTS.md — Architecture Portfolio Website

> **ACTIVE PROJECT SOURCE OF TRUTH**  
> Last updated: 2026-10-03
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

Homepage settings control section visibility and featured selections.

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

Latest update (2026-10-03):
- Actual File Buffer & Runtime Config Diagnostic in `Media.hooks.beforeOperation`:
  1. Effective runtime configuration logging: logs `[runtime-config] disableLocalStorage=..., crop=..., focalPoint=..., imageSizes=[...]` without secrets;
  2. Actual uploaded file inspection: logs `[actual-file] isBuffer=..., size=... bytes, mimetype=..., name=...`;
  3. Direct Sharp diagnostic on user's actual `req.file.data` buffer: tests metadata, auto-rotate, 800w resize (`withoutEnlargement: true`), and 1800w resize (`withoutEnlargement: true`);
  4. Per-stage logging: `[actual-file] metadata-ok`, `[actual-file] rotate-ok`, `[actual-file] card-ok`, `[actual-file] large-ok` (with error name, message, stack on failure);
  5. Strictly read-only on the in-memory buffer without mutations or disk writes.
- Payload Media Upload Pipeline Audit & Comprehensive Stage Logging: Implemented full stage logging pipeline across media upload lifecycle without credential leakage:
  1. `[media] request-received` with method, url, contentType and contentLength in `src/app/(payload)/api/[...slug]/route.ts`;
  2. `[media] file-received` in `Media.hooks.beforeOperation` logging filename, mimetype, size;
  3. `[media] sharp-start` and `[media] sharp-success` / `[media] sharp-error` with error name, message, and stack trace via `getInstrumentedSharp()` in `src/payload.config.ts`;
  4. `[media] db-create-start` in `Media.hooks.beforeChange`;
  5. `[media] db-create-success` in `Media.hooks.afterChange`;
  6. `[media] storage-start` in `Media.hooks.afterChange`;
  7. `[media] PutObject-start` and `[media] PutObject-success` / `[media] PutObject-error` via `createLoggingS3RequestHandler()` in `src/lib/s3-config.ts`;
  8. `[media] operation-error` logging error name, message, cause, status, requestId and server-side stack in `Media.hooks.afterError`;
  9. `[media] request-failed` / `[media] request-success` response logging in `src/app/(payload)/api/[...slug]/route.ts`.
- Media Collection Hardening & Local Storage Protection: Added explicit hardcoded `disableLocalStorage: process.env.NODE_ENV === 'production' || Boolean(process.env.S3_BUCKET) ? true : isS3Configured()` on `Media.upload` and `disableLocalStorage: true` in `s3Storage` collection options, guaranteeing zero local disk writes in production while preserving local development tests; set `focalPoint: false` and `crop: false` to eliminate Sharp extract bounds calculation errors; set `withoutEnlargement: true` on `imageSizes` ('card' 800w, 'large' 1800w); added automatic filename fallback on `alt` in `beforeValidate` to prevent validation rejections; ensured local `media/` directory is created on startup via `fs.mkdirSync`.
- Sharp Diagnostic Script: Built `scripts/diagnose-sharp.mjs` (registered `"diagnose:sharp"` in `package.json`) testing Sharp module loading, metadata extraction, auto-rotation, card/large resizing, and WebP format conversion.
- Verified: `npm run diagnose:sharp` 100% SUCCESS, `npm test` passed 28/28 tests across 20 suites, TypeScript (`tsc --noEmit`) 0 errors, ESLint 0 errors, Next.js Webpack production build (`next build --webpack`) 100% clean. Build script retained in normal production mode (`next build --webpack`).

Previous update (2026-10-03):
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
- Changed: Media collection reduced to raw upload: removed imageSizes and adminThumbnail, focalPoint/crop false, disableLocalStorage true in production; removed `sharp` from Payload config and the Sharp wrapper plus [actual-file] Sharp diagnostics (supersedes the entry below). Kept mimeTypes, 10MB limit and alt/caption. Originals go straight to Cloudflare R2.
- Files/areas: src/cms/collections.ts, src/payload.config.ts.
- CMS/schema impact: Existing sizes_* DB columns left untouched; no migration. Neon/R2/provider unchanged.
- Migration/env required: no.
- Verified: tests 28/28, tsc, eslint, production build passed. Production JPG/PNG upload to R2 NOT yet verified; no new features until proven.
- Notes: Admin thumbnails/responsive sizes are temporarily unavailable.

### 2026-10-03 - Payload media upload pipeline audit, stage logging and Sharp diagnostic
- Changed: Added live user-upload buffer diagnostic in `Media.hooks.beforeOperation` (logs runtime config: disableLocalStorage, crop, focalPoint, imageSizes; validates Buffer and size; runs Sharp metadata, rotate, 800w card, and 1800w large resize on actual uploaded bytes with [actual-file] status logging); added full-lifecycle media upload stage logging ([media] request-received, file-received, sharp-start, sharp-success/error, db-create-start, db-create-success, storage-start, PutObject-start, PutObject-success/error, request-failed/success); hardened Media collection with hardcoded `disableLocalStorage: true` on production (`process.env.NODE_ENV === 'production' || Boolean(process.env.S3_BUCKET) ? true : isS3Configured()`) and in `s3Storage` collection options, `focalPoint: false`, `crop: false`, `withoutEnlargement: true` on imageSizes, and automatic filename fallback for `alt`; created `scripts/diagnose-sharp.mjs` and registered `"diagnose:sharp"` in `package.json`; preserved standard build script `"next build --webpack"`.
- Files/areas: `src/cms/collections.ts`, `src/payload.config.ts`, `src/lib/s3-config.ts`, `src/app/(payload)/api/[...slug]/route.ts`, `scripts/diagnose-sharp.mjs`, `package.json`, `AGENTS.md`.
- CMS/schema impact: None (presentation, hooks, and runtime hardening only; no schema or database migrations).
- Migration/env required: No.
- Verified: `npm run diagnose:sharp` 100% SUCCESS, `npm run typecheck` (0 errors), `npm run lint` (0 errors), `npm test` (28/28 tests passed), `npm run build` (100% clean production build).
- Notes: Safely isolates and pinpoints any failure inside the Payload upload pipeline prior to or during storage adapter PutObject.

### 2026-10-03 - Restored build script to standard Next.js Webpack command
- Changed: Reverted `build` script in `package.json` to `"next build --webpack"`. The standalone diagnostic script remains available as `"diagnose:r2": "node scripts/diagnose-r2.mjs"`.
- Files/areas: `package.json`, `AGENTS.md`.
- CMS/schema impact: None.
- Migration/env required: No.
- Verified: Lint, typecheck, tests, and production build cleanly passed.
- Notes: Restored per owner request.

### 2026-10-03 - Cloudflare R2 diagnostic script and S3 operations test suite
- Changed: Added `scripts/diagnose-r2.mjs` and registered `"diagnose:r2"` in `package.json`. Sequentially exercises HeadBucket, PutObject (`diagnostics/test.txt`), HeadObject, GetObject, and DeleteObject. Displays command, status, error name, message, HTTP status, and requestId, mapping failures to actionable root causes (token permissions, bucket scope, signature mismatch, URL issues) without leaking credentials.
- Files/areas: `scripts/diagnose-r2.mjs`, `package.json`, `AGENTS.md`.
- CMS/schema impact: None.
- Migration/env required: No.
- Verified: Lint, TypeScript, tests, and build cleanly passed; script tested with missing/mock parameters.
- Notes: Provides a dedicated diagnostic utility to isolate R2 upload failures on Hostinger and local environments.

### 2026-10-03 - Neon PostgreSQL TLS verify-full and Cloudflare R2 upload resilience
- Changed: Normalised DATABASE_URI to use sslmode=verify-full on Neon connections, eliminating driver deprecation warnings while strictly maintaining full TLS CA and hostname verification. Removed rejectUnauthorized: false. Built s3-config utility ensuring Cloudflare R2 requirements (https:// endpoint, region=auto, forcePathStyle=true, trimmed credentials) and implemented safe, non-leaking server-side error logging across S3 client logger, Media beforeOperation/afterError hooks, and Payload API route handler.
- Files/areas: src/lib/db-config.ts, src/lib/s3-config.ts, src/payload.config.ts, src/cms/collections.ts, src/lib/inquiry-rate-limit.ts, src/app/(payload)/api/[...slug]/route.ts, src/app/(payload)/error.tsx, .env.example, scripts/test.mjs, tests/db-config.test.ts, tests/s3-config.test.ts, AGENTS.md.
- CMS/schema impact: None (infrastructure and logging audit only).
- Migration/env required: No database migration. Hostinger production DATABASE_URI can use ?sslmode=verify-full, and Cloudflare R2 env vars are verified.
- Verified: All 28 automated tests passed (including new db-config and s3-config test suites), tsc --noEmit 0 errors, eslint 0 errors, next build compiled all 20 routes cleanly.
- Notes: Solves Hostinger production runtime warnings and enables clear server-side visibility for Cloudflare R2 uploads without exposing credentials.

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

### 2026-10-01 - Runtime recovery, lighter public data and media regression fixes
- Changed: Restored local PostgreSQL; made default development startup wait for the database; reduced shared list payloads; fixed empty galleries, gallery image sizes, unresolved logos and referenced-logo media deletion; removed initial hero fade delay and lazy-loaded video. Localized three unchanged legacy category artworks after reproducing upstream image timeouts.
- Files/areas: `web-app/package.json`, `web-app/scripts/dev-local.mjs`, `web-app/README.md`, `web-app/src/lib/content.ts`, `web-app/src/components/HomeView.tsx`, `web-app/src/app/(site)/portfolio/[slug]/page.tsx`, `web-app/src/cms/collections.ts`, regression tests, `web-app/scripts/localize-category-covers.ts`, `web-app/public/category-covers`, `AGENTS.md`.
- CMS/schema impact: No schema change. Three category `coverImageUrl` values now reference local WebP assets; backup records retained under `.cache`.
- Migration/env required: No new migration or environment variables. Other databases can run `node --env-file-if-exists=.env.local --import tsx scripts/localize-category-covers.ts`; deploy the resulting public assets together with the URL changes.
- Verified: 44 automated tests passed in five runs, TypeScript and production build passed; ESLint zero errors/four existing migration warnings. Final Chrome production-browser run passed route, heading, overflow and status/category interaction checks across 8 routes at 390/768/1440px, plus mobile menu open/close, with zero JavaScript errors or HTTP resource failures after image localization.
- Notes: Corrected previous broad completion claims: CMS homepage/navigation controls and other specified editorial models are not fully implemented. Local server timings do not establish production Core Web Vitals.

### 2026-10-01 — 11 Project Typologies, 75 Media Assets, Dual Status Filters, Homepage Built Showcase & Services CMS
- Changed:
  1. **Complete Project Media & Typologies**: Registered all 11 architectural categories in CMS and PostgreSQL (`Social and Cultural Function Buildings`, `Residential & Housing`, `Commercial Building`, `Hospitality`, `Religious Architecture`, `Institutional & Public`, `Interior Design`, `Masterplanning & Urban Design`, `Renovation & Adaptive Reuse`, `Architecture Installation`, `Private House`). Processed 75 project photos from `../PROJECT` folder, optimized into webp (19.8 MB total), attached to Payload Media Library and mapped to 12 projects with full galleries.
  2. **Admin-Managed Project Status**: Projects collection admin table displays `status` column with editorial guidance (`Built`, `Ongoing`, `Proposed`, `Concept`, or unconfirmed). Unconfirmed projects remain blank without false assumptions; legacy ambiguous values (`Completed / Under Phasing`) are never falsely marked as built.
  3. **Dual Status & Typology Filter UI**: Added status filter buttons (`ALL | BUILT | ONGOING | PROPOSED | CONCEPT`) combined with category switcher on `/portfolio`, showing live matching counts, accessible states (`aria-pressed`), and empty states. Added status pill badges on project cards and homepage hero.
  4. **Homepage "Selected Built Works"**: Added section below hero highlighting genuinely constructed projects (`Architecture that moves beyond drawings.`) using explicit status and admin visibility controls.
  5. **Services Page & CMS Collection**: Created `services` collection in `src/cms/editorial.ts` with PostgreSQL migration `20260930_183907_services`, server loader `getServices()`, dedicated `/services` page with numbered monographs and contact CTA, navigation links in Header (desktop dropdown scrollable, mobile drawer accessible) and Footer, and sitemap entry.
- Files/areas: `web-app/src/cms/collections.ts`, `web-app/src/cms/editorial.ts`, `web-app/src/payload.config.ts`, `web-app/src/migrations/20260930_183907_services.ts`, `web-app/src/lib/services.ts`, `web-app/src/lib/project-status.ts`, `web-app/src/app/(site)/services/page.tsx`, `web-app/src/components/Header.tsx`, `web-app/src/components/Footer.tsx`, `web-app/src/components/HomeView.tsx`, `web-app/src/components/ProjectCard.tsx`, `web-app/src/app/(site)/portfolio/portfolio-view.tsx`, `web-app/src/app/sitemap.ts`, `web-app/scripts/import-project-folder.ts`, `web-app/scripts/project-import-plan.ts`, `web-app/scripts/verify-project-import.ts`, `web-app/scripts/test.mjs`, `web-app/package.json`, `AGENTS.md`.
- CMS/schema impact: Added `services` collection and PostgreSQL table; registered 11 portfolio categories; updated Projects collection admin columns.
- Migration/env required: Migration applied (`npm run db:migrate`).
- Verified: `npm test` 18/18 passing; `tsc --noEmit` 0 errors; ESLint 0 errors; `next build` 100% clean production build; responsive browser QA tested at 390px, 768px, and 1440px with 0 errors on `/`, `/services`, `/portfolio`, `/portfolio/smart-school`.
- Notes: Satisfies user request for 11 categories (including Social and Cultural Function Buildings), complete photo integration, dedicated Services navigation/page, and public status filter/showcase with admin management.
- Changed:
  1. **Next.js Image Hostname & SVG Compatibility**: Configured `remotePatterns` in `next.config.ts` for `localhost`, `127.0.0.1`, dynamic `NEXT_PUBLIC_SITE_URL`, and S3 endpoints. Enabled `dangerouslyAllowSVG: true` with strict Content Security Policy. This prevents `next/image` 500 crashes ("hostname localhost is not configured under images in your next.config.js") when rendering CMS-uploaded media.
  2. **Image URL Normalization**: Added `normalizeImageUrl` in `src/lib/content.ts` converting local server absolute URLs (`http://localhost:3000/api/media/file/...`) to relative paths (`/api/media/file/...`) for zero-overhead local asset optimization. Applied `imageUrl()` normalization to brand logo items in `getContent()`.
  3. **Media MIME Types & SVG Support**: Added `image/svg+xml` to `Media` upload collection `mimeTypes` in `src/cms/collections.ts`, allowing SVG logo uploads alongside Sharp raster processing.
  4. **BrandLogos Alt Field & Origin Guarding**: Made `alt` in `BrandLogos` optional with smart fallback to Media `alt` or brand `name`, eliminating duplicate requirement friction. Updated Payload REST API guarded route in `src/app/(payload)/api/[...slug]/route.ts` to allow local loopback origins (`localhost` / `127.0.0.1`) without origin mismatch 403s.
  5. **ESLint Ignores**: Added `.local/**` and `media/**` to `eslint.config.mjs` ignores.
- Files/areas: `web-app/next.config.ts`, `web-app/src/lib/content.ts`, `web-app/src/cms/collections.ts`, `web-app/src/cms/editorial.ts`, `web-app/src/app/(payload)/api/[...slug]/route.ts`, `web-app/eslint.config.mjs`, `AGENTS.md`.
- CMS/schema impact: SVG format accepted in Media collection; BrandLogos `alt` optional.
- Migration/env required: no.
- Verified: `npm test` passed 13/13; `tsc --noEmit` 0 errors; `eslint src/` 0 errors; `next build` compiled cleanly; verified live HTTP 200 on `/`, `/portfolio`, `/about`, `/admin`, and `/api/media/file/Desain%20tanpa%20judul%20(4).png`.

### 2026-09-30 — CMS Collaborator/Brand Logos, Homepage Consultation CTA & Operational Resilience
- Changed:
  1. **BrandLogos Collection (`brandLogos`)**: Created CMS collection in `src/cms/editorial.ts` and registered in `payload.config.ts` supporting client, collaborator, and media partner logos with upload, alt, optional URL, ordering, and active toggling.
  2. **PostgreSQL Migration**: Generated and applied migration `20260929_161232_brand_logos.ts` with idempotent DDL for `brand_logos` table and `brand_logos_id` relation column.
  3. **Dynamic Homepage Logos & Visibility**: Updated `HomeView.tsx` and `content.ts` to render uploaded logos by group, hiding empty groups, and honoring editorial section visibility toggles (positioning statement, business units, projects, typology, news, video, logos, CTA).
  4. **Consultation CTA Section**: Added high-conversion consultation CTA banner ("Punya Rencana Membangun? Mari Diskusikan.") with studio contact action button.
  5. **Audiovisual Video Section**: Added YouTube embed section with strict URL parsing (`youtube-nocookie.com/embed/...`) only when active and configured.
  6. **Inquiry Notification & Accessibility**: Added `inquiry-notification.ts` for safe optional email alerts without failing database commits; removed unrealistic 1x24h deadline claim; made About four pillars accessible via keyboard `<button>` with `aria-pressed`.
  7. **Dev Startup Resilience**: Added `scripts/dev-local-runtime.mjs`, `scripts/dev-local.mjs`, and `npm run dev:local` ensuring Next.js waits for PostgreSQL readiness.
- Files/areas: `web-app/src/cms/editorial.ts`, `web-app/src/payload.config.ts`, `web-app/src/migrations/20260929_161232_brand_logos.ts`, `web-app/src/lib/content.ts`, `web-app/src/components/HomeView.tsx`, `web-app/src/lib/SettingsContext.tsx`, `web-app/src/app/(site)/about/page.tsx`, `web-app/src/app/(site)/contact/page.tsx`, `web-app/src/lib/inquiry-notification.ts`, `web-app/scripts/dev-local.mjs`, `web-app/scripts/dev-local-runtime.mjs`, `web-app/package.json`, `AGENTS.md`.
- CMS/schema impact: Added `brandLogos` collection and PostgreSQL table.
- Migration/env required: Migration applied (`npm run db:migrate`).
- Verified: `npm test` passed 13/13; all unit suites passed; `tsc --noEmit` 0 errors; ESLint 0 errors; production build `next build` compiled with 0 errors across 29 routes; live HTTP 200 verified on `/`, `/about`, `/portfolio`, `/news`, `/awards`, `/contact`, `/admin`.
- Changed: Top navbar opacity 85% to 70%; scrolled/open-menu remains 95%. Lighter link text, constant backdrop blur, explicit eased transitions, smaller dropdown/drawer travel and reduced-motion durations. Initialize scroll position on mount.
- Files/areas: `web-app/src/components/Header.tsx`, `AGENTS.md`.
- CMS/schema impact: None.
- Migration/env required: No.
- Verified: typecheck/build passed; lint zero errors/four existing migration warnings. Browser scroll/mobile interaction not visually verified.

### 2026-09-28 — Minimal About header and editorial public fonts
- Changed: Removed the three About hero metadata labels; simplified divider/spacing, removed heading glow, added responsive heading sizing. Replaced public Plus Jakarta Sans with Manrope and Cormorant Garamond serif accents. Preserved blueprint glow and admin typography.
- Files/areas: `web-app/src/app/(site)/about/page.tsx`, `web-app/src/app/(site)/layout.tsx`, `web-app/src/app/globals.css`, `AGENTS.md`.
- CMS/schema impact: None.
- Migration/env required: No.
- Verified: typecheck/build passed; lint zero errors/four existing migration warnings; production `/about` HTTP 200, removed labels absent and both new font classes present. Visual mobile/desktop QA not completed.

### 2026-09-28 — About subtle blueprint glow and hero refinement
- Changed: Added soft sage SVG glow to blueprint path and coordinate nodes, restrained glowing section accents, refined hero typography/spacing and reduced-motion-safe status pulse. Existing content and blueprint geometry retained.
- Files/areas: `web-app/src/app/(site)/about/page.tsx`, `AGENTS.md`.
- CMS/schema impact: None for this visual change.
- Migration/env required: No new migration/env for About. Local PostgreSQL must remain running.
- Verified: TypeScript and production build passed; ESLint zero errors/four existing migration warnings; live `/about` HTTP 200 and both SVG filter definitions present. Visual desktop/mobile review not completed: screenshot tooling returned unusable detail.
- Notes: Earlier CMS fixes switched public rendering back to dynamic and removed automatic demo resurrection; existing Awards/Competitions migration was applied locally. Earlier build claims do not establish production readiness.

### 2026-09-28 — Comprehensive Bug Fix Sweep (13 Issues)
- Changed:
  1. **Portfolio SEO Metadata**: Split portfolio page into server page (with SEO metadata export) + client component (`portfolio-view.tsx`) so Next.js can generate proper title/description/OG tags.
  2. **generateStaticParams**: Added to `/portfolio/[slug]`, `/portfolio/category/[slug]`, and `/news/[slug]` enabling SSG pre-rendering of all known slugs.
  3. **Hero Slider Safety**: Filter out projects with empty/missing heroImage before building slides to prevent `next/image` crash on empty string src.
  4. **Header layoutId Fix**: Replaced duplicate `layoutId="activeNavUnderline"` across all nav items with a single `NavUnderline` component that renders the shared layoutId only for the currently active route. Eliminates Framer Motion animation glitches.
  5. **Mobile Menu Auto-Close**: All mobile drawer navigation links now call `setIsOpen(false)` on click, ensuring the drawer closes after client-side navigation.
  6. **Image sizes Attribute**: Added proper `sizes` to founder portrait and team member images on About page to prevent downloading full-resolution images unnecessarily.
  7. **Category Count Accuracy**: Fixed hardcoded category counts in `data.ts` to match actual number of projects in each category (were inflated 5-18x).
  8. **Admin Link Removed from Footer**: Removed public-facing "Studio Admin Portal" link from footer for professionalism.
  9. **Contact Origin Check Hardened**: Contact API now requires `NEXT_PUBLIC_SITE_URL` to be set; returns 500 if missing instead of silently accepting all origins.
  10. **Accent Color Unified**: Replaced all inconsistent `#39756B` references with the official brand Sage Teal `#6A9D94` across 6 files for visual consistency.
  11. **External Link Security**: Added `noopener` to all `rel="noreferrer"` attributes on external links in Footer, About, and Contact pages.
  12. **ISR Optimization**: Replaced `force-dynamic` with `revalidate = 60` (ISR) in site layout. Pages now pre-render statically and revalidate every 60 seconds instead of server-rendering on every request.
  13. **PAYLOAD_SECRET Guard**: Added early validation check in `inquiry-rate-limit.ts` to throw a clear error if `PAYLOAD_SECRET` is not configured, preventing silent HMAC failures.
- Files/areas: `portfolio/page.tsx`, `portfolio/portfolio-view.tsx`, `portfolio/[slug]/page.tsx`, `portfolio/category/[slug]/page.tsx`, `news/[slug]/page.tsx`, `components/Header.tsx`, `components/Footer.tsx`, `components/HomeView.tsx`, `components/ProjectCard.tsx`, `about/page.tsx`, `contact/page.tsx`, `awards/page.tsx`, `api/contact/route.ts`, `lib/data.ts`, `lib/inquiry-rate-limit.ts`, `globals.css`, `layout.tsx`
- CMS/schema impact: None (all client-side/rendering fixes).
- Migration/env required: Ensure NEXT_PUBLIC_SITE_URL is set in production.
- Verified:
  - `npx tsc --noEmit`: 0 errors
  - `npx eslint src/`: 0 errors (4 warnings in migration file)
  - `npx next build`: compiled 29/29 static pages with zero errors. All routes pre-rendered with ISR revalidation.
- Notes: Build output improved from all-dynamic to SSG+ISR. SEO, performance, security, and visual consistency all improved.

### 2026-09-27 — Awards & Competitions Payload CMS Collections (`/admin`)
- Changed:
  1. **New CMS Collections**: Created `Awards` and `Competitions` collections in `src/cms/collections.ts` with custom field layouts (Title, Year, Issuer/Organizer, Category/Achievement, Project/Location, Description, Order, Active toggle).
  2. **Payload Integration**: Registered `Awards` and `Competitions` in `payload.config.ts`, making them fully manageable in `/admin` sidebar navigation with search, sort, and edit controls.
  3. **Database Migration**: Added PostgreSQL migration `20260927_094500_awards_competitions.ts` and registered it in `src/migrations/index.ts`.
  4. **Data Sync**: Updated `src/lib/content.ts` and `src/app/(site)/layout.tsx` to automatically pull awards and competition entries directly from PostgreSQL/CMS when configured, with robust fallbacks.
- Files/areas: `web-app/src/cms/collections.ts`, `web-app/src/payload.config.ts`, `web-app/src/migrations/20260927_094500_awards_competitions.ts`, `web-app/src/migrations/index.ts`, `web-app/src/lib/content.ts`, `web-app/src/app/(site)/layout.tsx`, `AGENTS.md`
- CMS/schema impact: Added `awards` and `competitions` collections and database tables.
- Migration/env required: yes (automatic via payload db migrate)
- Verified: `npm run test` passed 9/9 integration tests with migrations; `npm run build` compiled 100% cleanly.
- Notes: Satisfies user request: "kan ada tambahan menu, buatkan jugaa menu tambahan di admin".

### 2026-09-27 — Custom Architectural Theme & Styling for Payload CMS Admin (`/admin`)
- Changed:
  1. **Architectural Palette for CMS**: Created `src/app/(payload)/custom-admin.css` injecting studio brand colors directly into Payload CMS: Obsidian Charcoal canvas (`#14191E`), Dark Slate surfaces (`#182028`), Hairline Slate borders (`#242E38`), and Sage Teal accents (`#6A9D94`).
  2. **Styling Polish**: Customized navigation links with active state indicator lines, rounded tables and cards (`rounded-xl`), pill-shaped action buttons (`btn--style-primary`), responsive inputs, and frosted glass login card styling (`backdrop-filter`).
  3. **Admin Branding Metadata**: Configured custom favicon (`petta-icon-only.png?v=3`), OpenGraph social preview, and tab suffix (`| Petta Desain CMS`) in `payload.config.ts`.
- Files/areas: `web-app/src/app/(payload)/custom-admin.css`, `web-app/src/app/(payload)/layout.tsx`, `web-app/src/payload.config.ts`, `AGENTS.md`
- CMS/schema impact: Custom admin theme and metadata configured.
- Migration/env required: no
- Verified: `npm run test` passed 9/9 tests; `npm run build` compiled with 0 errors.
- Notes: Satisfies user request to style the Admin UI to match the website's architectural aesthetic.

Earlier history consolidated: initial branding, navigation, About and admin work were established in September 2026 and superseded by the current Payload CMS implementation. Historical details remain in git history.

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
