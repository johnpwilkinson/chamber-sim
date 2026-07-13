# Requirements: Keyboard Shortcuts

## Introduction

This feature adds a fixed, non-customizable set of Mac-only keyboard shortcuts to the web app, plus a `?`-triggered help overlay, implemented as a single self-contained module under `src/keyboard-shortcuts/`. It defines a static shortcut registry, a single document-level `keydown` listener, typing-target suppression, and a `useShortcutAction` hook for future feature code to consume — without implementing the search/save features themselves.

### Requirement 1: Centralized keydown listener

**User story:** As a developer maintaining the app, I want a single centralized keydown listener owned by one provider component, so that shortcut handling never conflicts across features or double-fires.

#### Acceptance Criteria

- 1.1 WHEN `KeyboardShortcutsProvider` mounts THE SYSTEM SHALL attach exactly one `keydown` event listener at the `document` level.
- 1.2 WHEN `KeyboardShortcutsProvider` unmounts THE SYSTEM SHALL remove the document-level `keydown` listener it attached.
- 1.3 WHILE the app is running THE SYSTEM SHALL ensure no module other than `KeyboardShortcutsProvider` attaches its own `keydown` or `keyup` listener for shortcut purposes.
- 1.4 WHEN `KeyboardShortcutsProvider` renders THE SYSTEM SHALL render `ShortcutHelpOverlay` as part of its output.
- 1.5 THE SYSTEM SHALL have `KeyboardShortcutsProvider` own the registered action-handler map used to dispatch matched shortcuts to feature-registered callbacks.

### Requirement 2: Static shortcut registry

**User story:** As a developer, I want shortcut bindings defined as hardcoded constants in one place, so that bindings are consistent, predictable, and require no persistence or settings layer.

#### Acceptance Criteria

- 2.1 THE SYSTEM SHALL define a static `SHORTCUTS: ShortcutDefinition[]` registry in `shortcuts.ts` containing entries for "search" (`⌘K`), "save" (`⌘S`), help overlay (`?`), and cancel (`Escape`).
- 2.2 THE SYSTEM SHALL define `ShortcutDefinition` and `ShortcutActionId` types in `types.ts`, used by the registry, matcher, and provider.
- 2.3 WHERE a shortcut definition does not explicitly set `allowWhileTyping` to `true` THE SYSTEM SHALL treat that shortcut as suppressed while a typing target is focused.
- 2.4 THE SYSTEM SHALL define the `Escape` shortcut definition with `allowWhileTyping` set to `true`.
- 2.5 THE SYSTEM SHALL NOT persist shortcut key bindings to `localStorage`, cookies, or any settings UI.
- 2.6 THE SYSTEM SHALL NOT provide any rebind or customization mechanism for shortcut keys.

### Requirement 3: Shortcut matching logic

**User story:** As a developer, I want a pure function that maps a keyboard event and the registry to a matched shortcut, so that matching logic is testable in isolation from DOM listener wiring.

#### Acceptance Criteria

- 3.1 WHEN `matchShortcut` is invoked with a `KeyboardEvent` and the `SHORTCUTS` registry THE SYSTEM SHALL return the `ShortcutDefinition` whose key combination matches the event.
- 3.2 IF no registry entry's key combination matches the given `KeyboardEvent` THEN THE SYSTEM SHALL have `matchShortcut` return `undefined` without throwing.
- 3.3 WHEN evaluating a shortcut that requires a modifier key THE SYSTEM SHALL check `event.metaKey` only, and SHALL NOT check `event.ctrlKey` as a fallback.
- 3.4 THE SYSTEM SHALL implement `matchShortcut` as a pure function with no side effects and no dependency on DOM listener state.

### Requirement 4: Typing-target suppression

**User story:** As a user typing in a form field, I want most shortcuts to stay inactive while I'm typing, so that ordinary keystrokes aren't hijacked as shortcut triggers.

#### Acceptance Criteria

- 4.1 WHEN a keydown event's target is an `input`, `textarea`, `contenteditable`, or `select` element THE SYSTEM SHALL have `isTypingTarget` return `true` for that target.
- 4.2 WHEN a keydown event's target is none of `input`, `textarea`, `contenteditable`, or `select` THE SYSTEM SHALL have `isTypingTarget` return `false` for that target.
- 4.3 IF `isTypingTarget` returns `true` for the current event target AND the matched shortcut definition's `allowWhileTyping` is not `true` THEN THE SYSTEM SHALL suppress invocation of that shortcut's action.
- 4.4 WHERE `isTypingTarget` returns `true` for the current event target AND the matched shortcut definition's `allowWhileTyping` is `true` THE SYSTEM SHALL still invoke that shortcut's action.
- 4.5 THE SYSTEM SHALL treat `isTypingTarget` as the single source of truth for "is the user typing"; no other module in this feature SHALL implement separate typing-detection logic for shortcut suppression.
- 4.6 THE SYSTEM SHALL implement `isTypingTarget` as a pure function accepting `EventTarget | null` and returning a boolean.

### Requirement 5: Help overlay

**User story:** As a user, I want to press `?` to see a cheat sheet of available shortcuts, so that I can discover what shortcuts exist without external documentation.

#### Acceptance Criteria

