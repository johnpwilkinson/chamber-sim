import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { HeaderBuildBadge } from './header-build-badge'

const BUILD_TIME = 1752480000000

beforeEach(() => {
  vi.stubGlobal('__BUILD_TIME__', BUILD_TIME)
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('HeaderBuildBadge', () => {
  it("renders the build timestamp prefixed with 'built ' formatted via toLocaleString with no explicit locale or timeZone [req:3.1] [req:3.2] [req:3.3] [req:3.4] [req:3.5]", () => {
    render(<HeaderBuildBadge />)
    const formatted = new Date(BUILD_TIME).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
    expect(screen.getByText(`built ${formatted}`)).toBeInTheDocument()
  })

  it('positions the wrapper fixed to the top-right with a 12px offset [req:5.1] [req:5.2]', () => {
    render(<HeaderBuildBadge />)
    const wrapper = screen.getByText(/^built /).parentElement
    expect(wrapper?.className).toContain('fixed')
    expect(wrapper?.className).toContain('right-3')
    expect(wrapper?.className).toContain('top-3')
  })

  it('hides the wrapper when printing [req:6.1]', () => {
    render(<HeaderBuildBadge />)
    const wrapper = screen.getByText(/^built /).parentElement
    expect(wrapper?.className).toContain('print:hidden')
  })

  it('renders the text as a rounded-full pill with border and code-bg background [req:4.1]', () => {
    render(<HeaderBuildBadge />)
    const badge = screen.getByText(/^built /)
    expect(badge.className).toContain('rounded-full')
    expect(badge.className).toContain('border')
    expect(badge.className).toContain('bg-[var(--code-bg)]')
  })

  it('renders the text with text-xs sizing and the --text custom property color [req:4.1]', () => {
    render(<HeaderBuildBadge />)
    const badge = screen.getByText(/^built /)
    expect(badge.className).toContain('text-xs')
    expect(badge.className).toContain('text-[var(--text)]')
  })

  it('styles using arbitrary-value references to existing custom properties, not new tokens [req:4.2]', () => {
    render(<HeaderBuildBadge />)
    const wrapper = screen.getByText(/^built /).parentElement
    const badge = screen.getByText(/^built /)
    const classes = `${wrapper?.className} ${badge.className}`
    expect(classes).toContain('var(--border)')
    expect(classes).toContain('var(--code-bg)')
    expect(classes).toContain('var(--text)')
  })

  it('sets no explicit z-index on the badge or its wrapper [req:5.3]', () => {
    render(<HeaderBuildBadge />)
    const wrapper = screen.getByText(/^built /).parentElement
    const badge = screen.getByText(/^built /)
    expect(wrapper?.className).not.toMatch(/(^|\s)z-/)
    expect(badge.className).not.toMatch(/(^|\s)z-/)
  })

  it('renders no interactive elements: no links, buttons, or click handlers [req:7.1]', () => {
    const { container } = render(<HeaderBuildBadge />)
    expect(container.querySelector('a')).toBeNull()
    expect(container.querySelector('button')).toBeNull()
    expect(container.querySelector('[onclick]')).toBeNull()
  })

  it('does not apply aria-hidden to the badge or its text [req:7.2]', () => {
    render(<HeaderBuildBadge />)
    const wrapper = screen.getByText(/^built /).parentElement
    const badge = screen.getByText(/^built /)
    expect(wrapper?.hasAttribute('aria-hidden')).toBe(false)
    expect(badge.hasAttribute('aria-hidden')).toBe(false)
  })

  it('exposes the timestamp text as plain, reachable text discoverable via normal text queries [req:7.2]', () => {
    render(<HeaderBuildBadge />)
    const badge = screen.getByText(/^built /)
    expect(badge.textContent?.startsWith('built ')).toBe(true)
  })
})
