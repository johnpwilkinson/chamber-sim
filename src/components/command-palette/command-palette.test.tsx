import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommandPalette } from './command-palette'

function dispatchKeydown(init: Partial<KeyboardEventInit>) {
  const event = new KeyboardEvent('keydown', {
    key: 'k',
    bubbles: true,
    cancelable: true,
    ...init,
  })
  window.dispatchEvent(event)
  return event
}

afterEach(() => {
  cleanup()
})

describe('CommandPalette keyboard trigger', () => {
  it('Ctrl+K prevents default and toggles open on non-Mac platforms [req:1.1]', async () => {
    render(<CommandPalette />)
    expect(screen.queryByText('No results found.')).not.toBeInTheDocument()

    const openEvent = dispatchKeydown({ ctrlKey: true })
    expect(openEvent.defaultPrevented).toBe(true)
    expect(await screen.findByText('No results found.')).toBeInTheDocument()

    const closeEvent = dispatchKeydown({ ctrlKey: true })
    expect(closeEvent.defaultPrevented).toBe(true)
    await vi.waitFor(() => {
      expect(screen.queryByText('No results found.')).not.toBeInTheDocument()
    })
  })

  it('Cmd+K (metaKey) prevents default and toggles open on Mac platforms [req:1.2]', async () => {
    render(<CommandPalette />)

    const openEvent = dispatchKeydown({ metaKey: true })
    expect(openEvent.defaultPrevented).toBe(true)
    expect(await screen.findByText('No results found.')).toBeInTheDocument()

    const closeEvent = dispatchKeydown({ metaKey: true })
    expect(closeEvent.defaultPrevented).toBe(true)
    await vi.waitFor(() => {
      expect(screen.queryByText('No results found.')).not.toBeInTheDocument()
    })
  })

  it('registers exactly one keydown listener on window per mount [req:1.3]', () => {
    const addSpy = vi.spyOn(window, 'addEventListener')
    const removeSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = render(<CommandPalette />)
    const keydownAdds = addSpy.mock.calls.filter(([type]) => type === 'keydown')
    expect(keydownAdds).toHaveLength(1)

    unmount()
    const keydownRemoves = removeSpy.mock.calls.filter(([type]) => type === 'keydown')
    expect(keydownRemoves).toHaveLength(1)

    addSpy.mockRestore()
    removeSpy.mockRestore()
  })

  it('closing via CommandDialog\'s onOpenChange interaction updates open to closed [req:1.5]', async () => {
    const user = userEvent.setup()
    render(<CommandPalette />)

    dispatchKeydown({ ctrlKey: true })
    expect(await screen.findByText('No results found.')).toBeInTheDocument()

    const closeButton = await screen.findByRole('button', { name: /close/i })
    await user.click(closeButton)

    await vi.waitFor(() => {
      expect(screen.queryByText('No results found.')).not.toBeInTheDocument()
    })
  })
})

describe('CommandPalette rendering and structure', () => {
  it('renders CommandDialog with CommandInput, CommandList, and CommandEmpty showing "No results found." when open, plus all three CommandGroup headings [req:2.1] [req:2.2] [req:2.3]', async () => {
    render(<CommandPalette />)

    dispatchKeydown({ ctrlKey: true })

    expect(await screen.findByRole('combobox')).toBeInTheDocument()
    expect(await screen.findByText('No results found.')).toBeInTheDocument()
    expect(screen.getByText('Navigation')).toBeInTheDocument()
    expect(screen.getByText('Quick actions')).toBeInTheDocument()
    expect(screen.getByText('Search')).toBeInTheDocument()
  })
})
