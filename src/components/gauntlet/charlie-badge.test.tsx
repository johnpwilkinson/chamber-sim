import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { CharlieBadge } from './charlie-badge'

afterEach(() => {
  cleanup()
})

describe('CharlieBadge', () => {
  it('renders the formatted duration inside [data-testid="charlie-badge"] [req:4.4]', () => {
    render(<CharlieBadge seconds={3723} />)

    expect(screen.getByTestId('charlie-badge')).toHaveTextContent('1h 02m 03s')
  })
})
