# Plan 008: Remove redundant req:6.2 recap test

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on.
> If anything under "STOP conditions" occurs, stop and report — do not
> improvise. The dispatching driver maintains the status index in
> `plans/README.md` — do not edit it.
>
> **Drift check (run first)**: `git diff --stat 9b9ad51..HEAD -- src/components/resume-footer-link/resume-footer-link.test.tsx`
> If the file changed since planning, compare "Current state" below against
> the live code before proceeding; on a mismatch treat it as a STOP condition.

## Status

- **Priority**: P2
- **Severity**: MED
- **Feature**: drill-warm-resume-tiny-footer-link
- **Dimension**: simplify
- **Planned at**: commit `9b9ad51`, 2026-07-15

## Why this matters

This test re-asserts href, target, rel, and text content that are already individually covered by the req:1.1, req:2.1, req:2.2, and req:2.3 tests earlier in the same file. It adds a fifth render() call and four duplicate assertions with zero incremental coverage — none of them can fail without one of the earlier, more specific tests also failing.

## Current state

- File: `src/components/resume-footer-link/resume-footer-link.test.tsx` (line 116)
- Evidence: it('is covered by this unit test asserting markup and attributes [req:6.2]', () => { render(<ResumeFooterLink />); const link = screen.getByRole('link', { name: 'Resume' }); expect(link.getAttribute('href')).toBe('/resume'); expect(link.getAttribute('target')).toBe('_blank'); expect(link.getAttribute('rel')).toBe('noreferrer'); expect(link.textContent).toBe('Resume') })

## The fix

Delete this test. Attach the req:6.2 traceability tag onto the existing req:1.1/2.1-2.3 tests instead of duplicating their bodies. Neither sibling test file (footer-version-badge.test.tsx, header-build-badge.test.tsx) has an equivalent 'combined recap' test — this pattern is unique to this diff.

## Done criteria

- The issue described above no longer reproduces at `src/components/resume-footer-link/resume-footer-link.test.tsx:116`.
- The project's build and test suite pass.
- No file outside the scope of this fix (and its direct tests) was modified.

## STOP conditions

- The "Current state" excerpt no longer matches the live code.
- A correct fix requires editing files unrelated to this finding.
- The fix requires a design decision this plan does not spell out.
