# Wave 2 Shakeout — Requirements

## Requirement 1: Lane Formatting Utility

**User Story:** As the operator, I want one pure helper that turns a lane
branch and task id into a single display string, so that the shakeout run has
real, testable code to build and verify rather than a no-op.

Acceptance Criteria:
- 1.1 WHEN `formatLane` is called THE SYSTEM SHALL expose it from
  `src/components/wave2-shakeout/formatLane.ts` as a single named export with
  the signature `formatLane(branch: string, taskId: string): string`, with no
  default export and no other exports from that module.
- 1.2 WHEN `formatLane` is called with a `branch` that is empty after
  `trim()` THE SYSTEM SHALL return the exact string `unknown`.
- 1.3 WHEN `formatLane` is called with a `taskId` that is empty after
  `trim()` THE SYSTEM SHALL return the exact string `unknown`.
- 1.4 WHEN both arguments are valid per 1.2 and 1.3 THE SYSTEM SHALL return
  the string `` `${branch.trim()}#${taskId.trim()}` `` — a single `#`
  between the two trimmed values and no other characters.
- 1.5 WHEN `formatLane` is called twice with the same arguments THE SYSTEM
  SHALL return identical strings, holding no module-level mutable state and
  reading no clock, no random source, no DOM, and no network, and importing
  nothing.

## Requirement 2: Shakeout Marker Component

**User Story:** As the operator, I want the formatted lane string rendered by
a dedicated hidden marker component, so that the helper has a real consumer
in the app tree and the production build covers it.

Acceptance Criteria:
- 2.1 WHEN `src/components/wave2-shakeout/wave2-shakeout.tsx` is authored THE
  SYSTEM SHALL declare module-level constants `LANE_BRANCH` with the value
  `lane/wave2-shakeout/1.1` and `LANE_TASK` with the value `1.1`.
- 2.2 WHEN the `Wave2Shakeout` component renders THE SYSTEM SHALL render a
  single `<span>` carrying `data-shakeout="wave2"` and the class `hidden`,
  whose entire text content is the value returned by
  `formatLane(LANE_BRANCH, LANE_TASK)`, with `formatLane` imported from
  `./formatLane`.
- 2.3 WHEN the `Wave2Shakeout` component is authored THE SYSTEM SHALL give it
  no props, no state, no event handlers, no interactive elements, and no
  formatting logic of its own.
- 2.4 WHEN `src/App.tsx` is edited THE SYSTEM SHALL add one import of
  `Wave2Shakeout` inside the existing alphabetical import block and mount
  `<Wave2Shakeout />` exactly once, immediately after the existing
  `<DrillWaveCTwins />` mount, leaving every other line byte-identical.

## Requirement 3: The Declared Gate Passes

**User Story:** As the engine, I want the repository's own declared gate
green before a task finalizes, so that a narrower self-chosen check cannot
report success against a tree the gate will reject.

Acceptance Criteria:
- 3.1 WHEN task 1.1 completes THE SYSTEM SHALL leave no `debugger` statement
  anywhere in `src/App.tsx`.
- 3.2 WHEN `npm run verify` is executed THE SYSTEM SHALL exit zero, which
  requires oxlint to report no errors in addition to a successful `tsc -b`
  and `vite build`.
- 3.3 WHEN `npm test` is executed THE SYSTEM SHALL exit zero with no failing
  test.

## Requirement 4: Tests

**User Story:** As the operator, I want both surfaces pinned by tests, so
that the shakeout produces real acceptance evidence rather than assertions
about intent.

Acceptance Criteria:
- 4.1 WHEN `formatLane('lane/x', '1.1')` is asserted THE SYSTEM SHALL return
  the exact string `lane/x#1.1`.
- 4.2 WHEN `formatLane('  lane/x  ', ' 1.1 ')` is asserted THE SYSTEM SHALL
  return the exact string `lane/x#1.1`.
- 4.3 WHEN each of `formatLane('', '1.1')`, `formatLane('   ', '1.1')`,
  `formatLane('lane/x', '')` and `formatLane('lane/x', '   ')` is asserted
  THE SYSTEM SHALL return the exact string `unknown`.
- 4.4 WHEN the `Wave2Shakeout` component is rendered in a test THE SYSTEM
  SHALL produce text content equal to exactly
  `lane/wave2-shakeout/1.1#1.1`.
- 4.5 WHEN the rendered `Wave2Shakeout` output is inspected THE SYSTEM SHALL
  expose a `<span>` carrying `data-shakeout="wave2"` and the class `hidden`.
- 4.6 WHEN `App` is rendered in a test THE SYSTEM SHALL contain exactly one
  element matching `[data-shakeout="wave2"]`.

## Requirement 5: Lane Counter

**User Story:** As the operator, I want a second, dependent surface so the
run has more than one implementation leg to measure.

Acceptance Criteria:
- 5.1 WHEN `laneCount` is called THE SYSTEM SHALL expose it from
  `src/components/wave2-shakeout/laneCount.ts` as a single named export with
  the signature `laneCount(lanes: readonly string[]): number`, importing
  nothing, and SHALL return the number of entries that are non-empty after
  `trim()`.
- 5.2 WHEN `laneCount([])`, `laneCount(['a', '', '  ', 'b'])` and
  `laneCount(['  a  '])` are asserted THE SYSTEM SHALL return `0`, `2` and
  `1` respectively.
- 5.3 WHEN task 2.1 completes THE SYSTEM SHALL have modified no file outside
  `src/components/wave2-shakeout/`, and SHALL NOT have mounted `laneCount`
  anywhere.
