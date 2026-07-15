# Plan 012: onClick test only checks DOM attribute, not JSX prop

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on.
> If anything under "STOP conditions" occurs, stop and report — do not
> improvise. The dispatching driver maintains the status index in
> `plans/README.md` — do not edit it.
>
> **Drift check (run first)**: `git diff --stat 9500e0a..HEAD -- src/components/footer-env-mode-badge/footer-env-mode-badge.test.tsx`
> If the file changed since planning, compare "Current state" below against
> the live code before proceeding; on a mismatch treat it as a STOP condition.

## Status

- **Priority**: P2
- **Severity**: MED
- **Feature**: env-mode-badge
- **Dimension**: tests
- **Planned at**: commit `9500e0a`, 2026-07-15

## Why this matters

The 'no interactive elements' test can never catch a real onClick handler because it only checks for the literal DOM attribute `onclick`.

## Current state

- File: `src/components/footer-env-mode-badge/footer-env-mode-badge.test.tsx` (line 55)
- Evidence: footer-env-mode-badge.test.tsx:55-60:
  it('renders no interactive elements: no links, buttons, or click handlers [req:5.1] [req:5.2] [req:10.6]', () => {
    const { container } = render(<FooterEnvModeBadge />)
    expect(container.querySelector('a')).toBeNull()
    expect(container.querySelector('button')).toBeNull()
    expect(container.querySelector('[onclick]')).toBeNull()
  })
Compare footer-commit-badge.test.tsx:154-158 (touched by this same diff), which pairs the identical DOM check with a source-level regex: `expect(footerCommitBadgeSource).not.toMatch(/onClick/)` — the actual mechanism that would catch a regression. The new env-mode-badge test omits that regex check entirely.

## The fix

Read the component source once (as footer-commit-badge.test.tsx already does via `readFileSync`) and add `expect(footerEnvModeBadgeSource).not.toMatch(/onClick/)` alongside the existing DOM assertions in this test, so an accidentally-added onClick prop actually fails the suite.

## Done criteria

- The issue described above no longer reproduces at `src/components/footer-env-mode-badge/footer-env-mode-badge.test.tsx:55`.
- The project's build and test suite pass.
- No file outside the scope of this fix (and its direct tests) was modified.

## STOP conditions

- The "Current state" excerpt no longer matches the live code.
- A correct fix requires editing files unrelated to this finding.
- The fix requires a design decision this plan does not spell out.
