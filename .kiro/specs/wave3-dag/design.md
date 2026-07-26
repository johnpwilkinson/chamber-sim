# Wave 3 DAG — Design

## Overview

Three tiny pure modules under `src/components/`, in three directories: one
foundation module and two mutually independent siblings that both consume it.
Nothing here is interesting as product code. The point is the SHAPE: a
foundation task followed by two `(P)` siblings whose declared boundaries are
disjoint, so the engine's wave scheduler forms one parallel wave of width 2 and
runs both tasks concurrently on isolated lane worktrees.

Deliberately absent: any edit to `src/App.tsx`, any DOM test, any seeded gate
red. This drill measures makespan and lane isolation, so every other failure
mode is removed from its path — a shared file would introduce a merge
collision, a DOM suite would slow the gate, and a seeded red would pull the
debug ladder into a run whose subject is scheduling.

## File Structure

| Path | Boundary | Purpose |
|---|---|---|
| `src/components/wave3-dag/laneId.ts` | Owns | Pure lane-id formatter; no imports, no state. Task 1.1. |
| `src/components/wave3-dag/laneId.test.ts` | Owns | Vitest cover for the formatter, DOM-free. Task 1.1. |
| `src/components/wave3-dag-a/laneTagA.ts` | Owns | Sibling A's tagger; imports the formatter, nothing else. Task 2.1. |
| `src/components/wave3-dag-a/laneTagA.test.ts` | Owns | Vitest cover for sibling A, DOM-free. Task 2.1. |
| `src/components/wave3-dag-b/laneTagB.ts` | Owns | Sibling B's tagger; imports the formatter, nothing else. Task 2.2. |
| `src/components/wave3-dag-b/laneTagB.test.ts` | Owns | Vitest cover for sibling B, DOM-free. Task 2.2. |

## Boundary Commitments

| Commitment | Detail |
|---|---|
| Sibling A isolation | `src/components/wave3-dag-a` MUST NOT import `src/components/wave3-dag-b` — the two siblings are mutually independent and that independence is what makes concurrent lanes safe. |
| Sibling B isolation | `src/components/wave3-dag-b` MUST NOT import `src/components/wave3-dag-a` — the same commitment in the other direction, so neither sibling can quietly become the other's dependency. |
| Foundation purity | `src/components/wave3-dag` MUST NOT import `src/components/wave3-dag-a` — the foundation is a leaf that both siblings consume, never the reverse. |
| Library isolation | `src/lib` MUST NOT import `src/components/wave3-dag` — shared library code never depends on a throwaway drill surface. |
| Declared deps | none — no new package is added by this feature. |

### Behavioral commitments (doctrine, not module boundaries)

- **The two siblings must be genuinely disjoint.** Task 2.1 owns
  `src/components/wave3-dag-a` and task 2.2 owns `src/components/wave3-dag-b`,
  with no file in common and no import between them. The wave scheduler groups
  `(P)` siblings only when their declared `_Boundary:` components are disjoint,
  so a shared component would silently serialise the wave and the drill would
  measure nothing.
- **The gate is the check set.** The repository gate for this feature is
  `npm run build` (`tsc -b && vite build`) plus `npm test`. Both must exit
  zero for a task to finalize.
- **Writes stay single-threaded per lane.** Each task's work lives entirely
  inside its own lane worktree; no task edits a file another task declares.
- **Throwaway grade.** All three surfaces exist to exercise the engine's
  scheduler; deleting them and this spec after the drill is sanctioned.

## Testing Strategy

Vitest for all three modules — no DOM, no jsdom, no testing-library, so the
gate stays fast and the drill's wall-clock reflects orchestration rather than
test infrastructure. No new npm dependency and no config-file edits.
