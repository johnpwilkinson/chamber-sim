import type { ShortcutDefinition } from './types'

export const SHORTCUTS: ShortcutDefinition[] = [
  {
    id: 'search',
    key: 'k',
    metaKey: true,
    displayKeys: '⌘K',
    description: 'Open search',
  },
  {
    id: 'save',
    key: 's',
    metaKey: true,
    displayKeys: '⌘S',
    description: 'Save',
  },
  {
    id: 'help',
    key: '?',
    displayKeys: '?',
    description: 'Show keyboard shortcuts',
  },
  {
    id: 'cancel',
    key: 'Escape',
    displayKeys: 'Escape',
    description: 'Cancel / close',
    allowWhileTyping: true,
  },
]
