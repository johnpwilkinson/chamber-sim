# Requirements: helper-fan-c1

Six standalone pure utilities, one per requirement. Each requirement carries one
acceptance criterion, and the criterion names the evidence tag a test must carry
so the finalize-section gate can credit it.

## 1. slugify
- 1.1 `slugify(s)` from `src/util/slug.mjs` SHALL return `s` lowercased and trimmed, with every run of non-alphanumeric characters replaced by a single `-`; a test tagged `[req:1.1]` proves it.

## 2. clamp
- 2.1 `clamp(n, lo, hi)` from `src/util/clamp.mjs` SHALL return `n` bounded into the inclusive range `[lo, hi]`; a test tagged `[req:2.1]` proves it.

## 3. chunk
- 3.1 `chunk(arr, size)` from `src/util/chunk.mjs` SHALL return `arr` split into consecutive groups of `size`, the last group short when `arr.length` is not a multiple of `size`; a test tagged `[req:3.1]` proves it.

## 4. dedent
- 4.1 `dedent(s)` from `src/util/dedent.mjs` SHALL return `s` with the common leading whitespace of all non-empty lines removed; a test tagged `[req:4.1]` proves it.

## 5. range
- 5.1 `range(a, b, step=1)` from `src/util/range.mjs` SHALL return the numeric sequence from `a` inclusive to `b` exclusive advancing by `step`; a test tagged `[req:5.1]` proves it.

## 6. uniq
- 6.1 `uniq(arr)` from `src/util/uniq.mjs` SHALL return `arr` with duplicates removed, preserving first-occurrence order; a test tagged `[req:6.1]` proves it.
