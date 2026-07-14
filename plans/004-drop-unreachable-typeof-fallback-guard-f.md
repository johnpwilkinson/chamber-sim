# Plan 004: Drop unreachable typeof/fallback guard for __APP_VERSION__

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on.
> If anything under "STOP conditions" occurs, stop and report — do not
> improvise. The dispatching driver maintains the status index in
> `plans/README.md` — do not edit it.
>
> **Drift check (run first)**: `git diff --stat 1d0cd85..HEAD -- src/components/footer-version-badge/footer-version-badge.tsx`
> If the file changed since planning, compare "Current state" below against
> the live code before proceeding; on a mismatch treat it as a STOP condition.

## Status

- **Priority**: P2
- **Severity**: MED
- **Feature**: footer-version-badge
- **Dimension**: simplify
- **Planned at**: commit `1d0cd85`, 2026-07-14

## Why this matters

The component adds a `typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'unknown'` guard that isn't in the approved design's concrete shape (design.md just uses `v{__APP_VERSION__}` directly). `src/vite-env.d.ts` declares `__APP_VERSION__: string` (non-optional), and `vite.config.ts` always injects it via `define` at build time — per design.md's own 'Build-time version only' commitment, the value is guaranteed to exist in every build. The 'unknown' fallback branch is therefore dead code in production and is never exercised by any test (every test in footer-version-badge.test.tsx stubs the global via `vi.stubGlobal('__APP_VERSION__', '1.2.3')` in `beforeEach`), so it's both unreachable per the design's own guarantees and untested.

## Current state

- File: `src/components/footer-version-badge/footer-version-badge.tsx` (line 2)
- Evidence: src/components/footer-version-badge/footer-version-badge.tsx:2 `const version = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'unknown'` vs design.md:96-108 concrete shape which uses `v{__APP_VERSION__}` with no guard, and design.md:59 'Build-time version only... injected via Vite `define` at build/config time'.

## The fix

Remove the typeof check and 'unknown' fallback; use `__APP_VERSION__` directly in the JSX as shown in design.md's Concrete Shape section, matching the approved spec exactly.

## Done criteria

- The issue described above no longer reproduces at `src/components/footer-version-badge/footer-version-badge.tsx:2`.
- The project's build and test suite pass.
- No file outside the scope of this fix (and its direct tests) was modified.

## STOP conditions

- The "Current state" excerpt no longer matches the live code.
- A correct fix requires editing files unrelated to this finding.
- The fix requires a design decision this plan does not spell out.
