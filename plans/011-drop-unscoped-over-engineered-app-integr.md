# Plan 011: Drop unscoped, over-engineered app-integration test file

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on.
> If anything under "STOP conditions" occurs, stop and report — do not
> improvise. The dispatching driver maintains the status index in
> `plans/README.md` — do not edit it.
>
> **Drift check (run first)**: `git diff --stat 9500e0a..HEAD -- src/components/footer-env-mode-badge/app-integration.test.tsx`
> If the file changed since planning, compare "Current state" below against
> the live code before proceeding; on a mismatch treat it as a STOP condition.

## Status

- **Priority**: P2
- **Severity**: MED
- **Feature**: env-mode-badge
- **Dimension**: simplify
- **Planned at**: commit `9500e0a`, 2026-07-15

## Why this matters

This entire 125-line file is not authorized by design.md or tasks.md: design.md's File Structure table lists exactly five files for this feature (component, its test, the two commit-badge touches, and App.tsx) and states "No other files are touched"; tasks.md's only test-creation task is 1.2 for footer-env-mode-badge.test.tsx, with no task for an app-integration test. Beyond the scope violation, the mechanism is over-engineered for what req 8.1-8.4 need: it recursively walks every .tsx file under src/ with collectTsxFiles and greps file contents for the string 'FooterEnvModeBadge' to prove no other file mounts it (lines 10-16, 55-66), and it regex-parses App.tsx's raw source text to assert import-line counts and a literal mount-block pattern (lines 79-115) instead of just asserting on rendered DOM, which the file already does elsewhere (lines 42-49). A future rename of any sibling component, or a reordered/reformatted import block, breaks this test with no behavioral change, and the whole-tree file scan gets slower and noisier as the app grows.

## Current state

- File: `src/components/footer-env-mode-badge/app-integration.test.tsx` (line 10)
- Evidence: function collectTsxFiles(dir: string) { ... } (app-integration.test.tsx:10-16); const offenders = otherFiles.filter((file) => readFileSync(file, 'utf8').includes('FooterEnvModeBadge')) (line ~62); const mountBlockPattern = new RegExp(...) and bareMounts regex parsing of source text (lines ~90-115).

## The fix

Delete this file, or fold a single lightweight render-order assertion (already present at lines 42-49, checking right-3/right-20/right-44 DOM order) into footer-env-mode-badge.test.tsx / footer-commit-badge.test.tsx if App.tsx mount-order coverage is truly wanted. Drop the filesystem-scan and source-regex assertions entirely — they test file text, not behavior, and aren't required by any task.

## Done criteria

- The issue described above no longer reproduces at `src/components/footer-env-mode-badge/app-integration.test.tsx:10`.
- The project's build and test suite pass.
- No file outside the scope of this fix (and its direct tests) was modified.

## STOP conditions

- The "Current state" excerpt no longer matches the live code.
- A correct fix requires editing files unrelated to this finding.
- The fix requires a design decision this plan does not spell out.