- 5.1 WHEN the user presses `?` and the event target is not a typing target THE SYSTEM SHALL open `ShortcutHelpOverlay`.
- 5.2 WHEN `ShortcutHelpOverlay` is open THE SYSTEM SHALL render the list of shortcuts (keys and descriptions) derived from the `SHORTCUTS` registry.
- 5.3 WHEN the user presses `Escape` while `ShortcutHelpOverlay` is open THE SYSTEM SHALL close the overlay.
- 5.4 THE SYSTEM SHALL style `ShortcutHelpOverlay` exclusively via `ShortcutHelpOverlay.module.css` scoped styles.
- 5.5 THE SYSTEM SHALL NOT edit `src/App.css` or `src/index.css` to style the overlay or any other part of this feature.

### Requirement 6: Escape / cancel signal

**User story:** As a user, I want `Escape` to always cancel or close whatever is active, so that I have a consistent, reliable "get me out of this" key regardless of what I'm focused on.

#### Acceptance Criteria

- 6.1 WHEN the user presses `Escape`, regardless of the current focus or typing target, THE SYSTEM SHALL dispatch a cancel signal.
- 6.2 IF `ShortcutHelpOverlay` is open when `Escape` is pressed THEN THE SYSTEM SHALL close it as part of handling the cancel signal.
- 6.3 WHEN `Escape` is pressed while focus is in a text input, textarea, contenteditable, or select element THE SYSTEM SHALL still process the `Escape` shortcut, because its `allowWhileTyping` is `true`.

### Requirement 7: `useShortcutAction` hook and public API surface

**User story:** As a feature developer, I want to register a callback for a named shortcut action without touching the listener or registry internals, so that my feature code stays decoupled from shortcut plumbing.

#### Acceptance Criteria

- 7.1 WHEN feature code calls `useShortcutAction` with `"search"` or `"save"` and a handler function THE SYSTEM SHALL register that handler for the given action id with `KeyboardShortcutsProvider`.
- 7.2 WHEN the component that called `useShortcutAction` unmounts THE SYSTEM SHALL unregister its handler.
- 7.3 WHEN the user triggers the `"search"` shortcut (`⌘K`) outside a typing target AND a handler is registered for `"search"` THE SYSTEM SHALL invoke that registered handler.
- 7.4 WHEN the user triggers the `"save"` shortcut (`⌘S`) outside a typing target AND a handler is registered for `"save"` THE SYSTEM SHALL invoke that registered handler.
- 7.5 IF a shortcut with an associated action id fires and no handler is currently registered for that action THEN THE SYSTEM SHALL no-op without throwing.
- 7.6 THE SYSTEM SHALL export only `KeyboardShortcutsProvider`, `useShortcutAction`, and `SHORTCUTS` from `src/keyboard-shortcuts/index.ts`.
- 7.7 THE SYSTEM SHALL NOT expose `matchShortcut.ts`, `isTypingTarget.ts`, `shortcuts.ts`, `types.ts`, or other internal files for direct import by consumers outside `src/keyboard-shortcuts/`.
- 7.8 THE SYSTEM SHALL NOT implement actual search or save feature behavior; wiring `useShortcutAction("search" | "save", handler)` into real features remains out of scope until those features exist.

### Requirement 8: `App.tsx` integration boundary

**User story:** As a developer integrating this feature, I want the change to the app shell to be minimal and predictable, so that this feature cannot silently expand its footprint into unrelated app code.

#### Acceptance Criteria

- 8.1 WHEN this feature is integrated into the app THE SYSTEM SHALL add exactly one `<KeyboardShortcutsProvider>` wrapping element, plus its accompanying import statement, to `src/App.tsx`.
- 8.2 THE SYSTEM SHALL NOT make any edit to `src/App.tsx` other than the `<KeyboardShortcutsProvider>` wrapper and its import.

### Requirement 9: Directory ownership and dependencies

**User story:** As a maintainer, I want this feature's files scoped to a single owned directory with no new dependencies, so that ownership boundaries and the dependency graph stay clear.

#### Acceptance Criteria

- 9.1 THE SYSTEM SHALL create and own all files under `src/keyboard-shortcuts/**`, including `index.ts`, `KeyboardShortcutsProvider.tsx`, `useShortcutAction.ts`, `ShortcutHelpOverlay.tsx`, `ShortcutHelpOverlay.module.css`, `shortcuts.ts`, `matchShortcut.ts`, `isTypingTarget.ts`, `types.ts`, and associated `*.test.ts` files.
- 9.2 THE SYSTEM SHALL ensure no other feature adds files under `src/keyboard-shortcuts/**`.
- 9.3 THE SYSTEM SHALL NOT introduce new package dependencies; the implementation SHALL use only React and browser APIs already available via the existing `package.json`.

### Requirement 10: Mac-only key convention

**User story:** As a Mac user, I want shortcuts to use the Mac modifier convention, so that they match the platform's expected key combinations.

#### Acceptance Criteria

- 10.1 THE SYSTEM SHALL define all modifier-based shortcuts (e.g. `"search"`, `"save"`) using `⌘` (`event.metaKey`) as the modifier.
- 10.2 THE SYSTEM SHALL NOT add a `ctrlKey`-based Windows/Linux fallback for any shortcut in this pass.

### Requirement 11: Unit test coverage

**User story:** As a developer, I want the pure matching and typing-detection functions covered by unit tests, so that shortcut behavior regressions are caught before shipping.

#### Acceptance Criteria

- 11.1 THE SYSTEM SHALL include unit tests for `matchShortcut` covering at least one matching case per registry entry and at least one non-matching case.
- 11.2 THE SYSTEM SHALL include unit tests for `isTypingTarget` covering `input`, `textarea`, `contenteditable`, `select`, and a non-typing element target.
