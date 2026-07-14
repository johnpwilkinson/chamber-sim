# Requirements — Header Build Timestamp Badge

## Introduction

This feature adds a small, static badge to the top-right corner of the app header showing the build timestamp, formatted for the viewer's local timezone and locale, mirroring the visual treatment of the existing `FooterVersionBadge`. The requirements below are derived from `.kiro/specs/a-small-badge-in-the-app-header-showing/design.md`.

### Requirement 1: Build-time timestamp capture

**User story:** As a developer, I want the build timestamp captured once at build time, so that the badge shows an accurate, immutable build time without any runtime cost or drift.

Acceptance Criteria:
- 1.1 WHEN `vite.config.ts` is evaluated during a build or dev server start THE SYSTEM SHALL add a `__BUILD_TIME__: JSON.stringify(Date.now())` entry to the existing `define` block, alongside the existing `__APP_VERSION__` entry.
- 1.2 WHEN the `define` block is written THE SYSTEM SHALL leave the existing `__APP_VERSION__: JSON.stringify(pkg.version)` entry unmodified.
- 1.3 WHEN `Date.now()` is passed through `JSON.stringify` THE SYSTEM SHALL produce an unquoted numeric literal so that `__BUILD_TIME__` is injected as a `number`, not a `string`.
- 1.4 THE SYSTEM SHALL capture the timestamp exactly once per build/config evaluation, with no runtime clock reads, no `setInterval`, and no re-render-on-tick behavior anywhere in the feature.
- 1.5 THE SYSTEM SHALL NOT compute or display a "time since build" relative counter.

### Requirement 2: Ambient type declaration

**User story:** As a developer, I want `__BUILD_TIME__` typed in the ambient declarations, so that TypeScript compiles the component without `any`/untyped global errors.

Acceptance Criteria:
- 2.1 WHEN `src/vite-env.d.ts` is updated THE SYSTEM SHALL add a `declare const __BUILD_TIME__: number` line alongside the existing `__APP_VERSION__` declaration.
- 2.2 WHEN the new declaration is added THE SYSTEM SHALL leave the existing `declare const __APP_VERSION__: string` line unmodified.

### Requirement 3: Badge component rendering and formatting

**User story:** As an app user, I want to see the build timestamp formatted in my own timezone and locale, so that the displayed time is meaningful to me without any configuration.

Acceptance Criteria:
- 3.1 WHEN `HeaderBuildBadge` renders THE SYSTEM SHALL read the injected `__BUILD_TIME__` global and construct a `Date` from it.
- 3.2 WHEN formatting the build date THE SYSTEM SHALL call `toLocaleString` with no explicit locale argument (`undefined`), so THE SYSTEM SHALL render the timestamp using the viewer's browser locale.
- 3.3 WHEN formatting the build date THE SYSTEM SHALL call `toLocaleString` with no explicit `timeZone` option, so THE SYSTEM SHALL render the timestamp in the viewer's local timezone.
- 3.4 WHEN formatting the build date THE SYSTEM SHALL use `{ dateStyle: 'medium', timeStyle: 'short' }` as the formatting options.
- 3.5 WHEN the badge renders text content THE SYSTEM SHALL render exactly `built {formatted}`, with no other label variants.
- 3.6 THE SYSTEM SHALL implement `HeaderBuildBadge` as a component that accepts no props and holds no internal state.
- 3.7 THE SYSTEM SHALL locate the component exclusively at `src/components/header-build-badge/header-build-badge.tsx`.

### Requirement 4: Visual styling consistency

**User story:** As a user of the app, I want the new badge to look consistent with the existing footer version badge, so that the UI feels coherent.

