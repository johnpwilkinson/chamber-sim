export function FooterEnvModeBadge() {
  const mode = import.meta.env.MODE.toLowerCase()

  return (
    <div className="fixed right-20 bottom-3 print:hidden">
      <span
        title="vite mode"
        className="rounded-full border border-[var(--border)] bg-[var(--code-bg)] px-2 py-0.5 text-xs text-[var(--text)]"
      >
        {mode}
      </span>
    </div>
  )
}
