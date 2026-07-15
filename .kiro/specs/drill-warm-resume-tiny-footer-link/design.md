# Drill Warm Resume — Tiny Footer Link — Design

Source: [docs/brainstorming/drill-warm-resume-tiny-footer-link.md](../../../docs/brainstorming/drill-warm-resume-tiny-footer-link.md)

## Overview

A single, static "Resume" text link fixed to the bottom-left corner of the
viewport. It always renders (no conditional visibility, no session/drill
state check), links to `/resume`, and opens that link in a new tab. It is
plain text — no icon — styled subtly to match the muted-text convention
already established by `FooterVersionBadge` (bottom-right). No props, no
state, no data fetching, no routing library: `/resume` is a plain relative
`href` on an `<a>` tag, since the project has no client-side router in
`package.json`.

This mirrors the existing `footer-version-badge` feature exactly in shape
(fixed viewport-corner component, mounted once from `src/App.tsx`) but
occupies the opposite corner (bottom-left vs bottom-right) so the two never
overlap. The project has no literal `<footer>` landmark element today — like
`FooterVersionBadge`, this link is positioned with `fixed` CSS rather than
living inside a footer container that doesn't exist yet; introducing a real
`<footer>` landmark is out of scope for this feature.

Because `target="_blank"` opens a new browsing context, the link includes
`rel="noreferrer"` to prevent the new tab from getting a handle back to
`window.opener` (reverse-tabnabbing), even though `/resume` is same-origin.

## File Structure

Legend: **Owns** = this feature is the sole, ongoing owner. **Touches** =
existing shared file, edited only to integrate, not owned.

| Path | Boundary | Purpose |
|---|---|---|
| `src/components/resume-footer-link/resume-footer-link.tsx` | Owns | The link component: renders the fixed bottom-left `<a>` markup. No props, no state. |
| `src/components/resume-footer-link/resume-footer-link.test.tsx` | Owns | Unit test(s) for the component's markup/attributes. |
| `src/components/resume-footer-link/app-integration.test.tsx` | Owns | Test asserting `src/App.tsx` mounts the component, matching the sibling-feature convention (`footer-version-badge/app-integration.test.tsx`, `header-build-badge/app-integration.test.tsx`). |
| `src/App.tsx` | Touches | Adds one import and one `<ResumeFooterLink />` mount, alongside the existing `<FooterVersionBadge />` / `<HeaderBuildBadge />` mounts. No other markup changes. |

No other files are touched. `src/index.css`, `App.css`, `vite.config.ts`,
and every other feature's directory (`command-palette/`,
`footer-version-badge/`, `header-build-badge/`, `keyboard-shortcuts/`) are
out of scope — this feature only adds its own component directory plus the
one-line mount in `src/App.tsx`.

## Boundary Commitments

| Commitment | Detail |
|---|---|
| `src/components/resume-footer-link/` is exclusively this feature's | Nothing unrelated gets added there, and this feature adds nothing outside it except the one mount line in `src/App.tsx`. |
| Declared deps | none — uses only `react` (already a dependency); no new npm package is added. |
| Static, non-interactive beyond the link itself | No `onClick` handler, no state, no data fetching. The only interactive element is the `<a>` tag's native navigation. |
| Plain text, no icon | Renders the literal text `Resume`; no `<svg>`, no icon font, no image (brainstorm Q4). |
| Always rendered | No conditional/session-state gating; renders unconditionally on every view (brainstorm Q2). |
| New tab with safe `rel` | `target="_blank" rel="noreferrer"` on the anchor, so the new tab cannot access `window.opener` (brainstorm Q3). |
| Bottom-left, non-overlapping | Fixed-position at bottom-left of the viewport, opposite corner from `FooterVersionBadge`'s bottom-right, so the two never collide (brainstorm Q5). |
| Subtle styling matches existing footer link | Uses the same muted-text custom property (`var(--text)`) and small font size convention as `FooterVersionBadge`, not the app's accent color. |
| No config surface | No props on `ResumeFooterLink`, no new settings/context/store entry. |
| One mount point | Rendered exactly once, from `src/App.tsx`. No other file mounts it. |

## Concrete Shape

**Component** (`src/components/resume-footer-link/resume-footer-link.tsx`):
```tsx
export function ResumeFooterLink() {
  return (
    <a
      href="/resume"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-3 left-3 text-xs text-[var(--text)] hover:text-[var(--text-h)] print:hidden"
    >
      Resume
    </a>
  )
}
```
- Margin from viewport edges: `bottom-3 left-3` (12px), matching
  `FooterVersionBadge`'s `right-3 bottom-3` so both corner elements sit at
  the same inset.
- `text-xs` + `text-[var(--text)]` for muted, subtle text sizing and color;
  `hover:text-[var(--text-h)]` gives a discoverable hover state using the
  same "high-contrast text" custom property the app already defines.
- `print:hidden` matches the sibling badge's convention of hiding
  viewport-fixed chrome when printing.
- No `z-index` set — nothing else in the app claims fixed bottom-left
  positioning today.

**Mount point** (`src/App.tsx`):
```tsx
<CommandPalette />
<FooterVersionBadge />
<HeaderBuildBadge />
<ResumeFooterLink />
```
Added next to the existing fixed-position component mounts, before the rest
of the page markup, so it renders on every view of the (currently
single-page) app.
