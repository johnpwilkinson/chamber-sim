import { clamp } from './core'

export function formatDuration(seconds: number): string {
  const total = clamp(seconds, 0, Number.POSITIVE_INFINITY)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = Math.floor(total % 60)
  return `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`
}
