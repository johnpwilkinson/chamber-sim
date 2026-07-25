# Wave 2 Shakeout — Design

## Overview

Two small surfaces under `src/components/wave2-shakeout/`, mounted once in `src/App.tsx`.
Nothing here is interesting as product code; the point is that a real engine run
exercises the Wave 2 seams against real artifacts.

## Architecture

- `formatLane.ts` — pure string formatter, no imports, no state.
- `wave2-shakeout.tsx` — prop-less marker component consuming `formatLane`.
- `laneCount.ts` — pure array counter, no imports, no state (task 1.2).
- `src/App.tsx` — one import line and one mount, alphabetical block preserved.

## The seeded gate red

`src/App.tsx` ships with a `debugger` statement. The repository gate is
`npm run verify` = `oxlint && tsc -b && vite build`, and oxlint rejects `no-debugger`
at error level, so the gate is RED until it is removed. `tsc` and `vitest` are both
blind to the statement, so a child that verifies with a type-check and a test run alone
will report green against a tree the gate will reject. Task 1.1 owns `src/App.tsx`, so
removing the statement is inside its boundary and is not a scope widening.

## Testing strategy

vitest for the pure modules; vitest + jsdom + testing-library for the component,
mirroring the existing `drill-wave-c-twins` test style. No new npm dependency, no config
file edits.
