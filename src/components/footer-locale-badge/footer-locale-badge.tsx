export function FooterLocaleBadge() {
  const locale = (navigator.language || 'unknown').toLowerCase()

  return (
    <div className="fixed right-20 bottom-3 print:hidden">
      <span
        title="browser locale"
        className="rounded-full border border-[var(--border)] bg-[var(--code-bg)] px-2 py-0.5 text-xs text-[var(--text)]"
      >
        {locale}
      </span>
    </div>
  )
}
