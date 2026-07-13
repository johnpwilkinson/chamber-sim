# Footer Version Badge — Design

Source: [docs/brainstorming/footer-version-badge-a-small-fixed-badge.md](../../../docs/brainstorming/footer-version-badge-a-small-fixed-badge.md)

## Overview

A single, static component fixed to the bottom-right corner of the
viewport, showing the app's version (from `package.json`, prefixed with
`v`, e.g. `v0.0.0`) inside a subtle pill/chip. It renders unconditionally
in both dev and production, is non-interactive (no link, no click
behavior, no copy-to-clipboard), is plain screen-reader-visible text (no
`aria-hidden`), and is hidden when printing. No config, no settings, no
animation.

The version is exposed at build time via Vite's `define`, not a runtime
`fetch`/JSON import, so the badge never depends on `package.json` being
reachable at runtime and adds no bundle weight beyond a string.

One gap versus the brainstorm's assumption: the brainstorm's Q6 assumes
the app "already uses Tailwind theme tokens (e.g. `bg-background`,
`text-muted-foreground`)". Inspecting `src/index.css`, that's not the
case yet — the project only has hand-rolled CSS custom properties
(`--bg`, `--text`, `--border`, `--code-bg`, …) flipped by a
`prefers-color-scheme` media query; Shadcn's semantic token set
(`--background`, `--foreground`, `--muted`, `--muted-foreground`, etc.)
was never generated despite `components.json` being present from
command-palette. This feature does not introduce that token set — doing
so is a project-wide decision out of scope here. Instead it reads the
existing custom properties directly via Tailwind arbitrary values (e.g.
`bg-[var(--code-bg)]`, `text-[var(--text)]`, `border-[var(--border)]`),
which already flip with the theme, satisfying the brainstorm's intent
(dark/light adaptation) without inventing new tokens.

## File Structure

Legend: **Owns** = this feature is the sole, ongoing owner. **Bootstraps**
= this feature creates it because it's the first consumer, but ownership
becomes project-wide once merged. **Touches** = existing shared file,
edited only to integrate, not owned.

| Path | Boundary | Purpose |
|---|---|---|
| `src/components/footer-version-badge/footer-version-badge.tsx` | Owns | The badge component: reads `__APP_VERSION__`, renders the fixed pill markup. No props, no state. |
| `src/vite-env.d.ts` | Bootstraps | New ambient type declarations file (none exists yet); declares `__APP_VERSION__: string` so TS accepts the global injected by Vite's `define`. Future features may add their own ambient globals here without needing this feature's sign-off. |
| `vite.config.ts` | Touches | Adds a `define: { __APP_VERSION__: JSON.stringify(pkg.version) }` entry (reading `package.json` at config-load time via a static `import`), alongside the existing `react()`/`tailwindcss()` plugin setup. |
| `src/App.tsx` | Touches | Mounts `<FooterVersionBadge />` once, alongside the existing `<CommandPalette />` mount. No other markup changes. |

No other files are touched. `src/index.css`, `tailwind.config.ts`,
`components.json`, and the rest of the blank-slate scaffold (`App.css`,
`src/assets/*`) are out of scope — this feature styles entirely with
Tailwind utility classes on the one component it owns.

## Boundary Commitments

| Commitment | Detail |
|---|---|
| `src/components/footer-version-badge/` is exclusively this feature's | Nothing unrelated gets added there, and this feature adds nothing outside it except the integration touches listed above. |
| Declared deps | none — uses only `react` (already a dependency) and Tailwind utility classes; no new npm package is added. |
| Build-time version only | The version string is injected via Vite `define` at build/config time. No runtime `fetch`, no dynamic `import()` of `package.json`, no `resolveJsonModule` change to `tsconfig.app.json`. |
| No Shadcn semantic token migration | This feature does not add `--background`/`--foreground`/`--muted-foreground` (or any `@theme` block) to `src/index.css` or `tailwind.config.ts`. It consumes the existing hand-rolled custom properties via Tailwind arbitrary-value syntax instead. Introducing Shadcn's semantic token set is a separate, project-wide decision. |
| Static, non-interactive | No `onClick`, no `<a>`/`<Link>`, no clipboard API. Purely presentational markup (brainstorm Q4). |
| No `aria-hidden` | The version text is a plain visible text node, reachable by screen readers like any other static text (brainstorm Q7). |
| Always rendered | No `import.meta.env.DEV`/`PROD` gating — the same markup renders in dev and production builds (brainstorm Q2). |
| No config surface | No props on `FooterVersionBadge`, no new settings/context/store entry. |
| One mount point | Rendered exactly once, from `src/App.tsx`. No other file mounts it. |

## Concrete Shape

**Version plumbing** (`vite.config.ts`):
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
  },
})
```

**Ambient type** (`src/vite-env.d.ts`, new file):
```ts
/// <reference types="vite/client" />

declare const __APP_VERSION__: string
```

**Component** (`src/components/footer-version-badge/footer-version-badge.tsx`):
```tsx
export function FooterVersionBadge() {
  return (
    <div
      className="fixed right-3 bottom-3 print:hidden"
    >
      <span
        className="rounded-full border border-[var(--border)] bg-[var(--code-bg)] px-2 py-0.5 text-xs text-[var(--text)]"
      >
        v{__APP_VERSION__}
      </span>
    </div>
  )
}
```
- Margin from viewport edges: `right-3 bottom-3` (12px, mid-range of the
  brainstorm's 8–16px band).
- Pill: `rounded-full` + `border` + `bg-[var(--code-bg)]` for the subtle
  chip background, `text-xs` + `text-[var(--text)]` for muted text sizing
  and color.
- `print:hidden` on the outer wrapper satisfies "hidden when printing".
- No `z-index` set — nothing else in the app claims fixed bottom-right
  positioning today (confirmed by scanning `App.css`), so default
  stacking order is sufficient.

**Mount point** (`src/App.tsx`):
```tsx
<CommandPalette />
<FooterVersionBadge />
```
Added next to the existing `<CommandPalette />` mount, before the rest of
the page markup, so it renders on every view of the (currently
single-page) app.
