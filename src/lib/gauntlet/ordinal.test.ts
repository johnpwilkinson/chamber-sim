import { describe, expect, it } from 'vitest'
import { toOrdinal } from './ordinal'

describe('toOrdinal', () => {
  it('appends "st" for values ending in 1 except 11 [req:3.1]', () => {
    expect(toOrdinal(1)).toBe('1st')
    expect(toOrdinal(21)).toBe('21st')
    expect(toOrdinal(101)).toBe('101st')
    expect(toOrdinal(111)).not.toBe('111st')
  })

  it('appends "nd" for values ending in 2 except 12 [req:3.2]', () => {
    expect(toOrdinal(2)).toBe('2nd')
    expect(toOrdinal(22)).toBe('22nd')
    expect(toOrdinal(102)).toBe('102nd')
    expect(toOrdinal(112)).not.toBe('112nd')
  })

  it('appends "rd" for values ending in 3 except 13 [req:3.3]', () => {
    expect(toOrdinal(3)).toBe('3rd')
    expect(toOrdinal(23)).toBe('23rd')
    expect(toOrdinal(103)).toBe('103rd')
    expect(toOrdinal(113)).not.toBe('113rd')
  })

  it('appends "th" for 11, 12 and 13 and their hundreds echoes [req:3.4]', () => {
    expect(toOrdinal(11)).toBe('11th')
    expect(toOrdinal(12)).toBe('12th')
    expect(toOrdinal(13)).toBe('13th')
    expect(toOrdinal(111)).toBe('111th')
    expect(toOrdinal(112)).toBe('112th')
    expect(toOrdinal(113)).toBe('113th')
  })

  it('appends "th" for any other value [req:3.5]', () => {
    expect(toOrdinal(4)).toBe('4th')
    expect(toOrdinal(10)).toBe('10th')
    expect(toOrdinal(100)).toBe('100th')
    expect(toOrdinal(999)).toBe('999th')
  })

  it('rejects non-positive-integer input loudly', () => {
    expect(() => toOrdinal(0)).toThrow(RangeError)
    expect(() => toOrdinal(-1)).toThrow(RangeError)
    expect(() => toOrdinal(1.5)).toThrow(RangeError)
    expect(() => toOrdinal(Number.NaN)).toThrow(RangeError)
  })
})
