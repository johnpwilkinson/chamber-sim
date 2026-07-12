# Command Palette — Brainstorm

Date: 2026-07-12

## Summary

V1 of the command palette is scoped as infrastructure-first: wire up the
trigger, UI, and empty-state search using the existing `cmdk` dependency
styled with Shadcn, with navigation, quick actions, and content search as
the intended (but not yet populated) command categories. The palette is
considered "done" for v1 once it opens via keyboard shortcut and correctly
shows the empty state, since the app is currently a blank slate with no
real content or actions to wire up yet.

## Questions and answers

1. **What would trigger the command palette to open — a specific keyboard
   shortcut (e.g. Cmd/Ctrl+K), a UI button, or both?**
   Cmd/Ctrl+K.

2. **What actions/commands should the palette support at launch — e.g.
   navigation between pages, triggering app actions, searching content, or
   some mix?**
   Smart mix to get started - pick 3 popular actions.

   Proposed and agreed mix:
   1. Navigation — jump to pages/routes
   2. Quick actions — e.g. toggle theme, create new item
   3. Search — fuzzy search over app content/entities

3. **Should the palette's command list be static (hardcoded at build time)
   or extensible, where different parts of the app can register their own
   commands at runtime?**
   Static is fine for v1.

4. **Which UI library or styling approach should the palette use — plain
   custom-built with the existing `cmdk` dependency already in the
   project, or something else?**
   Shadcn.

5. **Since this is keyboard-shortcut triggered, should there also be a
   visible UI entry point (e.g. a search icon/button in the header) for
   users on touch devices or who don't know the shortcut, or is Cmd/Ctrl+K
   only sufficient for v1?**
   Sufficient for v1 — Cmd/Ctrl+K only, no visible trigger button.

6. **Should the palette results support keyboard-only navigation (arrow
   keys + enter), or also mouse hover/click selection?**
   Both.

7. **For the "search" part of the mix — since this is currently a
   blank-slate app, what should search actually search over (e.g. app
   pages/sections, mock data, or is this more forward-looking/placeholder
   until real content exists)?**
   More of a placeholder for now, but set up the infra so it can search
   app pages later.

8. **What specific quick actions should be included in v1, given this is
   currently a blank-slate app (e.g. toggle light/dark theme, open GitHub
   repo link, etc.)?**
   As long as it is installed, that is a win for v1. Trigger opens the
   palette with Cmd/Ctrl+K, search correctly recognizes there is nothing
   to search since it is blank slate, and displays the cmdk empty state.

9. **Anything else to add before writing the summary, or write it up
   now?**
   Nothing else to add — write up the summary.

## V1 scope (converged)

- Trigger: Cmd/Ctrl+K only (no button).
- UI: Shadcn's command palette component (built on `cmdk`, already a
  project dependency).
- Command categories (static list): navigation, quick actions, search —
  present as the intended structure, not necessarily populated with real
  entries yet.
- Search infra is wired up to search app pages, but since there's no
  content yet, it should correctly show the `cmdk` empty state.
- Selection: keyboard (arrow keys + enter) and mouse (hover/click) both
  supported.
- "Done" bar for v1: palette installs, opens via shortcut, and displays
  the empty state correctly.
