# Requirements Document

## Introduction

This feature adds a small, static footer badge that displays the short build
commit sha (e.g. `abc1234`), positioned to the right of the existing
`FooterVersionBadge`. On hover, a custom-styled tooltip reveals the full
commit sha. The sha values are captured once at build time via two new Vite
`define` globals (`__COMMIT_SHA__`, `__COMMIT_SHA_FULL__`), each resolved
independently via `git rev-parse`, with an independent `"whoops"` fallback
per global when resolution fails. The badge is non-interactive, hidden when
printing, and introduces no new dependencies, props, or configuration
surface.

## Requirements

### Requirement 1: Build-time commit sha resolution

**User Story:** As a developer building and deploying the app, I want the
commit sha to be captured automatically at build time, so that the running
app reflects exactly which commit it was built from without any manual step
or runtime dependency.

#### Acceptance Criteria

- 1.1 WHEN `vite.config.ts` is evaluated THE SYSTEM SHALL resolve `__COMMIT_SHA__` by invoking `resolveCommitSha` with `['rev-parse', '--short', 'HEAD']`.
- 1.2 WHEN `vite.config.ts` is evaluated THE SYSTEM SHALL resolve `__COMMIT_SHA_FULL__` by invoking `resolveCommitSha` with `['rev-parse', 'HEAD']`.
- 1.3 WHEN `resolveCommitSha` invokes `git` THE SYSTEM SHALL use `execFileSync` with an array-args form (never a shell string) so no shell interpolation occurs.
- 1.4 WHEN `resolveCommitSha` successfully resolves a sha THE SYSTEM SHALL trim the output and assign it to the corresponding `define` entry via `JSON.stringify`.
- 1.5 IF the `git rev-parse --short HEAD` invocation throws (e.g. no `.git` directory, `git` not installed, building from a tarball) THEN THE SYSTEM SHALL set `__COMMIT_SHA__` to the literal string `"whoops"` without affecting `__COMMIT_SHA_FULL__`.
- 1.6 IF the `git rev-parse HEAD` invocation throws THEN THE SYSTEM SHALL set `__COMMIT_SHA_FULL__` to the literal string `"whoops"` without affecting `__COMMIT_SHA__`.
- 1.7 THE SYSTEM SHALL resolve both `__COMMIT_SHA__` and `__COMMIT_SHA_FULL__` exactly once, at `vite.config.ts` evaluation (build) time, and SHALL NOT perform any runtime fetch (no `version.json`, no API call) or client-side re-resolution.
- 1.8 THE SYSTEM SHALL add the `__COMMIT_SHA__` and `__COMMIT_SHA_FULL__` entries to the existing `define` block in `vite.config.ts` alongside `__APP_VERSION__` and `__BUILD_TIME__`, without modifying those existing entries.
- 1.9 THE SYSTEM SHALL NOT depend on any CI-only environment variable to resolve either sha.

### Requirement 2: Ambient type declarations

**User Story:** As a developer working in the codebase, I want the new
build-time globals to be type-checked, so that referencing them in
component code is type-safe and consistent with the existing globals.

#### Acceptance Criteria

- 2.1 WHERE `src/vite-env.d.ts` declares existing build-time globals THE SYSTEM SHALL add `declare const __COMMIT_SHA__: string`.
- 2.2 WHERE `src/vite-env.d.ts` declares existing build-time globals THE SYSTEM SHALL add `declare const __COMMIT_SHA_FULL__: string`.
- 2.3 THE SYSTEM SHALL NOT modify the existing `__APP_VERSION__` or `__BUILD_TIME__` declarations in `src/vite-env.d.ts` when adding the new declarations.

### Requirement 3: Badge rendering

**User Story:** As a user or team member viewing the app, I want to see the
short build commit sha displayed as a small badge, so that I can quickly
identify which build/commit is currently deployed.

#### Acceptance Criteria

- 3.1 THE SYSTEM SHALL render a `FooterCommitBadge` component at `src/components/footer-commit-badge/footer-commit-badge.tsx` that reads `__COMMIT_SHA__` and `__COMMIT_SHA_FULL__`.
- 3.2 WHEN `FooterCommitBadge` renders and `__COMMIT_SHA__` is not `"whoops"` THE SYSTEM SHALL display the bare short sha text (e.g. `abc1234`) with no prefix.
- 3.3 WHEN `FooterCommitBadge` renders and `__COMMIT_SHA__` equals `"whoops"` THE SYSTEM SHALL display the literal text `whoops` as the badge text.
- 3.4 THE SYSTEM SHALL style the badge text as a pill using `rounded-full`, `border-[var(--border)]`, `bg-[var(--code-bg)]`, and `text-[var(--text)]`, matching the treatment of the existing `FooterVersionBadge`/`HeaderBuildBadge`.
- 3.5 THE SYSTEM SHALL accept no props on `FooterCommitBadge` and hold no internal state.
- 3.6 THE SYSTEM SHALL NOT set `aria-hidden` on the badge text or any element in the component tree, so the short-sha text remains reachable by screen readers as plain visible text.

### Requirement 4: Hover-only tooltip revealing the full sha

**User Story:** As a user who wants more detail than the short sha, I want to
hover over the badge to see the full commit sha, so that I can copy or
verify the exact commit without cluttering the default view.

#### Acceptance Criteria

