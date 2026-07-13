import type { ShortcutDefinition } from './types'

export function matchShortcut(
  event: KeyboardEvent,
  registry: readonly ShortcutDefinition[],
): ShortcutDefinition | undefined {
  return registry.find((shortcut) => {
    if (shortcut.key.toLowerCase() !== event.key.toLowerCase()) {
      return false
    }
    return Boolean(shortcut.metaKey) === event.metaKey
  })
}
