# Wave 3 DAG — Implementation Plan

## Tasks

- [ ] 1. Lane id foundation
- [ ] 1.1 Add `src/components/wave3-dag/laneId.ts`: a module with no import statements exporting exactly one named export `export function laneId(feature: string, taskId: string): string` and no default export [req:1.1] — return the literal string `unknown` when `feature.trim()` is empty [req:1.2], return `unknown` when `taskId.trim()` is empty [req:1.3], otherwise return the template string `` `lane/${feature.trim()}/${taskId.trim()}` `` [req:1.4]; hold no module-level mutable state and read no clock, random source, DOM, or network [req:1.5]. Add `src/components/wave3-dag/laneId.test.ts` with plain vitest tests (no DOM, no testing-library) asserting `laneId('wave3-dag', '1.1')` is `lane/wave3-dag/1.1` [req:5.1]; `laneId('  wave3-dag  ', ' 1.1 ')` is `lane/wave3-dag/1.1` [req:5.2]; and each of `laneId('', '1.1')`, `laneId('   ', '1.1')`, `laneId('wave3-dag', '')`, `laneId('wave3-dag', '   ')` is `unknown` [req:5.3]. Modify no file outside `src/components/wave3-dag/` — in particular do NOT edit `src/App.tsx`. Add no npm dependency and edit no config file [req:4.3]. The repository gate for this task is `npm run build` plus `npm test`: both must exit zero [req:4.1, 4.2].
  _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 4.1, 4.2, 4.3, 5.1, 5.2, 5.3_
  _Boundary: src/components/wave3-dag_

- [ ] 2. Two independent siblings
- [ ] 2.1 (P) Add `src/components/wave3-dag-a/laneTagA.ts`: a module exporting exactly one named export `export function laneTagA(taskId: string): string` and no default export [req:2.1], returning `` `A:${laneId('wave3-dag', taskId)}` `` with `laneId` imported from `../wave3-dag/laneId` — never reimplemented, never inlined [req:2.2]. Import nothing from `src/components/wave3-dag-b/` [req:2.3]. Add `src/components/wave3-dag-a/laneTagA.test.ts` with plain vitest tests (no DOM) asserting `laneTagA('2.1')` is `A:lane/wave3-dag/2.1` and `laneTagA('')` is `A:unknown` [req:5.4]. Modify no file outside `src/components/wave3-dag-a/`: do NOT edit `src/App.tsx`, do NOT edit anything under `src/components/wave3-dag/`, and do NOT create or edit anything under `src/components/wave3-dag-b/` — a sibling task owns that directory and is running at the same time as you. Add no npm dependency and edit no config file [req:4.3]. Verify with `npm run build` and `npm test`, both of which must exit zero [req:4.1, 4.2].
  _Requirements: 2.1, 2.2, 2.3, 4.1, 4.2, 4.3, 5.4_
  _Boundary: src/components/wave3-dag-a_
  _Depends: 1.1_

- [ ] 2.2 (P) Add `src/components/wave3-dag-b/laneTagB.ts`: a module exporting exactly one named export `export function laneTagB(taskId: string): string` and no default export [req:3.1], returning `` `B:${laneId('wave3-dag', taskId)}` `` with `laneId` imported from `../wave3-dag/laneId` — never reimplemented, never inlined [req:3.2]. Import nothing from `src/components/wave3-dag-a/` [req:3.3]. Add `src/components/wave3-dag-b/laneTagB.test.ts` with plain vitest tests (no DOM) asserting `laneTagB('2.2')` is `B:lane/wave3-dag/2.2` and `laneTagB('')` is `B:unknown` [req:5.5]. Modify no file outside `src/components/wave3-dag-b/`: do NOT edit `src/App.tsx`, do NOT edit anything under `src/components/wave3-dag/`, and do NOT create or edit anything under `src/components/wave3-dag-a/` — a sibling task owns that directory and is running at the same time as you. Add no npm dependency and edit no config file [req:4.3]. Verify with `npm run build` and `npm test`, both of which must exit zero [req:4.1, 4.2].
  _Requirements: 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 5.5_
  _Boundary: src/components/wave3-dag-b_
  _Depends: 1.1_
