import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import App from '../../App'

afterEach(() => {
  cleanup()
})

describe('App mount point integration', () => {
  it('renders the command palette trigger surface exactly once, unconditionally [req:4.1]', async () => {
    render(<App />)

    const openEvent = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    })
    window.dispatchEvent(openEvent)

    expect(await screen.findAllByText('No results found.')).toHaveLength(1)
    expect(await screen.findAllByRole('combobox')).toHaveLength(1)
  })

  it('leaves the existing blank-slate markup in App.tsx unchanged [req:4.2]', () => {
    render(<App />)

    expect(screen.getByText('Get started')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /count is 0/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /documentation/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /connect with us/i })).toBeInTheDocument()
  })
})
