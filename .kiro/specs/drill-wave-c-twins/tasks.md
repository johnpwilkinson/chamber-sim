# Drill Wave-C Twins — Implementation Plan

## Tasks

- [ ] 1. Drill marker component
- [x] 1.1 Implement `DrillWaveCTwins` in `src/components/drill-wave-c-twins/drill-wave-c-twins.tsx`: a prop-less, state-less function component (no imports beyond what the JSX requires) whose entire render is `<span data-drill="wave-c-twins" className="hidden">wave-c-twins</span>` — exact text `wave-c-twins`, no interactive elements, no event handlers, no additional markup.
  _Requirements: 1.1, 1.2, 1.3, 1.4_
  _Boundary: src/components/drill-wave-c-twins_
- [ ] 1.2 Author `src/components/drill-wave-c-twins/drill-wave-c-twins.test.tsx` using the existing vitest + jsdom + testing-library setup (mirror `src/components/drill-wave-b-resume/drill-wave-b-resume.test.tsx`'s import style) covering: rendered text content equals exactly `wave-c-twins` [req:3.1]; the rendered `<span>` carries `data-drill="wave-c-twins"` and the class `hidden` [req:3.2]; the rendered output contains no `<a>` or `<button>` elements and no `onclick` attribute [req:3.3]. All tests pass against the component from 1.1 via `npx vitest run`.
  _Requirements: 3.1, 3.2, 3.3_
  _Boundary: src/components/drill-wave-c-twins_
  _Depends: 1.1_

- [ ] 2. App root mount
- [ ] 2.1 Edit `src/App.tsx` to import `DrillWaveCTwins` from `./components/drill-wave-c-twins/drill-wave-c-twins` and mount `<DrillWaveCTwins />` exactly once, immediately after the existing `<DrillWaveBResume />`. Every other line of the file — existing imports, the other component mounts, and all page markup — stays byte-identical. Verify `npm run build` passes.
  _Requirements: 2.1, 2.2_
  _Boundary: src/App.tsx_
  _Depends: 1.1_
