# Command Palette — Requirements

Source: [design.md](./design.md)

## Introduction

V1 delivers the command palette as infrastructure: a keyboard-triggered
overlay built on `cmdk` and Shadcn's `Command`/`Dialog` primitives, with
three empty static command categories, plus the one-time Tailwind/Shadcn
project bootstrap this feature requires as its first consumer. No visible
trigger, no populated commands, no runtime registration API, and no custom
selection logic are in scope for v1.

### Requirement 1: Keyboard Trigger and Open/Close State

**User Story:** As a user, I want to open the command palette with a
keyboard shortcut from anywhere in the app, so that I can access it
without a visible trigger element.

#### Acceptance Criteria

- 1.1 WHEN the user presses `Ctrl+K` on a non-Mac platform THE SYSTEM SHALL prevent the browser/OS default action for that keystroke and toggle the palette's open state.
- 1.2 WHEN the user presses `Cmd+K` on a Mac platform (`metaKey`) THE SYSTEM SHALL prevent the browser/OS default action for that keystroke and toggle the palette's open state.
- 1.3 WHERE the `command-palette.tsx` root component is mounted THE SYSTEM SHALL register exactly one `keydown` listener on `window` (e.g. via a single `useEffect`) for the lifetime of that mount.
- 1.4 WHEN the open/close state changes THE SYSTEM SHALL keep that state local to the `CommandPalette` component, with no global event bus or external store involved.
- 1.5 WHEN the palette is open and the user triggers the close interaction exposed by `CommandDialog` (e.g. `onOpenChange`) THE SYSTEM SHALL update the local `open` state to closed.

### Requirement 2: Palette Rendering and Structure

**User Story:** As a user, I want the opened palette to show a searchable
list organized into categories with a clear empty state, so that the
overlay behaves predictably even before any commands exist.

#### Acceptance Criteria

- 2.1 WHEN the palette's `open` state is true THE SYSTEM SHALL render Shadcn's `CommandDialog` wrapping a `CommandInput`, a `CommandList`, and a `CommandEmpty` fallback.
- 2.2 WHEN the palette is rendered THE SYSTEM SHALL render three `CommandGroup` sections inside `CommandList`, headed "Navigation", "Quick actions", and "Search", sourced respectively from `navigationCommands`, `quickActionCommands`, and `searchCommands`.
- 2.3 IF all three command arrays (`navigationCommands`, `quickActionCommands`, `searchCommands`) are empty THE SYSTEM SHALL render `cmdk`'s `<CommandEmpty>` state showing "No results found." as the v1 done-state, not as an error condition.
- 2.4 WHEN the user presses arrow keys or Enter while the palette is open THE SYSTEM SHALL rely exclusively on `cmdk`/Shadcn's `Command` primitive for keyboard selection behavior, with no custom selection logic added by this feature.
- 2.5 WHEN the user hovers over or clicks a list item while the palette is open THE SYSTEM SHALL rely exclusively on `cmdk`/Shadcn's `Command` primitive for mouse selection behavior, with no custom selection logic added by this feature.
- 2.6 WHERE the `Command`/`Dialog` primitives render filtering or list behavior THE SYSTEM SHALL NOT fork or reimplement that behavior anywhere in `command-palette.tsx` or `commands.ts`.

### Requirement 3: Static Command Data

**User Story:** As a developer building on this feature later, I want a
typed, static command data shape with no entries yet, so that future work
can populate real commands without changing the palette component.

#### Acceptance Criteria

- 3.1 WHERE command data is defined THE SYSTEM SHALL declare it in `src/components/command-palette/commands.ts` as a `CommandCategory` union type (`'navigation' | 'quick-action' | 'search'`) and a `CommandItem` interface with `id`, `label`, `category`, optional `keywords`, and `onSelect`.
- 3.2 WHEN `commands.ts` is created THE SYSTEM SHALL export `navigationCommands`, `quickActionCommands`, and `searchCommands` as `CommandItem[]`, each initialized as an empty array for v1.
- 3.3 THE SYSTEM SHALL NOT expose any runtime API, hook, or store that allows other parts of the app to register or unregister commands dynamically; the command list SHALL remain a static, hand-edited array for v1.
- 3.4 THE SYSTEM SHALL NOT populate `navigationCommands`, `quickActionCommands`, or `searchCommands` with real navigation targets, quick actions, or search results in v1.

### Requirement 4: Mount Point Integration

**User Story:** As a user, I want the shortcut to work regardless of what
page or view I'm on, so that the palette is always reachable.

#### Acceptance Criteria

