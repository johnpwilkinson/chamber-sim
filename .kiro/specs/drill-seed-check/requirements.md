# Requirements: Drill Seed Check

Operational drill feature (runway-drill doctrine): a minimal, invisible marker component proving the ladder end-to-end. No user-facing behavior.

## 1. Marker component
- 1.1 A `DrillSeedMarker` component SHALL render a single `<span>` with `data-drill="seed-check"`, literal text `drill`, and `className="hidden"`; static, prop-less, state-less; no icons, no new npm dependency.

## 2. App mount
- 2.1 `src/App.tsx` SHALL mount exactly one `<DrillSeedMarker />` alongside the existing footer/header badge mounts, changing no other markup.
