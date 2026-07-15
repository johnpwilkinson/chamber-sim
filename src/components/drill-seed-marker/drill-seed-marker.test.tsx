import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { DrillSeedMarker } from './drill-seed-marker'

afterEach(() => {
  cleanup()
})

describe('DrillSeedMarker', () => {
  it('renders a span with the literal text drill [req:1.1]', () => {
    const { container } = render(<DrillSeedMarker />)
    const span = container.querySelector('span')
    expect(span).not.toBeNull()
    expect(span?.textContent).toBe('drill')
  })

  it('sets data-drill="seed-check" on the span [req:1.1]', () => {
    const { container } = render(<DrillSeedMarker />)
    const span = container.querySelector('span')
    expect(span?.getAttribute('data-drill')).toBe('seed-check')
  })

  it('sets className="hidden" on the span [req:1.1]', () => {
    const { container } = render(<DrillSeedMarker />)
    const span = container.querySelector('span')
    expect(span?.className).toBe('hidden')
  })

  it('renders no icon element [req:1.1]', () => {
    const { container } = render(<DrillSeedMarker />)
    expect(container.querySelector('svg')).toBeNull()
  })

  it('renders exactly one span element with no other elements [req:1.1]', () => {
    const { container } = render(<DrillSeedMarker />)
    expect(container.querySelectorAll('*')).toHaveLength(1)
    expect(container.querySelector('span')).not.toBeNull()
  })

  it('accepts no props and renders unconditionally regardless of arguments passed [req:1.1]', () => {
    const AnyProps = DrillSeedMarker as unknown as (props: Record<string, unknown>) => ReactElement
    const { container } = render(<AnyProps unexpected="value" another={42} />)
    const span = container.querySelector('span')
    expect(span?.textContent).toBe('drill')
    expect(span?.getAttribute('data-drill')).toBe('seed-check')
  })
})
