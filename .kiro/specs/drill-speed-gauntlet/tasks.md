# Implementation Plan: Speed Gauntlet Drill

- [ ] 1. Core Utilities Foundation
- [x] 1.1 (P) Add `src/lib/gauntlet/core.ts` exporting `clamp(n: number, lo: number, hi: number): number` (returns `n` bounded to `[lo, hi]`) and `formatCount(n: number, noun: string): string` (clamps negative `n` to `0` via `clamp()`, returns `"1 " + noun` for exactly `1`, and `"{n} " + noun + "s"` otherwise); no other exports.
  _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_
  _Boundary: src/lib/gauntlet/core.ts_
- [x]* 1.2 Add `src/lib/gauntlet/core.test.ts` covering: `clamp` returns `n` unchanged inside range, name this case [req:1.1]; `clamp` returns `lo` below range, name this case [req:1.2]; `clamp` returns `hi` above range, name this case [req:1.3]; `formatCount` singular at `n === 1`, name this case [req:1.4]; `formatCount` pluralized for `n === 0` and `n > 1`, name this case [req:1.5]; `formatCount` clamps a negative `n` to `0` before formatting, name this case [req:1.6].
  _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_
  _Boundary: src/lib/gauntlet/core.test.ts_
  _Depends: 1.1_

- [ ] 2. Alpha Badge (Roman Numerals)
- [ ] 2.1 (P) Add `src/lib/gauntlet/roman.ts` exporting `toRoman(n: number): string`, converting an integer `1 <= n <= 3999` to its Roman numeral string, and throwing a `RangeError` for any `n` outside that range; no clamping inside this module.
  _Requirements: 2.1, 2.2, 2.3_
  _Boundary: src/lib/gauntlet/roman.ts_
- [ ] 2.2 Add `src/components/gauntlet/alpha-badge.tsx` exporting `AlphaBadge({ count }: { count: number })`, which clamps `count` to `[1, 3999]` via `clamp()` from `src/lib/gauntlet/core.ts`, converts it via `toRoman()` from `src/lib/gauntlet/roman.ts`, and renders `"Alpha " + <roman numeral>` inside a `<span data-testid="alpha-badge">`; no local state, no side effects.
  _Requirements: 2.4, 2.5_
  _Boundary: src/components/gauntlet/alpha-badge.tsx_
  _Depends: 2.1, 1.1_
- [ ]* 2.3 Add `src/lib/gauntlet/roman.test.ts` and `src/components/gauntlet/alpha-badge.test.tsx` covering: `toRoman` converts a representative mid-range value correctly, name this case [req:2.1]; `toRoman(3999)` returns `"MMMCMXCIX"`, name this case [req:2.2]; `toRoman` throws `RangeError` for `0` and for `4000`, name this case [req:2.3]; `AlphaBadge` clamps an out-of-range `count` prop to `[1, 3999]` before rendering, name this case [req:2.4]; `AlphaBadge` renders `"Alpha "` plus the numeral inside `[data-testid="alpha-badge"]`, name this case [req:2.5].
  _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  _Boundary: src/lib/gauntlet/roman.test.ts, src/components/gauntlet/alpha-badge.test.tsx_
  _Depends: 2.1, 2.2_

- [ ] 3. Bravo Badge (Ordinals)
- [ ] 3.1 (P) Add `src/lib/gauntlet/ordinal.ts` exporting `toOrdinal(n: number): string`, converting a positive integer to its English ordinal string, applying the `1st`/`2nd`/`3rd`/`Nth` rule with the `11th`/`12th`/`13th` exception.
  _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  _Boundary: src/lib/gauntlet/ordinal.ts_
- [ ] 3.2 Add `src/components/gauntlet/bravo-badge.tsx` exporting `BravoBadge({ count }: { count: number })`, which clamps `count` to `[1, 999]` via `clamp()` from `src/lib/gauntlet/core.ts`, converts it via `toOrdinal()` from `src/lib/gauntlet/ordinal.ts`, and renders `"Bravo " + <ordinal>` inside an element with `data-testid="bravo-badge"`; no local state, no side effects.
  _Requirements: 3.6, 3.7_
  _Boundary: src/components/gauntlet/bravo-badge.tsx_
  _Depends: 3.1, 1.1_
- [ ]* 3.3 Add `src/lib/gauntlet/ordinal.test.ts` and `src/components/gauntlet/bravo-badge.test.tsx` covering: `toOrdinal` appends `"st"` for values ending in `1` excluding `11`, name this case [req:3.1]; `toOrdinal` appends `"nd"` for values ending in `2` excluding `12`, name this case [req:3.2]; `toOrdinal` appends `"rd"` for values ending in `3` excluding `13`, name this case [req:3.3]; `toOrdinal` appends `"th"` for `11`, `12`, and `13`, name this case [req:3.4]; `toOrdinal` appends `"th"` for a representative other value, name this case [req:3.5]; `BravoBadge` clamps an out-of-range `count` prop to `[1, 999]` before rendering, name this case [req:3.6]; `BravoBadge` renders `"Bravo "` plus the ordinal inside `[data-testid="bravo-badge"]`, name this case [req:3.7].
  _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_
  _Boundary: src/lib/gauntlet/ordinal.test.ts, src/components/gauntlet/bravo-badge.test.tsx_
  _Depends: 3.1, 3.2_

