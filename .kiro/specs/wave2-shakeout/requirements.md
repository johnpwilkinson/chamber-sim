# Wave 2 Shakeout — Requirements

## Introduction

A two-task spec whose only job is to exercise the Wave 2 hardening seams on a real
engine run: structural child isolation (legs and their children run in the task's
worktree), the mechanical gate reaching the children as the authoritative check set,
parallel read-only children with distinct output paths, and a recoverable gate red
finalizing without a human gate.

The repository's gate deliberately carries a linter (`npm run verify` = `oxlint && tsc -b && vite build`)
and `src/App.tsx` deliberately contains a `debugger` statement, which oxlint rejects at
error level while `tsc` and `vitest` are both blind to it. Task 1.1 owns `src/App.tsx`,
so clearing that statement is inside its boundary.

## Requirements

### Requirement 1 — a pure formatter module

**User Story:** As a developer, I want a tiny pure helper so the shakeout has real code to verify.

#### Acceptance Criteria

1.1. `src/components/wave2-shakeout/formatLane.ts` exports exactly one named function `export function formatLane(branch: string, taskId: string): string` and no default export.
1.2. `formatLane` returns the literal string `unknown` when `branch` is an empty string after trimming.
1.3. `formatLane` returns the literal string `unknown` when `taskId` is an empty string after trimming.
1.4. Otherwise `formatLane` returns the template string `` `${branch.trim()}#${taskId.trim()}` ``.
1.5. The module holds no module-level mutable state and reads no clock, random source, DOM, or network.

### Requirement 2 — a marker component

**User Story:** As a developer, I want the helper mounted so the app build covers it.

#### Acceptance Criteria

2.1. `src/components/wave2-shakeout/wave2-shakeout.tsx` declares module-level `const LANE_BRANCH = 'lane/wave2-shakeout/1.1'` and `const LANE_TASK = '1.1'`.
2.2. It exports a prop-less, state-less `export function Wave2Shakeout()` whose entire render is `<span data-shakeout="wave2" className="hidden">{formatLane(LANE_BRANCH, LANE_TASK)}</span>`, importing `formatLane` from `./formatLane`.
2.3. It has no props, no state, no event handlers, no interactive elements, and no duplicated formatting logic.
2.4. `src/App.tsx` imports `Wave2Shakeout` in the existing alphabetical import block and mounts `<Wave2Shakeout />` exactly once immediately after the existing `<DrillWaveCTwins />` mount.

### Requirement 3 — the repository gate passes

**User Story:** As the engine, I want the declared gate green so the task can finalize.

#### Acceptance Criteria

3.1. `src/App.tsx` contains no `debugger` statement when the task completes.
3.2. `npm run verify` exits zero, which requires oxlint clean as well as a successful `tsc -b` and `vite build`.
3.3. `npm test` exits zero.

### Requirement 4 — tests

**User Story:** As a developer, I want the behaviour pinned.

#### Acceptance Criteria

4.1. `src/components/wave2-shakeout/formatLane.test.ts` asserts `formatLane('lane/x', '1.1')` is `lane/x#1.1`.
4.2. The same file asserts `formatLane('  lane/x  ', ' 1.1 ')` is `lane/x#1.1`.
4.3. The same file asserts each of `formatLane('', '1.1')`, `formatLane('   ', '1.1')`, `formatLane('lane/x', '')`, `formatLane('lane/x', '   ')` is `unknown`.
4.4. `src/components/wave2-shakeout/wave2-shakeout.test.tsx` mirrors the import style of `src/components/drill-wave-c-twins/drill-wave-c-twins.test.tsx` and asserts the rendered text content is exactly `lane/wave2-shakeout/1.1#1.1`.
4.5. The same file asserts the rendered `<span>` carries `data-shakeout="wave2"` and the class `hidden`.
4.6. The same file renders `<App />` from `../../App` and asserts `container.querySelectorAll('[data-shakeout="wave2"]')` has length 1.

### Requirement 5 — a second, dependent surface

**User Story:** As a developer, I want a second task so the run has more than one leg.

#### Acceptance Criteria

5.1. `src/components/wave2-shakeout/laneCount.ts` exports exactly one named function `export function laneCount(lanes: readonly string[]): number` returning the number of entries that are non-empty after trimming.
5.2. `src/components/wave2-shakeout/laneCount.test.ts` asserts `laneCount([])` is `0`, `laneCount(['a', '', '  ', 'b'])` is `2`, and `laneCount(['  a  '])` is `1`.
5.3. No file outside `src/components/wave2-shakeout/` is modified by this requirement.
