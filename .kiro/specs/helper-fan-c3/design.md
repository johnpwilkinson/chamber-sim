# Design: helper-fan-c3

Six standalone modules under `src/util/` — `slug.mjs`, `clamp.mjs`, `chunk.mjs`,
`dedent.mjs`, `range.mjs`, `uniq.mjs` — each exporting one named pure function
with no imports between them, and one test file per module under `test/`. The
six leaf file sets are disjoint by construction, so no two sub-tasks touch a
shared file and the section's leaves are independent.

## Boundary Commitments
| Commitment | Meaning |
|---|---|
| util purity | `src/util` MUST NOT import `src/components` |
