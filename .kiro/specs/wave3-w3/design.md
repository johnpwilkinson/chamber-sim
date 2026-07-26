# Wave 3 Width-3 — Design

## Overview

Four tiny pure modules across four directories: one foundation and **three** mutually
independent siblings that each consume it. Nothing here is interesting as product
code. The point is the SHAPE — a foundation task followed by three `(P)` siblings with
pairwise-disjoint boundaries, so the wave scheduler forms one parallel wave of
**width 3** and the engine runs all three concurrently on isolated lane worktrees.

This is the second DAG drill. The first (`wave3-dag`, run `20260726T032106407`) proved
two legs overlap at 99.997% efficiency but could only save 14.4% of makespan, because
its two siblings were asymmetric 3.6:1 and a wave's saving is bounded by its SHORTEST
sibling. Hence the deliberate design constraint here: **the three siblings are the
same size** — one module plus one test each, the same shape, the same assertion count
— so the measured saving reflects the engine rather than the spec.

Also deliberately absent: any edit to `src/App.tsx`, any DOM test, and any seeded gate
red. A shared file would introduce merge collisions, a DOM suite would slow the gate,
and a seeded red cannot be scoped to one lane — `finalize-task` runs the whole mech
suite inside every lane, so a pre-committed broken file would RED the foundation task
too and halt the run before the parallel wave ever forms. Debug-under-concurrency is
therefore explicitly out of scope for this drill and belongs to a separate one whose
subject is halt behaviour.

## File Structure

| Path | Boundary | Purpose |
|---|---|---|
| `src/components/wave3-w3/laneKey.ts` | Owns | Pure lane-key formatter; no imports, no state. Task 1.1. |
| `src/components/wave3-w3/laneKey.test.ts` | Owns | Vitest cover for the formatter, DOM-free. Task 1.1. |
| `src/components/wave3-w3-a/tagA.ts` | Owns | Sibling A's tagger; imports the formatter, nothing else. Task 2.1. |
| `src/components/wave3-w3-a/tagA.test.ts` | Owns | Vitest cover for sibling A, DOM-free. Task 2.1. |
| `src/components/wave3-w3-b/tagB.ts` | Owns | Sibling B's tagger; imports the formatter, nothing else. Task 2.2. |
| `src/components/wave3-w3-b/tagB.test.ts` | Owns | Vitest cover for sibling B, DOM-free. Task 2.2. |
| `src/components/wave3-w3-c/tagC.ts` | Owns | Sibling C's tagger; imports the formatter, nothing else. Task 2.3. |
| `src/components/wave3-w3-c/tagC.test.ts` | Owns | Vitest cover for sibling C, DOM-free. Task 2.3. |

## Boundary Commitments

| Commitment | Detail |
|---|---|
| Sibling A isolation | `src/components/wave3-w3-a` MUST NOT import `src/components/wave3-w3-b` — the siblings are mutually independent and that independence is what makes concurrent lanes safe. |
| Sibling B isolation | `src/components/wave3-w3-b` MUST NOT import `src/components/wave3-w3-c` — the same commitment around the ring, so no sibling can quietly become another's dependency. |
| Sibling C isolation | `src/components/wave3-w3-c` MUST NOT import `src/components/wave3-w3-a` — closing the ring; with all three rules in force no sibling pair can couple. |
| Foundation purity | `src/components/wave3-w3` MUST NOT import `src/components/wave3-w3-a` — the foundation is a leaf all three siblings consume, never the reverse. |
| Library isolation | `src/lib` MUST NOT import `src/components/wave3-w3` — shared library code never depends on a throwaway drill surface. |
| Declared deps | none — no new package is added by this feature. |

### Behavioral commitments (doctrine, not module boundaries)

- **The three siblings must be pairwise disjoint.** Task 2.1 owns
  `src/components/wave3-w3-a`, 2.2 owns `-b`, 2.3 owns `-c`, with no file in common and
  no import between any pair. The wave scheduler groups `(P)` siblings only when their
  declared `_Boundary:` components are disjoint, so a single shared component would
  silently drop the wave to width 2 or 1 and the drill would measure the wrong thing.
- **The siblings must stay the same size.** Equal work is a measurement requirement,
  not an aesthetic one: makespan saving is bounded by the shortest sibling.
- **Every sibling depends on 1.1.** Each imports `laneKey`, so a lane created from the
  wrong base — before the foundation merged — could not compile. This makes lane-base
  correctness a loud failure instead of a silent assumption.
- **The gate is the check set.** The repository gate is `npm run build`
  (`tsc -b && vite build`) plus `npm test`. Both must exit zero for a task to finalize.
- **Writes stay single-threaded per lane.** Each task's work lives entirely inside its
  own lane worktree; no task edits a file another task declares.
- **Throwaway grade.** All four surfaces exist to exercise the engine's scheduler;
  deleting them and this spec after the drill is sanctioned.

## Testing Strategy

Vitest for all four modules — no DOM, no jsdom, no testing-library — so the gate stays
fast and the drill's wall-clock reflects orchestration rather than test
infrastructure. Three concurrent lanes each run `tsc -b && vite build` against one
shared `node_modules` symlink, which is itself part of what this drill exercises. No
new npm dependency and no config-file edits.
