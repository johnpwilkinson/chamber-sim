# Usage Meter Marker — Requirements

## Requirement 1: Meter Formatting Utility

**User Story:** As the operator, I want one pure helper that turns a
used/total pair into the meter's display string, so that every surface that
ever shows a usage meter formats it identically and the rounding rule lives
in exactly one testable place.

Acceptance Criteria:
- 1.1 WHEN `formatMeter` is called THE SYSTEM SHALL expose it from
  `src/components/w1-meter/formatMeter.ts` as a single named export with the
  signature `formatMeter(used: number, total: number): string`, with no
  default export and no other exports from that module.
- 1.2 WHEN `formatMeter` is called with a `total` that is not a finite number
  (`NaN`, `Infinity`, `-Infinity`) or that is less than or equal to `0` THE
  SYSTEM SHALL return the exact string `n/a`.
- 1.3 WHEN `formatMeter` is called with a `used` that is not a finite number
  (`NaN`, `Infinity`, `-Infinity`) or that is less than `0` THE SYSTEM SHALL
  return the exact string `n/a`.
- 1.4 WHEN both arguments are valid per 1.2 and 1.3 THE SYSTEM SHALL clamp
  the numerator to at most `total`, using `Math.min(used, total)`.
- 1.5 WHEN both arguments are valid per 1.2 and 1.3 THE SYSTEM SHALL compute
  the percentage as `Math.round((clamped / total) * 100)`, where `clamped` is
  the value from 1.4.
- 1.6 WHEN both arguments are valid per 1.2 and 1.3 THE SYSTEM SHALL return
  the string `` `${clamped}/${total} (${percentage}%)` `` — ASCII only, a
  single `/` between the numbers, a single space before the parenthesis, and
  a literal `%` before the closing parenthesis.
- 1.7 WHEN `formatMeter` is called twice with the same arguments THE SYSTEM
  SHALL return identical strings, holding no module-level mutable state and
  reading no clock, no random source, no DOM, and no network.
- 1.8 WHEN `src/components/w1-meter/formatMeter.ts` is authored THE SYSTEM
  SHALL import nothing — the module has no import statements.

## Requirement 2: Meter Marker Component

**User Story:** As the operator, I want the formatted meter string rendered
by a dedicated hidden marker component, so that the helper has a real
consumer in the app tree without adding visible chrome.

Acceptance Criteria:
- 2.1 WHEN the `W1Meter` component renders THE SYSTEM SHALL render a single
  `<span>` whose entire text content is the value returned by
  `formatMeter(3, 8)` — the exact string `3/8 (38%)`.
- 2.2 WHEN the `W1Meter` component renders THE SYSTEM SHALL set
  `data-meter="w1"` and the class `hidden` on that `<span>`.
- 2.3 WHEN the `W1Meter` component is defined THE SYSTEM SHALL accept no
  props, hold no internal state, attach no event handlers, and contain no
  interactive elements.
- 2.4 WHEN the `W1Meter` component is authored THE SYSTEM SHALL obtain its
  string only by calling `formatMeter` imported from `./formatMeter`, and
  SHALL NOT inline, duplicate, or recompute the format itself.

## Requirement 3: App Integration

**User Story:** As the operator, I want the marker mounted once in the app
root, so that the feature has a real shared-file integration touch without
disturbing anything else.

Acceptance Criteria:
- 3.1 WHEN the app root (`src/App.tsx`) renders THE SYSTEM SHALL mount
  `<W1Meter />` exactly once, immediately after the existing
  `<DrillWaveCTwins />` mount.
- 3.2 WHEN `src/App.tsx` is edited for Requirement 3 THE SYSTEM SHALL leave
  every other line unchanged — existing imports, the other component mounts,
  and all page markup stay byte-identical apart from the one added import
  line and the one added mount line.

## Requirement 4: Test Coverage

**User Story:** As the operator, I want unit tests proving both the helper's
rules and the marker's rendering, so that the mechanical test gate exercises
a real red/green surface.

Acceptance Criteria:
- 4.1 WHEN the test suite runs THE SYSTEM SHALL include, in
  `src/components/w1-meter/formatMeter.test.ts`, assertions that
  `formatMeter(0, 8)` is `0/8 (0%)`, `formatMeter(3, 8)` is `3/8 (38%)`,
  `formatMeter(1, 3)` is `1/3 (33%)`, `formatMeter(2, 3)` is `2/3 (67%)`,
  and `formatMeter(8, 8)` is `8/8 (100%)`.
- 4.2 WHEN the test suite runs THE SYSTEM SHALL include an assertion that
  `formatMeter(12, 8)` is `8/8 (100%)`, proving the clamp in 1.4.
- 4.3 WHEN the test suite runs THE SYSTEM SHALL include assertions that each
  of `formatMeter(1, 0)`, `formatMeter(1, -5)`, `formatMeter(-1, 8)`,
  `formatMeter(Number.NaN, 8)`, `formatMeter(1, Number.NaN)`,
  `formatMeter(1, Number.POSITIVE_INFINITY)`, and
  `formatMeter(Number.POSITIVE_INFINITY, 8)` is `n/a`.
- 4.4 WHEN the test suite runs THE SYSTEM SHALL include an assertion that
  two successive calls to `formatMeter(3, 8)` return equal strings.
- 4.5 WHEN the test suite runs THE SYSTEM SHALL include, in
  `src/components/w1-meter/w1-meter.test.tsx`, a test asserting the rendered
  text content of `<W1Meter />` equals exactly `3/8 (38%)`.
- 4.6 WHEN the test suite runs THE SYSTEM SHALL include a test asserting the
  rendered `<span>` carries `data-meter="w1"` and the class `hidden`.
- 4.7 WHEN the test suite runs THE SYSTEM SHALL include a test asserting the
  rendered output of `<W1Meter />` contains no `<a>` element, no `<button>`
  element, and no `onclick` attribute.
- 4.8 WHEN the test suite runs THE SYSTEM SHALL include a test that renders
  `<App />` and asserts `[data-meter="w1"]` appears exactly once, proving
  the mount in 3.1.

## Requirement 5: Retirement of the Wave-B Resume Marker

**User Story:** As the operator, I want the leftover `drill-wave-b-resume`
marker removed from the tree, so that the app root stops mounting a marker
no current feature owns.

Acceptance Criteria:
- 5.1 WHEN Requirement 5 is complete THE SYSTEM SHALL contain no
  `src/components/drill-wave-b-resume/` directory — both
  `drill-wave-b-resume.tsx` and `drill-wave-b-resume.test.tsx` are deleted,
  and the now-empty directory is gone.
- 5.2 WHEN Requirement 5 is complete THE SYSTEM SHALL contain no import of
  `./components/drill-wave-b-resume/drill-wave-b-resume` and no
  `<DrillWaveBResume />` mount in `src/App.tsx`.
- 5.3 WHEN `src/App.tsx` is edited for Requirement 5 THE SYSTEM SHALL remove
  exactly two lines — the `DrillWaveBResume` import line and the
  `<DrillWaveBResume />` mount line — and leave every other line
  byte-identical, including the `<DrillSeedMarker />`, `<DrillWaveCTwins />`,
  and `<W1Meter />` mounts, which stay in that relative order.
- 5.4 WHEN Requirement 5 is complete THE SYSTEM SHALL contain no remaining
  reference to the identifier `DrillWaveBResume` anywhere under `src/`.
- 5.5 WHEN Requirement 5 is complete THE SYSTEM SHALL pass `npm run build`
  and `npm test` with no failing test and no TypeScript error.
