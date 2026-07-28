import { describe, expect, it } from 'vitest'
import { toRoman } from './roman'

describe('toRoman', () => {
  it('converts a mid-range integer to its Roman numeral [req:2.1]', () => {
    expect(toRoman(1994)).toBe('MCMXCIV')
    expect(toRoman(1)).toBe('I')
    expect(toRoman(4)).toBe('IV')
    expect(toRoman(2024)).toBe('MMXXIV')
  })

  it('returns MMMCMXCIX at the maximum representable value [req:2.2]', () => {
    expect(toRoman(3999)).toBe('MMMCMXCIX')
  })

  it('throws RangeError below 1 and above 3999 [req:2.3]', () => {
    expect(() => toRoman(0)).toThrow(RangeError)
    expect(() => toRoman(4000)).toThrow(RangeError)
    expect(() => toRoman(-1)).toThrow(RangeError)
  })
})
