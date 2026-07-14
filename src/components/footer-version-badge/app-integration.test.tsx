import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import App from '../../App'

beforeEach(() => {
  vi.stubGlobal('__APP_VERSION__', '1.2.3')
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('App mount point integration', () => {
  it('mounts FooterVersionBadge exactly once, alongside CommandPalette [req:5.1] [req:5.2]', () => {
    render(<App />)

    expect(screen.getAllByText('v1.2.3')).toHaveLength(1)
  })

  it('leaves the existing blank-slate markup in App.tsx unchanged [req:5.3]', () => {
    render(<App />)

    expect(screen.getByText('Get started')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /count is 0/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /documentation/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /connect with us/i })).toBeInTheDocument()
  })
})