- 4.1 WHEN a user hovers the mouse over the badge AND `__COMMIT_SHA__` is not `"whoops"` THE SYSTEM SHALL reveal a tooltip showing the bare full sha text (`__COMMIT_SHA_FULL__`) with no label.
- 4.2 IF `__COMMIT_SHA__` equals `"whoops"` THEN THE SYSTEM SHALL render no tooltip markup at all in the DOM (not merely a hidden or empty tooltip).
- 4.3 THE SYSTEM SHALL implement the tooltip using a Tailwind `group`/`group-hover:opacity-100` CSS-only hover reveal, and SHALL NOT use the native HTML `title` attribute.
- 4.4 THE SYSTEM SHALL NOT implement the tooltip using a JavaScript- or portal-based tooltip library (e.g. `radix-ui`'s `Tooltip`), and SHALL NOT introduce a `TooltipProvider` wrapper.
- 4.5 THE SYSTEM SHALL implement the tooltip trigger as a non-focusable element with no `tabIndex`, no `onFocus` handler, and no interactive ARIA role, so the tooltip cannot be triggered via keyboard focus or touch.
- 4.6 THE SYSTEM SHALL reveal the tooltip purely via CSS `:hover` (`group-hover:opacity-100`), with no `onMouseEnter`/`onMouseLeave` JavaScript handlers and no component state driving visibility.
- 4.7 THE SYSTEM SHALL set `pointer-events-none` on the tooltip element so it never intercepts the hover or becomes a click target.
- 4.8 THE SYSTEM SHALL position the tooltip absolutely above the badge (`absolute bottom-full`, `right-0` alignment) with `whitespace-nowrap` so the full sha never wraps.
- 4.9 THE SYSTEM SHALL style the tooltip using the same `--border`/`--code-bg`/`--text` custom properties as the badge itself.
- 4.10 THE SYSTEM SHALL NOT set `aria-hidden` anywhere in the tooltip markup.

### Requirement 5: Positioning and print behavior

**User Story:** As a user viewing the footer, I want the commit badge placed
consistently next to the version badge and hidden from printed output, so
that the UI stays visually consistent and print output stays clean.

#### Acceptance Criteria

- 5.1 THE SYSTEM SHALL position the badge's outer wrapper with `fixed`, `bottom-3`, and `right-20` (80px from the viewport edge), placing it to the right of `FooterVersionBadge`'s `right-3 bottom-3` pill.
- 5.2 THE SYSTEM SHALL apply `print:hidden` to the badge's outer wrapper so the badge does not appear in printed output, matching the sibling badges.
- 5.3 THE SYSTEM SHALL NOT set any `z-index` on either the badge or the tooltip element.
- 5.4 THE SYSTEM SHALL NOT modify `FooterVersionBadge`'s own markup, styling, or layout to achieve positioning; the badge SHALL use its own independent fixed offset rather than a shared flex layout.

### Requirement 6: Non-interactive, static presentation

**User Story:** As a user, I want the commit badge to be purely
informational, so that it does not introduce unexpected interactive behavior
or navigation.

#### Acceptance Criteria

- 6.1 THE SYSTEM SHALL NOT attach an `onClick` handler to the badge or tooltip.
- 6.2 THE SYSTEM SHALL NOT render the badge or tooltip as an `<a>`/`Link` element or otherwise provide an outbound link.
- 6.3 THE SYSTEM SHALL NOT invoke the clipboard API from the badge or tooltip.
- 6.4 THE SYSTEM SHALL render the badge unconditionally in dev, staging, and production builds, with no config, settings, or environment-based toggle.

### Requirement 7: Mount point integration

**User Story:** As a developer integrating this feature, I want the badge
mounted exactly once in the app shell, so that it appears consistently on
every view without duplicate mounts.

#### Acceptance Criteria

- 7.1 THE SYSTEM SHALL mount `<FooterCommitBadge />` exactly once, from `src/App.tsx`, alongside the existing `<FooterVersionBadge />` and `<HeaderBuildBadge />` mounts.
- 7.2 THE SYSTEM SHALL NOT mount `FooterCommitBadge` from any file other than `src/App.tsx`.
- 7.3 THE SYSTEM SHALL NOT modify any markup in `src/App.tsx` other than adding the `<FooterCommitBadge />` mount next to the existing `<FooterVersionBadge />` mount.

### Requirement 8: Feature boundary, dependencies, and scope constraints

**User Story:** As a maintainer of the codebase, I want this feature's
footprint tightly scoped, so that it does not introduce new dependencies,
unrelated files, or design-system changes beyond what is needed.

#### Acceptance Criteria

- 8.1 THE SYSTEM SHALL treat `src/components/footer-commit-badge/` as exclusively owned by this feature; no unrelated files SHALL be added there, and no files outside this directory SHALL be added except the integration touches to `src/vite-env.d.ts`, `vite.config.ts`, and `src/App.tsx`.
- 8.2 THE SYSTEM SHALL introduce no new npm package; the feature SHALL use only `react` (existing dependency), Node's built-in `node:child_process` (`execFileSync`, build-time only, never bundled into client code), and Tailwind utility classes.
- 8.3 THE SYSTEM SHALL NOT add `--background`, `--foreground`, `--muted-foreground`, or any `@theme` block to `src/index.css` or `tailwind.config.ts`; the feature SHALL consume only the existing hand-rolled `--border`/`--code-bg`/`--text` custom properties via Tailwind arbitrary-value syntax.
- 8.4 THE SYSTEM SHALL NOT modify the source or tests of `FooterVersionBadge` or `HeaderBuildBadge`.
- 8.5 THE SYSTEM SHALL NOT introduce any new settings, context, or store entry to support this feature.
