# Speed Gauntlet Drill — Design

Source: [docs/brainstorming/drill-speed-gauntlet.md](../../../docs/brainstorming/drill-speed-gauntlet.md)

## Overview

The Speed Gauntlet drill is a scheduling stress-test shaped as a small
React feature: one shared foundation module, four independent "badge"
features, and one integration section that assembles them. The topology
is deliberately binding — it exists to force maximum parallel scheduling
at **section grain**, where section B depends on section A if and only if
any leaf task in B depends on a leaf task in A.

`core.ts` (section 1) is the only shared dependency. Sections 2-5 (`alpha`,
`bravo`, `charlie`, `delta`) each own a disjoint pair of new files — one
lib helper under `src/lib/gauntlet/`, one component under
`src/components/gauntlet/` — and depend on section 1 only, never on each
other. That makes sections 2-5 mutually independent: they land at the same
topological depth and can execute as one parallel wave of four section
lanes with zero merge conflicts, because no two sections ever write the
same file. Section 6 depends on all four component leaves from sections
2-5 and assembles them into one panel, then mounts that panel in the app
shell.

Each badge pairs a pure, framework-free lib function (a formatter or
converter) with a thin, purely presentational component that clamps or
passes through its numeric prop and renders a fixed `data-testid`. No
badge component holds state, fetches data, or reads context — every
badge's entire output is a deterministic function of its props.

## File Structure

| Section | Path | Owns/Touches | Purpose |
|---|---|---|---|
| 1 | `src/lib/gauntlet/core.ts` | Owns | `clamp(n, lo, hi)` and `formatCount(n, noun)` shared by every badge feature. |
| 2 (alpha) | `src/lib/gauntlet/roman.ts` | Owns | `toRoman(n)`: converts `1-3999` to a Roman numeral string; throws `RangeError` outside that range. |
| 2 (alpha) | `src/components/gauntlet/alpha-badge.tsx` | Owns | Renders `"Alpha " + toRoman(clamp(count, 1, 3999))` in a `<span data-testid="alpha-badge">`. |
| 3 (bravo) | `src/lib/gauntlet/ordinal.ts` | Owns | `toOrdinal(n)`: converts a positive integer to its English ordinal string (`"1st"`, `"2nd"`, `"3rd"`, `"4th"`, ...), including the 11th/12th/13th exception. |
| 3 (bravo) | `src/components/gauntlet/bravo-badge.tsx` | Owns | Renders `"Bravo " + toOrdinal(clamp(count, 1, 999))` with `data-testid="bravo-badge"`. |
| 4 (charlie) | `src/lib/gauntlet/duration.ts` | Owns | `formatDuration(seconds)`: zero-padded `"{h}h {mm}m {ss}s"` string; clamps negative input to `0` internally via `clamp()` from `core.ts`. |
| 4 (charlie) | `src/components/gauntlet/charlie-badge.tsx` | Owns | Renders `formatDuration(seconds)` with `data-testid="charlie-badge"`. |
| 5 (delta) | `src/lib/gauntlet/initials.ts` | Owns | `initials(name)`: uppercase first letters of the first and last word; `''` for empty/whitespace-only input. |
| 5 (delta) | `src/components/gauntlet/delta-badge.tsx` | Owns | Renders `"Delta " + initials(name) + " (" + formatCount(memberCount, 'member') + ")"` with `data-testid="delta-badge"`. |
| 6 | `src/components/gauntlet/gauntlet-panel.tsx` | Owns | Assembles all four badges with fixed demo props inside `<section data-testid="gauntlet-panel">`. |
| 6 | `src/App.tsx` | Touches | Mounts `<GauntletPanel />` exactly once; no other changes to existing markup. |

No other files are touched. Sections 2-5 write only under their own new
lib/component file pair — zero shared files, zero merge conflicts by
construction.

## Data Flow

All five badge/panel components are **pure and props-only**:

- No component in `src/components/gauntlet/` holds local state, calls a
  hook that reads external state, or performs a side effect.
- Each badge's entire rendered output is computed synchronously from its
  props by calling its section's lib function (and, for alpha/bravo,
  `clamp()` from `core.ts` first).
- `GauntletPanel` supplies fixed, hardcoded demo props to each badge — it
  is the only place demo data is defined, and it does not read those
  values from anywhere else.
- `App.tsx` renders `GauntletPanel` unconditionally; there is no prop or
  state threaded into it from the app shell.

This mirrors the drill's dependency topology at runtime: data flows
strictly downward from section 6 → sections 2-5 → section 1, never
sideways between sections 2-5.

## Dependency Topology (binding)

```
depth 0:  [1]                          core.ts
depth 1:  [2] [3] [4] [5]              alpha | bravo | charlie | delta  (mutually independent)
depth 2:  [6]                          gauntlet-panel.tsx -> App.tsx
```

Section-level dependency is derived from leaf-level `_Depends` edges: a
leaf declares `_Depends` only on the leaves whose outputs it actually
imports. `roman.ts` and `ordinal.ts` need no clamping of their own (they
throw / accept any integer respectively), so their honest dependency is
empty; the clamp call lives in `alpha-badge.tsx` / `bravo-badge.tsx`
instead, which is what pulls sections 2 and 3 down to depth 1.
`duration.ts` owns its own clamping, so section 4's depth-1 edge is on the
lib leaf instead of the component leaf. `initials.ts` needs no numeric
clamping at all, so section 5's depth-1 edge is carried by
`delta-badge.tsx`'s use of `formatCount()` for its member-count display.
Every section 2-5 leaf still lands at depth 1 either way — only which
leaf carries the edge differs.

## Testing Strategy

Tests use Vitest + `@testing-library/react` + `jest-dom`, matching the
existing repo setup (`src/test-setup.ts`). Each lib module gets a
colocated `*.test.ts` covering its pure-function edge cases directly
(no rendering required); each component gets a colocated `*.test.tsx`
using RTL's `render` + `screen.getByTestId`.

Every acceptance criterion exercised by a test is tagged inline in the
test's `it()`/`test()` description using the `[req:N.M]` convention (e.g.
`it('throws RangeError above 3999 [req:2.3]', ...)`), so a criterion can
be traced from `requirements.md` to the exact test that proves it.
Multi-criterion cases stack tags, e.g. `[req:3.1] [req:3.2]`.

Section 6's integration tests render `GauntletPanel` standalone (asserting
all four `data-testid`s are present under `[data-testid="gauntlet-panel"]`)
and render `App` standalone (asserting `GauntletPanel` mounts exactly
once and pre-existing markup is unchanged) — no end-to-end browser
automation is in scope.

## Boundary Commitments

| Commitment | Detail |
|---|---|
| Pure helpers own no UI | `src/lib/gauntlet` MUST NOT import `src/components` — the four formatting modules and `core.ts` are pure functions with zero React or component dependencies. |
| Gauntlet isolation | `src/components/gauntlet` MUST NOT import `src/components/command-palette` — the drill feature is isolated from unrelated features; its only cross-tree imports are `src/lib/gauntlet` helpers. |
| Drill path stays clear | `src/drill` MUST NOT import `src/components/gauntlet` — the reserved drill source path owns no dependency on this feature. |
