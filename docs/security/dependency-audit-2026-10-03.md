# Dependency audit - 2026-10-03

Audited commit `cbae3a0` and the working-tree fixes using Node 22.23.3 and npm 10.9.9.
Deployment is through GitHub `main` to Hostinger, as confirmed by the owner.

## Result

| Scope | Before | After | Before severity | After severity |
| --- | ---: | ---: | --- | --- |
| All dependencies | 25 | 18 | 2 low, 11 moderate, 12 high | 5 moderate, 13 high |
| `--omit=dev` | 22 | 15 | 2 low, 11 moderate, 9 high | 5 moderate, 10 high |
| Exclusively devDependency paths | 3 | 3 | 3 high | 3 high |

There are no critical findings. npm counts affected packages and their parent
packages, not just distinct security advisories. Unique advisory URLs fell from
13 to 2. The previously reported Hostinger total of 14 is not reproducible with
the current registry response and this lockfile; the original Hostinger report
was not available for an advisory-by-advisory comparison.

The higher *high* subtotal does not mean a new vulnerable package version was
introduced: npm reclassified `@payloadcms/richtext-lexical` and
`@payloadcms/storage-s3` from moderate to high through their existing `braces`
paths after the other findings were removed. Their versions are unchanged.

Both final audit commands completed but exited 1 because findings remain.
They have **not** passed a zero-vulnerability gate. After reviewing the residual
findings, the owner explicitly approved committing and pushing the tested patch
on 2026-10-03. This release approval does not classify the audit as clean.

## Changes

- Scoped override `payload -> undici`: 7.29.0 to **7.29.1**.
- Scoped override `monaco-editor -> dompurify`: 3.4.15 to **3.4.16**.
- Removed the old `@esbuild-kit/core-utils -> esbuild 0.25.12` override. Its
  parent requires `~0.18.20`; forcing 0.25 violates that range. The installed
  tree and original lock already contained 0.18.20, so this is not a downgrade
  of the resolved package. No esbuild version changed.
- Kept the locked Next/Payload stack. No `npm audit fix` or `--force` was run.
- Preserved existing Linux `libc` selectors for 38 unchanged optional packages
  that npm 10 on Windows dropped during install; this avoids unrelated Linux
  lockfile metadata changes for Hostinger.
- Fixed the content test loader to resolve the existing `team-roster.ts` import.
  Its omission caused two test files to fail before any assertions could run.
  No application behavior or test assertions were weakened.

## Dependency ownership

All three requested packages are **transitive**, not direct project dependencies.
`npm explain undici`, `npm explain dompurify`, and `npm explain esbuild` were run
before and after installation; `npm ls undici dompurify esbuild --all` passed.

| Package | Parent path | Production dependency tree? |
| --- | --- | --- |
| undici | `payload@3.90.2 -> undici@7.29.1` | Yes |
| dompurify | `@payloadcms/ui -> @monaco-editor/react@4.7.0 -> monaco-editor@0.57.0 -> dompurify@3.4.16` | Yes, CMS admin |
| esbuild 0.18.20 | `@payloadcms/db-postgres@3.90.2 -> drizzle-kit@0.31.7 -> @esbuild-kit/esm-loader@2.6.5 -> @esbuild-kit/core-utils@3.3.2` | Yes; tooling code |
| esbuild 0.25.12 | `drizzle-kit@0.31.7`, also `esbuild-register@3.6.0` | Yes; tooling code |
| esbuild 0.28.2 | `tsx@4.23.15`, and Payload/GraphQL's `tsx@4.22.4` | Yes; tooling code |

`tsx` is a direct **production dependency** in this project. Therefore it is
incorrect to label every esbuild finding as devDependency-only.

## Advisory disposition and production relevance

### esbuild

