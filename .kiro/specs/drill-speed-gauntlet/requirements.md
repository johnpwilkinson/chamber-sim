# Speed Gauntlet Drill — Requirements

Source: [design.md](./design.md)

## Introduction

The Speed Gauntlet drill exercises maximum parallel scheduling at section
grain: one shared foundation module (`core.ts`), four mutually independent
badge features that each depend only on that foundation, and one
integration section that assembles all four. Each badge feature is a pure
lib helper (a small formatting/conversion function) plus a presentational
React component that renders it with a fixed `data-testid`. No feature
depends on any other feature's output; all cross-feature composition
happens only in the integration section.

### Requirement 1: Core Utilities Foundation

**User Story:** As a developer building any of the four badge features, I
want a shared `clamp` and `formatCount` helper, so that every feature
bounds its numeric input and pluralizes counts the same way without
duplicating that logic.

#### Acceptance Criteria

- 1.1 WHEN `clamp(n, lo, hi)` is called with `lo <= n <= hi` THE SYSTEM SHALL return `n` unchanged.
- 1.2 WHEN `clamp(n, lo, hi)` is called with `n < lo` THE SYSTEM SHALL return `lo`.
- 1.3 WHEN `clamp(n, lo, hi)` is called with `n > hi` THE SYSTEM SHALL return `hi`.
- 1.4 WHEN `formatCount(n, noun)` is called with `n === 1` THE SYSTEM SHALL return `"1 " + noun` with no trailing `'s'` (e.g. `formatCount(1, 'item')` returns `"1 item"`).
- 1.5 WHEN `formatCount(n, noun)` is called with `n !== 1` THE SYSTEM SHALL return the count followed by `noun` pluralized with a trailing `'s'` (e.g. `formatCount(0, 'item')` returns `"0 items"`, `formatCount(5, 'item')` returns `"5 items"`).
- 1.6 WHEN `formatCount(n, noun)` is called with a negative `n` THE SYSTEM SHALL clamp `n` to `0` before formatting (e.g. `formatCount(-3, 'item')` returns `"0 items"`).

### Requirement 2: Alpha Badge — Roman Numeral Rendering

**User Story:** As a user of the drill panel, I want an "Alpha" badge that
renders a count as a Roman numeral, so that the panel demonstrates a
throwing (non-clamping) lib function paired with component-level clamping.

#### Acceptance Criteria

- 2.1 WHEN `toRoman(n)` is called with an integer `1 <= n <= 3999` THE SYSTEM SHALL return the correct Roman numeral string (e.g. `toRoman(1994)` returns `"MCMXCIV"`).
- 2.2 WHEN `toRoman(n)` is called with `n === 3999` THE SYSTEM SHALL return `"MMMCMXCIX"` as the maximum representable value.
- 2.3 WHEN `toRoman(n)` is called with `n < 1` or `n > 3999` THE SYSTEM SHALL throw a `RangeError`.
- 2.4 WHEN `AlphaBadge` renders with a `count` prop THE SYSTEM SHALL clamp `count` to the range `[1, 3999]` via `clamp()` before passing it to `toRoman()`.
- 2.5 WHEN `AlphaBadge` renders THE SYSTEM SHALL display the text `"Alpha "` followed by the Roman numeral, inside a `<span>` element with `data-testid="alpha-badge"`.

### Requirement 3: Bravo Badge — Ordinal Rendering

**User Story:** As a user of the drill panel, I want a "Bravo" badge that
renders a count as an ordinal, so that the panel demonstrates the
11th/12th/13th English ordinal exception alongside the standard
1st/2nd/3rd/Nth rules.

#### Acceptance Criteria

- 3.1 WHEN `toOrdinal(n)` is called with `n` ending in `1` and `n` not `11` THE SYSTEM SHALL append `"st"` (e.g. `1` → `"1st"`, `21` → `"21st"`).
- 3.2 WHEN `toOrdinal(n)` is called with `n` ending in `2` and `n` not `12` THE SYSTEM SHALL append `"nd"` (e.g. `2` → `"2nd"`, `22` → `"22nd"`).
- 3.3 WHEN `toOrdinal(n)` is called with `n` ending in `3` and `n` not `13` THE SYSTEM SHALL append `"rd"` (e.g. `3` → `"3rd"`, `23` → `"23rd"`).
- 3.4 WHEN `toOrdinal(n)` is called with `n` ending in `11`, `12`, or `13` THE SYSTEM SHALL append `"th"` as the special-case exception (e.g. `11` → `"11th"`, `112` → `"112th"`, `113` → `"113th"`).
- 3.5 WHEN `toOrdinal(n)` is called with any other `n` THE SYSTEM SHALL append `"th"` (e.g. `4` → `"4th"`, `100` → `"100th"`).
- 3.6 WHEN `BravoBadge` renders with a `count` prop THE SYSTEM SHALL clamp `count` to the range `[1, 999]` via `clamp()` before passing it to `toOrdinal()`.
- 3.7 WHEN `BravoBadge` renders THE SYSTEM SHALL display the text `"Bravo "` followed by the ordinal string, inside an element with `data-testid="bravo-badge"`.

