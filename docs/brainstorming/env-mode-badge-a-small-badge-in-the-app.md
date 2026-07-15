# Brainstorming: env-mode-badge

## Feature Description

A small badge in the app footer, next to the existing version badge, showing the current Vite mode read from `import.meta.env.MODE` (for example `development` or `production`). Reuse the existing footer badge styling and placement pattern. Always visible, lowercase text, with a `title` attribute of `"vite mode"`. Unit tests for render and text content. No new dependencies, no `vite.config` changes, no new defines, no dark mode, no routing, no settings. Scope is one small component plus footer wiring and tests — same size as the footer version badge feature.

## Existing Pattern (context gathered during brainstorm)

- `src/components/footer-version-badge/footer-version-badge.tsx` renders a fixed-position `<div>` (`fixed right-3 bottom-3 print:hidden`) wrapping a `<span>` pill (`rounded-full border border-[var(--border)] bg-[var(--code-bg)] px-2 py-0.5 text-xs text-[var(--text)]`) showing `v{__APP_VERSION__}`.
- `src/components/footer-commit-badge/footer-commit-badge.tsx` follows the same pill styling but is positioned at `right-20` (further left) and adds a hover tooltip.
- Each footer badge is its own independently fixed-positioned component (not a shared flex/footer container) — components are stacked side by side purely via different `right-N` Tailwind offsets, and each is mounted directly in `src/App.tsx` alongside the others (`<FooterVersionBadge />`, `<FooterCommitBadge />`, etc.).
- Existing badge tests (`footer-version-badge.test.tsx`) cover: text content, fixed bottom-right positioning, print:hidden, pill styling classes, use of existing CSS custom properties (no new tokens), no explicit z-index, no interactive elements, no `aria-hidden`, and plain discoverable text.

## Questions and Answers

1. **Q: Where should the env-mode badge sit relative to the existing version badge — immediately before it, immediately after it, or somewhere else in the footer?**
   A: Immediately before.

2. **Q: Should the badge's visible text be just the raw mode value (e.g. `development`), or include a label prefix (e.g. `mode: development`)?**
   A: Raw (no label prefix — just the mode value itself).

3. **Q: Should the badge reuse the exact same CSS class(es)/styling as the version badge (making them visually identical apart from content), or have a distinct visual treatment (e.g. different color) while still following the same structural pattern?**
   A: Yes — reuse the exact same classes; visually identical apart from content.

4. **Q: Should the component explicitly force lowercase (e.g. `.toLowerCase()` on the MODE value) as a safety guarantee, or just render `import.meta.env.MODE` as-is, trusting Vite modes are already lowercase by convention?**
   A: Yes — explicitly force lowercase via `.toLowerCase()`.

5. **Q: Should the unit tests mock `import.meta.env.MODE` to verify the badge renders correctly for multiple values (e.g. both `development` and `production`), or is a single test against whatever MODE is active in the test runtime sufficient?**
   A: Single test against the active MODE value in the test runtime.

## Converged Scope

- New component (mirroring `FooterVersionBadge`'s structure) that renders a fixed-position, always-visible pill badge showing `import.meta.env.MODE`, lowercased explicitly in code, with `title="vite mode"`.
- Same pill styling as the existing footer badges (`rounded-full border border-[var(--border)] bg-[var(--code-bg)] px-2 py-0.5 text-xs text-[var(--text)]`), positioned immediately before (to the left of) `FooterVersionBadge` using the existing `right-N` offset pattern.
- Wired into `src/App.tsx` alongside the other footer badges.
- Raw mode text only, no label prefix.
- Unit tests for render and text content, using a single active-MODE test case (no multi-value mocking).
- No new dependencies, no `vite.config` changes, no new defines, no dark mode, no routing, no settings — scope matches the existing footer version badge feature in size.
- Exact `right-N` offset value and any adjustment to the commit badge's offset to make room are left to the design phase.
