# Plan 014: No app-integration test for the App.tsx mount

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on.
> If anything under "STOP conditions" occurs, stop and report — do not
> improvise. The dispatching driver maintains the status index in
> `plans/README.md` — do not edit it.
>
> **Drift check (run first)**: `git diff --stat 4e4fbd9..HEAD -- src/components/drill-wave-b-resume/drill-wave-b-resume.test.tsx`
> If the file changed since planning, compare "Current state" below against
> the live code before proceeding; on a mismatch treat it as a STOP condition.

## Status

- **Priority**: P2
- **Severity**: MED
- **Feature**: drill-wave-b-resume
- **Dimension**: tests
- **Planned at**: commit `4e4fbd9`, 2026-07-16

## Why this matters

Requirement 2.1 mandates that `src/App.tsx` mount `<DrillWaveBResume />` exactly once, immediately after `<DrillSeedMarker />`. Every other App-mounted feature in this codebase (drill-seed-marker, command-palette, footer-commit-badge, resume-footer-link, header-build-badge, footer-version-badge) has a sibling `app-integration.test.tsx` that renders `<App />` and asserts the marker appears exactly once via its `data-drill`/data attribute. This PR adds the mount line in `src/App.tsx` (line 24: `<DrillWaveBResume />`) but adds no such test — the component-level tests only render `<DrillWaveBResume />` in isolation, never verifying it is actually wired into `App.tsx`. A future regression (e.g. someone deleting the mount line, or duplicating it) would go undetected by the test suite.

## Current state

- File: `src/components/drill-wave-b-resume/drill-wave-b-resume.test.tsx` (line 32)
- Evidence: git diff shows src/App.tsx +import and +`<DrillWaveBResume />` only, with no corresponding test; compare to src/components/drill-seed-marker/app-integration.test.tsx which does `render(<App />); expect(container.querySelectorAll('[data-drill="seed-check"]')).toHaveLength(1)`.

## The fix

Add `src/components/drill-wave-b-resume/app-integration.test.tsx` mirroring drill-seed-marker's pattern: render `<App />` and assert `container.querySelectorAll('[data-drill="wave-b-resume"]')` has length 1, covering requirement 2.1's 'exactly once, immediately after DrillSeedMarker' acceptance criterion.

## Done criteria

- The issue described above no longer reproduces at `src/components/drill-wave-b-resume/drill-wave-b-resume.test.tsx:32`.
- The project's build and test suite pass.
- No file outside the scope of this fix (and its direct tests) was modified.

## STOP conditions

- The "Current state" excerpt no longer matches the live code.
- A correct fix requires editing files unrelated to this finding.
- The fix requires a design decision this plan does not spell out.
