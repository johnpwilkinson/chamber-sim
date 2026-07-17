import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { DrillWaveCTwins } from './drill-wave-c-twins'

afterEach(() => {
  cleanup()
})

describe('DrillWaveCTwins', () => {
  it('renders text content equal to exactly wave-c-twins [req:3.1]', () => {
    const { container } = render(<DrillWaveCTwins />)
    const span = container.querySelector('span')
    expect(span).not.toBeNull()
    expect(span?.textContent).toBe('wave-c-twins')
  })

  it('sets data-drill="wave-c-twins" and class hidden on the rendered span [req:3.2]', () => {
    const { container } = render(<DrillWaveCTwins />)
    const span = container.querySelector('span')
    expect(span?.getAttribute('data-drill')).toBe('wave-c-twins')
    expect(span?.className).toBe('hidden')
  })

  it('renders no interactive elements and no onclick attribute [req:3.3]', () => {
    const { container } = render(<DrillWaveCTwins />)
    expect(container.querySelector('a')).toBeNull()
    expect(container.querySelector('button')).toBeNull()
    expect(container.querySelector('[onclick]')).toBeNull()
    const span = container.querySelector('span')
    expect(span?.onclick).toBeNull()
  })
})
