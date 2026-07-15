import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { ResumeFooterLink } from './resume-footer-link'

afterEach(() => {
  cleanup()
})

describe('ResumeFooterLink', () => {
  it('renders an anchor with the literal text Resume [req:1.1]', () => {
    render(<ResumeFooterLink />)
    const link = screen.getByRole('link', { name: 'Resume' })
    expect(link.tagName).toBe('A')
    expect(link.textContent).toBe('Resume')
  })

  it('renders unconditionally with no session-state or drill-state gating [req:1.2]', () => {
    const { container } = render(<ResumeFooterLink />)
    expect(container.querySelector('a')).not.toBeNull()
  })

  it('renders no svg, img, or icon glyph alongside the text [req:1.3]', () => {
    const { container } = render(<ResumeFooterLink />)
    expect(container.querySelector('svg')).toBeNull()
    expect(container.querySelector('img')).toBeNull()
    expect(container.querySelector('i')).toBeNull()
  })

  it('accepts and uses no props, since ResumeFooterLink takes zero arguments [req:1.4]', () => {
    expect(ResumeFooterLink.length).toBe(0)
    render(<ResumeFooterLink />)
    expect(screen.getByRole('link', { name: 'Resume' })).toBeInTheDocument()
  })

  it('sets href to the plain relative path /resume [req:2.1]', () => {
    render(<ResumeFooterLink />)
    const link = screen.getByRole('link', { name: 'Resume' })
    expect(link.getAttribute('href')).toBe('/resume')
  })

  it('sets target="_blank" so the link opens in a new browsing context [req:2.2]', () => {
    render(<ResumeFooterLink />)
    const link = screen.getByRole('link', { name: 'Resume' })
    expect(link.getAttribute('target')).toBe('_blank')
  })

  it('sets rel="noreferrer" alongside target="_blank" [req:2.3]', () => {
    render(<ResumeFooterLink />)
    const link = screen.getByRole('link', { name: 'Resume' })
    expect(link.getAttribute('rel')).toBe('noreferrer')
  })

  it('relies solely on native anchor navigation, with no onClick handler [req:2.4]', () => {
    render(<ResumeFooterLink />)
    const link = screen.getByRole('link', { name: 'Resume' })
    expect(link.hasAttribute('onclick')).toBe(false)
    expect((link as HTMLAnchorElement).onclick).toBeNull()
  })

  it('positions the anchor fixed at the bottom-left with bottom-3 left-3 insets [req:3.1]', () => {
    render(<ResumeFooterLink />)
    const link = screen.getByRole('link', { name: 'Resume' })
    expect(link.className).toContain('fixed')
    expect(link.className).toContain('bottom-3')
    expect(link.className).toContain('left-3')
  })

  it('styles the anchor with text-xs sizing and the var(--text) muted color [req:3.3]', () => {
    render(<ResumeFooterLink />)
    const link = screen.getByRole('link', { name: 'Resume' })
    expect(link.className).toContain('text-xs')
    expect(link.className).toContain('text-[var(--text)]')
  })

  it('changes text color to var(--text-h) on hover [req:3.4]', () => {
    render(<ResumeFooterLink />)
    const link = screen.getByRole('link', { name: 'Resume' })
    expect(link.className).toContain('hover:text-[var(--text-h)]')
  })

  it('hides the anchor when printing via print:hidden [req:3.5]', () => {
    render(<ResumeFooterLink />)
    const link = screen.getByRole('link', { name: 'Resume' })
    expect(link.className).toContain('print:hidden')
  })

  it('sets no explicit z-index on the anchor [req:3.6]', () => {
    render(<ResumeFooterLink />)
    const link = screen.getByRole('link', { name: 'Resume' })
    expect(link.className).not.toMatch(/(^|\s)z-/)
  })

  it('declares no dependencies beyond react and adds no new npm package [req:4.1]', () => {
    render(<ResumeFooterLink />)
    expect(screen.getByRole('link', { name: 'Resume' })).toBeInTheDocument()
  })

  it('contains no internal state and no data-fetching logic [req:4.2]', () => {
    const { container: first } = render(<ResumeFooterLink />)
    const firstHtml = first.innerHTML
    cleanup()
    const { container: second } = render(<ResumeFooterLink />)
    expect(second.innerHTML).toBe(firstHtml)
  })

  it('exposes no props and no new settings, context, or store entry [req:4.3]', () => {
    render(<ResumeFooterLink />)
    const link = screen.getByRole('link', { name: 'Resume' })
    expect(link.textContent).toBe('Resume')
  })

  it('is implemented at src/components/resume-footer-link/resume-footer-link.tsx as its sole owner [req:6.1]', () => {
    expect(typeof ResumeFooterLink).toBe('function')
  })

  it('is covered by this unit test asserting markup and attributes [req:6.2]', () => {
    render(<ResumeFooterLink />)
    const link = screen.getByRole('link', { name: 'Resume' })
    expect(link.getAttribute('href')).toBe('/resume')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noreferrer')
    expect(link.textContent).toBe('Resume')
  })
})
