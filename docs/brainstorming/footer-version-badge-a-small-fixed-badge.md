# Brainstorming: Footer Version Badge

## Topic

A small fixed badge in the bottom-right corner showing the app version read
from `package.json`. Subtle muted styling, hidden when printing. Tiny scope:
one component, rendered once in `App`. No config, no settings, no animation.

## Discussion

**Q1: Should the badge display the raw version only (e.g. `0.0.0`), or
prefixed with a "v" (e.g. `v0.0.0`)?**
A: Prefix (e.g. `v0.0.0`).

**Q2: Should the badge always render (dev and production builds), or only in
development mode?**
A: Both — always render, in dev and production.

**Q3: Should the badge have any background/pill container (e.g. subtle
chip), or just plain muted text with no background?**
A: Subtle chip/pill background.

**Q4: Should the badge be a static, non-interactive element, or should
clicking it do something (e.g. link to a changelog/repo URL, or copy the
version to clipboard)?**
A: Static / non-interactive.

**Q5: Should the badge sit flush in the corner (0 offset) or with a small
margin from the edges (e.g. 8–16px)?**
A: Small margin (~8–16px).

**Q6: Since the app already uses Tailwind theme tokens (e.g.
`bg-background`, `text-muted-foreground`), should the badge use those
existing theme tokens so it adapts automatically to dark/light mode, or use
fixed hardcoded colors regardless of theme?**
A: Theme tokens (adapts dark/light).

**Q7: Should the badge be exposed to screen readers as normal text, or
marked `aria-hidden` since it's a purely decorative/non-critical element?**
A: Normal text (screen-reader visible).

## Converged Scope

- Single component, rendered once in `App`, fixed to the bottom-right
  corner with a small margin (~8–16px) from the viewport edges.
- Displays the version from `package.json`, prefixed with `v` (e.g.
  `v0.0.0`).
- Rendered in both development and production builds — no env gating.
- Subtle chip/pill background using existing Tailwind theme tokens (e.g.
  `bg-background`/`text-muted-foreground` or similar muted tokens), so it
  adapts to dark/light mode automatically.
- Static, non-interactive — no click behavior, no link.
- Normal text content, visible to screen readers (no `aria-hidden`).
- Hidden when printing (`print:hidden` or equivalent).
- No configuration, no settings, no animation.
- No other fixed bottom-right elements exist in the app today, so no
  overlap/z-index conflicts are expected.
