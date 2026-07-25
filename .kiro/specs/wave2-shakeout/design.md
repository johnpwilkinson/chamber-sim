# Wave 2 Shakeout — Design

## Overview

Two small surfaces under `src/components/wave2-shakeout/`, one of them mounted
once in `src/App.tsx`. Nothing here is interesting as product code: the point
is that a real engine run exercises the Wave 2 hardening seams — structural
child isolation, the mechanical gate reaching the children as the authoritative
check set, parallel read-only children with distinct output paths, and a
recoverable gate red finalizing without a human gate — against real artifacts.

## File Structure

| Path | Boundary | Purpose |
|---|---|---|
| `src/components/wave2-shakeout/formatLane.ts` | Owns | Pure lane-string formatter; no imports, no state. |
| `src/components/wave2-shakeout/formatLane.test.ts` | Owns | Vitest cover for the formatter, DOM-free. |
| `src/components/wave2-shakeout/wave2-shakeout.tsx` | Owns | Prop-less hidden marker component consuming the formatter. |
| `src/components/wave2-shakeout/wave2-shakeout.test.tsx` | Owns | Vitest + jsdom cover for the marker and its single mount. |
| `src/components/wave2-shakeout/laneCount.ts` | Owns | Pure array counter (task 2.1); no imports, no state. |
| `src/components/wave2-shakeout/laneCount.test.ts` | Owns | Vitest cover for the counter, DOM-free. |
| `src/App.tsx` | Touches | One import line and one mount; the seeded `debugger` statement is removed here. |

## Boundary Commitments

| Commitment | Detail |
|---|---|
| Leaf isolation | `src/components/wave2-shakeout` MUST NOT import `src/components/command-palette` — the shakeout surface is a leaf and owns no dependency on other feature components. |
| Shortcut isolation | `src/components/wave2-shakeout` MUST NOT import `src/keyboard-shortcuts` — the marker is inert and never participates in the shortcut provider. |
| Library isolation | `src/lib` MUST NOT import `src/components/wave2-shakeout` — shared library code never depends on a throwaway shakeout surface. |
| Declared deps | none — no new package is added by this feature. |

### Behavioral commitments (doctrine, not module boundaries)

- **The gate is the check set.** The repository gate for this feature is
  `npm run verify` (`oxlint && tsc -b && vite build`) plus `npm test`. A
  type-check and a test run alone are NOT the gate: oxlint is part of it, and
  it rejects `no-debugger` at error level while `tsc` and `vitest` are both
  blind to that statement.
- **The seeded red is in scope.** `src/App.tsx` ships with a `debugger`
  statement, so the gate is RED until it is removed. `src/App.tsx` is inside
  task 1.1's declared boundary, so clearing it is the task's own work and not
  a scope widening.
- **Throwaway grade.** Both surfaces exist to exercise the engine seams;
  deleting them and this spec after the shakeout is sanctioned.

## Testing Strategy

Vitest for the two pure modules (no DOM, no testing-library). Vitest + jsdom +
testing-library for the marker component, mirroring the existing
`drill-wave-c-twins` test style with `cleanup()` in `afterEach`. No new npm
dependency and no config-file edits.