Acceptance Criteria:
- 4.1 WHEN the badge renders THE SYSTEM SHALL apply the same pill treatment as `FooterVersionBadge`: `rounded-full`, `border border-[var(--border)]`, `bg-[var(--code-bg)]`, `px-2 py-0.5`, `text-xs`, `text-[var(--text)]`.
- 4.2 THE SYSTEM SHALL consume the existing hand-rolled CSS custom properties (`--border`, `--code-bg`, `--text`) via Tailwind arbitrary-value syntax, the same mechanism `FooterVersionBadge` uses.
- 4.3 THE SYSTEM SHALL NOT add `--background`, `--foreground`, `--muted-foreground`, or any `@theme` block to `src/index.css` or `tailwind.config.ts`.
- 4.4 THE SYSTEM SHALL NOT introduce any Shadcn semantic token migration as part of this feature.
- 4.5 WHERE styling decisions are needed THE SYSTEM SHALL reuse `FooterVersionBadge`'s approach read-only, without modifying any file under `src/components/footer-version-badge/`.

### Requirement 5: Positioning without collision

**User story:** As a user, I want the build badge and the version badge to never overlap, so that both remain legible at all times.

Acceptance Criteria:
- 5.1 WHEN the badge is positioned THE SYSTEM SHALL apply `fixed right-3 top-3` to the outer wrapper, placing it in the top-right corner of the viewport.
- 5.2 THE SYSTEM SHALL keep the badge's fixed position distinct from `FooterVersionBadge`'s fixed `right-3 bottom-3` position, so the two badges never overlap.
- 5.3 THE SYSTEM SHALL NOT set an explicit `z-index` on the badge, since its top-right position does not overlap the bottom-right footer badge.

### Requirement 6: Print visibility

**User story:** As a user printing a page, I want the build badge hidden from the printed output, so that print layouts stay clean.

Acceptance Criteria:
- 6.1 WHEN the page is printed THE SYSTEM SHALL apply `print:hidden` to the badge's outer wrapper so the badge does not appear in print output.

### Requirement 7: Non-interactive, accessible, always-rendered, config-free behavior

**User story:** As a developer maintaining this feature, I want the badge to be a simple, always-on, non-interactive static element, so that it requires no configuration and introduces no interactive surface to maintain or secure.

Acceptance Criteria:
- 7.1 THE SYSTEM SHALL render the badge as purely presentational markup, with no `onClick` handler, no `<a>`/`<Link>` element, and no clipboard API usage.
- 7.2 THE SYSTEM SHALL render the timestamp as a plain visible text node with no `aria-hidden` attribute, so it remains reachable by screen readers like any other static text.
- 7.3 WHEN the app runs in dev, staging, or production THE SYSTEM SHALL render the same badge markup unconditionally, with no `import.meta.env.DEV`/`PROD` gating.
- 7.4 THE SYSTEM SHALL NOT expose any props on `HeaderBuildBadge`, and SHALL NOT add any new settings, context, or store entry to configure the badge.

### Requirement 8: Single mount point integration

**User story:** As a developer, I want the badge mounted exactly once from the app root, so that it appears consistently across the app without duplicate mounts.

Acceptance Criteria:
- 8.1 WHEN `src/App.tsx` is updated THE SYSTEM SHALL mount `<HeaderBuildBadge />` once, alongside the existing `<FooterVersionBadge />` mount.
- 8.2 WHEN the mount is added THE SYSTEM SHALL make no other markup changes to `src/App.tsx`.
- 8.3 THE SYSTEM SHALL ensure no file other than `src/App.tsx` mounts `HeaderBuildBadge`.
- 8.4 WHEN any view of the (currently single-page) app renders THE SYSTEM SHALL display the badge, since it is mounted at the app root.

### Requirement 9: Ownership boundary and dependency constraints

**User story:** As a maintainer, I want this feature's file footprint and dependencies tightly scoped, so that it stays easy to review and does not introduce unnecessary coupling or supply-chain risk.

Acceptance Criteria:
- 9.1 THE SYSTEM SHALL treat `src/components/header-build-badge/` as exclusively owned by this feature, adding nothing unrelated to that directory.
- 9.2 THE SYSTEM SHALL NOT add files or feature-specific logic outside `src/components/header-build-badge/` other than the integration touches to `src/vite-env.d.ts`, `vite.config.ts`, and `src/App.tsx`.
- 9.3 THE SYSTEM SHALL implement the feature using only `react` (already a dependency) and native `Intl`/`Date`/`toLocaleString` APIs and Tailwind utility classes.
- 9.4 THE SYSTEM SHALL NOT add any new npm package to satisfy this feature's requirements.
