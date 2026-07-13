import { describe, expect, it } from 'vitest'
import { isTypingTarget } from './isTypingTarget'

describe('isTypingTarget', () => {
  it('returns true for an input element target [req:4.1]', () => {
    const target = document.createElement('input')
    expect(isTypingTarget(target)).toBe(true)
  })

  it('returns true for a textarea element target [req:4.1]', () => {
    const target = document.createElement('textarea')
    expect(isTypingTarget(target)).toBe(true)
  })

  it('returns true for a contenteditable element target [req:4.1]', () => {
    const target = document.createElement('div')
    target.setAttribute('contenteditable', 'true')
    document.body.appendChild(target)
    expect(isTypingTarget(target)).toBe(true)
    document.body.removeChild(target)
  })

  it('returns true for a select element target [req:4.1]', () => {
    const target = document.createElement('select')
    expect(isTypingTarget(target)).toBe(true)
  })

  it('returns false for a non-typing element target [req:4.2]', () => {
    const target = document.createElement('div')
    expect(isTypingTarget(target)).toBe(false)
  })

  it('returns false for a null target [req:4.6]', () => {
    expect(isTypingTarget(null)).toBe(false)
  })

  it('is a pure function accepting EventTarget | null and returning a boolean [req:4.6]', () => {
    const target = document.createElement('button')
    const first = isTypingTarget(target)
    const second = isTypingTarget(target)
    expect(typeof first).toBe('boolean')
    expect(first).toBe(second)
  })
})
