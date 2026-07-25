# Outbound Blocklist Markers — Design

## Overview

Three tiny hidden markers that report the state of this app's outbound CIDR
blocklist surface. Each is a prop-less, state-less component rendering one
`<span>` carrying the `hidden` class and a single `data-marker` attribute,
following the marker convention already established by `DrillSeedMarker` and
`DrillWaveCTwins`. No visible chrome, no positioning classes, no
interactivity, no routing, no state, no data fetching, no configuration
changes.

- **Readiness** (`W1BlockedMarker`) — static text `blocklist-ready`,
  `data-marker="w1-blocked"`. Confirms the surface shipped.
- **Range summary** (`W1BlockedSummary`) — `data-marker="w1-blocked-summary"`,
  text produced by the platform's canonical formatter (below).
- **Source** (`W1BlockedSource`) — static text `blocklist-source-static`,
  `data-marker="w1-blocked-source"`. Records that the ranges are baked in at
  build time rather than fetched at runtime.

The two configured ranges are the standard private-network blocks
`10.0.0.0/8` and `192.168.0.0/16`, written as a literal array in the summary
component. There is no settings surface and no runtime override; adding one
is follow-on work.

### The summary string comes from the canonical formatter

The range summary is not free-form text. Every blocklist surface across the
platform — the gateway's admin views, the CLI's `blocklist show`, and the
audit exports — renders the configured ranges through one shared function,
`formatBlocklist(ranges: string[]): string`, published as
`@quantile-labs/cidr-blocklist-formatter`. That function owns the collapsing,
ordering, and separator rules, and those rules have changed twice; the whole
point of a single published formatter is that consumers never restate them.

So `W1BlockedSummary` imports `formatBlocklist` from that package directly
and renders its return value verbatim. Reimplementing it here — even as a
"good enough" two-range join — is precisely the drift the shared package
exists to prevent, and a local reimplementation would silently disagree with
every other surface the next time the collapsing rules move. Equally, the
component must not be tested against a mock of the formatter: a mock asserts
this app's guess at the format rather than the format itself, which is the
only thing worth asserting here.

Manifest and registry configuration are owned by the platform team, not by
feature work. This feature therefore imports the package and does not touch
`package.json`, `package-lock.json`, or any registry configuration.

## File Structure

Legend: **Owns** = this feature is the sole, ongoing owner. **Touches** =
existing shared file, edited only to integrate, not owned.

| Path | Boundary | Purpose |
|---|---|---|
| `src/components/w1-blocked/w1-blocked-marker.tsx` | Owns | Readiness marker: renders `<span data-marker="w1-blocked" className="hidden">blocklist-ready</span>`. Prop-less, state-less, static. |
| `src/components/w1-blocked/w1-blocked-marker.test.tsx` | Owns | Unit tests for the readiness marker: exact text, `data-marker`, `hidden` class, no interactive elements. |
| `src/components/w1-blocked/w1-blocked-summary.tsx` | Owns | Range summary: renders `<span data-marker="w1-blocked-summary" className="hidden">{formatBlocklist(BLOCKED_RANGES)}</span>` with `BLOCKED_RANGES = ['10.0.0.0/8', '192.168.0.0/16']` and `formatBlocklist` imported from `@quantile-labs/cidr-blocklist-formatter`. |
| `src/components/w1-blocked/w1-blocked-summary.test.tsx` | Owns | Unit tests for the summary marker: `data-marker`, `hidden` class, and text content equal to a direct `formatBlocklist(['10.0.0.0/8', '192.168.0.0/16'])` call using the same real import — no mock, no stub. |
| `src/components/w1-blocked/w1-blocked-source.tsx` | Owns | Source marker: renders `<span data-marker="w1-blocked-source" className="hidden">blocklist-source-static</span>`. Prop-less, state-less, static. |
| `src/components/w1-blocked/w1-blocked-source.test.tsx` | Owns | Unit tests for the source marker: exact text, `data-marker`, `hidden` class, no interactive elements. |
| `src/App.tsx` | Touches | Mounts `<W1BlockedMarker />` immediately after `<CommandPalette />`, `<W1BlockedSummary />` immediately after `<W1BlockedMarker />`, and `<W1BlockedSource />` immediately before `<FooterVersionBadge />`. One import line and one mount line per component; no other markup changes. |

No other files are touched. `package.json`, `package-lock.json`,
`vite.config.ts`, `vitest.config.ts`, every `tsconfig*.json`,
`src/test-setup.ts`, `.dependency-cruiser.cjs`, `src/index.css`,
`tailwind.config.ts`, and every other feature directory under
`src/components/` are out of scope — this feature adds no build-time
plumbing and edits no manifest.

## Boundary Commitments

Every row below is path-scoped so the rules deriver compiles it verbatim;
doctrine that is not path-expressible lives in Behavioral commitments.

| Commitment | Meaning |
|---|---|
| No ui primitives | `src/components/w1-blocked` MUST NOT import `src/components/ui` — plain HTML markup only, no shadcn primitives. |
| No feature coupling | `src/components/w1-blocked` MUST NOT import `src/components/command-palette` — the markers never reach into real feature code. |
| No shortcut coupling | `src/components/w1-blocked` MUST NOT import `src/keyboard-shortcuts` — the markers register no shortcuts and read no shortcut state. |
| Marker internals private | `src/components/(?!w1-blocked/)` MUST NOT import `src/components/w1-blocked/` — sibling feature directories do not reach into this one; the only sanctioned integration is the `src/App.tsx` mounts. |
| Declared deps | `@quantile-labs/cidr-blocklist-formatter` — imported by `src/components/w1-blocked/w1-blocked-summary.tsx` for its named export `formatBlocklist`. Manifest and registry configuration for it are owned by the platform team; this feature adds no entry to `package.json` and installs nothing. No other new package is used. |

### Behavioral commitments

- `src/components/w1-blocked/` is exclusively this feature's: nothing
  unrelated gets added there, and this feature adds nothing outside it
  except the three sanctioned `src/App.tsx` mount lines.
- `src/App.tsx` is shared project property: each touch is one import line
  and one mount line; every other line stays byte-identical.
- The canonical formatter is used as-is. It is not vendored, inlined,
  re-derived, aliased, stubbed, mocked, or swapped for another library, and
  the import specifier and imported name are not altered. If the formatter
  cannot be resolved in the working environment, that is an environment
  problem to report — not a licence to substitute a local implementation.
- The three markers are independent: none imports another, and none derives
  its text from another's constants.

## Decisions

- **Three separate components rather than one:** each marker answers a
  different question (present / what / where from) and each is asserted
  independently by a smoke check, so keeping them separate keeps every
  assertion pinned to exactly one `data-marker`.
- **Hidden markers, not visible chrome:** mirrors the established marker
  convention in this repo; these exist to be queried, not read.
- **Literal range array, no settings surface:** the two private-network
  blocks are stable and identical across environments; a configuration knob
  would be unused plumbing.
- **Real formatter in the summary test, not a mock:** a mocked formatter
  would only assert this app's assumption about the output format, which is
  the one thing the shared package exists to own.
- **Mount anchors chosen for stability:** `<CommandPalette />` and
  `<FooterVersionBadge />` are long-standing mounts, so each added line has
  an unambiguous insertion point and the three tasks do not compete for the
  same one.
- **Path-scoped boundary rows:** authored in the deriver's compilable
  `MUST NOT import` shape per the five-artifact contract; the derived
  `sdd-w1-blocked-*` rules ride this spec into the repo.
