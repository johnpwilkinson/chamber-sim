export function FooterVersionBadge() {
  const version = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'unknown'

  return (
    <div className="fixed right-3 bottom-3 print:hidden">
      <span className="rounded-full border border-[var(--border)] bg-[var(--code-bg)] px-2 py-0.5 text-xs text-[var(--text)]">
        v{version}
      </span>
    </div>
  )
}
