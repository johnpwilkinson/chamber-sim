# Implementation Plan: env-mode-badge

- [ ] 1. Footer Env Mode Badge component
- [x] 1.1 (P) Create `src/components/footer-env-mode-badge/footer-env-mode-badge.tsx`: a prop-less, state-less component that reads `import.meta.env.MODE`, applies `.toLowerCase()`, and renders it as plain text (no label prefix) inside a `<span title="vite mode">` carrying the pill classes `rounded-full border border-[var(--border)] bg-[var(--code-bg)] px-2 py-0.5 text-xs text-[var(--text)]`, wrapped in a `<div className="fixed right-20 bottom-3 print:hidden">` with no `z-index`, no `aria-hidden`, no interactive handlers/elements, and no environment gating on `import.meta.env.DEV`/`PROD`.
  _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 4.1, 4.2, 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 7.1, 7.2, 7.3, 7.4, 9.1, 9.2_
  _Boundary: src/components/footer-env-mode-badge_
- [ ] 1.2 Create `src/components/footer-env-mode-badge/footer-env-mode-badge.test.tsx` verifying: lowercased mode value renders as plain text content [req:1.2] [req:1.3] [req:10.1]; wrapper carries `fixed`, `right-20`, `bottom-3`, `print:hidden` classes [req:3.1] [req:3.2] [req:10.2]; text-carrying `<span>` carries `title="vite mode"` [req:4.2] [req:10.3]; pill styling classes (`rounded-full`, `border`, `bg-[var(--code-bg)]`, `text-xs`, `text-[var(--text)]`) are present [req:2.1] [req:10.4]; no explicit `z-index` class is present [req:2.4] [req:10.5]; no interactive elements (`<a>`, `<button>`, `onClick`) are present [req:5.1] [req:5.2] [req:10.6]; no `aria-hidden` attribute is present anywhere in the rendered output [req:4.1] [req:10.7].
  _Requirements: 1.2, 1.3, 2.1, 2.4, 3.1, 3.2, 4.1, 4.2, 5.1, 5.2, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_
  _Boundary: src/components/footer-env-mode-badge_
  _Depends: 1.1_

- [ ] 2. Footer Commit Badge offset adjustment
- [ ] 2.1 (P) In `src/components/footer-commit-badge/footer-commit-badge.tsx`, change the wrapper offset from `right-20` to `right-44` only (no other class, markup, tooltip, fallback, or SHA-display change), and update the corresponding assertion in `src/components/footer-commit-badge/footer-commit-badge.test.tsx` from expecting `right-20` to expecting `right-44`, tagging the updated assertion [req:3.3] [req:10.8].
  _Requirements: 3.3, 3.4, 10.8_
  _Boundary: src/components/footer-commit-badge_

- [ ] 3. App mount integration
- [ ] 3.1 In `src/App.tsx`, import `FooterEnvModeBadge` from `./components/footer-env-mode-badge/footer-env-mode-badge` and mount `<FooterEnvModeBadge />` exactly once, positioned between the existing `<FooterVersionBadge />` and `<FooterCommitBadge />` mounts, with no other markup change to the file, so the three footer badges (`right-3`, `right-20`, `right-44`) render together without horizontal overlap.
  _Requirements: 8.1, 8.2, 8.3, 8.4, 3.5_
  _Boundary: src/App.tsx_
  _Depends: 1.1_
