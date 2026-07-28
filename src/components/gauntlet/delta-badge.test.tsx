import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { DeltaBadge } from './delta-badge'

afterEach(cleanup)

describe('DeltaBadge', () => {
  it('renders "Delta ", the initials, and the parenthesized member count [req:5.5]', () => {
    render(<DeltaBadge name="ada lovelace" memberCount={3} />)
    expect(screen.getByTestId('delta-badge')).toHaveTextContent(
      'Delta AL (3 members)',
    )
  })

  it('renders the singular member text for a one-member team [req:5.5]', () => {
    render(<DeltaBadge name="Mary Jane Watson" memberCount={1} />)
    expect(screen.getByTestId('delta-badge')).toHaveTextContent(
      'Delta MW (1 member)',
    )
  })
})
