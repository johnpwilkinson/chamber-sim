# Plan 007: No test for req:7.3 always-rendered/no env-gating

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on.
> If anything under "STOP conditions" occurs, stop and report — do not
> improvise. The dispatching driver maintains the status index in
> `plans/README.md` — do not edit it.
>
> **Drift check (run first)**: `git diff --stat 59e331d..HEAD -- src/components/header-build-badge/header-build-badge.test.tsx`
> If the file changed since planning, compare "Current state" below against
> the live code before proceeding; on a mismatch treat it as a STOP condition.

## Status

- **Priority**: P2
- **Severity**: MED
- **Feature**: a-small-badge-in-the-app-header-showing
- **Dimension**: tests
- **Planned at**: commit `59e331d`, 2026-07-14

## Why this matters

Requirement 7.3 (badge renders identically in dev/staging/production with no import.meta.env gating) has no corresponding test anywhere in the diff. A future change that wraps the render in an env check would violate 7.3 but no test would fail.

## Current state

- File: `src/components/header-build-badge/header-build-badge.test.tsx` (line 93)
- Evidence: grep -rn "req:" on the new test files shows tags for req:1.x,3.x,4.x,5.x,6.x,7.1,7.2,8.x but no req:7.3 anywhere in header-build-badge.test.tsx or app-integration.test.tsx.

## The fix

Add a test asserting the component renders the same output regardless of `import.meta.env.PROD`/`DEV` (stub both values, confirm badge text appears in each case), or a source-scan test asserting header-build-badge.tsx contains no `import.meta.env` reference.

## Done criteria

- The issue described above no longer reproduces at `src/components/header-build-badge/header-build-badge.test.tsx:93`.
- The project's build and test suite pass.
- No file outside the scope of this fix (and its direct tests) was modified.

## STOP conditions

- The "Current state" excerpt no longer matches the live code.
- A correct fix requires editing files unrelated to this finding.
- The fix requires a design decision this plan does not spell out.
