import { SHORTCUTS } from './shortcuts'
import styles from './ShortcutHelpOverlay.module.css'

export interface ShortcutHelpOverlayProps {
  open: boolean
  onClose: () => void
}

export function ShortcutHelpOverlay({ open, onClose }: ShortcutHelpOverlayProps) {
  if (!open) {
    return null
  }

  return (
    <div className={styles.backdrop} role="presentation" onClick={onClose}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcut-help-overlay-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="shortcut-help-overlay-title" className={styles.title}>
          Keyboard shortcuts
        </h2>
        <ul className={styles.list}>
          {SHORTCUTS.map((shortcut) => (
            <li key={shortcut.id} className={styles.row}>
              <kbd className={styles.keys}>{shortcut.displayKeys}</kbd>
              <span className={styles.description}>{shortcut.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
