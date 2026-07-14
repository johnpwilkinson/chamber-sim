# Header Build Timestamp Badge — Design

Source: [docs/brainstorming/a-small-badge-in-the-app-header-showing.md](../../../docs/brainstorming/a-small-badge-in-the-app-header-showing.md)

## Overview

A single, static component fixed to the top-right corner of the viewport,
showing the app's build timestamp inside the same pill/chip treatment as
the existing `FooterVersionBadge`. It renders unconditionally in dev,
staging, and production, is non-interactive, and is hidden when printing.
No config, no settings, no animation.

The timestamp is captured once at build time via a new Vite `define`
(`__BUILD_TIME__`, the build's `Date.now()` epoch milliseconds), mirroring
how `__APP_VERSION__` is already injected from `package.json`. The
component formats that epoch value at render time with the browser's
`Intl`/`toLocaleString` APIs, using no explicit `timeZone` option so it
renders in the viewer's local timezone, and no explicit `locale` argument
so it follows the viewer's browser locale — satisfying the brainstorm's
"formatted, viewer-local-timezone" resolution (Q2/Q3) without adding a
date-formatting dependency.

This feature reuses the same hand-rolled CSS custom properties
(`--border`, `--code-bg`, `--text`) that `FooterVersionBadge` reads via
Tailwind arbitrary values — see that feature's design doc for why the
project has no Shadcn semantic token set yet. This feature does not
change that.

## File Structure

Legend: **Owns** = this feature is the sole, ongoing owner. **Touches** =
existing shared file, edited only to integrate, not owned.

| Path | Boundary | Purpose |
|---|---|---|
| `src/components/header-build-badge/header-build-badge.tsx` | Owns | The badge component: reads `__BUILD_TIME__`, formats it for the viewer's local timezone/locale, renders the fixed pill markup. No props, no state. |
| `src/vite-env.d.ts` | Touches | Adds `declare const __BUILD_TIME__: number` alongside the existing `__APP_VERSION__` declaration. Does not touch the `__APP_VERSION__` line. |
| `vite.config.ts` | Touches | Adds a `__BUILD_TIME__: JSON.stringify(Date.now())` entry to the existing `define` block, alongside `__APP_VERSION__`. |
| `src/App.tsx` | Touches | Mounts `<HeaderBuildBadge />` once, alongside the existing `<FooterVersionBadge />` mount. No other markup changes. |

No other files are touched. `src/components/footer-version-badge/` is
read-only reference for this feature, not modified.

## Boundary Commitments

| Commitment | Detail |
|---|---|
| `src/components/header-build-badge/` is exclusively this feature's | Nothing unrelated gets added there, and this feature adds nothing outside it except the integration touches listed above. |
| Declared deps | none — uses only `react` (already a dependency), native `Intl`/`Date`/`toLocaleString`, and Tailwind utility classes; no new npm package is added. |
| Build-time timestamp only | The timestamp is captured once via Vite `define` at build/config time (`Date.now()` evaluated when `vite.config.ts` runs). No runtime clock reads, no `setInterval`/re-render-on-tick, no "time since build" relative counter. |
| No Shadcn semantic token migration | This feature does not add `--background`/`--foreground`/`--muted-foreground` (or any `@theme` block) to `src/index.css` or `tailwind.config.ts`. It consumes the existing hand-rolled custom properties via Tailwind arbitrary-value syntax, same as `FooterVersionBadge`. |
| Static, non-interactive | No `onClick`, no `<a>`/`<Link>`, no clipboard API. Purely presentational markup. |
| No `aria-hidden` | The timestamp text is a plain visible text node, reachable by screen readers like any other static text. |
| Always rendered | No `import.meta.env.DEV`/`PROD` gating — the same markup renders in dev and production builds, in all environments (brainstorm Q4). |
| No config surface | No props on `HeaderBuildBadge`, no new settings/context/store entry. |
| One mount point | Rendered exactly once, from `src/App.tsx`. No other file mounts it. |
| Positioning does not collide with footer badge | Fixed `top-right` (`right-3 top-3`), distinct from `FooterVersionBadge`'s fixed `bottom-right` (`right-3 bottom-3`) — the two badges never overlap. |
| Hidden when printing | `print:hidden` on the outer wrapper, matching `FooterVersionBadge`. |

## Concrete Shape

**Build-time plumbing** (`vite.config.ts`):
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import pkg from './package.json' with { type: 'json' }

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': new URL('./src', import.meta.url).pathname },
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __BUILD_TIME__: JSON.stringify(Date.now()),
  },
})
```
`JSON.stringify(Date.now())` on a number yields an unquoted numeric
literal (e.g. `1752480000000`), so `__BUILD_TIME__` is injected as a
plain `number`, not a string.

**Ambient type** (`src/vite-env.d.ts`, existing file, one line added):
```ts
/// <reference types="vite/client" />

declare const __APP_VERSION__: string
declare const __BUILD_TIME__: number
```

**Component** (`src/components/header-build-badge/header-build-badge.tsx`):
```tsx
export function HeaderBuildBadge() {
  const formatted = new Date(__BUILD_TIME__).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <div className="fixed right-3 top-3 print:hidden">
      <span className="rounded-full border border-[var(--border)] bg-[var(--code-bg)] px-2 py-0.5 text-xs text-[var(--text)]">
        built {formatted}
      </span>
    </div>
  )
}
```
- `toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })`
  — omitting the locale argument uses the viewer's browser locale;
  omitting `timeZone` in the options uses the viewer's local timezone
  (brainstorm Q2/Q3). Example output: `Jul 14, 2026, 9:41 AM`.
- Margin from viewport edges: `right-3 top-3` (12px), the mirror image of
  `FooterVersionBadge`'s `right-3 bottom-3`.
- Pill styling is identical to `FooterVersionBadge`: `rounded-full` +
  `border border-[var(--border)]` + `bg-[var(--code-bg)]` +
  `px-2 py-0.5 text-xs text-[var(--text)]`.
- `print:hidden` on the outer wrapper satisfies "hidden when printing"
  (brainstorm Q7).
- No `z-index` set — `FooterVersionBadge` is bottom-right and this badge
  is top-right, so there is no overlap to arbitrate.
- Text content is exactly `built {formatted}` (brainstorm Q6), no other
  label variants.

**Mount point** (`src/App.tsx`):
```tsx
<CommandPalette />
<FooterVersionBadge />
<HeaderBuildBadge />
```
Added next to the existing `<FooterVersionBadge />` mount, so it renders
on every view of the (currently single-page) app.
