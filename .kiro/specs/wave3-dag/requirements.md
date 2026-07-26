# Wave 3 DAG — Requirements

## Requirement 1: Lane Id Utility (the foundation both parallel tasks consume)

**User Story:** As the operator, I want one pure helper that both parallel
tasks depend on, so that the run has a real foundation task before the
parallel wave and the engine's `_Depends:` edge is exercised rather than
asserted.

Acceptance Criteria:
- 1.1 WHEN `laneId` is called THE SYSTEM SHALL expose it from
  `src/components/wave3-dag/laneId.ts` as a single named export with the
  signature `laneId(feature: string, taskId: string): string`, with no default
  export and no other exports from that module.
- 1.2 WHEN `laneId` is called with a `feature` that is empty after `trim()`
  THE SYSTEM SHALL return the exact string `unknown`.
- 1.3 WHEN `laneId` is called with a `taskId` that is empty after `trim()`
  THE SYSTEM SHALL return the exact string `unknown`.
- 1.4 WHEN both arguments are valid per 1.2 and 1.3 THE SYSTEM SHALL return
  the string `` `lane/${feature.trim()}/${taskId.trim()}` `` — the literal
  prefix `lane/`, the trimmed feature, a single `/`, and the trimmed task id,
  with no other characters.
- 1.5 WHEN `laneId` is called twice with the same arguments THE SYSTEM SHALL
  return identical strings, holding no module-level mutable state and reading
  no clock, no random source, no DOM, and no network, and importing nothing.

## Requirement 2: Parallel Sibling A

**User Story:** As the operator, I want one of two mutually independent
sibling tasks to own its own directory, so that the engine can run it
concurrently with its sibling on an isolated lane worktree.

Acceptance Criteria:
- 2.1 WHEN `laneTagA` is called THE SYSTEM SHALL expose it from
  `src/components/wave3-dag-a/laneTagA.ts` as a single named export with the
  signature `laneTagA(taskId: string): string`, with no default export and no
  other exports from that module.
- 2.2 WHEN `laneTagA` is called THE SYSTEM SHALL return
  `` `A:${laneId('wave3-dag', taskId)}` `` , with `laneId` imported from
  `../wave3-dag/laneId` and never reimplemented or inlined.
- 2.3 WHEN `src/components/wave3-dag-a/` is authored THE SYSTEM SHALL import
  nothing from `src/components/wave3-dag-b/`.

## Requirement 3: Parallel Sibling B

**User Story:** As the operator, I want the second sibling to own a different
directory with no dependency on the first, so that two lanes can write at the
same time without touching a shared file.

Acceptance Criteria:
- 3.1 WHEN `laneTagB` is called THE SYSTEM SHALL expose it from
  `src/components/wave3-dag-b/laneTagB.ts` as a single named export with the
  signature `laneTagB(taskId: string): string`, with no default export and no
  other exports from that module.
- 3.2 WHEN `laneTagB` is called THE SYSTEM SHALL return
  `` `B:${laneId('wave3-dag', taskId)}` `` , with `laneId` imported from
  `../wave3-dag/laneId` and never reimplemented or inlined.
- 3.3 WHEN `src/components/wave3-dag-b/` is authored THE SYSTEM SHALL import
  nothing from `src/components/wave3-dag-a/`.

## Requirement 4: The Declared Gate Passes

**User Story:** As the engine, I want the repository's own declared gate green
before each task finalizes, so that a narrower self-chosen check cannot report
success against a tree the gate will reject.

Acceptance Criteria:
- 4.1 WHEN `npm run build` is executed THE SYSTEM SHALL exit zero, which
  requires a successful `tsc -b` followed by a successful `vite build`.
- 4.2 WHEN `npm test` is executed THE SYSTEM SHALL exit zero with no failing
  test.
- 4.3 WHEN any task completes THE SYSTEM SHALL have added no npm dependency
  and edited no configuration file.

## Requirement 5: Tests

**User Story:** As the operator, I want each surface pinned by DOM-free tests,
so that every task produces real acceptance evidence and the suite stays fast
enough for a short drill.

Acceptance Criteria:
- 5.1 WHEN `laneId('wave3-dag', '1.1')` is asserted THE SYSTEM SHALL return
  the exact string `lane/wave3-dag/1.1`.
- 5.2 WHEN `laneId('  wave3-dag  ', ' 1.1 ')` is asserted THE SYSTEM SHALL
  return the exact string `lane/wave3-dag/1.1`.
- 5.3 WHEN each of `laneId('', '1.1')`, `laneId('   ', '1.1')`,
  `laneId('wave3-dag', '')` and `laneId('wave3-dag', '   ')` is asserted THE
  SYSTEM SHALL return the exact string `unknown`.
- 5.4 WHEN `laneTagA('2.1')` is asserted THE SYSTEM SHALL return the exact
  string `A:lane/wave3-dag/2.1`, and `laneTagA('')` SHALL return
  `A:unknown`.
- 5.5 WHEN `laneTagB('2.2')` is asserted THE SYSTEM SHALL return the exact
  string `B:lane/wave3-dag/2.2`, and `laneTagB('')` SHALL return
  `B:unknown`.
