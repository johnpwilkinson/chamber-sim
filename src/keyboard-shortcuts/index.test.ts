import { describe, expect, it } from 'vitest'
import * as indexModule from './index'
import { KeyboardShortcutsProvider, useShortcutAction, SHORTCUTS } from './index'

describe('index', () => {
  it('exports exactly KeyboardShortcutsProvider, useShortcutAction, and SHORTCUTS [req:7.6]', () => {
    expect(Object.keys(indexModule).sort()).toEqual(
      ['KeyboardShortcutsProvider', 'SHORTCUTS', 'useShortcutAction'].sort(),
    )
  })

  it('re-exports the real KeyboardShortcutsProvider, useShortcutAction, and SHORTCUTS values [req:7.6]', () => {
    expect(typeof KeyboardShortcutsProvider).toBe('function')
    expect(typeof useShortcutAction).toBe('function')
    expect(Array.isArray(SHORTCUTS)).toBe(true)
  })

  it('does not export internal modules such as matchShortcut, isTypingTarget, shortcuts, or types [req:7.7]', () => {
    const exportNames = Object.keys(indexModule)
    expect(exportNames).not.toContain('matchShortcut')
    expect(exportNames).not.toContain('isTypingTarget')
    expect(exportNames).not.toContain('ShortcutDefinition')
    expect(exportNames).not.toContain('ShortcutActionId')
    expect(exportNames).not.toContain('registerActionHandler')
    expect(exportNames).not.toContain('unregisterActionHandler')
  })
})
