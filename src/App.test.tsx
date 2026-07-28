import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import App from './App'

afterEach(() => {
  cleanup()
})

describe('App', () => {
  it('renders GauntletPanel exactly once, unconditionally [req:6.2] [req:6.4]', () => {
    const { container } = render(<App />)

    expect(screen.getAllByTestId('gauntlet-panel')).toHaveLength(1)
    expect(screen.getByTestId('alpha-badge')).toBeInTheDocument()

    // pre-existing markup is untouched
    expect(container.querySelector('#center')).not.toBeNull()
    expect(screen.getByRole('button', { name: /count is 0/i })).toBeInTheDocument()

    // no prop or state gates the panel: a second, independent mount renders it too
    cleanup()
    render(<App />)
    expect(screen.getAllByTestId('gauntlet-panel')).toHaveLength(1)
  })
})
