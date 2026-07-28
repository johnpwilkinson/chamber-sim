export function clamp(n: number, lo: number, hi: number): number {
  if (n < lo) return lo
  if (n > hi) return hi
  return n
}

export function formatCount(n: number, noun: string): string {
  const count = clamp(n, 0, Number.POSITIVE_INFINITY)
  return count === 1 ? `1 ${noun}` : `${count} ${noun}s`
}
