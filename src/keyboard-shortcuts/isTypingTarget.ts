/**
 * Single source of truth for "is the user typing" (see design.md Boundary
 * Commitments: Input-typing suppression). Pure function, no DOM listener
 * state or side effects.
 */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  const tagName = target.tagName

  if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') {
    return true
  }

  const editableAncestor = target.closest('[contenteditable]')

  return editableAncestor !== null && editableAncestor.getAttribute('contenteditable') !== 'false'
}