- 4.1 WHEN the app starts THE SYSTEM SHALL render `<CommandPalette />` exactly once from `src/App.tsx`, outside any conditional markup.
- 4.2 WHEN integrating `<CommandPalette />` into `src/App.tsx` THE SYSTEM SHALL leave the rest of the existing blank-slate markup in `App.tsx` unchanged.

### Requirement 5: Shadcn UI Primitives Bootstrap

**User Story:** As a developer, I want the two Shadcn primitives this
feature needs, and the shared helper they depend on, generated as shared,
reusable code, so that later features can adopt Shadcn without redoing
this setup.

#### Acceptance Criteria

- 5.1 WHEN this feature is implemented THE SYSTEM SHALL add Shadcn's generated `Command` primitive at `src/components/ui/command.tsx`, wrapping `cmdk`.
- 5.2 WHEN this feature is implemented THE SYSTEM SHALL add Shadcn's generated `Dialog` primitive at `src/components/ui/dialog.tsx`, backing `CommandDialog`.
- 5.3 WHEN this feature is implemented THE SYSTEM SHALL add Shadcn's standard `cn()` class-merge helper at `src/lib/utils.ts`.
- 5.4 THE SYSTEM SHALL add only the `command` and `dialog` primitives to `src/components/ui/`, and SHALL NOT pre-populate any other Shadcn primitive in that folder.

### Requirement 6: Tailwind and Project Tooling Bootstrap

**User Story:** As a developer, I want Tailwind and Shadcn's CLI wired
into the currently bare Vite + React + TS project, so that the palette's
styling dependencies are satisfied and future features can build on the
same tooling.

#### Acceptance Criteria

- 6.1 WHEN this feature is implemented THE SYSTEM SHALL add `components.json` as Shadcn's CLI config, specifying component paths, path aliases, and style.
- 6.2 WHEN this feature is implemented THE SYSTEM SHALL add `tailwind.config.ts` and wire Tailwind into `vite.config.ts` since Tailwind is a hard prerequisite for the Shadcn components used here.
- 6.3 WHEN `vite.config.ts` is edited THE SYSTEM SHALL register Tailwind's Vite plugin and add the `@/*` path alias that Shadcn-generated imports expect.
- 6.4 WHEN `tsconfig.app.json` is edited THE SYSTEM SHALL add a matching `@/*` path alias so the TypeScript project resolves Shadcn's import style.
- 6.5 WHEN `src/index.css` is edited THE SYSTEM SHALL add Tailwind's CSS entry point alongside the existing custom-property theme, without replacing the existing tokens.
- 6.6 WHEN `package.json` is edited THE SYSTEM SHALL add `tailwindcss`, its Vite plugin, and Shadcn's transitive dependencies (`class-variance-authority`, `clsx`, `tailwind-merge`, `@radix-ui/react-dialog`, an icon set) as new dependencies, and SHALL rely on the already-present `cmdk` dependency without re-adding it.
- 6.7 THE SYSTEM SHALL NOT modify `src/App.css`, `src/assets/*`, or any other blank-slate scaffold file beyond the files enumerated in this and the preceding requirements.

### Requirement 7: Scope and Ownership Boundaries

**User Story:** As a maintainer, I want clear ownership boundaries between
this feature's files and the shared project tooling it bootstraps, so
that future features can extend the shared parts without needing this
feature's sign-off.

#### Acceptance Criteria

- 7.1 THE SYSTEM SHALL treat `src/components/command-palette/` as exclusively owned by this feature, adding nothing unrelated there.
- 7.2 THE SYSTEM SHALL NOT add files outside `src/components/command-palette/` except the integration touches explicitly listed (`src/App.tsx`, `src/index.css`, `vite.config.ts`, `tsconfig.app.json`, `package.json`) and the bootstrapped files listed in Requirements 5 and 6.
- 7.3 WHERE `src/components/ui/` is a shared Shadcn primitives folder THE SYSTEM SHALL treat it as project-wide, not command-palette-owned, once merged, so future features may add their own primitives there without this feature's sign-off.
- 7.4 WHERE `components.json` and the Tailwind wiring are introduced as a one-time project bootstrap THE SYSTEM SHALL treat them as project-owned once merged, not as a long-term possession of the command-palette feature.
- 7.5 WHERE `src/lib/utils.ts` is introduced as Shadcn's standard `cn()` helper THE SYSTEM SHALL treat it as project-owned once merged, not as a long-term possession of the command-palette feature, consistent with the `src/components/ui/` (7.3) and Tailwind/`components.json` (7.4) bootstrap boundaries — future features may import or extend it without this feature's sign-off.
- 7.6 THE SYSTEM SHALL NOT add any visible trigger UI (e.g. a header button or icon) for opening the palette; `Cmd/Ctrl+K` SHALL remain the only entry point in v1.