- [ ] 4. Charlie Badge (Duration)
- [ ] 4.1 (P) Add `src/lib/gauntlet/duration.ts` exporting `formatDuration(seconds: number): string`, clamping negative `seconds` to `0` via `clamp()` from `src/lib/gauntlet/core.ts`, then returning a zero-padded `"{h}h {mm}m {ss}s"` string (minutes and seconds zero-padded to two digits, hours unpadded).
  _Requirements: 4.1, 4.2, 4.3_
  _Boundary: src/lib/gauntlet/duration.ts_
  _Depends: 1.1_
- [ ] 4.2 Add `src/components/gauntlet/charlie-badge.tsx` exporting `CharlieBadge({ seconds }: { seconds: number })`, which renders `formatDuration(seconds)` from `src/lib/gauntlet/duration.ts` inside an element with `data-testid="charlie-badge"`; no local state, no side effects.
  _Requirements: 4.4_
  _Boundary: src/components/gauntlet/charlie-badge.tsx_
  _Depends: 4.1_
- [ ]* 4.3 Add `src/lib/gauntlet/duration.test.ts` and `src/components/gauntlet/charlie-badge.test.tsx` covering: `formatDuration` returns the correct zero-padded form for a value spanning hours, minutes, and seconds, name this case [req:4.1]; `formatDuration` returns `"0h "` prefix with zero-padded minutes/seconds for a sub-minute value, name this case [req:4.2]; `formatDuration` clamps a negative value to `"0h 00m 00s"`, name this case [req:4.3]; `CharlieBadge` renders the formatted duration inside `[data-testid="charlie-badge"]`, name this case [req:4.4].
  _Requirements: 4.1, 4.2, 4.3, 4.4_
  _Boundary: src/lib/gauntlet/duration.test.ts, src/components/gauntlet/charlie-badge.test.tsx_
  _Depends: 4.1, 4.2_

- [ ] 5. Delta Badge (Initials)
- [x] 5.1 (P) Add `src/lib/gauntlet/initials.ts` exporting `initials(name: string): string`, returning the uppercase first letters of the first and last whitespace-separated word (middle words ignored), the uppercase first letter alone for a single-word name, and `''` for an empty or whitespace-only string.
  _Requirements: 5.1, 5.2, 5.3, 5.4_
  _Boundary: src/lib/gauntlet/initials.ts_
- [x] 5.2 Add `src/components/gauntlet/delta-badge.tsx` exporting `DeltaBadge({ name, memberCount }: { name: string; memberCount: number })`, which renders `"Delta " + initials(name)` from `src/lib/gauntlet/initials.ts` followed by `" (" + formatCount(memberCount, 'member') + ")"` using `formatCount()` from `src/lib/gauntlet/core.ts`, inside an element with `data-testid="delta-badge"`; no local state, no side effects.
  _Requirements: 5.5_
  _Boundary: src/components/gauntlet/delta-badge.tsx_
  _Depends: 5.1, 1.1_
- [x]* 5.3 Add `src/lib/gauntlet/initials.test.ts` and `src/components/gauntlet/delta-badge.test.tsx` covering: `initials` returns concatenated uppercase first+last letters for a two-word name, name this case [req:5.1]; `initials` returns a single uppercase letter for a single-word name, name this case [req:5.2]; `initials` returns `''` for an empty and a whitespace-only string, name this case [req:5.3]; `initials` uses only the first and last word for a name with more than two words, name this case [req:5.4]; `DeltaBadge` renders `"Delta "`, the initials, and the parenthesized `formatCount` member text inside `[data-testid="delta-badge"]`, name this case [req:5.5].
  _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  _Boundary: src/lib/gauntlet/initials.test.ts, src/components/gauntlet/delta-badge.test.tsx_
  _Depends: 5.1, 5.2_

- [ ] 6. Gauntlet Panel Integration
- [ ] 6.1 Add `src/components/gauntlet/gauntlet-panel.tsx` exporting `GauntletPanel()`, which renders `AlphaBadge`, `BravoBadge`, `CharlieBadge`, and `DeltaBadge` (each imported from its own component file, each supplied fixed demo props) inside a `<section data-testid="gauntlet-panel">`; no state, no props of its own.
  _Requirements: 6.1, 6.3_
  _Boundary: src/components/gauntlet/gauntlet-panel.tsx_
  _Depends: 2.2, 3.2, 4.2, 5.2_
- [ ] 6.2 Edit `src/App.tsx` to render `<GauntletPanel />` exactly once, unconditionally, importing it from `src/components/gauntlet/gauntlet-panel.tsx`, leaving all other existing markup unchanged.
  _Requirements: 6.2, 6.4_
  _Boundary: src/App.tsx_
  _Depends: 6.1_
- [ ]* 6.3 Add `src/components/gauntlet/gauntlet-panel.test.tsx` and `src/App.test.tsx` covering: `GauntletPanel` renders all four badges' `data-testid`s (`alpha-badge`, `bravo-badge`, `charlie-badge`, `delta-badge`) as descendants of `[data-testid="gauntlet-panel"]`, name this case [req:6.1] [req:6.3]; `App` renders `GauntletPanel` exactly once, unconditionally, name this case [req:6.2] [req:6.4].
  _Requirements: 6.1, 6.2, 6.3, 6.4_
  _Boundary: src/components/gauntlet/gauntlet-panel.test.tsx, src/App.test.tsx_
  _Depends: 6.1, 6.2_
