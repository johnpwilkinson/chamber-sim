export function HeaderBuildBadge() {
  const formatted = new Date(__BUILD_TIME__).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <div className="fixed right-3 top-3 print:hidden">
      <span className="rounded-full border border-[var(--border)] bg-[var(--code-bg)] px-2 py-0.5 text-xs text-[var(--text)]">
        built {formatted}
      </span>
    </div>
  )
}
