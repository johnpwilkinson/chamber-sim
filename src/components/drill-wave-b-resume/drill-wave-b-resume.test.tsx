import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { DrillWaveBResume } from './drill-wave-b-resume'

afterEach(() => {
  cleanup()
})

describe('DrillWaveBResume', () => {
  it('renders a span with the exact text wave-b-resumed [req:1.1]', () => {
    const { container } = render(<DrillWaveBResume />)
    const span = container.querySelector('span')
    expect(span).not.toBeNull()
    expect(span?.textContent).toBe('wave-b-resumed')
  })

  it('renders exactly one span element with no other elements [req:1.1]', () => {
    const { container } = render(<DrillWaveBResume />)
    expect(container.querySelectorAll('*')).toHaveLength(1)
    expect(container.querySelector('span')).not.toBeNull()
  })

  it('sets data-drill="wave-b-resume" on the span [req:1.2]', () => {
    const { container } = render(<DrillWaveBResume />)
    const span = container.querySelector('span')
    expect(span?.getAttribute('data-drill')).toBe('wave-b-resume')
  })

  it('sets className="hidden" on the span [req:1.2]', () => {
    const { container } = render(<DrillWaveBResume />)
    const span = container.querySelector('span')
    expect(span?.className).toBe('hidden')
  })

  it('accepts no props and renders unconditionally regardless of arguments passed [req:1.3]', () => {
    const AnyProps = DrillWaveBResume as unknown as (props: Record<string, unknown>) => ReactElement
    const { container } = render(<AnyProps unexpected="value" another={42} />)
    const span = container.querySelector('span')
    expect(span?.textContent).toBe('wave-b-resumed')
    expect(span?.getAttribute('data-drill')).toBe('wave-b-resume')
  })

  it('contains no interactive elements or event-handler attributes [req:1.3]', () => {
    const { container } = render(<DrillWaveBResume />)
    const span = container.querySelector('span')
    expect(container.querySelector('button, a, input, select, textarea')).toBeNull()
    expect(span?.onclick).toBeNull()
  })
})
