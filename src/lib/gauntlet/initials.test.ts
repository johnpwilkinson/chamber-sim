import { describe, expect, it } from 'vitest'
import { initials } from './initials'

describe('initials', () => {
  it('concatenates uppercase first letters of both words for a two-word name [req:5.1]', () => {
    expect(initials('ada lovelace')).toBe('AL')
    expect(initials('Grace Hopper')).toBe('GH')
  })

  it('returns a single uppercase letter for a single-word name [req:5.2]', () => {
    expect(initials('Zendaya')).toBe('Z')
    expect(initials('prince')).toBe('P')
  })

  it("returns '' for an empty and a whitespace-only string [req:5.3]", () => {
    expect(initials('')).toBe('')
    expect(initials('   ')).toBe('')
    expect(initials('\t\n ')).toBe('')
  })

  it('uses only the first and last word when the name has more than two words [req:5.4]', () => {
    expect(initials('Mary Jane Watson')).toBe('MW')
    expect(initials('john ronald reuel tolkien')).toBe('JT')
  })
})
