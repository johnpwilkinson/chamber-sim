import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import { GauntletPanel } from './gauntlet-panel'

afterEach(() => {
  cleanup()
})

describe('GauntletPanel', () => {
  it('renders all four badges inside the gauntlet-panel section [req:6.1] [req:6.3]', () => {
    render(<GauntletPanel />)

    const panel = screen.getByTestId('gauntlet-panel')
    expect(panel.tagName).toBe('SECTION')

    for (const testId of [
      'alpha-badge',
      'bravo-badge',
      'charlie-badge',
      'delta-badge',
    ]) {
      const badge = within(panel).getByTestId(testId)
      expect(panel.contains(badge)).toBe(true)
      expect(badge.textContent).not.toBe('')
    }
  })
})
