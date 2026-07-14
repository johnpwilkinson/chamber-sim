# Plan 005: No test exercises FooterVersionBadge mounted via App

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on.
> If anything under "STOP conditions" occurs, stop and report — do not
> improvise. The dispatching driver maintains the status index in
> `plans/README.md` — do not edit it.
>
> **Drift check (run first)**: `git diff --stat 1d0cd85..HEAD -- src/App.tsx`
> If the file changed since planning, compare "Current state" below against
> the live code before proceeding; on a mismatch treat it as a STOP condition.

## Status

- **Priority**: P2
- **Severity**: MED
- **Feature**: footer-version-badge
- **Dimension**: tests
- **Planned at**: commit `1d0cd85`, 2026-07-14

## Why this matters

Requirement 5 (5.1 'mount exactly once from App.tsx', 5.2 'alongside CommandPalette without other markup changes', 5.3 'no other file mounts it') is entirely untested. footer-version-badge.test.tsx only ever renders `<FooterVersionBadge />` in isolation — no test renders `<App />` and asserts the badge appears alongside the existing blank-slate markup and CommandPalette. The repo already has a precedent for exactly this: src/components/command-palette/app-integration.test.tsx renders `<App />` and checks both the new feature's presence and that existing markup is unchanged. If a future edit removes the `<FooterVersionBadge />` mount from App.tsx, or duplicates it, or breaks its coexistence with CommandPalette/KeyboardShortcutsProvider, no test in this diff would catch it.

## Current state

- File: `src/App.tsx` (line 16)
- Evidence: src/App.tsx:16 `<FooterVersionBadge />` (mount point, req 5.1-5.3) has no corresponding assertion in any test file; footer-version-badge.test.tsx:1-86 only imports and renders the component directly, never `App`.

## The fix

Add an app-integration test analogous to command-palette/app-integration.test.tsx: render `<App />`, assert `screen.getByText(/^v/)` (or query by the badge's role/text) is present exactly once, and assert existing App markup (e.g. 'Get started' heading) is still intact — mirroring the [req:5.1] [req:5.2] tags used elsewhere in this diff's test file.

## Done criteria

- The issue described above no longer reproduces at `src/App.tsx:16`.
- The project's build and test suite pass.
- No file outside the scope of this fix (and its direct tests) was modified.

## STOP conditions

- The "Current state" excerpt no longer matches the live code.
- A correct fix requires editing files unrelated to this finding.
- The fix requires a design decision this plan does not spell out.
