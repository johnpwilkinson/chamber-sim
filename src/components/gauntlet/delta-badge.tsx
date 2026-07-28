import { formatCount } from '@/lib/gauntlet/core'
import { initials } from '@/lib/gauntlet/initials'

export function DeltaBadge({
  name,
  memberCount,
}: {
  name: string
  memberCount: number
}) {
  return (
    <span data-testid="delta-badge">
      {`Delta ${initials(name)} (${formatCount(memberCount, 'member')})`}
    </span>
  )
}