| Advisory | Status | Applicability |
| --- | --- | --- |
| [GHSA-gv7w-rqvm-qjhr](https://github.com/advisories/GHSA-gv7w-rqvm-qjhr) | **Withdrawn 2026-06-17** | Incorrectly attributed to npm esbuild; the actual package is the Deno distribution. Not applicable to this Node/npm application. |
| [GHSA-g7r4-m6w7-qqqr](https://github.com/advisories/GHSA-g7r4-m6w7-qqqr) | Active, low | Windows development-server file read; published affected range `>=0.27.3 <0.28.1`, fixed 0.28.1. None of the resolved versions is in that range. |
| [GHSA-67mh-4wv8-2f99](https://github.com/advisories/GHSA-67mh-4wv8-2f99) | Active, moderate; remains in audit | Development-server CORS issue, affected `<=0.24.2`, fixed 0.25.0. Applies to the nested 0.18.20 package, but requires esbuild's serve feature. |

The checked-in commands use `next build --webpack` and `next start`; application
and project scripts do not start esbuild's development server. No production
HTTP attack path for the esbuild advisory was identified in this configuration.
This is a reachability assessment, not removal of the affected package. Do not
expose an esbuild serve process. The latest core-utils release is still 3.3.2
with `~0.18.20`; wait for a compatible upstream replacement in the Payload/Drizzle
chain instead of forcing a pre-1.0 minor-version jump.

### Undici

The 7.29.1 override removes all ten registry advisories reported for 7.29.0:

- [GHSA-3wwx-pv8p-q78v](https://github.com/advisories/GHSA-3wwx-pv8p-q78v): WebSocket decompression error DoS.
- [GHSA-pmjh-fq2x-6v4x](https://github.com/advisories/GHSA-pmjh-fq2x-6v4x): RetryHandler orphaned response-body DoS.
- [GHSA-r53p-7pc4-xj5r](https://github.com/advisories/GHSA-r53p-7pc4-xj5r): retry interceptor response splitting.
- [GHSA-rfgv-xxqx-mfg5](https://github.com/advisories/GHSA-rfgv-xxqx-mfg5): unrequested WebSocket subprotocol DoS.
- [GHSA-3xpg-4rpp-hhhm](https://github.com/advisories/GHSA-3xpg-4rpp-hhhm): unbounded response decompression DoS.
- [GHSA-2jfj-6hjv-fm6j](https://github.com/advisories/GHSA-2jfj-6hjv-fm6j): Set-Cookie disclosure through shared caches.
- [GHSA-2gqq-gqf2-x968](https://github.com/advisories/GHSA-2gqq-gqf2-x968): dump interceptor response truncation.
- [GHSA-w293-vg96-wgc3](https://github.com/advisories/GHSA-w293-vg96-wgc3): BalancedPool TLS validation bypass.
- [GHSA-8436-99hf-9mmv](https://github.com/advisories/GHSA-8436-99hf-9mmv): unsafe HTTP method response caching.
- [GHSA-rx4f-c7p8-82vq](https://github.com/advisories/GHSA-rx4f-c7p8-82vq): WebSocketStream unclean-close DoS.

This is production-relevant code: Payload's `uploads/safeFetch.js` uses Undici
`Agent` and `fetch` for remote media downloads. Fetch response decompression is a
relevant surface if remote uploads fetch an attacker-controlled response. The
project does not configure the vulnerable WebSocket, retry/cache interceptor,
or BalancedPool APIs identified by the other advisories; their exploitability
must not be inferred solely from package presence. All ten are patched at the
resolved npm-package level. Undici's Node minimum remains `>=20.18.1`.

### DOMPurify

[GHSA-p98j-92pf-mc4p](https://github.com/advisories/GHSA-p98j-92pf-mc4p)
affects 3.4.13-3.4.15 and is patched in the resolved npm package at 3.4.16. It
requires `IN_PLACE` sanitization with a node-removing afterSanitize hook.

**Bundled-copy limitation:** Monaco 0.57.0, still the latest published release at
audit time, also embeds DOMPurify **3.4.15** in
`monaco-editor/esm/vs/base/browser/dompurify/dompurify.js`. npm overrides do not
rewrite that vendored file. Monaco's `domSanitize.js` imports it directly; the
reviewed caller sanitizes HTML strings and does not enable `IN_PLACE`. The
specific advisory preconditions were not found in that caller or application
code, but this is not a claim that every bundled sanitizer has been patched.
Track an upstream Monaco release that refreshes the vendored copy. This browser
code belongs to the production CMS admin, not exclusively development tooling.

### Braces: remaining unpatched production dependency

[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
is active/high and affects all published versions through 3.0.3. GitHub lists
no patched version; npm's latest is still 3.0.3. Deep attacker-supplied brace
patterns can exhaust the stack.

Production paths include `@payloadcms/next -> sass@1.77.4 -> chokidar@3.6.0`
and `@payloadcms/storage-s3 -> @payloadcms/plugin-cloud-storage ->
find-node-modules -> findup-sync -> micromatch`. These are build/filesystem
discovery paths. No project route passes user-supplied glob/brace patterns into
these tools, so direct remote production exploitability was not demonstrated.
The dependency remains affected and is **not** dismissed as dev-only. A package
or upstream parent fix is still required; speculative downgrades were rejected.

The **three exclusively devDependency findings** are `eslint-config-next`,
`@next/eslint-plugin-next`, and `fast-glob`, all through the same braces advisory.
`braces` and `micromatch` are shared with production paths and are not dev-only.

## Verification

- `npm install`: passed; only the two resolved package versions changed.
- `npm audit` and `npm audit --omit=dev`: completed, **exit 1**, counts above.
- JSON variants of both audits captured before and after for comparison.
- `npm run typecheck`: passed.
- `npm run lint`: passed, zero warnings/errors.
- All **59 existing tests passed**: 20 database/unit checks, 17 content checks,
  9 editorial/status rendering checks, 2 gallery checks, 3 service loader checks,
  3 service page checks, 5 startup/accessibility checks.
- `npm run build`: passed with all routes generated.
- `npm ls undici dompurify esbuild --all`: passed; no invalid dependency tree.
- No database schema migration, new environment variable, or studio content edit.
- No new browser visual QA; production Hostinger behavior has not been verified.

The 20 database/unit checks ran through `npm test` in its disposable PostgreSQL
database. Remaining commands, each with Node's test runner, were:

```text
node --import ./tests/content-loader.mjs --test tests/content.test.mjs tests/cms-editorial.test.mjs
node --import ./tests/cms-editorial-loader.mjs --test tests/cms-editorial-render.test.mjs tests/project-status-render.test.mjs
node --import ./tests/gallery-loader.mjs --test tests/gallery-render.test.mjs
node --import ./tests/services-loader.mjs --test tests/services.test.mjs
node --import ./tests/services-page-loader.mjs --test tests/services-page.test.mjs
node --test tests/dev-local.test.mjs tests/inquiry-accessibility.test.mjs
```

Raw audit JSON, explanation trees, advisory API responses and additional test
logs are in the local ignored `.cache/dependency-audit/` directory. Registry
results can change over time; rerun audits when upstream fixes are published.
