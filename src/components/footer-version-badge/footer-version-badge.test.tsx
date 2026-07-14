import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { FooterVersionBadge } from './footer-version-badge'

beforeEach(() => {
  vi.stubGlobal('__APP_VERSION__', '1.2.3')
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('FooterVersionBadge', () => {
  it('renders the version prefixed with v as a plain, unmodified text node [req:1.1] [req:1.2] [req:1.3]', () => {
    render(<FooterVersionBadge />)
    expect(screen.getByText('v1.2.3')).toBeInTheDocument()
  })

  it('positions the wrapper fixed to the bottom-right with a 12px offset [req:6.1]', () => {
    render(<FooterVersionBadge />)
    const wrapper = screen.getByText('v1.2.3').parentElement
    expect(wrapper?.className).toContain('fixed')
    expect(wrapper?.className).toContain('right-3')
    expect(wrapper?.className).toContain('bottom-3')
  })

  it('hides the wrapper when printing [req:7.1]', () => {
    render(<FooterVersionBadge />)
    const wrapper = screen.getByText('v1.2.3').parentElement
    expect(wrapper?.className).toContain('print:hidden')
  })

  it('renders the text as a rounded-full pill with border and code-bg background [req:6.2]', () => {
    render(<FooterVersionBadge />)
    const badge = screen.getByText('v1.2.3')
    expect(badge.className).toContain('rounded-full')
    expect(badge.className).toContain('border')
    expect(badge.className).toContain('bg-[var(--code-bg)]')
  })

  it('renders the text with text-xs sizing and the --text custom property color [req:6.3]', () => {
    render(<FooterVersionBadge />)
    const badge = screen.getByText('v1.2.3')
    expect(badge.className).toContain('text-xs')
    expect(badge.className).toContain('text-[var(--text)]')
  })

  it('styles using arbitrary-value references to existing custom properties, not new tokens [req:6.4]', () => {
    render(<FooterVersionBadge />)
    const wrapper = screen.getByText('v1.2.3').parentElement
    const badge = screen.getByText('v1.2.3')
    const classes = `${wrapper?.className} ${badge.className}`
    expect(classes).toContain('var(--border)')
    expect(classes).toContain('var(--code-bg)')
    expect(classes).toContain('var(--text)')
  })

  it('sets no explicit z-index on the badge or its wrapper [req:6.5]', () => {
    render(<FooterVersionBadge />)
    const wrapper = screen.getByText('v1.2.3').parentElement
    const badge = screen.getByText('v1.2.3')
    expect(wrapper?.className).not.toMatch(/(^|\s)z-/)
    expect(badge.className).not.toMatch(/(^|\s)z-/)
  })

  it('renders no interactive elements: no links, buttons, or click handlers [req:8.1]', () => {
    const { container } = render(<FooterVersionBadge />)
    expect(container.querySelector('a')).toBeNull()
    expect(container.querySelector('button')).toBeNull()
    expect(container.querySelector('[onclick]')).toBeNull()
  })

  it('does not apply aria-hidden to the badge or its text [req:8.2]', () => {
    render(<FooterVersionBadge />)
    const wrapper = screen.getByText('v1.2.3').parentElement
    const badge = screen.getByText('v1.2.3')
    expect(wrapper?.hasAttribute('aria-hidden')).toBe(false)
    expect(badge.hasAttribute('aria-hidden')).toBe(false)
  })

  it('exposes the version text as plain, reachable text discoverable via normal text queries [req:8.3]', () => {
    render(<FooterVersionBadge />)
    expect(screen.getByText('v1.2.3').textContent).toBe('v1.2.3')
  })
})
