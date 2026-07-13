# Design: Keyboard Shortcuts

Source brainstorm: `docs/brainstorming/keyboard-shortcuts.md`

## Overview

A fixed, non-customizable set of keyboard shortcuts for the web app (Mac-only
key conventions), plus a `?` help overlay for discoverability. The feature
ships as a single self-contained module, `src/keyboard-shortcuts/`, that:

- Attaches exactly one `keydown` listener at the document level.
- Matches incoming key events against a static, hardcoded registry of
  shortcut definitions (no persistence, no rebinding UI).
- Suppresses matching for any shortcut not marked `allowWhileTyping` when
  the event target is a text input, textarea, `contenteditable`, or `select`
  element.
- Handles `?` (help overlay open) and `Escape` (close overlay / dispatch a
  cancel signal) internally.
- Exposes a small hook, `useShortcutAction`, that other feature code uses to
  register a callback for a named action (`"search"` | `"save"`) without
  touching the listener or registry directly.

Initial shortcut set (from the brainstorm, all fixed):

| Action | Keys | Works while typing? |
| --- | --- | --- |
| Search | `⌘K` | No |
| Save | `⌘S` | No |
| Help overlay | `?` | No |
| Close/cancel (overlay, search, in-flight action) | `Escape` | Yes |

The app does not yet have real search or save features (blank Vite
scaffold). This design only owns the shortcut plumbing and the help overlay
UI; wiring `useShortcutAction("search" | "save", handler)` into real
features is out of scope until those features exist.

## File Structure

Boundary table — everything under `src/keyboard-shortcuts/` is owned and
created by this feature. `src/App.tsx` is not owned but requires a one-line
integration edit (see Boundary Commitments).

| Path | Owned by this feature | Purpose |
| --- | --- | --- |
| `src/keyboard-shortcuts/index.ts` | Yes | Public exports: `KeyboardShortcutsProvider`, `useShortcutAction`, `SHORTCUTS` |
| `src/keyboard-shortcuts/KeyboardShortcutsProvider.tsx` | Yes | Mounts the single document `keydown` listener, owns registered action-handler map, renders `ShortcutHelpOverlay` |
| `src/keyboard-shortcuts/useShortcutAction.ts` | Yes | Hook for feature code to register/unregister a handler for `"search"` \| `"save"` |
| `src/keyboard-shortcuts/ShortcutHelpOverlay.tsx` | Yes | `?`-triggered cheat sheet modal, renders from `SHORTCUTS` |
| `src/keyboard-shortcuts/ShortcutHelpOverlay.module.css` | Yes | Scoped styles for the overlay only |
| `src/keyboard-shortcuts/shortcuts.ts` | Yes | Static `SHORTCUTS: ShortcutDefinition[]` registry (id, keys, description, allowWhileTyping) |
| `src/keyboard-shortcuts/matchShortcut.ts` | Yes | Pure function: `KeyboardEvent` + registry → matched `ShortcutDefinition \| undefined` |
| `src/keyboard-shortcuts/isTypingTarget.ts` | Yes | Pure function: `EventTarget \| null` → boolean (input/textarea/contenteditable/select detection) |
| `src/keyboard-shortcuts/types.ts` | Yes | `ShortcutDefinition`, `ShortcutActionId` types |
| `src/keyboard-shortcuts/*.test.ts` | Yes | Unit tests for `matchShortcut` and `isTypingTarget` |
| `src/App.tsx` | No (integration point only) | Wraps app tree in `<KeyboardShortcutsProvider>`; this feature must not otherwise edit this file |

## Boundary Commitments

| Commitment | Detail |
| --- | --- |
| Owned directory | This feature creates and owns all files under `src/keyboard-shortcuts/**`. No other feature may add files there. |
| Single listener | Exactly one `document`-level `keydown` listener exists in the app, attached by `KeyboardShortcutsProvider`. No other module may attach its own `keydown`/`keyup` listener for shortcut purposes. |
| Public API surface | Only `KeyboardShortcutsProvider`, `useShortcutAction`, and `SHORTCUTS` are exported from `src/keyboard-shortcuts/index.ts`. Internal files (`matchShortcut.ts`, `isTypingTarget.ts`, etc.) are not imported directly by consumers outside the directory. |
| Static registry, no persistence | Shortcut key bindings live only in `shortcuts.ts` as hardcoded constants. No `localStorage`, cookies, settings UI, or rebind mechanism is introduced. |
| Input-typing suppression | `isTypingTarget.ts` is the single source of truth for "is the user typing"; any shortcut without `allowWhileTyping: true` is suppressed when it returns `true`. |
| Escape exception | `Escape` is hardcoded with `allowWhileTyping: true` and always dispatches a cancel signal (closes the help overlay if open) regardless of focus. |
| Mac-only bindings | Key matching checks `event.metaKey` only; no Windows/Linux `ctrlKey` fallback is added in this pass. |
| Styling isolation | `ShortcutHelpOverlay` styles live only in `ShortcutHelpOverlay.module.css`; this feature does not edit `src/App.css` or `src/index.css`. |
| App.tsx integration point | This feature may add exactly one wrapping `<KeyboardShortcutsProvider>` element to `src/App.tsx` and its accompanying import. No other edits to `App.tsx` are in scope. |
| No feature wiring | This feature does not implement search or save behavior; `useShortcutAction("search" \| "save", ...)` calls from other features are out of scope until those features exist. |
| Declared deps | none — implemented with React and browser APIs already available via the existing `package.json`. |
