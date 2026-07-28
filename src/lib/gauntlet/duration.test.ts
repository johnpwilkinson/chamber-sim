import { describe, expect, it } from 'vitest'
import { formatDuration } from './duration'

describe('formatDuration', () => {
  it('zero-pads minutes and seconds for a value spanning hours [req:4.1]', () => {
    expect(formatDuration(3723)).toBe('1h 02m 03s')
    expect(formatDuration(36000)).toBe('10h 00m 00s')
  })

  it('renders a 0h prefix with zero-padded minutes and seconds below one minute [req:4.2]', () => {
    expect(formatDuration(5)).toBe('0h 00m 05s')
    expect(formatDuration(0)).toBe('0h 00m 00s')
  })

  it('clamps a negative value to 0 [req:4.3]', () => {
    expect(formatDuration(-1)).toBe('0h 00m 00s')
    expect(formatDuration(-3723)).toBe('0h 00m 00s')
  })
})
