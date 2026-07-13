/**
 * Identifiers for every shortcut in the static registry. "search" and "save"
 * are dispatched to feature handlers via `useShortcutAction`; "help" and
 * "cancel" are handled internally by `KeyboardShortcutsProvider`.
 */
export type ShortcutActionId = "search" | "save" | "help" | "cancel";

/**
 * A single entry in the static `SHORTCUTS` registry. `key` is matched
 * against `KeyboardEvent.key`; `metaKey` marks whether the ⌘ modifier must
 * be held (checked via `event.metaKey` only, never `event.ctrlKey`).
 */
export interface ShortcutDefinition {
  id: ShortcutActionId;
  key: string;
  metaKey?: boolean;
  displayKeys: string;
  description: string;
  /**
   * Defaults to suppressed while a typing target is focused; set true to
   * still fire while typing (e.g. Escape).
   */
  allowWhileTyping?: boolean;
}
