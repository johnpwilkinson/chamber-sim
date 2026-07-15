export function FooterCommitBadge() {
  const sha = __COMMIT_SHA__
  const hasSha = sha !== 'whoops'

  return (
    <div className="group relative fixed right-44 bottom-3 print:hidden">
      <span className="rounded-full border border-[var(--border)] bg-[var(--code-bg)] px-2 py-0.5 text-xs text-[var(--text)]">
        {sha}
      </span>
      {hasSha && (
        <span className="pointer-events-none absolute right-0 bottom-full mb-1 whitespace-nowrap rounded border border-[var(--border)] bg-[var(--code-bg)] px-2 py-0.5 text-xs text-[var(--text)] opacity-0 transition-opacity group-hover:opacity-100">
          {__COMMIT_SHA_FULL__}
        </span>
      )}
    </div>
  )
}
