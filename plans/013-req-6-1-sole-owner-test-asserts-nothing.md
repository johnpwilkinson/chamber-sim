# Plan 013: req:6.1 'sole owner' test asserts nothing meaningful

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on.
> If anything under "STOP conditions" occurs, stop and report — do not
> improvise. The dispatching driver maintains the status index in
> `plans/README.md` — do not edit it.
>
> **Drift check (run first)**: `git diff --stat 12dd47c..HEAD -- src/components/footer-locale-badge/footer-locale-badge.test.tsx`
> If the file changed since planning, compare "Current state" below against
> the live code before proceeding; on a mismatch treat it as a STOP condition.

## Status

- **Priority**: P2
- **Severity**: MED
- **Feature**: footer-locale-badge
- **Dimension**: tests
- **Planned at**: commit `12dd47c`, 2026-07-15

## Why this matters

The test claims to verify the 'sole owner' / single-mount-point boundary commitment from design.md via `expect(typeof FooterLocaleBadge).toBe('function')`. This is trivially true for any successfully imported function component and can never fail in a way that signals a real regression (e.g. someone violating the boundary by adding a second export, or moving the component elsewhere). It gives false confidence that req:6.1 is covered when no real verification happens.

## Current state

- File: `src/components/footer-locale-badge/footer-locale-badge.test.tsx` (line 89)
- Evidence: it('is implemented at src/components/footer-locale-badge/footer-locale-badge.tsx as its sole owner [req:6.1]', () => {
  expect(typeof FooterLocaleBadge).toBe('function')
})

## The fix

Remove this test (design.md's own required-test list for this file does not include an ownership test — file-structure boundaries aren't meaningfully runtime-testable) or replace it with an assertion that actually exercises the boundary, e.g. checking the module has no other named exports.

## Done criteria

- The issue described above no longer reproduces at `src/components/footer-locale-badge/footer-locale-badge.test.tsx:89`.
- The project's build and test suite pass.
- No file outside the scope of this fix (and its direct tests) was modified.

## STOP conditions

- The "Current state" excerpt no longer matches the live code.
- A correct fix requires editing files unrelated to this finding.
- The fix requires a design decision this plan does not spell out.
