import { readFileSync } from 'node:fs'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { FooterCommitBadge } from './footer-commit-badge'

const SHORT_SHA = 'abc1234'
const FULL_SHA = 'abc1234deadbeefdeadbeefdeadbeefdeadbeef'

const footerCommitBadgeSourcePath = path.resolve(
  process.cwd(),
  'src/components/footer-commit-badge/footer-commit-badge.tsx',
)
const footerCommitBadgeSource = readFileSync(footerCommitBadgeSourcePath, 'utf8')

function stubResolved() {
  vi.stubGlobal('__COMMIT_SHA__', SHORT_SHA)
  vi.stubGlobal('__COMMIT_SHA_FULL__', FULL_SHA)
}

function stubFallback() {
  vi.stubGlobal('__COMMIT_SHA__', 'whoops')
  vi.stubGlobal('__COMMIT_SHA_FULL__', 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef')
}

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('FooterCommitBadge', () => {
  describe('badge text', () => {
    beforeEach(stubResolved)

    it('displays the bare short sha with no prefix [req:3.2]', () => {
      render(<FooterCommitBadge />)
      expect(screen.getByText(SHORT_SHA)).toBeInTheDocument()
    })

    it('renders the badge text as a rounded-full pill using the shared custom properties [req:3.4]', () => {
      render(<FooterCommitBadge />)
      const badge = screen.getByText(SHORT_SHA)
      expect(badge.className).toContain('rounded-full')
      expect(badge.className).toContain('border-[var(--border)]')
      expect(badge.className).toContain('bg-[var(--code-bg)]')
      expect(badge.className).toContain('text-[var(--text)]')
    })
  })

  describe('fallback state', () => {
    beforeEach(stubFallback)

    it('displays the literal text whoops when __COMMIT_SHA__ equals "whoops" [req:3.3]', () => {
      render(<FooterCommitBadge />)
      expect(screen.getByText('whoops')).toBeInTheDocument()
    })
  })

  it('does not set aria-hidden anywhere in the component tree [req:3.6]', () => {
    stubResolved()
    const { container } = render(<FooterCommitBadge />)
    expect(container.querySelector('[aria-hidden]')).toBeNull()
  })

  describe('tooltip (resolved state)', () => {
    beforeEach(stubResolved)

    it('renders the bare full sha with no label, styled with the shared custom properties [req:4.1] [req:4.9]', () => {
      render(<FooterCommitBadge />)
      const tooltip = screen.getByText(FULL_SHA)
      expect(tooltip.textContent).toBe(FULL_SHA)
      expect(tooltip.className).toContain('border-[var(--border)]')
      expect(tooltip.className).toContain('bg-[var(--code-bg)]')
      expect(tooltip.className).toContain('text-[var(--text)]')
    })

    it('reveals the tooltip via group/group-hover:opacity-100 classes with no title attribute [req:4.3]', () => {
      const { container } = render(<FooterCommitBadge />)
      const wrapper = screen.getByText(SHORT_SHA).parentElement
      const tooltip = screen.getByText(FULL_SHA)
      expect(wrapper?.className).toContain('group')
      expect(tooltip.className).toContain('group-hover:opacity-100')
      expect(container.querySelector('[title]')).toBeNull()
    })

    it('does not use a Radix or portal-based tooltip library [req:4.4]', () => {
      render(<FooterCommitBadge />)
      expect(footerCommitBadgeSource).not.toMatch(/radix|TooltipProvider|createPortal/i)
      expect(screen.queryByRole('tooltip')).toBeNull()
    })

    it('renders the tooltip trigger with no tabIndex, no onFocus, and no interactive role [req:4.5]', () => {
      render(<FooterCommitBadge />)
      const wrapper = screen.getByText(SHORT_SHA).parentElement
      expect(wrapper?.hasAttribute('tabindex')).toBe(false)
      expect(wrapper?.hasAttribute('role')).toBe(false)
      expect(footerCommitBadgeSource).not.toMatch(/tabIndex|onFocus/)
    })

    it('reveals the tooltip purely via CSS hover with no mouse-event handlers [req:4.6]', () => {
      render(<FooterCommitBadge />)
      expect(footerCommitBadgeSource).not.toMatch(/onMouseEnter|onMouseLeave/)
    })

    it('sets pointer-events-none on the tooltip element [req:4.7]', () => {
      render(<FooterCommitBadge />)
      const tooltip = screen.getByText(FULL_SHA)
      expect(tooltip.className).toContain('pointer-events-none')
    })

    it('positions the tooltip absolute bottom-full right-0 whitespace-nowrap [req:4.8]', () => {
      render(<FooterCommitBadge />)
      const tooltip = screen.getByText(FULL_SHA)
      expect(tooltip.className).toContain('absolute')
      expect(tooltip.className).toContain('bottom-full')
      expect(tooltip.className).toContain('right-0')
      expect(tooltip.className).toContain('whitespace-nowrap')
    })

    it('does not set aria-hidden anywhere in the tooltip markup [req:4.10]', () => {
      render(<FooterCommitBadge />)
      const tooltip = screen.getByText(FULL_SHA)
      expect(tooltip.hasAttribute('aria-hidden')).toBe(false)
      expect(tooltip.parentElement?.hasAttribute('aria-hidden')).toBe(false)
    })
  })

  describe('tooltip absent in fallback state', () => {
    beforeEach(stubFallback)

    it('renders zero tooltip markup in the DOM when the short sha is "whoops" [req:4.2]', () => {
      const { container } = render(<FooterCommitBadge />)
      expect(screen.queryByText('deadbeefdeadbeefdeadbeefdeadbeefdeadbeef')).toBeNull()
      expect(container.querySelectorAll('span')).toHaveLength(1)
    })
  })

  describe('positioning and print behavior', () => {
    beforeEach(stubResolved)

    it("positions the wrapper fixed right-56 bottom-3 [req:5.1] [req:3.3] [req:10.8] [req:9.11]", () => {
      render(<FooterCommitBadge />)
      const wrapper = screen.getByText(SHORT_SHA).parentElement
      expect(wrapper?.className).toContain('fixed')
      expect(wrapper?.className).toContain('right-56')
      expect(wrapper?.className).toContain('bottom-3')
    })

    it('hides the wrapper when printing [req:5.2]', () => {
      render(<FooterCommitBadge />)
      const wrapper = screen.getByText(SHORT_SHA).parentElement
      expect(wrapper?.className).toContain('print:hidden')
    })

    it('sets no explicit z-index on the badge or the tooltip [req:5.3]', () => {
      render(<FooterCommitBadge />)
      const wrapper = screen.getByText(SHORT_SHA).parentElement
      const badge = screen.getByText(SHORT_SHA)
      const tooltip = screen.getByText(FULL_SHA)
      expect(wrapper?.className).not.toMatch(/(^|\s)z-/)
      expect(badge.className).not.toMatch(/(^|\s)z-/)
      expect(tooltip.className).not.toMatch(/(^|\s)z-/)
    })
  })

  describe('non-interactive, static presentation', () => {
    beforeEach(stubResolved)

    it('renders no onClick handler, no anchor/Link element [req:6.1] [req:6.2]', () => {
      const { container } = render(<FooterCommitBadge />)
      expect(container.querySelector('a')).toBeNull()
      expect(container.querySelector('[onclick]')).toBeNull()
      expect(footerCommitBadgeSource).not.toMatch(/onClick/)
    })

    it('does not invoke the clipboard API from source [req:6.3]', () => {
      expect(footerCommitBadgeSource).not.toMatch(/navigator\.clipboard/)
    })

    it('renders unconditionally with no config, settings, or environment-based toggle [req:6.4]', () => {
      expect(footerCommitBadgeSource).not.toMatch(/import\.meta\.env/)
      expect(footerCommitBadgeSource).not.toMatch(/useState|useEffect|useContext/)
    })
  })
})
