# Env Mode Badge — Design

Source: [docs/brainstorming/env-mode-badge-a-small-badge-in-the-app.md](../../../docs/brainstorming/env-mode-badge-a-small-badge-in-the-app.md)

## Overview

A single, static component fixed to the bottom-right of the viewport,
immediately to the left of the existing `FooterVersionBadge`, showing the
current Vite mode (`import.meta.env.MODE`, e.g. `development` or
`production`) inside the same pill/chip styling already used by the other
footer badges. It renders unconditionally (no `import.meta.env.DEV`/`PROD`
gating), is non-interactive, is plain screen-reader-visible text (no
`aria-hidden`), and is hidden when printing. The mode value is explicitly
lowercased in code (`.toLowerCase()`) rather than trusted as-is, per the
brainstorm's answer to Q4. No label prefix — just the raw mode value. No
config, no settings, no animation, no new dependencies.

`import.meta.env.MODE` is a build-time constant Vite already injects into
every module; unlike the version and commit badges, this feature needs no
`vite.config.ts` `define` entry and no new ambient type declaration — the
`ImportMetaEnv.MODE` typing is already provided by `vite/client` types
(referenced today via `src/vite-env.d.ts`, bootstrapped by
`footer-version-badge`).

One layout consequence: the brainstorm asks for this badge to sit
immediately before (left of) `FooterVersionBadge` at `right-3`. Today that
slot (`right-20`) is occupied by `FooterCommitBadge`. This feature takes
over `right-20` for itself (the mode text, up to `development`/
`production`, needs more horizontal room than the short commit SHA it
displaces) and pushes `FooterCommitBadge` further left to `right-44` to
keep all three badges non-overlapping. `FooterVersionBadge` itself is
untouched.

## File Structure

Legend: **Owns** = this feature is the sole, ongoing owner. **Touches** =
existing shared file, edited only to integrate or to make room, not owned.

| Path | Boundary | Purpose |
|---|---|---|
| `src/components/footer-env-mode-badge/footer-env-mode-badge.tsx` | Owns | The badge component: reads `import.meta.env.MODE`, lowercases it, renders the fixed pill markup. No props, no state. |
| `src/components/footer-env-mode-badge/footer-env-mode-badge.test.tsx` | Owns | Unit tests for render, text content, positioning, and styling. |
| `src/components/footer-commit-badge/footer-commit-badge.tsx` | Touches | Offset changed from `right-20` to `right-44` to make room for the new badge. No other change. |
| `src/components/footer-commit-badge/footer-commit-badge.test.tsx` | Touches | Existing `right-20` assertion updated to `right-44`. No other change. |
| `src/App.tsx` | Touches | Mounts `<FooterEnvModeBadge />` once, alongside the other footer badge mounts. No other markup changes. |

No other files are touched. `src/vite-env.d.ts`, `vite.config.ts`,
`src/index.css`, `tailwind.config.ts`, and `src/components/footer-version-badge/`
are all out of scope — this feature adds no build-time plumbing and does
not alter the version badge's markup or offset.

## Boundary Commitments

