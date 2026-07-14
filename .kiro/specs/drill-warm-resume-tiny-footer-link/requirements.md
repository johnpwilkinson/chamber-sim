# Drill Warm Resume — Tiny Footer Link — Requirements

## Introduction

This feature adds a single, always-visible, static "Resume" text link fixed to the bottom-left corner of the viewport. It mirrors the existing `FooterVersionBadge` feature's shape and conventions but occupies the opposite corner, linking to `/resume` in a new browsing-context-safe tab. This document defines the EARS-format acceptance criteria derived from the approved design.

## Requirements

### Requirement 1: Always-visible plain-text link rendering

**User Story:** As a site visitor, I want to see a "Resume" link on every page view, so that I can navigate to the resume without any conditional state or session dependency hiding it.

Acceptance Criteria:
- 1.1 WHEN the `ResumeFooterLink` component is mounted THE SYSTEM SHALL render an `<a>` element containing the literal text `Resume`.
- 1.2 WHEN the `ResumeFooterLink` component renders THE SYSTEM SHALL render unconditionally, with no session-state, drill-state, or other conditional check gating its visibility.
- 1.3 WHEN the `ResumeFooterLink` component renders THE SYSTEM SHALL NOT render any `<svg>`, icon font glyph, or `<img>` element alongside the text.
- 1.4 WHEN the `ResumeFooterLink` component renders THE SYSTEM SHALL render no props-driven content, since the component accepts no props.

### Requirement 2: Safe new-tab navigation to `/resume`

**User Story:** As a site visitor, I want the Resume link to open in a new tab without exposing my current page to the destination, so that I can view the resume without losing my place or risking a reverse-tabnabbing attack.

Acceptance Criteria:
- 2.1 WHEN the `ResumeFooterLink` anchor is rendered THE SYSTEM SHALL set its `href` attribute to the plain relative path `/resume`.
- 2.2 WHEN the `ResumeFooterLink` anchor is rendered THE SYSTEM SHALL set `target="_blank"` so the link opens in a new browsing context.
- 2.3 WHEN the `ResumeFooterLink` anchor is rendered with `target="_blank"` THE SYSTEM SHALL set `rel="noreferrer"` so the newly opened tab cannot access `window.opener`.
- 2.4 WHEN a user activates the `ResumeFooterLink` anchor THE SYSTEM SHALL rely solely on the anchor's native browser navigation, with no `onClick` handler, no client-side routing library, and no programmatic navigation logic attached.

### Requirement 3: Bottom-left fixed positioning and subtle styling

**User Story:** As a site visitor, I want the Resume link to sit unobtrusively in the bottom-left corner without overlapping other fixed UI, so that it stays visible but doesn't interfere with the rest of the page.

Acceptance Criteria:
- 3.1 WHEN the `ResumeFooterLink` component renders THE SYSTEM SHALL position the anchor with fixed CSS positioning at the bottom-left corner of the viewport, using `bottom-3 left-3` inset classes.
- 3.2 WHERE `FooterVersionBadge` is fixed at the bottom-right of the viewport THE SYSTEM SHALL position `ResumeFooterLink` at the bottom-left so the two components never overlap.
- 3.3 WHEN the `ResumeFooterLink` component renders THE SYSTEM SHALL style the anchor with `text-xs` sizing and the `var(--text)` muted-text color custom property, matching `FooterVersionBadge`'s subtle-styling convention rather than the app's accent color.
- 3.4 WHEN a user hovers over the `ResumeFooterLink` anchor THE SYSTEM SHALL change its text color to the `var(--text-h)` high-contrast custom property to provide a discoverable hover state.
- 3.5 WHEN the page is printed THE SYSTEM SHALL hide the `ResumeFooterLink` anchor via the `print:hidden` class, matching the sibling badge's print convention.
- 3.6 WHEN the `ResumeFooterLink` component renders THE SYSTEM SHALL NOT set any `z-index` on the anchor, since no other fixed bottom-left element exists in the app today.

### Requirement 4: Static component with no state, config, or new dependencies

**User Story:** As a maintainer, I want the Resume link component to be fully static and dependency-free, so that it carries no hidden coupling, data fetching, or configuration surface to maintain.

Acceptance Criteria:
- 4.1 WHEN the `ResumeFooterLink` component is implemented THE SYSTEM SHALL declare no dependencies beyond `react`, which is already a project dependency, and SHALL NOT add any new npm package.
- 4.2 WHEN the `ResumeFooterLink` component is implemented THE SYSTEM SHALL contain no internal state (no `useState`, `useEffect`, or equivalent) and no data-fetching logic.
- 4.3 WHEN the `ResumeFooterLink` component is implemented THE SYSTEM SHALL expose no props and no new settings, context, or store entry.

### Requirement 5: Single mount point in App.tsx

**User Story:** As a maintainer, I want the Resume link mounted exactly once alongside the app's other fixed-position components, so that it renders consistently on every view without duplicate mounts.

Acceptance Criteria:
- 5.1 WHEN `src/App.tsx` is rendered THE SYSTEM SHALL import and mount exactly one `<ResumeFooterLink />` element, alongside the existing `<FooterVersionBadge />` and `<HeaderBuildBadge />` mounts.
- 5.2 WHEN `src/App.tsx` is modified to add the `ResumeFooterLink` mount THE SYSTEM SHALL change only the one import line and the one `<ResumeFooterLink />` mount line, with no other markup changes to `src/App.tsx`.
- 5.3 WHILE the application has only `src/App.tsx` as the mount point for `ResumeFooterLink` THE SYSTEM SHALL NOT mount the component from any other file.

### Requirement 6: Feature-owned file boundaries

**User Story:** As a maintainer, I want the Resume link feature's files scoped to its own directory with matching test coverage, so that ownership boundaries stay clear and consistent with sibling features.

Acceptance Criteria:
- 6.1 WHEN the feature is implemented THE SYSTEM SHALL place the component implementation at `src/components/resume-footer-link/resume-footer-link.tsx` as the sole, ongoing owner of that path.
- 6.2 WHEN the feature is implemented THE SYSTEM SHALL provide a unit test at `src/components/resume-footer-link/resume-footer-link.test.tsx` covering the component's markup and attributes.
- 6.3 WHEN the feature is implemented THE SYSTEM SHALL provide an integration test at `src/components/resume-footer-link/app-integration.test.tsx` asserting that `src/App.tsx` mounts the component, matching the sibling-feature convention used by `footer-version-badge/app-integration.test.tsx` and `header-build-badge/app-integration.test.tsx`.
- 6.4 WHEN the feature is implemented THE SYSTEM SHALL add no files or changes outside `src/components/resume-footer-link/` except the one mount integration in `src/App.tsx`.
- 6.5 IF a change would touch `src/index.css`, `App.css`, `vite.config.ts`, or any other feature's directory (`command-palette/`, `footer-version-badge/`, `header-build-badge/`, `keyboard-shortcuts/`) THEN THE SYSTEM SHALL treat that change as out of scope for this feature.
