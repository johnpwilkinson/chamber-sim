# Drill Wave-B Resume — Design

## Overview

A deliberately tiny, throwaway-grade drill feature whose only purpose is to
prove the Wave B operator-console hardening end to end on this repository:
decision minting at propose, and — the headline — the halt-kind-aware resume
policy (`drill` → immediate warm auto-resume after seed-push, no human, no
+1h timer). It renders one static, hidden marker `<span>` whose literal text
is `wave-b-resumed`, mounted once in `src/App.tsx` immediately after the
existing `<DrillSeedMarker />`. No interactivity, no state, no props, no
data fetching, no new dependencies, no configuration changes, no routing.
The `drill-` slug prefix triggers the engine's built-in one-shot halt lever
before validate; the Wave B engine must resume the run by itself,
immediately and warm, as part of the same proposal.

Styling mirrors `DrillSeedMarker` exactly: the span carries the `hidden`
class so the marker never affects visible layout, plus a `data-drill`
attribute naming this drill.

## File Structure

Legend: **Owns** = this feature is the sole, ongoing owner. **Touches** =
existing shared file, edited only to integrate, not owned.

| Path | Boundary | Purpose |
|---|---|---|
| `src/components/drill-wave-b-resume/drill-wave-b-resume.tsx` | Owns | The component: renders `<span data-drill="wave-b-resume" className="hidden">wave-b-resumed</span>`. Prop-less, state-less, static. |
| `src/components/drill-wave-b-resume/drill-wave-b-resume.test.tsx` | Owns | Unit tests for render, exact text content, the `data-drill` attribute, and the `hidden` class, using the existing vitest + jsdom + testing-library setup. |
| `src/App.tsx` | Touches | Mounts `<DrillWaveBResume />` exactly once, immediately after the existing `<DrillSeedMarker />`. One import line and one mount line; no other markup changes. |

No other files are touched. `package.json`, `vite.config.ts`,
`vitest.config.ts`, and every other feature directory under
`src/components/` are out of scope — this feature adds no dependencies and
no build-time plumbing.

## Boundary Commitments

Every row below is path-scoped so the rules deriver compiles it verbatim;
doctrine that is not path-expressible lives in Behavioral commitments.

| Commitment | Meaning |
|---|---|
| Drill independence | `src/components/drill-wave-b-resume` MUST NOT import `src/components/drill-seed-marker` — the two drill markers stay fully independent throwaways. |
| No ui primitives | `src/components/drill-wave-b-resume` MUST NOT import `src/components/ui` — plain HTML markup only, no shadcn primitives. |
| No feature coupling | `src/components/drill-wave-b-resume` MUST NOT import `src/components/command-palette` — the drill never touches real feature code. |
| Declared deps | none — uses only `react` (already a dependency); no new npm package is added. |

### Behavioral commitments

- `src/components/drill-wave-b-resume/` is exclusively this feature's:
  nothing unrelated gets added there, and this feature adds nothing outside
  it except the single sanctioned `src/App.tsx` mount line.
- `src/App.tsx` is shared project property: the touch is one import line
  and one mount line; every other line stays byte-identical.
- Throwaway grade: this is a runway drill. A future cleanup feature may
  remove it wholesale; nothing may grow to depend on it.

## Decisions

- **Hidden marker, not visible chrome:** mirrors `DrillSeedMarker` (the
  established sim drill convention) rather than adding another visible
  corner element; the drill's value is the pipeline run, not the pixel.
- **Placement after `<DrillSeedMarker />`:** keeps drill markers adjacent
  and makes the App.tsx touch a one-line append, byte-preserving everything
  else.
- **Path-scoped boundary rows:** authored in the deriver's compilable
  `MUST NOT import` shape per the five-artifact contract; the derived
  `sdd-drill-wave-b-resume-*` rules ride this spec into the repo.
