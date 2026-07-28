import { formatDuration } from '../../lib/gauntlet/duration'

export function CharlieBadge({ seconds }: { seconds: number }) {
  return <span data-testid="charlie-badge">{formatDuration(seconds)}</span>
}
