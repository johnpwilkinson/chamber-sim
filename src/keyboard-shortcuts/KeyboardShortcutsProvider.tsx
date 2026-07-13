import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { SHORTCUTS } from './shortcuts'
import { matchShortcut } from './matchShortcut'
import { isTypingTarget } from './isTypingTarget'
import { ShortcutHelpOverlay } from './ShortcutHelpOverlay'
import type { ShortcutActionId } from './types'

export type ShortcutActionHandler = () => void

/**
 * Action-handler map owned by KeyboardShortcutsProvider (see design.md
 * Boundary Commitments: Single listener). `useShortcutAction` registers and
 * unregisters through these functions; they are not part of the public
 * index.ts surface.
 */
const actionHandlers = new Map<ShortcutActionId, ShortcutActionHandler>()

export function registerActionHandler(
  id: ShortcutActionId,
  handler: ShortcutActionHandler,
): void {
  actionHandlers.set(id, handler)
}

export function unregisterActionHandler(
  id: ShortcutActionId,
  handler: ShortcutActionHandler,
): void {
  if (actionHandlers.get(id) === handler) {
    actionHandlers.delete(id)
  }
}

export interface KeyboardShortcutsProviderProps {
  children?: ReactNode
}

export function KeyboardShortcutsProvider({ children }: KeyboardShortcutsProviderProps) {
  const [helpOpen, setHelpOpen] = useState(false)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const shortcut = matchShortcut(event, SHORTCUTS)
      if (!shortcut) {
        return
      }

      if (isTypingTarget(event.target) && !shortcut.allowWhileTyping) {
        return
      }

      if (shortcut.id === 'help') {
        setHelpOpen(true)
        return
      }

      if (shortcut.id === 'cancel') {
        setHelpOpen(false)
        return
      }

      actionHandlers.get(shortcut.id)?.()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      {children}
      <ShortcutHelpOverlay open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  )
}
