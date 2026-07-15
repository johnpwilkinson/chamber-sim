import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { FooterEnvModeBadge } from './footer-env-mode-badge'

const expectedMode = import.meta.env.MODE.toLowerCase()

afterEach(() => {
  cleanup()
})

describe('FooterEnvModeBadge', () => {
  it('reads import.meta.env.MODE and renders it lowercased as plain text with no label prefix [req:1.1] [req:1.2] [req:1.3]', () => {
    render(<FooterEnvModeBadge />)
    const badge = screen.getByText(expectedMode)
    expect(badge.textContent).toBe(expectedMode)
  })

  it('positions the wrapper fixed right-20 bottom-3 and hides it when printing [req:3.1] [req:3.2]', () => {
    render(<FooterEnvModeBadge />)
    const wrapper = screen.getByText(expectedMode).parentElement
    expect(wrapper?.className).toContain('fixed')
    expect(wrapper?.className).toContain('right-20')
    expect(wrapper?.className).toContain('bottom-3')
    expect(wrapper?.className).toContain('print:hidden')
  })

  it('renders the pill styling classes identical to the other footer badges [req:2.1]', () => {
    render(<FooterEnvModeBadge />)
    const badge = screen.getByText(expectedMode)
    expect(badge.className).toContain('rounded-full')
    expect(badge.className).toContain('border')
    expect(badge.className).toContain('border-[var(--border)]')
    expect(badge.className).toContain('bg-[var(--code-bg)]')
    expect(badge.className).toContain('px-2')
    expect(badge.className).toContain('py-0.5')
    expect(badge.className).toContain('text-xs')
    expect(badge.className).toContain('text-[var(--text)]')
  })

  it('sets title="vite mode" as a static string on the text-carrying span [req:4.2]', () => {
    render(<FooterEnvModeBadge />)
    const badge = screen.getByText(expectedMode)
    expect(badge.tagName).toBe('SPAN')
    expect(badge.getAttribute('title')).toBe('vite mode')
  })

  it('sets no explicit z-index on the badge or its wrapper [req:2.4]', () => {
    render(<FooterEnvModeBadge />)
    const wrapper = screen.getByText(expectedMode).parentElement
    const badge = screen.getByText(expectedMode)
    expect(wrapper?.className).not.toMatch(/(^|\s)z-/)
    expect(badge.className).not.toMatch(/(^|\s)z-/)
  })

  it('renders no interactive elements: no links, buttons, or click handlers [req:5.1] [req:5.2]', () => {
    const { container } = render(<FooterEnvModeBadge />)
    expect(container.querySelector('a')).toBeNull()
    expect(container.querySelector('button')).toBeNull()
    expect(container.querySelector('[onclick]')).toBeNull()
  })

  it('does not apply aria-hidden anywhere in the rendered markup [req:4.1]', () => {
    const { container } = render(<FooterEnvModeBadge />)
    expect(container.querySelector('[aria-hidden]')).toBeNull()
  })

  it('exposes the mode text as plain, reachable text discoverable via normal text queries [req:1.3] [req:4.1]', () => {
    render(<FooterEnvModeBadge />)
    expect(screen.getByText(expectedMode).textContent).toBe(expectedMode)
  })

  it('accepts no props (component signature takes no arguments) [req:1.4]', () => {
    expect(FooterEnvModeBadge.length).toBe(0)
  })
})
