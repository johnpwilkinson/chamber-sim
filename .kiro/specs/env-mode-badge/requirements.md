# Requirements Document

## Introduction

This feature adds a small, static badge to the app's footer that displays the current Vite build mode (`import.meta.env.MODE`, e.g. `development` or `production`). It sits immediately to the left of the existing `FooterVersionBadge`, reuses the existing pill styling, and requires `FooterCommitBadge` to shift further left to avoid overlap. The badge is always rendered (no environment gating), non-interactive, accessible to screen readers, and introduces no new dependencies, build-time plumbing, or configuration surface.

## Requirements

### Requirement 1: Env Mode Display

**User Story:** As a developer or tester, I want a badge that shows the current Vite build mode, so that I can tell at a glance whether the app is running in development or production.

#### Acceptance Criteria

- 1.1 WHEN the `FooterEnvModeBadge` component renders THE SYSTEM SHALL read the value of `import.meta.env.MODE`.
- 1.2 WHEN the component renders THE SYSTEM SHALL apply `.toLowerCase()` to the `import.meta.env.MODE` value before displaying it, rather than trusting its casing as-is.
- 1.3 WHEN the component renders THE SYSTEM SHALL display the lowercased mode value as plain text content with no label prefix (e.g. `development`, not `mode: development`).
- 1.4 THE SYSTEM SHALL NOT accept any props on `FooterEnvModeBadge`.
- 1.5 THE SYSTEM SHALL NOT maintain any internal state in `FooterEnvModeBadge`.

### Requirement 2: Visual Styling Consistency

**User Story:** As a user of the app, I want the env-mode badge to look like the other footer badges, so that the UI feels consistent.

#### Acceptance Criteria

- 2.1 WHEN the badge renders THE SYSTEM SHALL apply the pill classes `rounded-full border border-[var(--border)] bg-[var(--code-bg)] px-2 py-0.5 text-xs text-[var(--text)]` to the text-carrying element, identical to `FooterVersionBadge` and `FooterCommitBadge`.
- 2.2 THE SYSTEM SHALL NOT introduce any new CSS custom properties for this badge.
- 2.3 THE SYSTEM SHALL NOT apply any distinct visual treatment (e.g. color-coding by mode) to the badge.
- 2.4 THE SYSTEM SHALL NOT set an explicit `z-index` on the badge, matching the other footer badges.

### Requirement 3: Positioning and Layout

**User Story:** As a user of the app, I want the footer badges to be positioned without overlapping, so that all badge text stays readable.

#### Acceptance Criteria

- 3.1 WHEN the badge renders THE SYSTEM SHALL position its outer wrapper with `fixed right-20 bottom-3` so that it sits immediately to the left of `FooterVersionBadge`.
- 3.2 WHEN the app is printed THE SYSTEM SHALL hide the badge via `print:hidden` on the outer wrapper.
- 3.3 WHEN `FooterCommitBadge` renders THE SYSTEM SHALL position its wrapper at `right-44` instead of `right-20`, so it no longer overlaps the env-mode badge.
- 3.4 THE SYSTEM SHALL NOT change any class, markup, tooltip, fallback handling, or SHA-display behavior of `FooterCommitBadge` beyond the `right-20` → `right-44` offset change.
- 3.5 WHERE the three footer badges (`FooterVersionBadge` at `right-3`, `FooterEnvModeBadge` at `right-20`, `FooterCommitBadge` at `right-44`) are mounted together THE SYSTEM SHALL render them without horizontal overlap.
- 3.6 THE SYSTEM SHALL NOT alter `FooterVersionBadge`'s markup or offset.

### Requirement 4: Accessibility

**User Story:** As a screen reader user, I want the env-mode badge's text to be discoverable, so that I am not blocked from perceiving the same information sighted users see.

#### Acceptance Criteria

- 4.1 WHEN the badge renders THE SYSTEM SHALL expose the mode text as a plain, screen-reader-visible text node with no `aria-hidden` attribute anywhere in its markup.
- 4.2 WHEN the badge renders THE SYSTEM SHALL set `title="vite mode"` as a static string on the `<span>` element that carries the mode text.

### Requirement 5: Static, Non-Interactive Behavior

**User Story:** As a user of the app, I want the env-mode badge to be purely informational, so that it does not introduce unexpected interactive behavior.

#### Acceptance Criteria

- 5.1 THE SYSTEM SHALL NOT attach an `onClick` handler or any other interactive event handler to the badge.
- 5.2 THE SYSTEM SHALL NOT render the badge as or within an `<a>` or `<Link>` element.
- 5.3 THE SYSTEM SHALL NOT invoke the clipboard API from the badge.
- 5.4 THE SYSTEM SHALL NOT render a tooltip component or popover for the badge beyond the static `title` attribute.

