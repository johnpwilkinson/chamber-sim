import { useEffect, useRef } from 'react'
import {
  registerActionHandler,
  unregisterActionHandler,
} from './KeyboardShortcutsProvider'
import type { ShortcutActionHandler } from './KeyboardShortcutsProvider'

export type UseShortcutActionId = 'search' | 'save'

export function useShortcutAction(
  id: UseShortcutActionId,
  handler: ShortcutActionHandler,
): void {
  const handlerRef = useRef(handler)
  handlerRef.current = handler

  useEffect(() => {
    const dispatch: ShortcutActionHandler = () => handlerRef.current()
    registerActionHandler(id, dispatch)
    return () => unregisterActionHandler(id, dispatch)
  }, [id])
}
