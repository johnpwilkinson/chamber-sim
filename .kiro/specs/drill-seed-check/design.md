# Design: Drill Seed Check

A hidden static `<span>` marker (`data-drill="seed-check"`, text `drill`, `className="hidden"`) rendered unconditionally by `DrillSeedMarker` at `src/components/drill-seed-marker/drill-seed-marker.tsx`, mounted once in `src/App.tsx` beside the existing badge components. Unit + integration tests mirror the sibling badge conventions.

## Boundary Commitment
| boundary | dependencies |
|---|---|
| src/components/drill-seed-marker | none (no new npm deps) |
