# Plan 003: No test for the isToggleKey guard's negative branch

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on.
> If anything under "STOP conditions" occurs, stop and report — do not
> improvise. The dispatching driver maintains the status index in
> `plans/README.md` — do not edit it.
>
> **Drift check (run first)**: `git diff --stat 931604d..HEAD -- src/components/command-palette/command-palette.test.tsx`
> If the file changed since planning, compare "Current state" below against
> the live code before proceeding; on a mismatch treat it as a STOP condition.

## Status

- **Priority**: P2
- **Severity**: MED
- **Feature**: command-palette
- **Dimension**: tests
- **Planned at**: commit `931604d`, 2026-07-12

## Why this matters

command-palette.tsx introduces `isToggleKey = key==='k' && (metaKey||ctrlKey); if (!isToggleKey) return` specifically so unrelated keystrokes don't hijack preventDefault or toggle the palette (this guard is the whole reason req 1.1/1.2 name 'Ctrl+K'/'Cmd+K' specifically rather than 'K'). Every test in this file only dispatches 'k' with ctrlKey or metaKey already set to true, so the guard's false branch is never exercised. If a future edit weakens the condition (e.g. drops the modifier check, or matches any key when a modifier is held), no test would fail, silently breaking global keyboard shortcuts by hijacking every 'k' keypress app-wide, or every Ctrl/Cmd-anything combo.

## Current state

- File: `src/components/command-palette/command-palette.test.tsx` (line 21)
- Evidence: command-palette.tsx:17-18: `const isToggleKey = event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey); if (!isToggleKey) return` — command-palette.test.tsx only ever calls dispatchKeydown({ctrlKey:true}) or dispatchKeydown({metaKey:true}), both with the default key:'k' baked into the helper, so isToggleKey is always true across the whole suite.

## The fix

Add a test asserting the negative path, e.g.: dispatch a plain 'k' keydown with no modifiers and assert defaultPrevented is false and the palette does not open; and dispatch ctrlKey+key:'j' (or another non-'k' key) and assert the same. Something like:
```ts
it('does not open or preventDefault for unrelated keystrokes [req:1.1] [req:1.2]', async () => {
  render(<CommandPalette />)
  const plainK = dispatchKeydown({ ctrlKey: false, metaKey: false })
  expect(plainK.defaultPrevented).toBe(false)
  const ctrlJ = dispatchKeydown({ ctrlKey: true, key: 'j' })
  expect(ctrlJ.defaultPrevented).toBe(false)
  expect(screen.queryByText('No results found.')).not.toBeInTheDocument()
})
```

## Done criteria

- The issue described above no longer reproduces at `src/components/command-palette/command-palette.test.tsx:21`.
- The project's build and test suite pass.
- No file outside the scope of this fix (and its direct tests) was modified.

## STOP conditions

- The "Current state" excerpt no longer matches the live code.
- A correct fix requires editing files unrelated to this finding.
- The fix requires a design decision this plan does not spell out.
