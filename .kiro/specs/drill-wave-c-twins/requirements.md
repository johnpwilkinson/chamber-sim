# Drill Wave-C Twins — Requirements

## Requirement 1: Static Marker Rendering

**User Story:** As the operator, I want a tiny static hidden marker rendered by a dedicated component, so that the Wave C twin-kill rewiring has a minimal real artifact to build, test, and merge while the drill halt lever proves the rewired tree end to end.

Acceptance Criteria:
- 1.1 WHEN the `DrillWaveCTwins` component renders THE SYSTEM SHALL render a single `<span>` whose exact text content is `wave-c-twins`.
- 1.2 WHEN the `DrillWaveCTwins` component renders THE SYSTEM SHALL set `data-drill="wave-c-twins"` and the class `hidden` on that `<span>`.
- 1.3 WHEN the `DrillWaveCTwins` component is defined THE SYSTEM SHALL accept no props, hold no internal state, attach no event handlers, and contain no interactive elements.
- 1.4 WHEN the `DrillWaveCTwins` component is authored THE SYSTEM SHALL NOT import anything beyond what the JSX itself requires.

## Requirement 2: App Integration

**User Story:** As the operator, I want the marker mounted once in the app root, so that the drill exercises a real shared-file integration touch without disturbing anything else.

Acceptance Criteria:
- 2.1 WHEN the app root (`src/App.tsx`) renders THE SYSTEM SHALL mount `<DrillWaveCTwins />` exactly once, immediately after the existing `<DrillWaveBResume />`.
- 2.2 WHEN `src/App.tsx` is edited for this feature THE SYSTEM SHALL leave every other line unchanged — existing imports, the other component mounts, and all page markup stay byte-identical apart from the one import line and one mount line.

## Requirement 3: Test Coverage

**User Story:** As the operator, I want unit tests proving the marker's behavior, so that the pipeline's mechanical test gate exercises a real red/green surface during the drill run.

Acceptance Criteria:
- 3.1 WHEN the test suite runs THE SYSTEM SHALL include a test asserting the rendered text content equals exactly `wave-c-twins`.
- 3.2 WHEN the test suite runs THE SYSTEM SHALL include a test asserting the rendered `<span>` carries `data-drill="wave-c-twins"` and the class `hidden`.
- 3.3 WHEN the test suite runs THE SYSTEM SHALL include a test asserting the rendered output contains no interactive elements (`a`, `button`) and no `onclick` attribute.
