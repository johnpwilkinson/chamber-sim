import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { ShortcutHelpOverlay } from './ShortcutHelpOverlay'
import { SHORTCUTS } from './shortcuts'

afterEach(() => {
  cleanup()
})

describe('ShortcutHelpOverlay', () => {
  it('renders nothing when closed [req:5.2]', () => {
    render(<ShortcutHelpOverlay open={false} onClose={vi.fn()} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders the key and description for every SHORTCUTS entry when open [req:5.2]', () => {
    render(<ShortcutHelpOverlay open={true} onClose={vi.fn()} />)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()

    for (const shortcut of SHORTCUTS) {
      expect(screen.getByText(shortcut.displayKeys)).toBeInTheDocument()
      expect(screen.getByText(shortcut.description)).toBeInTheDocument()
    }
  })

  it('renders exactly as many rows as there are entries in SHORTCUTS [req:5.2]', () => {
    render(<ShortcutHelpOverlay open={true} onClose={vi.fn()} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(SHORTCUTS.length)
  })

  it('applies CSS-module-scoped class names (not global/plain class names) to its root elements [req:5.4]', () => {
    render(<ShortcutHelpOverlay open={true} onClose={vi.fn()} />)
    const dialog = screen.getByRole('dialog')

    expect(dialog.className).toBeTruthy()
    expect(dialog.className).not.toBe('panel')
    expect(dialog.className.startsWith('_panel_') || dialog.className.includes('panel_')).toBe(true)
  })
})
