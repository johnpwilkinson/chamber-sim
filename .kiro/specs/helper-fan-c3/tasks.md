# Tasks: helper-fan-c3

- [ ] 1. Build the six utilities (root)
- [ ] 1.1 Implement src/util/slug.mjs: slugify(s) lowercases, trims, maps runs of non-alphanumerics to single '-'; test in test/slug.test.mjs
  _Requirements: 1.1_
  _Boundary: src/util/slug.mjs, test/slug.test.mjs_
- [ ] 1.2 Implement src/util/clamp.mjs: clamp(n, lo, hi) bounds n into [lo, hi]; test in test/clamp.test.mjs
  _Requirements: 2.1_
  _Boundary: src/util/clamp.mjs, test/clamp.test.mjs_
- [ ] 1.3 Implement src/util/chunk.mjs: chunk(arr, size) splits an array into size-length groups, last group short; test in test/chunk.test.mjs
  _Requirements: 3.1_
  _Boundary: src/util/chunk.mjs, test/chunk.test.mjs_
- [ ] 1.4 Implement src/util/dedent.mjs: dedent(s) strips the common leading whitespace of all non-empty lines; test in test/dedent.test.mjs
  _Requirements: 4.1_
  _Boundary: src/util/dedent.mjs, test/dedent.test.mjs_
- [ ] 1.5 Implement src/util/range.mjs: range(a, b, step=1) returns the inclusive-exclusive numeric sequence; test in test/range.test.mjs
  _Requirements: 5.1_
  _Boundary: src/util/range.mjs, test/range.test.mjs_
- [ ] 1.6 Implement src/util/uniq.mjs: uniq(arr) preserves first occurrence order; test in test/uniq.test.mjs
  _Requirements: 6.1_
  _Boundary: src/util/uniq.mjs, test/uniq.test.mjs_
