# Implementation Plan: Footer Version Badge

- [ ] 1. Build-time version plumbing and TypeScript ambient declaration
- [x] 1.1 (P) Add static `package.json` import and `define: { __APP_VERSION__: JSON.stringify(pkg.version) }` entry to `vite.config.ts`, leaving the existing `react()`/`tailwindcss()` plugin list and `resolve.alias` config unmodified
  _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  _Boundary: vite.config.ts_
- [x] 1.2 (P) Create `src/vite-env.d.ts` with a `/// <reference types="vite/client" />` directive and an ambient `declare const __APP_VERSION__: string` declaration
  _Requirements: 3.1, 3.2_
  _Boundary: src/vite-env.d.ts_

- [ ] 2. FooterVersionBadge component
- [x] 2.1 Create `src/components/footer-version-badge/footer-version-badge.tsx` exporting `FooterVersionBadge`, a no-props no-state component rendering a `fixed right-3 bottom-3 print:hidden` wrapper containing a `rounded-full border border-[var(--border)] bg-[var(--code-bg)] px-2 py-0.5 text-xs text-[var(--text)]` span with plain text `v{__APP_VERSION__}`, no click handlers, no `<a>`/`<Link>`, no clipboard behavior, no `aria-hidden`, no `import.meta.env.DEV`/`PROD` gating, and no explicit `z-index`
  _Requirements: 1.1, 1.2, 1.3, 4.1, 4.2, 4.3, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 7.1, 8.1, 8.2, 8.3, 9.1, 9.2, 10.1, 10.2, 11.1_
  _Boundary: src/components/footer-version-badge/_
  _Depends: 1.1, 1.2_

- [ ] 3. Mount FooterVersionBadge in App
- [ ] 3.1 Mount `<FooterVersionBadge />` in `src/App.tsx` immediately alongside the existing `<CommandPalette />` mount, with no other markup changes and no other file added or modified
  _Blocked: vitest.config.ts is a separate Vite config from vite.config.ts and does not inherit vite.config.ts's  define: { __APP_VERSION__ }  entry. Mounting FooterVersionBadge (which reads the bare global __APP_VERSION__) in App.tsx is correct per spec, but any test that renders <App /> under Vitest now throws ReferenceError: __APP_VERSION__ is not defined, breaking the pre-existing command-palette app-integration tests. requirements.md/design.md never addressed the test runtime and requirement 11.3's closed file list does not include vitest.config.ts._
  _Requirements: 5.1, 5.2, 5.3, 11.2, 11.3_
  _Boundary: src/App.tsx_
  _Depends: 2.1_
