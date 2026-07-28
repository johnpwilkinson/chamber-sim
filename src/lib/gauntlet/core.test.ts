import { describe, expect, it } from 'vitest'
import { clamp, formatCount } from './core'

describe('clamp', () => {
  it('returns n unchanged inside the range [req:1.1]', () => {
    expect(clamp(5, 1, 10)).toBe(5)
    expect(clamp(1, 1, 10)).toBe(1)
    expect(clamp(10, 1, 10)).toBe(10)
  })

  it('returns lo below the range [req:1.2]', () => {
    expect(clamp(0, 1, 10)).toBe(1)
    expect(clamp(-100, 1, 10)).toBe(1)
  })

  it('returns hi above the range [req:1.3]', () => {
    expect(clamp(11, 1, 10)).toBe(10)
    expect(clamp(4000, 1, 3999)).toBe(3999)
  })
})

describe('formatCount', () => {
  it('formats singular at n === 1 [req:1.4]', () => {
    expect(formatCount(1, 'item')).toBe('1 item')
    expect(formatCount(1, 'member')).toBe('1 member')
  })

  it('pluralizes for n === 0 and n > 1 [req:1.5]', () => {
    expect(formatCount(0, 'item')).toBe('0 items')
    expect(formatCount(2, 'item')).toBe('2 items')
    expect(formatCount(5, 'item')).toBe('5 items')
  })

  it('clamps a negative n to 0 before formatting [req:1.6]', () => {
    expect(formatCount(-3, 'item')).toBe('0 items')
    expect(formatCount(-1, 'member')).toBe('0 members')
  })
})
