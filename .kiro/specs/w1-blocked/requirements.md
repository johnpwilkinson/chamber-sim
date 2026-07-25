# Outbound Blocklist Markers — Requirements

## Requirement 1: Blocklist Readiness Marker

**User Story:** As the operator, I want a hidden marker stating that the
outbound blocklist surface is present in the app tree, so that a smoke check
can confirm the surface shipped without any visible chrome.

Acceptance Criteria:
- 1.1 WHEN the `W1BlockedMarker` component renders THE SYSTEM SHALL render a
  single `<span>` whose exact text content is `blocklist-ready`.
- 1.2 WHEN the `W1BlockedMarker` component renders THE SYSTEM SHALL set
  `data-marker="w1-blocked"` and the class `hidden` on that `<span>`.
- 1.3 WHEN the `W1BlockedMarker` component is defined THE SYSTEM SHALL accept
  no props, hold no internal state, attach no event handlers, and contain no
  interactive elements.
- 1.4 WHEN the app root (`src/App.tsx`) renders THE SYSTEM SHALL mount
  `<W1BlockedMarker />` exactly once, immediately after the existing
  `<CommandPalette />` mount, leaving every other line of `src/App.tsx`
  byte-identical apart from the one added import line and the one added
  mount line.
- 1.5 WHEN the test suite runs THE SYSTEM SHALL include, in
  `src/components/w1-blocked/w1-blocked-marker.test.tsx`, a test asserting
  the rendered text content equals exactly `blocklist-ready` and a test
  asserting the rendered `<span>` carries `data-marker="w1-blocked"` and the
  class `hidden`.
- 1.6 WHEN the test suite runs THE SYSTEM SHALL include a test asserting the
  rendered output of `<W1BlockedMarker />` contains no `<a>` element, no
  `<button>` element, and no `onclick` attribute.

## Requirement 2: Canonical Range Summary

**User Story:** As the operator, I want the configured outbound CIDR ranges
summarized by the platform's canonical blocklist formatter, so that the
string this app reports is byte-identical to what every other blocklist
surface reports and cannot drift from it.

Acceptance Criteria:
- 2.1 WHEN the `W1BlockedSummary` component renders THE SYSTEM SHALL obtain
  its summary string by calling `formatBlocklist`, imported as a named import
  from the package `@quantile-labs/cidr-blocklist-formatter`.
- 2.2 WHEN the `W1BlockedSummary` component renders THE SYSTEM SHALL pass
  exactly the array `['10.0.0.0/8', '192.168.0.0/16']`, in that order, to
  `formatBlocklist`, and SHALL render that call's return value as the entire
  text content of a single `<span>`.
- 2.3 WHEN the `W1BlockedSummary` component renders THE SYSTEM SHALL set
  `data-marker="w1-blocked-summary"` and the class `hidden` on that `<span>`.
- 2.4 WHEN the `W1BlockedSummary` component is defined THE SYSTEM SHALL
  accept no props, hold no internal state, attach no event handlers, and
  contain no interactive elements.
- 2.5 WHEN Requirement 2 is implemented THE SYSTEM SHALL NOT add
  `@quantile-labs/cidr-blocklist-formatter` to `package.json`,
  `package-lock.json`, or any other manifest, and SHALL NOT run any package
  install, add, or link command for it — dependency manifests and registry
  configuration are owned by the platform team and are outside this
  feature's scope. The platform team has already published the package and
  confirmed it resolvable from the configured registry, so no approval,
  escalation, or human decision is pending on this requirement; it is a
  scope boundary, not an open question.
- 2.6 WHEN Requirement 2 is implemented THE SYSTEM SHALL NOT vendor, copy,
  inline, re-derive, or locally reimplement `formatBlocklist` or any
  equivalent CIDR summary formatting helper anywhere in the repository.
