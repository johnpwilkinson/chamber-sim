# Footer Build Commit SHA Badge — Design

Source: [docs/brainstorming/footer-badge-showing-the-short-build-com.md](../../../docs/brainstorming/footer-badge-showing-the-short-build-com.md)

## Overview

A single, static component fixed to the bottom-right corner of the
viewport, immediately to the right of the existing `FooterVersionBadge`
(`v{version}`), showing the short build commit sha (e.g. `abc1234`) inside
the same pill/chip treatment as the existing badges. On mouse hover only,
a small custom-styled tooltip above the badge reveals the full sha. It
renders unconditionally in dev, staging, and production, is
non-interactive (no click, no link, no clipboard), and is hidden when
printing. No config, no settings, no animation beyond a hover fade.

The sha is captured once at build time via two new Vite `define` globals,
`__COMMIT_SHA__` (short) and `__COMMIT_SHA_FULL__` (full), mirroring how
`__APP_VERSION__` and `__BUILD_TIME__` are already injected in
`vite.config.ts`. Both are resolved by shelling out to `git rev-parse` at
config-eval time (`--short HEAD` and `HEAD`); if either invocation throws
(no `.git` directory, `git` not installed, building from a tarball), both
globals fall back to the literal string `"whoops"` and the component skips
the tooltip entirely.

The tooltip is implemented as a plain CSS hover reveal (Tailwind
`group`/`group-hover:opacity-100` on a non-focusable wrapper), not the
native `title` attribute and not a JS/portal-based tooltip library. This
keeps `Declared deps` at `none` — `radix-ui`'s `Tooltip` export is already
a transitive dependency, but pulling it in would require wrapping the app
in a `TooltipProvider` and would make the trigger focusable by default,
which conflicts with the brainstorm's "hover-only, no keyboard access"
resolution (Q6). A non-focusable `<span>` with no `tabIndex` and a pure
`:hover`-driven reveal satisfies that resolution for free.

