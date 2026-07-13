import { describe, expect, it } from 'vitest'
import { matchShortcut } from './matchShortcut'
import { SHORTCUTS } from './shortcuts'

function makeEvent(init: Partial<KeyboardEventInit> & { key: string }): KeyboardEvent {
  return new KeyboardEvent('keydown', init)
}

describe('matchShortcut', () => {
  it('matches the search shortcut (metaKey+K) [req:3.1]', () => {
    const event = makeEvent({ key: 'k', metaKey: true })
    expect(matchShortcut(event, SHORTCUTS)).toBe(
      SHORTCUTS.find((s) => s.id === 'search'),
    )
  })

  it('matches the save shortcut (metaKey+S) [req:3.1]', () => {
    const event = makeEvent({ key: 's', metaKey: true })
    expect(matchShortcut(event, SHORTCUTS)).toBe(
      SHORTCUTS.find((s) => s.id === 'save'),
    )
  })

  it('matches the help shortcut (?) [req:3.1]', () => {
    const event = makeEvent({ key: '?' })
    expect(matchShortcut(event, SHORTCUTS)).toBe(
      SHORTCUTS.find((s) => s.id === 'help'),
    )
  })

  it('matches the cancel shortcut (Escape) [req:3.1]', () => {
    const event = makeEvent({ key: 'Escape' })
    expect(matchShortcut(event, SHORTCUTS)).toBe(
      SHORTCUTS.find((s) => s.id === 'cancel'),
    )
  })

  it('returns undefined without throwing when no registry entry matches [req:3.2]', () => {
    const event = makeEvent({ key: 'z' })
    expect(() => matchShortcut(event, SHORTCUTS)).not.toThrow()
    expect(matchShortcut(event, SHORTCUTS)).toBeUndefined()
  })

  it('does not match a metaKey-required shortcut when metaKey is not held, and does not fall back to ctrlKey [req:3.3]', () => {
    const ctrlOnly = makeEvent({ key: 'k', ctrlKey: true })
    expect(matchShortcut(ctrlOnly, SHORTCUTS)).toBeUndefined()

    const neither = makeEvent({ key: 'k' })
    expect(matchShortcut(neither, SHORTCUTS)).toBeUndefined()
  })

  it('is a pure function: repeated calls with the same inputs return the same result and do not mutate the registry [req:3.4]', () => {
    const event = makeEvent({ key: 'k', metaKey: true })
    const registrySnapshot = JSON.stringify(SHORTCUTS)

    const first = matchShortcut(event, SHORTCUTS)
    const second = matchShortcut(event, SHORTCUTS)

    expect(first).toBe(second)
    expect(JSON.stringify(SHORTCUTS)).toBe(registrySnapshot)
  })
})
