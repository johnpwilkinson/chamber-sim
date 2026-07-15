import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { FooterLocaleBadge } from './footer-locale-badge'

function stubLanguage(value: string | undefined) {
  Object.defineProperty(window.navigator, 'language', {
    value,
    configurable: true,
  })
}

const originalLanguage = window.navigator.language

afterEach(() => {
  cleanup()
  stubLanguage(originalLanguage)
})

describe('FooterLocaleBadge', () => {
  it('renders the lowercased form of a stubbed navigator.language value as its text [req:9.1]', () => {
    stubLanguage('en-US')
    render(<FooterLocaleBadge />)
    expect(screen.getByText('en-us')).toBeInTheDocument()
  })

  it('positions the wrapper fixed right-20 bottom-3 and hides it when printing [req:9.2]', () => {
    stubLanguage('en-US')
    render(<FooterLocaleBadge />)
    const wrapper = screen.getByText('en-us').parentElement
    expect(wrapper?.className).toContain('fixed')
    expect(wrapper?.className).toContain('right-20')
    expect(wrapper?.className).toContain('bottom-3')
    expect(wrapper?.className).toContain('print:hidden')
  })

  it('sets title="browser locale" on the text-carrying element [req:9.3]', () => {
    stubLanguage('en-US')
    render(<FooterLocaleBadge />)
    const badge = screen.getByText('en-us')
    expect(badge.getAttribute('title')).toBe('browser locale')
  })

  it('renders the pill styling classes identical to the other footer badges [req:9.4]', () => {
    stubLanguage('en-US')
    render(<FooterLocaleBadge />)
    const badge = screen.getByText('en-us')
    expect(badge.className).toContain('rounded-full')
    expect(badge.className).toContain('border')
    expect(badge.className).toContain('bg-[var(--code-bg)]')
    expect(badge.className).toContain('text-xs')
    expect(badge.className).toContain('text-[var(--text)]')
  })

  it('sets no explicit z-index on the badge or its wrapper [req:9.5]', () => {
    stubLanguage('en-US')
    render(<FooterLocaleBadge />)
    const badge = screen.getByText('en-us')
    const wrapper = badge.parentElement
    expect(badge.className).not.toMatch(/(^|\s)z-/)
    expect(wrapper?.className).not.toMatch(/(^|\s)z-/)
  })

  it('renders no interactive elements: no links, buttons, or click handlers [req:9.6]', () => {
    stubLanguage('en-US')
    const { container } = render(<FooterLocaleBadge />)
    expect(container.querySelector('a')).toBeNull()
    expect(container.querySelector('button')).toBeNull()
    expect(container.querySelector('[onclick]')).toBeNull()
  })

  it('does not apply aria-hidden anywhere in the rendered markup [req:9.7]', () => {
    stubLanguage('en-US')
    const { container } = render(<FooterLocaleBadge />)
    expect(container.querySelector('[aria-hidden]')).toBeNull()
  })

  it('exposes the resolved locale value as exact textContent [req:9.8]', () => {
    stubLanguage('en-US')
    render(<FooterLocaleBadge />)
    expect(screen.getByText('en-us').textContent).toBe('en-us')
  })

  it('renders the literal text "unknown" when navigator.language is undefined [req:9.9]', () => {
    stubLanguage(undefined)
    render(<FooterLocaleBadge />)
    expect(screen.getByText('unknown')).toBeInTheDocument()
  })
})