| Commitment | Detail |
|---|---|
| `src/components/footer-env-mode-badge/` is exclusively this feature's | Nothing unrelated gets added there, and this feature adds nothing outside it except the integration/offset touches listed above. |
| Declared deps | none — uses only `react` (already a dependency), Vite's built-in `import.meta.env.MODE`, and Tailwind utility classes; no new npm package is added. |
| No build-time plumbing | No `vite.config.ts` `define` entry, no new ambient type declaration in `src/vite-env.d.ts`. `import.meta.env.MODE` is already typed by Vite's own client types. |
| Reuses existing pill styling verbatim | Same classes as `FooterVersionBadge`/`FooterCommitBadge`: `rounded-full border border-[var(--border)] bg-[var(--code-bg)] px-2 py-0.5 text-xs text-[var(--text)]`. No new CSS custom properties, no distinct visual treatment. |
| Raw text, explicitly lowercased | Renders `import.meta.env.MODE.toLowerCase()` with no label prefix (e.g. `development`, not `mode: development`). |
| Static, non-interactive | No `onClick`, no `<a>`/`<Link>`, no clipboard API, no tooltip. Purely presentational markup. |
| No `aria-hidden` | The mode text is a plain visible text node, reachable by screen readers like any other static text. |
| Always rendered | No environment gating — the same markup renders in dev and production builds. |
| No config surface | No props on `FooterEnvModeBadge`, no new settings/context/store entry. |
| One mount point | Rendered exactly once, from `src/App.tsx`. No other file mounts it. |
| `title` attribute fixed | The wrapper's `<span>` carries `title="vite mode"` (static string, not derived). |
| Bounded layout touch | The only allowed edit to `footer-commit-badge.tsx`/`.test.tsx` is the `right-20` → `right-44` offset (and its matching test assertion). No styling, text, or behavior change to that component. |

## Concrete Shape

**Component** (`src/components/footer-env-mode-badge/footer-env-mode-badge.tsx`):
```tsx
export function FooterEnvModeBadge() {
  const mode = import.meta.env.MODE.toLowerCase()

  return (
    <div className="fixed right-20 bottom-3 print:hidden">
      <span
        title="vite mode"
        className="rounded-full border border-[var(--border)] bg-[var(--code-bg)] px-2 py-0.5 text-xs text-[var(--text)]"
      >
        {mode}
      </span>
    </div>
  )
}
```
- Offset: `right-20 bottom-3` — immediately before (left of)
  `FooterVersionBadge`'s `right-3`, reusing the same `bottom-3` baseline.
- Pill: identical classes to `FooterVersionBadge`/`FooterCommitBadge`
  (`rounded-full`, `border`, `bg-[var(--code-bg)]`, `text-xs`,
  `text-[var(--text)]`) — visually identical apart from content, per the
  brainstorm's Q3 answer.
- `print:hidden` on the outer wrapper hides it when printing.
- No `z-index` set, matching the other footer badges.
- `title="vite mode"` on the `<span>` carrying the text, matching where
  `FooterCommitBadge` places its hover affordance today (on the text
  element, not the wrapper).

**Offset adjustment** (`src/components/footer-commit-badge/footer-commit-badge.tsx`):
```tsx
<div className="group relative fixed right-44 bottom-3 print:hidden">
```
Only the `right-20` → `right-44` change; everything else (tooltip,
fallback handling, SHA display) is untouched. The matching test assertion
in `footer-commit-badge.test.tsx` (`expect(wrapper?.className).toContain('right-20')`)
is updated to `right-44`.

**Mount point** (`src/App.tsx`):
```tsx
import { FooterEnvModeBadge } from './components/footer-env-mode-badge/footer-env-mode-badge'
// ...
<FooterVersionBadge />
<FooterEnvModeBadge />
<FooterCommitBadge />
```
Added between the version and commit badge mounts, matching their visual
left-to-right order (version at `right-3`, env-mode at `right-20`, commit
at `right-44`).

**Tests** (`src/components/footer-env-mode-badge/footer-env-mode-badge.test.tsx`):
Mirrors `footer-version-badge.test.tsx`'s structure, against the single
active `import.meta.env.MODE` value in the test runtime (no multi-value
mocking, per the brainstorm's Q5 answer):
- Renders the lowercased mode value as plain text.
- Wrapper is `fixed right-20 bottom-3` and `print:hidden`.
- Text carries `title="vite mode"`.
- Pill styling matches (`rounded-full`, `border`, `bg-[var(--code-bg)]`,
  `text-xs`, `text-[var(--text)]`), via the shared custom properties, no
  new tokens.
- No explicit `z-index`.
- No interactive elements (no `<a>`, `<button>`, `onClick`).
- No `aria-hidden` anywhere.
- Text is exposed as plain, discoverable text (`textContent` equals the
  mode value).
