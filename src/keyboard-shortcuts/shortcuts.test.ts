import { describe, expect, it, vi } from 'vitest'
import * as shortcutsModule from './shortcuts'
import { SHORTCUTS } from './shortcuts'

describe('SHORTCUTS', () => {
  it('defines a search shortcut bound to metaKey+K [req:2.1]', () => {
    const search = SHORTCUTS.find((s) => s.id === 'search')
    expect(search).toBeDefined()
    expect(search?.key.toLowerCase()).toBe('k')
    expect(search?.metaKey).toBe(true)
    expect(search?.displayKeys).toBe('⌘K')
  })

  it('defines a save shortcut bound to metaKey+S [req:2.1]', () => {
    const save = SHORTCUTS.find((s) => s.id === 'save')
    expect(save).toBeDefined()
    expect(save?.key.toLowerCase()).toBe('s')
    expect(save?.metaKey).toBe(true)
    expect(save?.displayKeys).toBe('⌘S')
  })

  it('defines a help overlay shortcut bound to ? [req:2.1]', () => {
    const help = SHORTCUTS.find((s) => s.id === 'help')
    expect(help).toBeDefined()
    expect(help?.key).toBe('?')
    expect(help?.displayKeys).toBe('?')
  })

  it('defines a cancel shortcut bound to Escape [req:2.1]', () => {
    const cancel = SHORTCUTS.find((s) => s.id === 'cancel')
    expect(cancel).toBeDefined()
    expect(cancel?.key).toBe('Escape')
    expect(cancel?.displayKeys).toBe('Escape')
  })

  it('does not set allowWhileTyping for search or save, so they are suppressed while typing [req:2.3]', () => {
    const search = SHORTCUTS.find((s) => s.id === 'search')
    const save = SHORTCUTS.find((s) => s.id === 'save')
    expect(search?.allowWhileTyping).not.toBe(true)
    expect(save?.allowWhileTyping).not.toBe(true)
  })

  it('sets allowWhileTyping to true on the Escape/cancel definition [req:2.4]', () => {
    const cancel = SHORTCUTS.find((s) => s.id === 'cancel')
    expect(cancel?.allowWhileTyping).toBe(true)
  })

  it('does not use ctrlKey on any modifier-based shortcut, only metaKey [req:10.1] [req:10.2]', () => {
    for (const shortcut of SHORTCUTS) {
      expect((shortcut as unknown as Record<string, unknown>).ctrlKey).toBeUndefined()
    }
    const search = SHORTCUTS.find((s) => s.id === 'search')
    const save = SHORTCUTS.find((s) => s.id === 'save')
    expect(search?.metaKey).toBe(true)
    expect(save?.metaKey).toBe(true)
  })

  it('does not read from or write to localStorage when constructing the registry [req:2.5]', () => {
    const setSpy = vi.spyOn(Storage.prototype, 'setItem')
    const getSpy = vi.spyOn(Storage.prototype, 'getItem')
    expect(SHORTCUTS.length).toBeGreaterThan(0)
    expect(setSpy).not.toHaveBeenCalled()
    expect(getSpy).not.toHaveBeenCalled()
    setSpy.mockRestore()
    getSpy.mockRestore()
  })

  it('exposes no rebind or customization function alongside the registry [req:2.6]', () => {
    const exportNames = Object.keys(shortcutsModule)
    expect(exportNames).toEqual(['SHORTCUTS'])
  })
})
