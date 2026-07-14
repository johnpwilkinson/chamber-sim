# Plan 006: Test tagged req:8.3 never checks other files

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on.
> If anything under "STOP conditions" occurs, stop and report — do not
> improvise. The dispatching driver maintains the status index in
> `plans/README.md` — do not edit it.
>
> **Drift check (run first)**: `git diff --stat 59e331d..HEAD -- src/components/header-build-badge/app-integration.test.tsx`
> If the file changed since planning, compare "Current state" below against
> the live code before proceeding; on a mismatch treat it as a STOP condition.

## Status

- **Priority**: P2
- **Severity**: MED
- **Feature**: a-small-badge-in-the-app-header-showing
- **Dimension**: tests
- **Planned at**: commit `59e331d`, 2026-07-14

## Why this matters

The test is tagged [req:8.3] ("THE SYSTEM SHALL ensure no file other than src/App.tsx mounts HeaderBuildBadge") but its body only renders <App/> and counts badge occurrences within that single render. It never inspects any other file/module to confirm HeaderBuildBadge isn't mounted elsewhere in the codebase.

## Current state

- File: `src/components/header-build-badge/app-integration.test.tsx` (line 18)
- Evidence: app-integration.test.tsx:18-27: it('mounts HeaderBuildBadge exactly once, alongside FooterVersionBadge [req:8.1] [req:8.3]', () => { render(<App />); ... expect(screen.getAllByText(`built ${formatted}`)).toHaveLength(1); expect(screen.getAllByText('v1.2.3')).toHaveLength(1) })

## The fix

Either drop the [req:8.3] tag (this test only covers 8.1), or add a real check, e.g. a source-scan test (mirroring the vite-config.test.ts pattern) that greps src/**/*.tsx excluding header-build-badge/ and App.tsx for `HeaderBuildBadge` usage and asserts no matches.

## Done criteria

- The issue described above no longer reproduces at `src/components/header-build-badge/app-integration.test.tsx:18`.
- The project's build and test suite pass.
- No file outside the scope of this fix (and its direct tests) was modified.

## STOP conditions

- The "Current state" excerpt no longer matches the live code.
- A correct fix requires editing files unrelated to this finding.
- The fix requires a design decision this plan does not spell out.
