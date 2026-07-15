# Plan 010: No test for mixed-fallback state (full sha only fails)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on.
> If anything under "STOP conditions" occurs, stop and report — do not
> improvise. The dispatching driver maintains the status index in
> `plans/README.md` — do not edit it.
>
> **Drift check (run first)**: `git diff --stat 1492319..HEAD -- src/components/footer-commit-badge/footer-commit-badge.test.tsx`
> If the file changed since planning, compare "Current state" below against
> the live code before proceeding; on a mismatch treat it as a STOP condition.

## Status

- **Priority**: P2
- **Severity**: MED
- **Feature**: footer-badge-showing-the-short-build-com
- **Dimension**: tests
- **Planned at**: commit `1492319`, 2026-07-15

## Why this matters

The component's tooltip visibility branch (`hasSha = sha !== 'whoops'`) only checks `__COMMIT_SHA__`, but per design.md each of the two `resolveCommitSha` calls in vite.config.ts fails independently. If only the full sha's git call throws while the short sha resolves, the tooltip still renders (since hasSha is true) but displays the literal text 'whoops'. This asymmetric state is never exercised at the component level.

## Current state

- File: `src/components/footer-commit-badge/footer-commit-badge.test.tsx` (line 21)
- Evidence: stubResolved() (lines 16-19) and stubFallback() (lines 21-24) only ever set both __COMMIT_SHA__ and __COMMIT_SHA_FULL__ to matching resolved/fallback pairs; no test sets __COMMIT_SHA__ to a real sha while __COMMIT_SHA_FULL__ is 'whoops'. The asymmetric-fallback behavior is already covered for vite.config.ts itself in vite-config.test.ts's 'independent fallback per global' describe block (lines 43-96), but not propagated to a FooterCommitBadge rendering test.

## The fix

Add a test/stub combo (e.g. stubFullOnlyFallback: __COMMIT_SHA__='abc1234', __COMMIT_SHA_FULL__='whoops') asserting the tooltip renders with visible text 'whoops' in that state, so a future change to the hasSha gating logic or tooltip content is caught.

## Done criteria

- The issue described above no longer reproduces at `src/components/footer-commit-badge/footer-commit-badge.test.tsx:21`.
- The project's build and test suite pass.
- No file outside the scope of this fix (and its direct tests) was modified.

## STOP conditions

- The "Current state" excerpt no longer matches the live code.
- A correct fix requires editing files unrelated to this finding.
- The fix requires a design decision this plan does not spell out.
