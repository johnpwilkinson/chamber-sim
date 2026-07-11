# Brainstorm: Dark Mode Support

Date: 2026-07-11

## Summary

Dark mode will be implemented by adopting shadcn/ui's official Vite dark-mode
pattern as-is: a `ThemeProvider` backed by React Context, a three-way
light/dark/system selector persisted to `localStorage`, and an inline
FOUC-prevention script. Styling is Tailwind CSS using the `class` strategy,
set up via a full `shadcn/ui init` (CSS variables, Slate base color, current
default style) since the project is currently a blank Vite + React scaffold.

## Questions and Answers

1. **What should drive dark mode selection — a manual toggle, automatically
   following `prefers-color-scheme`, or both?**
   Both, with manual toggle overriding the system default.

2. **Should the manual choice persist across sessions (e.g. localStorage), or
   reset to system preference on each load?**
   Persist.

3. **Does the project already have a styling solution in mind, or should we
   decide that as part of this brainstorm?**
   Tailwind CSS.

4. **Two-state toggle (light/dark) or three-state (light/dark/system)?**
   (Initial answer, later superseded — see Q6) Two-state toggle. Initial
   state follows system preference; after user toggles, their choice
   persists (overrides system) going forward.

5. **Should the toggle live in a global location like a header/navbar, or
   somewhere contextual like a settings panel?**
   Nav.

6. **Icon-based toggle or labeled switch?**
   Icon.

7. **Should we add an inline script in `index.html` to prevent a flash of
   the wrong theme before React hydrates, or is a brief flash acceptable?**
   Use the shadcn dark mode Vite guide
   (https://ui.shadcn.com/docs/dark-mode/vite) as-is, which includes its own
   documented FOUC-prevention pattern.

8. **shadcn's default toggle is a three-option dropdown
   (Light/Dark/System) with animated sun/moon icons — different from the
   two-state toggle decided in Q4. Adapt shadcn's `ThemeProvider`/FOUC
   pattern but keep the two-state toggle, or switch to shadcn's native
   three-option dropdown?**
   Adopt shadcn's native three-option dropdown (Light/Dark/System) as-is,
   including their `ThemeProvider` and FOUC-prevention pattern. This
   supersedes the two-state answer in Q4.

9. **Should this effort include running `shadcn/ui init` (Tailwind config,
   `components.json`, CSS variables, etc.) as a prerequisite, since the
   project is currently a blank Vite + React scaffold?**
   Include full shadcn/ui init as part of this. Use Context7 to pull
   current, accurate setup docs rather than relying on possibly stale
   knowledge.

10. **Which shadcn base color palette — Slate, Gray, Zinc, Neutral, or
    Stone?**
    Slate.

11. **Which shadcn style variant — "Default" or "New York"?**
    Preference for New York, with instruction to fall back to whatever
    `shadcn init` currently defaults to if the style choice has been
    removed. Verified via Context7: as of the 2025-02 Tailwind v4 update,
    shadcn deprecated the "Default" style and the CLI no longer prompts for
    a style choice — new projects use "new-york" automatically, so the
    preference is satisfied with no fallback needed.

## Resulting Decisions

- **Trigger**: System preference on first load; manual override persists
  thereafter.
- **Persistence**: `localStorage`, using shadcn's `vite-ui-theme` key and
  `system` default, per their documented `ThemeProvider`.
- **Styling**: Tailwind CSS, `class`-strategy dark mode, via full
  `shadcn/ui init`.
- **Toggle UI**: Icon-based (sun/moon) dropdown in the nav, offering
  Light/Dark/System — shadcn's native `ModeToggle` component, unmodified.
- **FOUC prevention**: shadcn's documented inline-script/`ThemeProvider`
  pattern from the Vite dark-mode guide.
- **shadcn/ui setup**: Base color Slate; style defaults to "new-york" (the
  only current option, matching stated preference).

## Reference

- shadcn/ui dark mode (Vite): https://ui.shadcn.com/docs/dark-mode/vite
