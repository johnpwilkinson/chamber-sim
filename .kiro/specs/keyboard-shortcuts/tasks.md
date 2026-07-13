# Implementation Plan: Keyboard Shortcuts

- [ ] 1. Core types and pure shortcut-matching utilities
- [ ] 1.1 (P) Define `ShortcutDefinition` and `ShortcutActionId` types in `src/keyboard-shortcuts/types.ts`
  _Requirements: 2.2, 9.1_
  _Boundary: src/keyboard-shortcuts_
- [ ] 1.2 (P) Implement `isTypingTarget.ts` as a pure function over `EventTarget | null` and add its unit tests covering input/textarea/contenteditable/select/non-typing targets, named with [req:4.1] [req:4.2] [req:4.6] [req:11.2]
  _Requirements: 4.1, 4.2, 4.6, 11.2, 9.1_
  _Boundary: src/keyboard-shortcuts_
- [ ] 1.3 Define the static `SHORTCUTS: ShortcutDefinition[]` registry in `shortcuts.ts` (search ⌘K, save ⌘S, help `?`, cancel `Escape` with `allowWhileTyping: true`), with no persistence or rebind mechanism
  _Requirements: 2.1, 2.3, 2.4, 2.5, 2.6, 10.1, 10.2, 9.1_
  _Boundary: src/keyboard-shortcuts_
  _Depends: 1.1_
- [ ] 1.4 Implement `matchShortcut.ts` as a pure function matching a `KeyboardEvent` against `SHORTCUTS` (checking `event.metaKey` only, never `event.ctrlKey`), returning `undefined` on no match, and add unit tests covering a matching case per registry entry plus a non-matching case, named with [req:3.1] [req:3.2] [req:3.3] [req:3.4] [req:11.1]
  _Requirements: 3.1, 3.2, 3.3, 3.4, 11.1, 9.1_
  _Boundary: src/keyboard-shortcuts_
  _Depends: 1.1, 1.3_

- [ ] 2. Help overlay UI
- [ ] 2.1 Build `ShortcutHelpOverlay.tsx`, rendering the shortcut list (keys and descriptions) derived from `SHORTCUTS`, styled exclusively via `ShortcutHelpOverlay.module.css` with no edits to `src/App.css` or `src/index.css`
  _Requirements: 5.2, 5.4, 5.5, 9.1_
  _Boundary: src/keyboard-shortcuts_
  _Depends: 1.1, 1.3_

- [ ] 3. Provider: centralized listener and dispatch
- [ ] 3.1 Build `KeyboardShortcutsProvider.tsx`: attach exactly one document-level `keydown` listener on mount and remove it on unmount, own the registered action-handler map, render `ShortcutHelpOverlay`, apply `isTypingTarget`/`matchShortcut` to suppress non-`allowWhileTyping` shortcuts while typing, open the overlay on `?`, and dispatch the cancel signal on `Escape` (closing the overlay if open, regardless of focus)
  _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 4.3, 4.4, 4.5, 5.1, 5.3, 6.1, 6.2, 6.3, 9.1_
  _Boundary: src/keyboard-shortcuts_
  _Depends: 1.1, 1.2, 1.3, 1.4, 2.1_

- [ ] 4. Public hook and module API surface
- [ ] 4.1 Implement `useShortcutAction.ts`, registering/unregistering a handler for `"search"` | `"save"` with `KeyboardShortcutsProvider`'s handler map on mount/unmount, invoking the handler when the corresponding shortcut fires outside a typing target, and no-oping without throwing when no handler is registered
  _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 9.1_
  _Boundary: src/keyboard-shortcuts_
  _Depends: 3.1_
- [ ] 4.2 Create `index.ts` exporting only `KeyboardShortcutsProvider`, `useShortcutAction`, and `SHORTCUTS`, with no other internal file (`matchShortcut.ts`, `isTypingTarget.ts`, `shortcuts.ts`, `types.ts`) exposed for outside import, and no search/save feature behavior implemented
  _Requirements: 7.6, 7.7, 7.8, 9.1, 9.2, 9.3_
  _Boundary: src/keyboard-shortcuts_
  _Depends: 1.3, 3.1, 4.1_

- [ ] 5. App shell integration
- [ ] 5.1 Add exactly one `<KeyboardShortcutsProvider>` wrapping element and its accompanying import to `src/App.tsx`, with no other edits to that file
  _Requirements: 8.1, 8.2_
  _Boundary: src/App.tsx_
  _Depends: 4.2_
