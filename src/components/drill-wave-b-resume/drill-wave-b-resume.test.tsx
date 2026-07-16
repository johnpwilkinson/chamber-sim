import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { DrillWaveBResume } from './drill-wave-b-resume'

afterEach(() => {
  cleanup()
})

describe('DrillWaveBResume', () => {
  it('renders text content equal to exactly wave-b-resumed [req:3.1]', () => {
    const { container } = render(<DrillWaveBResume />)
    const span = container.querySelector('span')
    expect(span).not.toBeNull()
    expect(span?.textContent).toBe('wave-b-resumed')
  })

  it('sets data-drill="wave-b-resume" and class hidden on the rendered span [req:3.2]', () => {
    const { container } = render(<DrillWaveBResume />)
    const span = container.querySelector('span')
    expect(span?.getAttribute('data-drill')).toBe('wave-b-resume')
    expect(span?.className).toBe('hidden')
  })

  it('renders no interactive elements and no onclick attribute [req:3.3]', () => {
    const { container } = render(<DrillWaveBResume />)
    expect(container.querySelector('a')).toBeNull()
    expect(container.querySelector('button')).toBeNull()
    expect(container.querySelector('[onclick]')).toBeNull()
    const span = container.querySelector('span')
    expect(span?.onclick).toBeNull()
  })
})
