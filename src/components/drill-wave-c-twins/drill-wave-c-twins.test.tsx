import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { DrillWaveCTwins } from './drill-wave-c-twins'

afterEach(() => {
  cleanup()
})

describe('DrillWaveCTwins', () => {
  it('renders a single span with exact text content wave-c-twins [req:1.1]', () => {
    const { container } = render(<DrillWaveCTwins />)
    const spans = container.querySelectorAll('span')
    expect(spans.length).toBe(1)
    expect(spans[0].textContent).toBe('wave-c-twins')
  })

  it('sets data-drill="wave-c-twins" and class hidden on the rendered span [req:1.2]', () => {
    const { container } = render(<DrillWaveCTwins />)
    const span = container.querySelector('span')
    expect(span?.getAttribute('data-drill')).toBe('wave-c-twins')
    expect(span?.className).toBe('hidden')
  })

  it('accepts no props, holds no state, and renders no interactive elements or event handlers [req:1.3]', () => {
    expect(DrillWaveCTwins.length).toBe(0)
    const { container } = render(<DrillWaveCTwins />)
    expect(container.querySelector('a')).toBeNull()
    expect(container.querySelector('button')).toBeNull()
    expect(container.querySelector('input')).toBeNull()
    expect(container.querySelector('[onclick]')).toBeNull()
    const span = container.querySelector('span')
    expect(span?.onclick).toBeNull()
    expect(span?.children.length).toBe(0)
  })
})