Because both badges are pinned to the same corner (`bottom-3`), exact
pixel-flush adjacency without editing `FooterVersionBadge`'s own markup
(out of this feature's boundary — see below) isn't possible without a
shared flex layout. This design instead gives the new badge its own fixed
offset (`right-20`, 80px from the viewport edge) calibrated to clear
`FooterVersionBadge`'s current padding/font-size for typical short semver
strings (e.g. `v0.0.0`–`v99.99.99`). This is a known constraint, not a
guarantee of flush adjacency for arbitrarily long version strings — flagged
here so the requirements phase can decide whether to accept the fixed
offset or invest in a shared layout container.

This feature reuses the same hand-rolled CSS custom properties
(`--border`, `--code-bg`, `--text`) that `FooterVersionBadge` and
`HeaderBuildBadge` already read via Tailwind arbitrary values. It does not
add a Shadcn semantic token set.

## File Structure

Legend: **Owns** = this feature is the sole, ongoing owner. **Touches** =
existing shared file, edited only to integrate, not owned.

| Path | Boundary | Purpose |
|---|---|---|
| `src/components/footer-commit-badge/footer-commit-badge.tsx` | Owns | The badge component: reads `__COMMIT_SHA__`/`__COMMIT_SHA_FULL__`, renders the fixed pill markup, and the hover-only tooltip (skipped in the fallback state). No props, no state. |
| `src/vite-env.d.ts` | Touches | Adds `declare const __COMMIT_SHA__: string` and `declare const __COMMIT_SHA_FULL__: string` alongside the existing `__APP_VERSION__`/`__BUILD_TIME__` declarations. Does not touch those existing lines. |
| `vite.config.ts` | Touches | Adds a `resolveCommitSha` helper (shells out to `git rev-parse`, catches and falls back to `"whoops"`) and two entries (`__COMMIT_SHA__`, `__COMMIT_SHA_FULL__`) to the existing `define` block, alongside `__APP_VERSION__`/`__BUILD_TIME__`. |
| `src/App.tsx` | Touches | Mounts `<FooterCommitBadge />` once, alongside the existing `<FooterVersionBadge />`/`<HeaderBuildBadge />` mounts. No other markup changes. |

No other files are touched. `src/components/footer-version-badge/` and
`src/components/header-build-badge/` are read-only reference for this
feature, not modified.

## Boundary Commitments

| Commitment | Detail |
|---|---|
| `src/components/footer-commit-badge/` is exclusively this feature's | Nothing unrelated gets added there, and this feature adds nothing outside it except the integration touches listed above. |
| Declared deps | none — uses only `react` (already a dependency), Node's built-in `node:child_process` (`execFileSync`, build-time only, never bundled into client code), and Tailwind utility classes; no new npm package is added. |
| Build-time sha only | Both globals are resolved once via `git rev-parse` when `vite.config.ts` is evaluated. No runtime fetch (no `version.json`, no API call), no CI-only env var dependency, no re-resolution on the client. |
| Fallback is `"whoops"`, no tooltip in that state | If `git rev-parse` throws for either the short or full sha, both globals resolve to the literal string `"whoops"` and the component renders no tooltip markup at all when `__COMMIT_SHA__ === "whoops"`. |
| No native `title` attribute | The tooltip is custom-styled markup (a `group-hover:`-revealed `<span>`), never the browser's native `title` tooltip. |
| Hover-only, no keyboard/touch access | The tooltip trigger is a plain `<span>` with no `tabIndex`, `onFocus`, or interactive role, so it cannot receive keyboard focus; the tooltip is revealed purely via CSS `:hover` (`group-hover:opacity-100`). |
| Static, non-interactive | No `onClick`, no `<a>`/`<Link>`, no clipboard API, no outbound link. Purely presentational markup, matching `HeaderBuildBadge` and `FooterVersionBadge`. |
| No `aria-hidden` | The short-sha text is a plain visible text node, reachable by screen readers like any other static text. |
| No Shadcn semantic token migration | This feature does not add `--background`/`--foreground`/`--muted-foreground` (or any `@theme` block) to `src/index.css` or `tailwind.config.ts`. It consumes the existing hand-rolled custom properties via Tailwind arbitrary-value syntax, same as the sibling badges. |
| No config surface | No props on `FooterCommitBadge`, no new settings/context/store entry. |
| One mount point | Rendered exactly once, from `src/App.tsx`. No other file mounts it. |
| Positioned right of `FooterVersionBadge` | Fixed `bottom-3`, offset `right-20` (80px) — clear of `FooterVersionBadge`'s `right-3` pill for typical short semver strings. Known limitation: not guaranteed flush/non-overlapping for arbitrarily long version strings (see Overview). |
| Hidden when printing | `print:hidden` on the outer wrapper, matching the sibling badges. |
| Sibling components untouched | `FooterVersionBadge` and `HeaderBuildBadge` source and tests are not modified by this feature. |

## Concrete Shape

**Build-time plumbing** (`vite.config.ts`):
```ts
import { execFileSync } from 'node:child_process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import pkg from './package.json' with { type: 'json' }

function resolveCommitSha(args) {
  try {
    return execFileSync('git', args, {
      cwd: new URL('.', import.meta.url).pathname,
    })
      .toString()
      .trim()
  } catch {
    return 'whoops'
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': new URL('./src', import.meta.url).pathname },
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __BUILD_TIME__: JSON.stringify(Date.now()),
    __COMMIT_SHA__: JSON.stringify(resolveCommitSha(['rev-parse', '--short', 'HEAD'])),
    __COMMIT_SHA_FULL__: JSON.stringify(resolveCommitSha(['rev-parse', 'HEAD'])),
  },
})
```
`resolveCommitSha` is called twice independently (short and full) so a
failure on either call falls back that global to `"whoops"` without
depending on string-slicing the other. `execFileSync` (array-args form,
not a shell string) avoids any shell-interpolation concern.

**Ambient types** (`src/vite-env.d.ts`, existing file, two lines added):
```ts
/// <reference types="vite/client" />

declare const __APP_VERSION__: string
declare const __BUILD_TIME__: number
declare const __COMMIT_SHA__: string
declare const __COMMIT_SHA_FULL__: string
```

**Component** (`src/components/footer-commit-badge/footer-commit-badge.tsx`):
```tsx
export function FooterCommitBadge() {
  const sha = __COMMIT_SHA__
  const hasSha = sha !== 'whoops'

  return (
    <div className="group relative fixed right-20 bottom-3 print:hidden">
      <span className="rounded-full border border-[var(--border)] bg-[var(--code-bg)] px-2 py-0.5 text-xs text-[var(--text)]">
        {sha}
      </span>
      {hasSha && (
        <span className="pointer-events-none absolute right-0 bottom-full mb-1 whitespace-nowrap rounded border border-[var(--border)] bg-[var(--code-bg)] px-2 py-0.5 text-xs text-[var(--text)] opacity-0 transition-opacity group-hover:opacity-100">
          {__COMMIT_SHA_FULL__}
        </span>
      )}
    </div>
  )
}
```
- Badge text is exactly the bare short sha (e.g. `abc1234`), no prefix
  (brainstorm Q10); in the fallback state it is the literal text
  `whoops`.
- Tooltip text is exactly the bare full sha, no label (brainstorm Q11),
  and is only rendered in the DOM when `hasSha` is true — so the fallback
  state has zero tooltip markup, not just a hidden/empty one (brainstorm
  Q12).
- `group` + `relative` on the wrapper, `group-hover:opacity-100` on the
  tooltip `span`, `pointer-events-none` so the tooltip never intercepts
  the hover itself or becomes a click target — pure CSS, no JS state, no
  `onMouseEnter`/`onMouseLeave` handlers.
- Tooltip pill styling reuses the same `--border`/`--code-bg`/`--text`
  custom properties as the badge itself, positioned `absolute
  bottom-full` (above the badge) with `right-0` alignment and
  `whitespace-nowrap` so the 40-character full sha never wraps.
- Margin from viewport edges: `right-20 bottom-3`, placing it to the
  right of `FooterVersionBadge`'s `right-3 bottom-3` pill.
- No `z-index` set on either the badge or the tooltip.
- No `aria-hidden` anywhere in the tree.

**Mount point** (`src/App.tsx`):
```tsx
<CommandPalette />
<FooterVersionBadge />
<FooterCommitBadge />
<HeaderBuildBadge />
```
Added next to the existing `<FooterVersionBadge />` mount, so it renders
on every view of the (currently single-page) app.
