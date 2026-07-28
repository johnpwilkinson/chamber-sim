export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ''

  const first = words[0]
  const last = words[words.length - 1]
  if (words.length === 1) return first[0].toUpperCase()

  return (first[0] + last[0]).toUpperCase()
}
