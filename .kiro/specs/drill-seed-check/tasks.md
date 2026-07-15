# Implementation Plan: Drill Seed Check

- [ ] 1. Component implementation and unit coverage
- [x] 1.1 Implement `DrillSeedMarker` at `src/components/drill-seed-marker/drill-seed-marker.tsx` as a static, prop-less, state-less component rendering a single `<span>` with `data-drill="seed-check"`, literal text `drill`, and `className="hidden"` (no props, no hooks, no icons, no new npm dependency). Add the unit test `src/components/drill-seed-marker/drill-seed-marker.test.tsx` asserting: the span renders with text `drill`, attribute `data-drill="seed-check"`, and class `hidden`; no icon element is present; the component accepts and uses no props; renders unconditionally. Name tests with [req:1.1].
  _Requirements: 1.1_
  _Boundary: src/components/drill-seed-marker_

- [ ] 2. App.tsx mount and integration coverage
- [x] 2.1 In `src/App.tsx`, add exactly one import of `DrillSeedMarker` and exactly one `<DrillSeedMarker />` mount alongside the existing badge mounts, changing no other markup in the file. Add the integration test `src/components/drill-seed-marker/app-integration.test.tsx` asserting that rendering `App` mounts exactly one `DrillSeedMarker` instance, matching the sibling-feature convention. Name tests with [req:2.1].
  _Requirements: 2.1_
  _Boundary: src/App.tsx, src/components/drill-seed-marker_
  _Depends: 1.1_
