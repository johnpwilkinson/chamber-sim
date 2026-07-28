import { AlphaBadge } from './alpha-badge'
import { BravoBadge } from './bravo-badge'
import { CharlieBadge } from './charlie-badge'
import { DeltaBadge } from './delta-badge'

export function GauntletPanel() {
  return (
    <section data-testid="gauntlet-panel">
      <AlphaBadge count={1994} />
      <BravoBadge count={21} />
      <CharlieBadge seconds={3723} />
      <DeltaBadge name="ada lovelace" memberCount={3} />
    </section>
  )
}