### Requirement 6: Always-Rendered (No Environment Gating)

**User Story:** As a developer, I want the badge to render the same way in every build, so that its presence is predictable regardless of environment.

#### Acceptance Criteria

- 6.1 WHEN the app builds in development mode THE SYSTEM SHALL render the badge.
- 6.2 WHEN the app builds in production mode THE SYSTEM SHALL render the badge with the same markup structure.
- 6.3 THE SYSTEM SHALL NOT gate the badge's rendering on `import.meta.env.DEV` or `import.meta.env.PROD`.

### Requirement 7: No Configuration Surface

**User Story:** As a maintainer, I want the badge to require zero configuration, so that it stays simple to reason about and needs no new build plumbing.

#### Acceptance Criteria

- 7.1 THE SYSTEM SHALL NOT expose any settings, context, or store entry to configure the badge.
- 7.2 THE SYSTEM SHALL NOT require any `vite.config.ts` `define` entry for this feature.
- 7.3 THE SYSTEM SHALL NOT require any new ambient type declaration in `src/vite-env.d.ts` for this feature, relying on Vite's existing `ImportMetaEnv.MODE` typing.
- 7.4 THE SYSTEM SHALL NOT add any new npm package dependency for this feature.

### Requirement 8: Single Mount Point Integration

**User Story:** As a maintainer, I want the badge mounted exactly once in a predictable location, so that there is a single source of truth for where it appears.

#### Acceptance Criteria

- 8.1 WHEN the app root renders THE SYSTEM SHALL mount `<FooterEnvModeBadge />` exactly once, from `src/App.tsx`.
- 8.2 THE SYSTEM SHALL NOT mount `FooterEnvModeBadge` from any file other than `src/App.tsx`.
- 8.3 WHEN mounting the footer badges in `src/App.tsx` THE SYSTEM SHALL place `<FooterEnvModeBadge />` between `<FooterVersionBadge />` and `<FooterCommitBadge />`, matching their left-to-right visual order.
- 8.4 THE SYSTEM SHALL NOT make any markup change to `src/App.tsx` beyond adding the `FooterEnvModeBadge` import and mount.

### Requirement 9: File Ownership Boundaries

**User Story:** As a maintainer, I want this feature's code confined to a dedicated directory with tightly bounded edits elsewhere, so that its blast radius on the rest of the codebase stays minimal.

#### Acceptance Criteria

- 9.1 THE SYSTEM SHALL confine all new files for this feature to `src/components/footer-env-mode-badge/`.
- 9.2 THE SYSTEM SHALL NOT add unrelated code to `src/components/footer-env-mode-badge/`.
- 9.3 THE SYSTEM SHALL NOT modify `src/index.css` or `tailwind.config.ts` as part of this feature.
- 9.4 THE SYSTEM SHALL NOT modify any file under `src/components/footer-version-badge/` as part of this feature.

### Requirement 10: Test Coverage

**User Story:** As a developer maintaining this codebase, I want automated tests for the env-mode badge and updated tests for the shifted commit badge, so that regressions are caught automatically.

#### Acceptance Criteria

- 10.1 WHEN `footer-env-mode-badge.test.tsx` runs THE SYSTEM SHALL verify the badge renders the lowercased `import.meta.env.MODE` value as plain text content.
- 10.2 WHEN `footer-env-mode-badge.test.tsx` runs THE SYSTEM SHALL verify the wrapper element carries `fixed`, `right-20`, `bottom-3`, and `print:hidden` classes.
- 10.3 WHEN `footer-env-mode-badge.test.tsx` runs THE SYSTEM SHALL verify the text-carrying element carries `title="vite mode"`.
- 10.4 WHEN `footer-env-mode-badge.test.tsx` runs THE SYSTEM SHALL verify the pill styling classes (`rounded-full`, `border`, `bg-[var(--code-bg)]`, `text-xs`, `text-[var(--text)]`) are present.
- 10.5 WHEN `footer-env-mode-badge.test.tsx` runs THE SYSTEM SHALL verify no explicit `z-index` class is present on the badge.
- 10.6 WHEN `footer-env-mode-badge.test.tsx` runs THE SYSTEM SHALL verify no interactive elements (`<a>`, `<button>`, `onClick`) are present in the rendered output.
- 10.7 WHEN `footer-env-mode-badge.test.tsx` runs THE SYSTEM SHALL verify no `aria-hidden` attribute is present anywhere in the rendered output.
- 10.8 WHEN `footer-commit-badge.test.tsx` runs THE SYSTEM SHALL assert the wrapper's className contains `right-44` in place of the prior `right-20` assertion.
