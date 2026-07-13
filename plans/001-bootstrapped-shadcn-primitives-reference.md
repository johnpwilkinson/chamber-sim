# Plan 001: Bootstrapped shadcn primitives reference undefined theme tokens

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on.
> If anything under "STOP conditions" occurs, stop and report — do not
> improvise. The dispatching driver maintains the status index in
> `plans/README.md` — do not edit it.
>
> **Drift check (run first)**: `git diff --stat 931604d..HEAD -- src/index.css`
> If the file changed since planning, compare "Current state" below against
> the live code before proceeding; on a mismatch treat it as a STOP condition.

## Status

- **Priority**: P1
- **Severity**: HIGH
- **Feature**: command-palette
- **Dimension**: integration
- **Planned at**: commit `931604d`, 2026-07-12

## Why this matters

src/components/ui/command.tsx and src/components/ui/dialog.tsx (both bootstrapped in this PR) are Shadcn-generated components that style themselves entirely with semantic Tailwind color utilities — bg-popover, text-popover-foreground, bg-accent, text-accent-foreground, text-foreground, bg-background, text-muted-foreground, bg-border, ring-ring, ring-offset-background. Shadcn's convention (and components.json's own `"cssVariables": true` in this diff) requires these to be backed by CSS custom properties (--popover, --popover-foreground, --accent, --accent-foreground, --background, --foreground, --muted-foreground, --border, --ring, etc.) registered via an `@theme` block in the CSS bootstrap, plus the corresponding `:root` variable values. Neither src/index.css nor tailwind.config.ts (both bootstrapped in this same PR) define any of these tokens — src/index.css only keeps the pre-existing app-specific custom properties (--text, --bg, --accent as a single violet value, --border as a raw hex, etc.), which do not match Shadcn's expected color names/shape. I verified this isn't just a theoretical gap: `grep -rn "@theme\|--color-\|--popover\|--muted-foreground" src/ tailwind.config.ts components.json` finds zero matches, and after running `npx vite build`, the generated dist CSS contains zero occurrences of `popover`, `accent-foreground`, `muted-foreground`, `bg-border`, `ring-ring`, `ring-offset-background`, or `bg-background` — Tailwind v4 silently drops utilities it can't resolve to a theme color instead of erroring.

## Current state

- File: `src/index.css` (line 1)
- Evidence: src/components/ui/command.tsx:22 `"bg-popover text-popover-foreground flex h-full w-full ..."`; src/components/ui/dialog.tsx:61 `"bg-background ... rounded-lg border p-6 shadow-lg"`; src/index.css:1-33 defines only --text/--bg/--border/--accent/--code-bg, no --popover/--accent-foreground/--muted-foreground/--ring; components.json:9 `"cssVariables": true` implies these should exist.

## The fix

Add the standard Shadcn `@theme`/`:root` CSS-variable block to src/index.css (or a dedicated theme partial imported from it) defining --background, --foreground, --popover, --popover-foreground, --accent, --accent-foreground, --muted-foreground, --border, --ring (and map them to Tailwind color names via `@theme inline { --color-popover: var(--popover); ... }` for Tailwind v4), so the bootstrapped Command/Dialog primitives actually render with a visible surface, text color, and selection highlight instead of transparent/unstyled output.

## Done criteria

- The issue described above no longer reproduces at `src/index.css:1`.
- The project's build and test suite pass.
- No file outside the scope of this fix (and its direct tests) was modified.

## STOP conditions

- The "Current state" excerpt no longer matches the live code.
- A correct fix requires editing files unrelated to this finding.
- The fix requires a design decision this plan does not spell out.
