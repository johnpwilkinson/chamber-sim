# Plan 002: @ alias built with URL.pathname breaks on Windows

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on.
> If anything under "STOP conditions" occurs, stop and report — do not
> improvise. The dispatching driver maintains the status index in
> `plans/README.md` — do not edit it.
>
> **Drift check (run first)**: `git diff --stat 931604d..HEAD -- vite.config.ts`
> If the file changed since planning, compare "Current state" below against
> the live code before proceeding; on a mismatch treat it as a STOP condition.

## Status

- **Priority**: P2
- **Severity**: MED
- **Feature**: command-palette
- **Dimension**: correctness
- **Planned at**: commit `931604d`, 2026-07-12

## Why this matters

The `@` path alias is constructed with `new URL('./src', import.meta.url).pathname`, which yields a malformed filesystem path on Windows because `.pathname` retains a leading slash before the drive letter.

## Current state

- File: `vite.config.ts` (line 9)
- Evidence: vite.config.ts:8-10: `resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } }`. Verified via `node -e "console.log(new URL('./src', 'file:///C:/Users/dev/project/vite.config.ts').pathname)"` which prints `/C:/Users/dev/project/src` — not a valid Windows path.

## The fix

Use `fileURLToPath` for cross-platform-safe resolution: `import { fileURLToPath } from 'node:url'` then `alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }`.

## Done criteria

- The issue described above no longer reproduces at `vite.config.ts:9`.
- The project's build and test suite pass.
- No file outside the scope of this fix (and its direct tests) was modified.

## STOP conditions

- The "Current state" excerpt no longer matches the live code.
- A correct fix requires editing files unrelated to this finding.
- The fix requires a design decision this plan does not spell out.
