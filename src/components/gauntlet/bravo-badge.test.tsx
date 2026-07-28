import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { BravoBadge } from './bravo-badge'

afterEach(cleanup)

describe('BravoBadge', () => {
  it('clamps an out-of-range count to [1, 999] before rendering [req:3.6]', () => {
    const { rerender } = render(<BravoBadge count={0} />)
    expect(screen.getByTestId('bravo-badge')).toHaveTextContent('Bravo 1st')

    rerender(<BravoBadge count={-42} />)
    expect(screen.getByTestId('bravo-badge')).toHaveTextContent('Bravo 1st')

    rerender(<BravoBadge count={1000} />)
    expect(screen.getByTestId('bravo-badge')).toHaveTextContent('Bravo 999th')
  })

  it('renders "Bravo " plus the ordinal inside [data-testid="bravo-badge"] [req:3.7]', () => {
    const { rerender } = render(<BravoBadge count={2} />)
    expect(screen.getByTestId('bravo-badge')).toHaveTextContent('Bravo 2nd')

    rerender(<BravoBadge count={12} />)
    expect(screen.getByTestId('bravo-badge')).toHaveTextContent('Bravo 12th')

    rerender(<BravoBadge count={23} />)
    expect(screen.getByTestId('bravo-badge').textContent).toBe('Bravo 23rd')
  })
})
