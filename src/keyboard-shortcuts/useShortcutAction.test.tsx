import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { KeyboardShortcutsProvider } from './KeyboardShortcutsProvider'
import { useShortcutAction } from './useShortcutAction'

afterEach(() => {
  cleanup()
})

function pressKey(init: KeyboardEventInit & { key: string }, target: Document | Element = document) {
  fireEvent.keyDown(target, init)
}

function wrapper({ children }: { children: ReactNode }) {
  return <KeyboardShortcutsProvider>{children}</KeyboardShortcutsProvider>
}

describe('useShortcutAction', () => {
  it('registers a handler for "search" with KeyboardShortcutsProvider so ⌘K invokes it [req:7.1]', () => {
    const handler = vi.fn()
    renderHook(() => useShortcutAction('search', handler), { wrapper })

    pressKey({ key: 'k', metaKey: true })

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('registers a handler for "save" with KeyboardShortcutsProvider so ⌘S invokes it [req:7.1]', () => {
    const handler = vi.fn()
    renderHook(() => useShortcutAction('save', handler), { wrapper })

    pressKey({ key: 's', metaKey: true })

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('unregisters its handler when the calling component unmounts [req:7.2]', () => {
    const handler = vi.fn()
    const { unmount } = renderHook(() => useShortcutAction('search', handler), { wrapper })

    unmount()
    pressKey({ key: 'k', metaKey: true })

    expect(handler).not.toHaveBeenCalled()
  })

  it('invokes the registered "search" handler when ⌘K fires outside a typing target [req:7.3]', () => {
    const handler = vi.fn()
    renderHook(() => useShortcutAction('search', handler), { wrapper })

    pressKey({ key: 'k', metaKey: true })

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('does not invoke the "search" handler when ⌘K fires inside a typing target [req:7.3]', () => {
    const handler = vi.fn()
    renderHook(() => useShortcutAction('search', handler), { wrapper })

    const input = document.createElement('input')
    document.body.appendChild(input)
    pressKey({ key: 'k', metaKey: true }, input)

    expect(handler).not.toHaveBeenCalled()
    document.body.removeChild(input)
  })

  it('invokes the registered "save" handler when ⌘S fires outside a typing target [req:7.4]', () => {
    const handler = vi.fn()
    renderHook(() => useShortcutAction('save', handler), { wrapper })

    pressKey({ key: 's', metaKey: true })

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('does not invoke the "save" handler when ⌘S fires inside a typing target [req:7.4]', () => {
    const handler = vi.fn()
    renderHook(() => useShortcutAction('save', handler), { wrapper })

    const input = document.createElement('input')
    document.body.appendChild(input)
    pressKey({ key: 's', metaKey: true }, input)

    expect(handler).not.toHaveBeenCalled()
    document.body.removeChild(input)
  })

  it('no-ops without throwing when the "save" shortcut fires and no handler is registered for it [req:7.5]', () => {
    const searchHandler = vi.fn()
    renderHook(() => useShortcutAction('search', searchHandler), { wrapper })

    expect(() => pressKey({ key: 's', metaKey: true })).not.toThrow()
    expect(searchHandler).not.toHaveBeenCalled()
  })

  it('no-ops without throwing when the "search" shortcut fires and no handler is registered at all [req:7.5]', () => {
    render(<KeyboardShortcutsProvider />)

    expect(() => pressKey({ key: 'k', metaKey: true })).not.toThrow()
  })
})
