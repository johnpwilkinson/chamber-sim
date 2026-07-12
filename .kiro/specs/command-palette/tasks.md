# Implementation Plan: Command Palette

- [ ] 1. Tailwind and Project Tooling Bootstrap
- [x] 1.1 (P) Add `tailwindcss`, its Vite plugin (`@tailwindcss/vite`), and Shadcn's transitive dependencies (`class-variance-authority`, `clsx`, `tailwind-merge`, `@radix-ui/react-dialog`, an icon set) as new dependencies in `package.json` and install them, relying on the already-present `cmdk` dependency without re-adding it; verify the existing build and test suite still pass unchanged.
  _Requirements: 6.6_
  _Boundary: package.json_
- [x] 1.2 Add `tailwind.config.ts`, register Tailwind's Vite plugin and the `@/*` path alias in `vite.config.ts`, add the matching `@/*` path alias in `tsconfig.app.json`, and add Tailwind's CSS entry point in `src/index.css` alongside the existing custom-property theme without replacing the existing tokens; verify the app still builds cleanly.
  _Requirements: 6.2, 6.3, 6.4, 6.5_
  _Boundary: vite.config.ts, tsconfig.app.json, src/index.css_
  _Depends: 1.1_
- [x] 1.3 (P) Add `components.json` as Shadcn's CLI config, specifying the `src/components/ui` component path, the `@/*` path alias, and the style preset.
  _Requirements: 6.1_
  _Boundary: components.json_

- [ ] 2. Shadcn UI Primitives Bootstrap
- [x] 2.1 Add `src/lib/utils.ts` exporting Shadcn's standard `cn()` class-merge helper built on `clsx` and `tailwind-merge`.
  _Requirements: 5.3_
  _Boundary: src/lib/utils.ts_
  _Depends: 1.1_
- [ ] 2.2 Add `src/components/ui/dialog.tsx` as Shadcn's generated Dialog primitive wrapping `@radix-ui/react-dialog`, using `cn()` from `src/lib/utils.ts`.
  _Requirements: 5.2, 5.4_
  _Boundary: src/components/ui/dialog.tsx_
  _Depends: 2.1_
- [ ] 2.3 Add `src/components/ui/command.tsx` as Shadcn's generated Command primitive wrapping `cmdk`, including the `CommandDialog` composition that renders `Dialog`/`DialogContent` from `src/components/ui/dialog.tsx`, using `cn()` from `src/lib/utils.ts`; add no other Shadcn primitive to `src/components/ui/`.
  _Requirements: 5.1, 5.4_
  _Boundary: src/components/ui/command.tsx_
  _Depends: 2.1, 2.2_

- [ ] 3. Static Command Data
- [x] 3.1 (P) Add `src/components/command-palette/commands.ts` declaring the `CommandCategory` union (`'navigation' | 'quick-action' | 'search'`) and the `CommandItem` interface (`id`, `label`, `category`, optional `keywords`, `onSelect`), and exporting `navigationCommands`, `quickActionCommands`, `searchCommands` as empty `CommandItem[]` arrays, with no runtime registration API and no populated entries.
  _Requirements: 3.1, 3.2, 3.3, 3.4_
  _Boundary: src/components/command-palette/_

- [ ] 4. Command Palette Root Component
- [ ] 4.1 Add `src/components/command-palette/command-palette.tsx`: local `open`/`setOpen` state; a single `useEffect`-registered `window` `keydown` listener matching `metaKey`+`k` (Mac) or `ctrlKey`+`k` (other platforms) that calls `preventDefault()` and toggles `open`; render Shadcn's `CommandDialog` (`open`, `onOpenChange={setOpen}`) wrapping `CommandInput`, `CommandList`, a `CommandEmpty` showing "No results found.", and three `CommandGroup`s headed "Navigation", "Quick actions", "Search" sourced from `navigationCommands`, `quickActionCommands`, `searchCommands`; add no custom selection or filter logic beyond what `cmdk`/Shadcn's `Command` primitive provides.
  _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_
  _Boundary: src/components/command-palette/_
  _Depends: 2.3, 3.1_
- [ ]* 4.2 Add tests for `src/components/command-palette/command-palette.tsx` covering: `Ctrl+K` toggles `open` on non-Mac, name this case [req:1.1]; `Cmd+K` (`metaKey`) toggles `open` on Mac, name this case [req:1.2]; exactly one `keydown` listener is registered per mount, name this case [req:1.3]; triggering `CommandDialog`'s close interaction (`onOpenChange`) updates `open` to closed, name this case [req:1.5]; and, with all command arrays empty, `CommandEmpty` renders "No results found." while all three `CommandGroup` headings ("Navigation", "Quick actions", "Search") are present, name this case with [req:2.1] [req:2.2] [req:2.3].
  _Requirements: 1.1, 1.2, 1.3, 1.5, 2.1, 2.2, 2.3_
  _Boundary: src/components/command-palette/_
  _Depends: 4.1_

- [ ] 5. Mount Point Integration
- [ ] 5.1 Edit `src/App.tsx` to render `<CommandPalette />` exactly once, unconditionally, importing it from `src/components/command-palette/command-palette.tsx`, leaving the rest of the existing blank-slate markup unchanged.
  _Requirements: 4.1, 4.2_
  _Boundary: src/App.tsx_
  _Depends: 4.1_
- [ ]* 5.2 Add a test for `src/App.tsx` asserting `<CommandPalette />` renders exactly once outside any conditional markup, name this case [req:4.1], and that the pre-existing blank-slate markup is otherwise unchanged, name this case [req:4.2].
  _Requirements: 4.1, 4.2_
  _Boundary: src/App.tsx_
  _Depends: 5.1_
