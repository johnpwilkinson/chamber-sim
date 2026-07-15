# Implementation Plan: Drill Warm Resume — Tiny Footer Link

- [ ] 1. Component implementation and unit coverage
- [x] 1.1 Implement `ResumeFooterLink` at `src/components/resume-footer-link/resume-footer-link.tsx` as a static, prop-less, state-less component rendering a single `<a>` with literal text `Resume`, `href="/resume"`, `target="_blank"`, `rel="noreferrer"`, and `className="fixed bottom-3 left-3 text-xs text-[var(--text)] hover:text-[var(--text-h)] print:hidden"` (no `onClick`, no `useState`/`useEffect`, no `<svg>`/`<img>`/icon glyph, no `z-index`, no new npm dependency). Add the unit test file `src/components/resume-footer-link/resume-footer-link.test.tsx` asserting: the anchor renders with text `Resume`; `href="/resume"`; `target="_blank"`; `rel="noreferrer"`; the anchor carries `bottom-3 left-3` fixed positioning, `text-xs`/`text-[var(--text)]` base styling, `hover:text-[var(--text-h)]` hover styling, and `print:hidden`; no `<svg>`/`<img>`/icon element is present; the component accepts and uses no props; and the component renders unconditionally with no conditional/session-state gating. Name tests with [req:1.1] [req:1.2] [req:1.3] [req:1.4] [req:2.1] [req:2.2] [req:2.3] [req:2.4] [req:3.1] [req:3.3] [req:3.4] [req:3.5] [req:3.6] [req:4.1] [req:4.2] [req:4.3] [req:6.1] [req:6.2].
  _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 3.1, 3.3, 3.4, 3.5, 3.6, 4.1, 4.2, 4.3, 6.1, 6.2_
  _Boundary: src/components/resume-footer-link_

- [ ] 2. App.tsx mount and integration coverage
- [ ] 2.1 In `src/App.tsx`, add exactly one import of `ResumeFooterLink` and exactly one `<ResumeFooterLink />` mount alongside the existing `<FooterVersionBadge />` and `<HeaderBuildBadge />` mounts, changing no other markup in the file. Add the integration test `src/components/resume-footer-link/app-integration.test.tsx` asserting that rendering `App` mounts exactly one `ResumeFooterLink` instance, matching the sibling-feature convention used by `footer-version-badge/app-integration.test.tsx` and `header-build-badge/app-integration.test.tsx`, and that no file other than `src/App.tsx` mounts the component. Name tests with [req:5.1] [req:5.2] [req:5.3] [req:6.3].
  _Requirements: 5.1, 5.2, 5.3, 6.3, 6.4, 6.5_
  _Boundary: src/App.tsx, src/components/resume-footer-link_
  _Depends: 1.1_
