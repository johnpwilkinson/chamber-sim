import { clamp } from '../../lib/gauntlet/core'
import { toOrdinal } from '../../lib/gauntlet/ordinal'

export function BravoBadge({ count }: { count: number }) {
  return <span data-testid="bravo-badge">{`Bravo ${toOrdinal(clamp(count, 1, 999))}`}</span>
}
