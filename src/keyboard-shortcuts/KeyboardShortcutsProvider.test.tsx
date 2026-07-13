import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import {
  KeyboardShortcutsProvider,
  registerActionHandler,
  unregisterActionHandler,
} from './KeyboardShortcutsProvider'

afterEach(() => {
  cleanup()
})

function pressKey(init: KeyboardEventInit & { key: string }, target: Document | Element = document) {
  fireEvent.keyDown(target, init)
}

const siblingModules = import.meta.glob('./*.{ts,tsx}', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

describe('KeyboardShortcutsProvider', () => {
  it('attaches exactly one document-level keydown listener on mount [req:1.1]', () => {
    const addSpy = vi.spyOn(document, 'addEventListener')
    const { unmount } = render(<KeyboardShortcutsProvider />)

    const keydownCalls = addSpy.mock.calls.filter(([type]) => type === 'keydown')
    expect(keydownCalls).toHaveLength(1)

    addSpy.mockRestore()
    unmount()
  })

  it('removes the document-level keydown listener it attached on unmount [req:1.2]', () => {
    const addSpy = vi.spyOn(document, 'addEventListener')
    const removeSpy = vi.spyOn(document, 'removeEventListener')
    const { unmount } = render(<KeyboardShortcutsProvider />)

    const [, attachedHandler] = addSpy.mock.calls.find(([type]) => type === 'keydown')!

    unmount()

    const keydownRemovals = removeSpy.mock.calls.filter(([type]) => type === 'keydown')
    expect(keydownRemovals).toHaveLength(1)
    expect(keydownRemovals[0][1]).toBe(attachedHandler)

    addSpy.mockRestore()
    removeSpy.mockRestore()
  })

  it('no other module under src/keyboard-shortcuts attaches its own keydown/keyup listener [req:1.3]', () => {
    const otherModules = Object.entries(siblingModules).filter(
      ([file]) =>
        !file.endsWith('KeyboardShortcutsProvider.tsx') &&
        !file.endsWith('.test.ts') &&
        !file.endsWith('.test.tsx'),
    )

    expect(otherModules.length).toBeGreaterThan(0)

    for (const [file, contents] of otherModules) {
      expect(contents, `${file} must not attach its own keydown/keyup listener`).not.toMatch(
        /addEventListener\(\s*['"](keydown|keyup)['"]/,
      )
    }
  })

  it('renders ShortcutHelpOverlay as part of its output (opens on "?") [req:1.4]', () => {
    render(<KeyboardShortcutsProvider />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    pressKey({ key: '?' })

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('owns an action-handler map that dispatches a matched shortcut to a registered callback [req:1.5]', () => {
    render(<KeyboardShortcutsProvider />)
    const handler = vi.fn()
    registerActionHandler('search', handler)

    pressKey({ key: 'k', metaKey: true })

    expect(handler).toHaveBeenCalledTimes(1)
    unregisterActionHandler('search', handler)
  })

  it('suppresses a non-allowWhileTyping shortcut while a typing target is focused [req:4.3]', () => {
    render(<KeyboardShortcutsProvider />)
    const handler = vi.fn()
    registerActionHandler('search', handler)

    const input = document.createElement('input')
    document.body.appendChild(input)
    pressKey({ key: 'k', metaKey: true }, input)

    expect(handler).not.toHaveBeenCalled()

    document.body.removeChild(input)
    unregisterActionHandler('search', handler)
  })

  it('still invokes an allowWhileTyping shortcut while a typing target is focused [req:4.4]', () => {
    render(<KeyboardShortcutsProvider />)
    pressKey({ key: '?' })
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    const input = document.createElement('input')
    document.body.appendChild(input)
    pressKey({ key: 'Escape' }, input)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    document.body.removeChild(input)
  })

  it('opens ShortcutHelpOverlay when "?" is pressed outside a typing target [req:5.1]', () => {
    render(<KeyboardShortcutsProvider />)
    pressKey({ key: '?' })
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('closes ShortcutHelpOverlay when Escape is pressed while it is open [req:5.3]', () => {
    render(<KeyboardShortcutsProvider />)
    pressKey({ key: '?' })
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    pressKey({ key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('dispatches the cancel signal on Escape regardless of focus or typing target, without throwing [req:6.1]', () => {
    render(<KeyboardShortcutsProvider />)
    expect(() => pressKey({ key: 'Escape' })).not.toThrow()

    const input = document.createElement('input')
    document.body.appendChild(input)
    expect(() => pressKey({ key: 'Escape' }, input)).not.toThrow()
    document.body.removeChild(input)
  })

  it('closes the overlay as part of handling the cancel signal when it is open [req:6.2]', () => {
    render(<KeyboardShortcutsProvider />)
    pressKey({ key: '?' })
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    pressKey({ key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('still processes Escape while focus is in a text input, textarea, contenteditable, or select element [req:6.3]', () => {
    render(<KeyboardShortcutsProvider />)
    pressKey({ key: '?' })
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    const textarea = document.createElement('textarea')
    document.body.appendChild(textarea)
    pressKey({ key: 'Escape' }, textarea)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    document.body.removeChild(textarea)
  })
})
