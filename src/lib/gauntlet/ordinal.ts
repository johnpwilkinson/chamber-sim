export function toOrdinal(n: number): string {
  if (!Number.isInteger(n) || n < 1) {
    throw new RangeError(`toOrdinal expects a positive integer, received ${n}`)
  }

  const lastTwo = n % 100
  if (lastTwo >= 11 && lastTwo <= 13) return `${n}th`

  switch (n % 10) {
    case 1:
      return `${n}st`
    case 2:
      return `${n}nd`
    case 3:
      return `${n}rd`
    default:
      return `${n}th`
  }
}
