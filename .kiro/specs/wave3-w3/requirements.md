# Wave 3 Width-3 — Requirements

## Requirement 1: Lane Key Utility (the foundation all three siblings consume)

**User Story:** As the operator, I want one pure helper that all three parallel tasks
import, so that the run has a real foundation before the parallel wave and every
sibling's lane provably carries the foundation's merged work.

Acceptance Criteria:
- 1.1 WHEN `laneKey` is called THE SYSTEM SHALL expose it from
  `src/components/wave3-w3/laneKey.ts` as a single named export with the signature
  `laneKey(feature: string, taskId: string): string`, with no default export and no
  other exports from that module.
- 1.2 WHEN `laneKey` is called with a `feature` that is empty after `trim()` THE
  SYSTEM SHALL return the exact string `unknown`.
- 1.3 WHEN `laneKey` is called with a `taskId` that is empty after `trim()` THE
  SYSTEM SHALL return the exact string `unknown`.
- 1.4 WHEN both arguments are valid per 1.2 and 1.3 THE SYSTEM SHALL return the
  string `` `${feature.trim()}/${taskId.trim()}` `` — the trimmed feature, a single
  `/`, and the trimmed task id, with no other characters.
- 1.5 WHEN `laneKey` is called twice with the same arguments THE SYSTEM SHALL return
  identical strings, holding no module-level mutable state and reading no clock, no
  random source, no DOM, and no network, and importing nothing.

## Requirement 2: Parallel Sibling A

**User Story:** As the operator, I want the first of three mutually independent
siblings to own its own directory, so that the engine can run it concurrently with
both others on an isolated lane worktree.

Acceptance Criteria:
- 2.1 WHEN `tagA` is called THE SYSTEM SHALL expose it from
  `src/components/wave3-w3-a/tagA.ts` as a single named export with the signature
  `tagA(taskId: string): string`, with no default export and no other exports.
- 2.2 WHEN `tagA` is called THE SYSTEM SHALL return
  `` `A:${laneKey('wave3-w3', taskId)}` `` , with `laneKey` imported from
  `../wave3-w3/laneKey` and never reimplemented or inlined.
- 2.3 WHEN `src/components/wave3-w3-a/` is authored THE SYSTEM SHALL import nothing
  from `src/components/wave3-w3-b/` and nothing from `src/components/wave3-w3-c/`.

## Requirement 3: Parallel Sibling B

**User Story:** As the operator, I want the second sibling to own a different
directory with no dependency on its peers, so that three lanes can write at the same
time without touching a shared file.

Acceptance Criteria:
- 3.1 WHEN `tagB` is called THE SYSTEM SHALL expose it from
  `src/components/wave3-w3-b/tagB.ts` as a single named export with the signature
  `tagB(taskId: string): string`, with no default export and no other exports.
- 3.2 WHEN `tagB` is called THE SYSTEM SHALL return
  `` `B:${laneKey('wave3-w3', taskId)}` `` , with `laneKey` imported from
  `../wave3-w3/laneKey` and never reimplemented or inlined.
- 3.3 WHEN `src/components/wave3-w3-b/` is authored THE SYSTEM SHALL import nothing
  from `src/components/wave3-w3-a/` and nothing from `src/components/wave3-w3-c/`.

## Requirement 4: Parallel Sibling C

**User Story:** As the operator, I want a third sibling of the same size as the other
two, so that the wave runs at width three and the makespan saving reflects a balanced
parallel wave rather than one dominant task.

Acceptance Criteria:
- 4.1 WHEN `tagC` is called THE SYSTEM SHALL expose it from
  `src/components/wave3-w3-c/tagC.ts` as a single named export with the signature
  `tagC(taskId: string): string`, with no default export and no other exports.
- 4.2 WHEN `tagC` is called THE SYSTEM SHALL return
  `` `C:${laneKey('wave3-w3', taskId)}` `` , with `laneKey` imported from
  `../wave3-w3/laneKey` and never reimplemented or inlined.
- 4.3 WHEN `src/components/wave3-w3-c/` is authored THE SYSTEM SHALL import nothing
  from `src/components/wave3-w3-a/` and nothing from `src/components/wave3-w3-b/`.

## Requirement 5: The Declared Gate Passes

**User Story:** As the engine, I want the repository's own declared gate green before
each task finalizes, so that a narrower self-chosen check cannot report success
against a tree the gate will reject.

Acceptance Criteria:
- 5.1 WHEN `npm run build` is executed THE SYSTEM SHALL exit zero, which requires a
  successful `tsc -b` followed by a successful `vite build`.
- 5.2 WHEN `npm test` is executed THE SYSTEM SHALL exit zero with no failing test.
- 5.3 WHEN any task completes THE SYSTEM SHALL have added no npm dependency and
  edited no configuration file.

## Requirement 6: Tests

**User Story:** As the operator, I want each surface pinned by DOM-free tests of
equal size, so that every task produces real acceptance evidence and the three
siblings stay balanced.

Acceptance Criteria:
- 6.1 WHEN `laneKey('wave3-w3', '1.1')` is asserted THE SYSTEM SHALL return the exact
  string `wave3-w3/1.1`.
- 6.2 WHEN `laneKey('  wave3-w3  ', ' 1.1 ')` is asserted THE SYSTEM SHALL return the
  exact string `wave3-w3/1.1`.
- 6.3 WHEN each of `laneKey('', '1.1')`, `laneKey('   ', '1.1')`,
  `laneKey('wave3-w3', '')` and `laneKey('wave3-w3', '   ')` is asserted THE SYSTEM
  SHALL return the exact string `unknown`.
- 6.4 WHEN `tagA('2.1')` is asserted THE SYSTEM SHALL return the exact string
  `A:wave3-w3/2.1`, and `tagA('')` SHALL return `A:unknown`.
- 6.5 WHEN `tagB('2.2')` is asserted THE SYSTEM SHALL return the exact string
  `B:wave3-w3/2.2`, and `tagB('')` SHALL return `B:unknown`.
- 6.6 WHEN `tagC('2.3')` is asserted THE SYSTEM SHALL return the exact string
  `C:wave3-w3/2.3`, and `tagC('')` SHALL return `C:unknown`.
