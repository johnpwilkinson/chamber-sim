import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import App from '../../App'

afterEach(() => {
  cleanup()
})

describe('App mount point integration', () => {
  it('mounts DrillSeedMarker exactly once, alongside the existing badge mounts [req:2.1]', () => {
    const { container } = render(<App />)

    expect(container.querySelectorAll('[data-drill="seed-check"]')).toHaveLength(1)
  })
})
