# Command Palette — Design

Source: [docs/brainstorming/command-palette.md](../../../docs/brainstorming/command-palette.md)

## Overview

V1 ships the command palette as infrastructure: a `Cmd/Ctrl+K`-triggered
overlay, built on the existing `cmdk` dependency and styled with Shadcn's
Command/Dialog primitives, with three static command categories
(navigation, quick actions, search) present as structure but not yet
populated with real entries. The app is currently a blank Vite + React +
TS slate with no Tailwind, no Shadcn, and no path aliases configured, so
this feature is also the one that bootstraps that project-level tooling —
it's the first consumer, not a passive user, of Tailwind/Shadcn.

"Done" for v1 (per brainstorm): the palette installs, opens via the
keyboard shortcut, and correctly renders `cmdk`'s empty state because
there is nothing to search or act on yet. Keyboard (arrow keys + enter)
and mouse (hover/click) selection both work, but that behavior is
inherited for free from `cmdk`/Shadcn's `Command` primitive — no custom
selection logic is written.

Explicitly not in v1: a visible trigger button, populated command
entries, a runtime command-registration API, or a real content/search
index. Those are follow-on work once the app has actual pages/content to
point the palette at.

## File Structure

Legend: **Owns** = this feature is the sole, ongoing owner. **Bootstraps**
= this feature creates it because it's the first consumer, but ownership
becomes project-wide once merged (future features may extend it without
asking command-palette's permission). **Touches** = existing shared file,
edited only to integrate, not owned.

| Path | Boundary | Purpose |
|---|---|---|
| `src/components/command-palette/command-palette.tsx` | Owns | Root component: open/close state, `Mod+K` keydown listener, renders Shadcn `CommandDialog` wrapping input/list/groups/empty-state. |
| `src/components/command-palette/commands.ts` | Owns | Static command data: `CommandItem` type + one array per category (`navigationCommands`, `quickActionCommands`, `searchCommands`), all empty for v1. |
| `src/components/ui/command.tsx` | Bootstraps | Shadcn's generated `Command` primitive (wraps `cmdk`). |
| `src/components/ui/dialog.tsx` | Bootstraps | Shadcn's generated `Dialog` primitive (backs `CommandDialog`). |
| `src/lib/utils.ts` | Bootstraps | Shadcn's standard `cn()` class-merge helper. |
| `components.json` | Bootstraps | Shadcn CLI config (component paths, aliases, style). |
| `tailwind.config.ts` / Tailwind wiring in `vite.config.ts` | Bootstraps | Tailwind is a hard prerequisite for Shadcn components and isn't in the project yet. |
| `src/App.tsx` | Touches | Mounts `<CommandPalette />`; no other changes to the existing blank-slate markup. |
| `src/index.css` | Touches | Adds Tailwind's CSS entry point alongside the existing custom-property theme; existing tokens are not replaced. |
| `vite.config.ts` | Touches | Registers Tailwind's Vite plugin; adds the `@/*` path alias Shadcn imports expect. |
| `tsconfig.app.json` | Touches | Adds matching `@/*` path alias for the TS project. |
| `package.json` | Touches | New deps: `tailwindcss`, its Vite plugin, and Shadcn's transitive deps (`class-variance-authority`, `clsx`, `tailwind-merge`, `@radix-ui/react-dialog`, an icon set). `cmdk` is already present. |

No other files are touched. `src/App.css`, `src/assets/*`, and the rest of
the blank-slate scaffold are out of scope.

## Boundary Commitments

- **`src/components/command-palette/` is exclusively this feature's.**
  Nothing unrelated gets added there, and this feature adds nothing
  outside it except the integration touches listed above.
- **`src/components/ui/` is a shared Shadcn primitives folder, not a
  command-palette-owned one.** This feature adds only the two primitives
  it needs (`command`, `dialog`) and does not pre-populate the rest of
  Shadcn's catalog. Future features add their own primitives here without
  needing command-palette's sign-off.
- **Tailwind/Shadcn config is a one-time project bootstrap, not a
  long-term command-palette possession.** `components.json` and the
  Tailwind wiring exist because this is the first feature to need them;
  once merged, they belong to the project, not to this feature.
- **No real command entries.** `commands.ts` ships with empty category
  arrays. Populating navigation targets, quick actions, or search results
  is follow-on work, gated on the app having real pages/content.
- **No runtime registration API.** The command list is a static, hand-
  edited array. Nothing in this feature exposes a way for other parts of
  the app to register commands dynamically (brainstorm Q3).
- **No visible trigger UI.** `Cmd/Ctrl+K` is the only entry point; no
  header button/icon is added (brainstorm Q5).
- **No custom selection/filter logic.** Keyboard and mouse selection,
  and empty-state rendering, come from `cmdk`/Shadcn's `Command`
  primitive as-is — this feature does not fork or reimplement that
  behavior.

## Concrete Shape

**Trigger.** A single `keydown` listener, registered once (e.g. via
`useEffect` on `window` inside `command-palette.tsx`), matches `metaKey`
(Mac) or `ctrlKey` (other platforms) + `k`, calls `preventDefault()`, and
toggles local `open` state. No global event bus or store — this is one
component's local state.

**Component tree.**
```
<CommandPalette>                          // command-palette.tsx
  <CommandDialog open={open} onOpenChange={setOpen}>   // shadcn ui/command.tsx + ui/dialog.tsx
    <CommandInput />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Navigation">{navigationCommands}</CommandGroup>
      <CommandGroup heading="Quick actions">{quickActionCommands}</CommandGroup>
      <CommandGroup heading="Search">{searchCommands}</CommandGroup>
    </CommandList>
  </CommandDialog>
</CommandPalette>
```
With all three arrays empty, `cmdk` renders `<CommandEmpty>` — this is
the v1 "done" state, not a bug to fix later.

**Data shape** (`commands.ts`):
```ts
type CommandCategory = 'navigation' | 'quick-action' | 'search'

interface CommandItem {
  id: string
  label: string
  category: CommandCategory
  keywords?: string[]
  onSelect: () => void
}

export const navigationCommands: CommandItem[] = []
export const quickActionCommands: CommandItem[] = []
export const searchCommands: CommandItem[] = []
```
This shape is deliberately what a future requirement ("add a navigation
command for page X") slots into without changing `command-palette.tsx`.

**Mount point.** `<CommandPalette />` is rendered once from `App.tsx`,
outside any conditional markup, so the shortcut works from anywhere in
the (currently single-page) app.
