# Implementation Plan — Header Build Timestamp Badge

- [ ] 1. Build-time value plumbing
- [x] 1.1 (P) Add `__BUILD_TIME__: JSON.stringify(Date.now())` to the `define` block in `vite.config.ts`, alongside the existing `__APP_VERSION__: JSON.stringify(pkg.version)` entry, leaving that existing entry unmodified so `Date.now()` is injected as an unquoted numeric literal (a `number`, not a `string`), captured exactly once per config evaluation with no runtime clock reads or interval-based re-evaluation.
  _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  _Boundary: vite.config.ts_
- [x] 1.2 (P) Add `declare const __BUILD_TIME__: number` to `src/vite-env.d.ts` alongside the existing `declare const __APP_VERSION__: string` line, leaving that existing line unmodified.
  _Requirements: 2.1, 2.2_
  _Boundary: src/vite-env.d.ts_

- [ ] 2. HeaderBuildBadge component
- [x] 2.1 Create `src/components/header-build-badge/header-build-badge.tsx`: a prop-less, stateless `HeaderBuildBadge` function component that reads the injected `__BUILD_TIME__` global, constructs a `Date` from it, formats it via `toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })` (no explicit locale, no explicit `timeZone`), and renders `<div className="fixed right-3 top-3 print:hidden"><span className="rounded-full border border-[var(--border)] bg-[var(--code-bg)] px-2 py-0.5 text-xs text-[var(--text)]">built {formatted}</span></div>` — purely presentational markup with no `onClick`, no `<a>`/`<Link>`, no clipboard API, no `aria-hidden`, and no `import.meta.env.DEV`/`PROD` gating. Add `src/components/header-build-badge/header-build-badge.test.tsx` (stubbing `__BUILD_TIME__` via `vi.stubGlobal`, mirroring the `FooterVersionBadge` test file's setup/teardown) naming tests: "renders the build timestamp prefixed with 'built ' formatted via toLocaleString with no explicit locale or timeZone [req:3.1] [req:3.2] [req:3.3] [req:3.4] [req:3.5]", "positions the wrapper fixed to the top-right with a 12px offset [req:5.1] [req:5.2]", "hides the wrapper when printing [req:6.1]", "renders the text as a rounded-full pill with border and code-bg background [req:4.1]", "renders the text with text-xs sizing and the --text custom property color [req:4.1]", "styles using arbitrary-value references to existing custom properties, not new tokens [req:4.2]", "sets no explicit z-index on the badge or its wrapper [req:5.3]", "renders no interactive elements: no links, buttons, or click handlers [req:7.1]", "does not apply aria-hidden to the badge or its text [req:7.2]", "exposes the timestamp text as plain, reachable text discoverable via normal text queries [req:7.2]".
  _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 6.1, 7.1, 7.2, 7.3, 7.4, 9.1, 9.3_
  _Boundary: src/components/header-build-badge_
  _Depends: 1.1, 1.2_

- [ ] 3. App root mount integration
- [ ] 3.1 Update `src/App.tsx` to import `HeaderBuildBadge` from `./components/header-build-badge/header-build-badge` and mount `<HeaderBuildBadge />` once, directly alongside the existing `<FooterVersionBadge />` mount, with no other markup changes. Add `src/components/header-build-badge/app-integration.test.tsx` (stubbing both `__APP_VERSION__` and `__BUILD_TIME__`, mirroring the footer badge's `app-integration.test.tsx`) naming tests: "mounts HeaderBuildBadge exactly once, alongside FooterVersionBadge [req:8.1] [req:8.3]", "leaves the existing blank-slate markup in App.tsx unchanged [req:8.2]", "renders the badge on the app's single page view [req:8.4]".
  _Requirements: 8.1, 8.2, 8.3, 8.4, 9.2_
  _Boundary: src/App.tsx, src/components/header-build-badge_
  _Depends: 2.1_