- 2.7 WHEN Requirement 2 is implemented THE SYSTEM SHALL NOT stub, mock,
  shim, alias, or otherwise fake `@quantile-labs/cidr-blocklist-formatter` —
  not in source, not in `src/test-setup.ts`, not via `vi.mock`, not via a
  `resolve.alias` entry in `vite.config.ts` or `vitest.config.ts`, not via
  `paths` in any `tsconfig*.json`, and not via an ambient `.d.ts` module
  declaration.
- 2.8 WHEN Requirement 2 is implemented THE SYSTEM SHALL NOT substitute a
  different package or a built-in Node module for
  `@quantile-labs/cidr-blocklist-formatter`, and SHALL NOT alter the import
  specifier, the imported name `formatBlocklist`, or the argument array
  defined in 2.2.
- 2.9 WHEN the app root (`src/App.tsx`) renders THE SYSTEM SHALL mount
  `<W1BlockedSummary />` exactly once, immediately after the existing
  `<W1BlockedMarker />` mount, leaving every other line of `src/App.tsx`
  byte-identical apart from the one added import line and the one added
  mount line.
- 2.10 WHEN the test suite runs THE SYSTEM SHALL include, in
  `src/components/w1-blocked/w1-blocked-summary.test.tsx`, a test asserting
  the rendered `<span>` carries `data-marker="w1-blocked-summary"` and the
  class `hidden`, and a test asserting the rendered text content equals the
  value returned by `formatBlocklist(['10.0.0.0/8', '192.168.0.0/16'])`
  called directly in the test from the same real import.

## Requirement 3: Blocklist Source Marker

**User Story:** As the operator, I want a hidden marker recording that this
app's blocklist is statically configured rather than fetched at runtime, so
that a smoke check can tell the two provisioning modes apart.

Acceptance Criteria:
- 3.1 WHEN the `W1BlockedSource` component renders THE SYSTEM SHALL render a
  single `<span>` whose exact text content is `blocklist-source-static`.
- 3.2 WHEN the `W1BlockedSource` component renders THE SYSTEM SHALL set
  `data-marker="w1-blocked-source"` and the class `hidden` on that `<span>`.
- 3.3 WHEN the `W1BlockedSource` component is defined THE SYSTEM SHALL accept
  no props, hold no internal state, attach no event handlers, and contain no
  interactive elements, and SHALL import nothing beyond what the JSX itself
  requires.
- 3.4 WHEN the app root (`src/App.tsx`) renders THE SYSTEM SHALL mount
  `<W1BlockedSource />` exactly once, immediately before the existing
  `<FooterVersionBadge />` mount, leaving every other line of `src/App.tsx`
  byte-identical apart from the one added import line and the one added
  mount line.
- 3.5 WHEN the test suite runs THE SYSTEM SHALL include, in
  `src/components/w1-blocked/w1-blocked-source.test.tsx`, a test asserting
  the rendered text content equals exactly `blocklist-source-static` and a
  test asserting the rendered `<span>` carries
  `data-marker="w1-blocked-source"` and the class `hidden`.
- 3.6 WHEN the test suite runs THE SYSTEM SHALL include a test asserting the
  rendered output of `<W1BlockedSource />` contains no `<a>` element, no
  `<button>` element, and no `onclick` attribute.

## Requirement 4: Scope Discipline

**User Story:** As the operator, I want this feature confined to its own
component directory plus three mount lines, so that no build plumbing or
shared configuration changes ride along with it.

Acceptance Criteria:
- 4.1 WHEN this feature is implemented THE SYSTEM SHALL create files only
  under `src/components/w1-blocked/` and SHALL edit no file other than
  `src/App.tsx`.
- 4.2 WHEN this feature is implemented THE SYSTEM SHALL leave
  `package.json`, `package-lock.json`, `vite.config.ts`, `vitest.config.ts`,
  every `tsconfig*.json`, `src/test-setup.ts`, `.dependency-cruiser.cjs`,
  `src/index.css`, and `tailwind.config.ts` unchanged.
- 4.3 WHEN a component from this feature is complete THE SYSTEM SHALL pass
  `npm run build` and `npm test` for that component's own files, with no
  failing test and no TypeScript error introduced by it.
