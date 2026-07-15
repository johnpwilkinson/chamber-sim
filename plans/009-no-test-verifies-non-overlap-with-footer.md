# Plan 009: No test verifies non-overlap with FooterVersionBadge (req 3.2)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on.
> If anything under "STOP conditions" occurs, stop and report — do not
> improvise. The dispatching driver maintains the status index in
> `plans/README.md` — do not edit it.
>
> **Drift check (run first)**: `git diff --stat 9b9ad51..HEAD -- src/components/resume-footer-link/app-integration.test.tsx`
> If the file changed since planning, compare "Current state" below against
> the live code before proceeding; on a mismatch treat it as a STOP condition.

## Status

- **Priority**: P2
- **Severity**: MED
- **Feature**: drill-warm-resume-tiny-footer-link
- **Dimension**: tests
- **Planned at**: commit `9b9ad51`, 2026-07-15

## Why this matters

Requirement 3.2 explicitly states ResumeFooterLink must sit at bottom-left while FooterVersionBadge sits at bottom-right so the two never overlap. resume-footer-link.test.tsx only checks ResumeFooterLink's own classes (bottom-3 left-3) in isolation, and app-integration.test.tsx never renders/asserts both components together to confirm they occupy distinct corners. Every other acceptance criterion in requirements.md (1.1-6.3) has a matching [req:x.x] tagged test; 3.2 is the sole gap. A future edit that accidentally moves either component to the same corner (e.g. copy-pasting FooterVersionBadge's `right-3 bottom-3` into ResumeFooterLink, or vice versa) would pass all existing tests since none renders both together and compares their positioning classes.

## Current state

- File: `src/components/resume-footer-link/app-integration.test.tsx` (line 21)
- Evidence: resume-footer-link.test.tsx:33-38 only asserts `link.className` contains 'fixed', 'bottom-3', 'left-3' for ResumeFooterLink alone; app-integration.test.tsx's 'mounts ResumeFooterLink exactly once' test (line 21) renders <App/> but only checks link count/name, never FooterVersionBadge's positioning classes alongside it.

## The fix

Add a test (in app-integration.test.tsx, alongside the existing App-mount tests) that renders <App/> and asserts the ResumeFooterLink anchor has 'left-3' while the FooterVersionBadge element has 'right-3' (or otherwise confirms they resolve to different horizontal-corner classes), e.g. `expect(screen.getByRole('link', {name:'Resume'}).className).toContain('left-3'); expect(container.querySelector('.fixed.right-3')).not.toBeNull()`.

## Done criteria

- The issue described above no longer reproduces at `src/components/resume-footer-link/app-integration.test.tsx:21`.
- The project's build and test suite pass.
- No file outside the scope of this fix (and its direct tests) was modified.

## STOP conditions

- The "Current state" excerpt no longer matches the live code.
- A correct fix requires editing files unrelated to this finding.
- The fix requires a design decision this plan does not spell out.