### Requirement 4: Charlie Badge — Duration Formatting

**User Story:** As a user of the drill panel, I want a "Charlie" badge
that renders a seconds count as a zero-padded `h/m/s` duration, so that
the panel demonstrates a lib function that owns its own input clamping
rather than delegating it to the caller.

#### Acceptance Criteria

- 4.1 WHEN `formatDuration(seconds)` is called THE SYSTEM SHALL return a string of the form `"{h}h {mm}m {ss}s"`, with minutes and seconds zero-padded to two digits (e.g. `formatDuration(3723)` returns `"1h 02m 03s"`).
- 4.2 WHEN `formatDuration(seconds)` is called with `seconds < 60` THE SYSTEM SHALL still return the full `"{h}h {mm}m {ss}s"` form with hours as `"0h"` (e.g. `formatDuration(5)` returns `"0h 00m 05s"`).
- 4.3 WHEN `formatDuration(seconds)` is called with a negative value THE SYSTEM SHALL clamp `seconds` to `0` via `clamp()` before formatting, returning `"0h 00m 00s"`.
- 4.4 WHEN `CharlieBadge` renders with a `seconds` prop THE SYSTEM SHALL display the result of `formatDuration(seconds)` inside an element with `data-testid="charlie-badge"`.

### Requirement 5: Delta Badge — Initials Rendering

**User Story:** As a user of the drill panel, I want a "Delta" badge that
renders a name's initials alongside a member count, so that the panel
demonstrates a purely string-based lib function combined with
`formatCount` for the badge's own numeric display.

#### Acceptance Criteria

- 5.1 WHEN `initials(name)` is called with a two-word name THE SYSTEM SHALL return the uppercase first letters of the first and last word concatenated (e.g. `initials("ada lovelace")` returns `"AL"`).
- 5.2 WHEN `initials(name)` is called with a single-word name THE SYSTEM SHALL return the uppercase first letter of that word only (e.g. `initials("Zendaya")` returns `"Z"`).
- 5.3 WHEN `initials(name)` is called with an empty string or a string containing only whitespace THE SYSTEM SHALL return an empty string.
- 5.4 WHEN `initials(name)` is called with a name of more than two words THE SYSTEM SHALL use only the first and last word, ignoring middle words (e.g. `initials("Mary Jane Watson")` returns `"MW"`).
- 5.5 WHEN `DeltaBadge` renders with `name` and `memberCount` props THE SYSTEM SHALL display `"Delta "` followed by `initials(name)` and, in parentheses, `formatCount(memberCount, 'member')`, inside an element with `data-testid="delta-badge"` (e.g. name `"ada lovelace"` and count `3` renders `"Delta AL (3 members)"`).

### Requirement 6: Gauntlet Panel Integration

**User Story:** As a user viewing the drill app, I want all four badges
assembled into one panel mounted in the app shell, so that the full
gauntlet is visible and queryable from a single root.

#### Acceptance Criteria

- 6.1 WHEN `GauntletPanel` renders THE SYSTEM SHALL render `AlphaBadge`, `BravoBadge`, `CharlieBadge`, and `DeltaBadge` together, each supplied fixed demo props, inside a `<section>` element with `data-testid="gauntlet-panel"`.
- 6.2 WHEN the app starts THE SYSTEM SHALL render `<GauntletPanel />` exactly once from `src/App.tsx`, leaving all pre-existing markup in `App.tsx` unchanged.
- 6.3 WHERE `GauntletPanel` is rendered THE SYSTEM SHALL expose each of the four badges' `data-testid` attributes (`alpha-badge`, `bravo-badge`, `charlie-badge`, `delta-badge`) as descendants of `[data-testid="gauntlet-panel"]`, so the full drill set is queryable from the panel root.
- 6.4 THE SYSTEM SHALL NOT render `GauntletPanel` conditionally or more than once within `App.tsx`.
