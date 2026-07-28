import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { AlphaBadge } from './alpha-badge'

afterEach(() => {
  cleanup()
})

describe('AlphaBadge', () => {
  it('clamps an out-of-range count to [1, 3999] before converting [req:2.4]', () => {
    render(<AlphaBadge count={0} />)
    expect(screen.getByTestId('alpha-badge')).toHaveTextContent('Alpha I')
    cleanup()

    render(<AlphaBadge count={-42} />)
    expect(screen.getByTestId('alpha-badge')).toHaveTextContent('Alpha I')
    cleanup()

    render(<AlphaBadge count={10000} />)
    expect(screen.getByTestId('alpha-badge')).toHaveTextContent('Alpha MMMCMXCIX')
  })

  it('renders "Alpha " plus the numeral inside the alpha-badge span [req:2.5]', () => {
    render(<AlphaBadge count={1994} />)

    const badge = screen.getByTestId('alpha-badge')
    expect(badge.tagName).toBe('SPAN')
    expect(badge).toHaveTextContent('Alpha MCMXCIV')
    expect(badge.textContent).toBe('Alpha MCMXCIV')
  })
})
