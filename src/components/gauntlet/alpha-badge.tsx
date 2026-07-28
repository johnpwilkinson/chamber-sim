import { clamp } from '../../lib/gauntlet/core'
import { toRoman } from '../../lib/gauntlet/roman'

export function AlphaBadge({ count }: { count: number }) {
  return <span data-testid="alpha-badge">{`Alpha ${toRoman(clamp(count, 1, 3999))}`}</span>
}
