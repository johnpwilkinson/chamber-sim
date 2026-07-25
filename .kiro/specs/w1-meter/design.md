# Usage Meter Marker — Design

## Overview

A small usage-meter surface plus a housekeeping removal.

The meter is a two-part feature: one pure formatting module and one hidden
marker component that consumes it. `formatMeter(used, total)` is the single
source of truth for how a used/total pair is rendered — clamp the numerator
to the total, round the percentage with `Math.round`, and emit
`"<clamped>/<total> (<pct>%)"`; return the literal `n/a` when either input
is not a usable finite number. The rule set is deliberately narrow and fully
enumerated in the requirements so the module is exhaustively unit-testable
without any fixture or mock.

`W1Meter` is the first consumer: a prop-less, state-less component rendering
one hidden `<span data-meter="w1" className="hidden">` whose text is
`formatMeter(3, 8)` — the string `3/8 (38%)`. The two numbers are
module-level constants standing in for real usage data, following the
precedent already set by `command-palette`'s `commands.ts`, which shipped
with empty arrays until real content existed. Wiring a live source is
follow-on work and out of scope here; nothing in this feature reads state,
props, storage, or the network.

Styling mirrors the existing hidden markers (`DrillSeedMarker`,
`DrillWaveCTwins`) exactly: the `hidden` class keeps the marker out of
visible layout, and a single `data-` attribute names it. No visible chrome,
no positioning classes, no interactivity, no routing, no configuration
changes, no new dependencies.

The second, independent part of this feature retires
`src/components/drill-wave-b-resume/`. That marker is a leftover from an
earlier exercise; no current feature owns it, nothing imports it, and the
app root still mounts it. Both of its files are deleted and its two lines in
`src/App.tsx` — the import and the `<DrillWaveBResume />` mount — are
removed. Everything else in `src/App.tsx` stays byte-identical, and the
remaining marker mounts keep their existing relative order
(`<DrillSeedMarker />` → `<DrillWaveCTwins />` → `<W1Meter />`).

## File Structure

Legend: **Owns** = this feature is the sole, ongoing owner. **Touches** =
existing shared file, edited only to integrate, not owned. **Removes** =
existing file this feature deletes outright.

| Path | Boundary | Purpose |
|---|---|---|
| `src/components/w1-meter/formatMeter.ts` | Owns | The pure helper: one named export `formatMeter(used: number, total: number): string`. Clamp, round, format, or return `n/a`. No imports, no state, no side effects. |
| `src/components/w1-meter/formatMeter.test.ts` | Owns | Exhaustive unit tests for the helper: the five nominal cases, the clamp case, all seven `n/a` guard cases, and repeat-call stability. Plain vitest, no DOM needed. |
| `src/components/w1-meter/w1-meter.tsx` | Owns | The marker component: renders `<span data-meter="w1" className="hidden">{formatMeter(METER_USED, METER_TOTAL)}</span>` with `METER_USED = 3` and `METER_TOTAL = 8`. Prop-less, state-less. |
| `src/components/w1-meter/w1-meter.test.tsx` | Owns | Unit tests for exact text content, the `data-meter` attribute, the `hidden` class, the absence of interactive elements, and the single `<App />` mount. Uses the existing vitest + jsdom + testing-library setup. |
| `src/App.tsx` | Touches | Adds one import line and one `<W1Meter />` mount line immediately after `<DrillWaveCTwins />`; separately removes the `DrillWaveBResume` import line and its mount line. No other markup changes. |
| `src/components/drill-wave-b-resume/drill-wave-b-resume.tsx` | Removes | Deleted — leftover marker with no current owner. |
| `src/components/drill-wave-b-resume/drill-wave-b-resume.test.tsx` | Removes | Deleted with its component. |

No other files are touched. `package.json`, `package-lock.json`,
`vite.config.ts`, `vitest.config.ts`, `tsconfig*.json`,
`.dependency-cruiser.cjs`, `src/index.css`, `tailwind.config.ts`, the
`.kiro/specs/drill-wave-b-resume/` spec directory, the `docs/` and `plans/`
trees, and every other feature directory under `src/components/` are all out
of scope — this feature adds no dependencies and no build-time plumbing, and
the retirement is a source-tree removal only, not a config or history edit.

## Boundary Commitments

Every row below is path-scoped so the rules deriver compiles it verbatim;
doctrine that is not path-expressible lives in Behavioral commitments.

| Commitment | Meaning |
|---|---|
| Helper purity | `src/components/w1-meter/formatMeter.ts` MUST NOT import `src/` — the helper is a leaf module with no project-internal dependencies. |
| No ui primitives | `src/components/w1-meter` MUST NOT import `src/components/ui` — plain HTML markup only, no shadcn primitives. |
| No feature coupling | `src/components/w1-meter` MUST NOT import `src/components/command-palette` — the meter never reaches into real feature code. |
| No shortcut coupling | `src/components/w1-meter` MUST NOT import `src/keyboard-shortcuts` — the meter registers no shortcuts and reads no shortcut state. |
| Meter internals private | `src/components/(?!w1-meter/)` MUST NOT import `src/components/w1-meter/` — sibling feature directories do not reach into this one; the only sanctioned integration is the `src/App.tsx` mount. |
| Declared deps | none — uses only `react` (already a dependency); no new npm package is added and no manifest is edited. |

### Behavioral commitments

- `src/components/w1-meter/` is exclusively this feature's: nothing
  unrelated gets added there, and this feature adds nothing outside it
  except the single sanctioned `src/App.tsx` mount line.
- `src/App.tsx` is shared project property: this feature's touches are one
  added import line, one added mount line, and two removed
  `DrillWaveBResume` lines. Every other line stays byte-identical.
- The `3` and `8` in `w1-meter.tsx` are placeholders, not a feature: no
  live usage source, no props, no configuration knob is introduced here.
- The retirement is deletion only. No replacement marker is added for
  `drill-wave-b-resume`, and no other feature directory is touched while
  removing it.

## Decisions

- **Helper split out of the component:** the rounding and guard rules are
  the only real logic here, and they are worth testing without a renderer.
  A separate `formatMeter.ts` keeps the component a one-line render and
  makes the rule set unit-testable in isolation.
- **`n/a` rather than throwing or returning empty:** a marker must always
  render something; a sentinel string keeps callers free of try/catch and
  keeps the return type a plain `string`.
- **ASCII-only output:** `3/8 (38%)` avoids any unicode-normalization
  ambiguity between the source literal and the test assertion.
- **Hidden marker, not visible chrome:** mirrors the established marker
  convention (`DrillSeedMarker`, `DrillWaveCTwins`); the value here is the
  helper and its wiring, not a pixel.
- **Retirement bundled here, not deferred:** the removal touches the same
  `src/App.tsx` mount block this feature already edits, so doing it in one
  place avoids two conflicting edits to a shared file. It is sequenced
  after the meter work so the mount block is in its final shape first.
- **Path-scoped boundary rows:** authored in the deriver's compilable
  `MUST NOT import` shape per the five-artifact contract; the derived
  `sdd-w1-meter-*` rules ride this spec into the repo.
