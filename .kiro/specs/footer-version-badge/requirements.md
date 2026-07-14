# Footer Version Badge — Requirements

## Requirement 1: Version Display

**User Story:** As a user of the app, I want to see the running application version in a small badge, so that I can identify which build I'm using.

- 1.1 WHEN the app renders THE SYSTEM SHALL display a badge showing the application version prefixed with `v` (e.g. `v0.0.0`).
- 1.2 THE SYSTEM SHALL derive the displayed version from the `version` field of `package.json`.
- 1.3 THE SYSTEM SHALL render the version text as a plain, unmodified text node (no truncation, no additional formatting beyond the `v` prefix).

## Requirement 2: Build-Time Version Injection

**User Story:** As a developer, I want the version to be baked in at build time, so that the badge never depends on runtime access to `package.json` and adds no bundle weight beyond a string.

- 2.1 WHEN the application is built or the dev server starts THE SYSTEM SHALL inject the version string into the client bundle via Vite's `define` config option under the global identifier `__APP_VERSION__`.
- 2.2 THE SYSTEM SHALL read `package.json`'s `version` field via a static `import` in `vite.config.ts` at config-load time.
- 2.3 THE SYSTEM SHALL NOT perform a runtime `fetch` or dynamic `import()` of `package.json` to obtain the version.
- 2.4 THE SYSTEM SHALL NOT require any change to `resolveJsonModule` in `tsconfig.app.json`.
- 2.5 THE SYSTEM SHALL limit modification of `vite.config.ts` to adding the `define: { __APP_VERSION__: JSON.stringify(pkg.version) }` entry (and the static `import` of `package.json` needed to support it), leaving the existing `react()`/`tailwindcss()` plugin list, `resolve.alias` configuration, and all other existing config entries unmodified.

## Requirement 3: TypeScript Ambient Declaration

**User Story:** As a developer, I want TypeScript to recognize the injected version global, so that the codebase compiles without type errors.

- 3.1 WHEN TypeScript compiles code that references `__APP_VERSION__` THE SYSTEM SHALL provide an ambient declaration of `__APP_VERSION__: string` in `src/vite-env.d.ts`.
- 3.2 IF `src/vite-env.d.ts` does not already exist THE SYSTEM SHALL create it as a new file including a `/// <reference types="vite/client" />` directive alongside the `__APP_VERSION__` declaration.

## Requirement 4: Component Ownership and Structure

**User Story:** As a developer maintaining the codebase, I want the badge implemented as a single self-contained component, so that its scope and ownership are unambiguous.

- 4.1 THE SYSTEM SHALL implement the badge as a component named `FooterVersionBadge` at `src/components/footer-version-badge/footer-version-badge.tsx`.
- 4.2 THE SYSTEM SHALL implement `FooterVersionBadge` with no props and no internal state.
- 4.3 THE SYSTEM SHALL treat `src/components/footer-version-badge/` as exclusively owned by this feature, adding no unrelated files to that directory.

## Requirement 5: Mounting

**User Story:** As a user, I want the badge to appear on every view of the app, so that the version is always visible regardless of what page I'm on.

- 5.1 WHEN the app root renders THE SYSTEM SHALL mount `<FooterVersionBadge />` exactly once, from `src/App.tsx`.
- 5.2 THE SYSTEM SHALL mount `<FooterVersionBadge />` alongside the existing `<CommandPalette />` mount without making other markup changes to `src/App.tsx`.
- 5.3 THE SYSTEM SHALL NOT mount `FooterVersionBadge` from any file other than `src/App.tsx`.

## Requirement 6: Positioning and Visual Style

**User Story:** As a user, I want the version badge to appear as a subtle, unobtrusive pill in the corner of the screen, so that it doesn't interfere with the rest of the UI or clash with the app's theme.

- 6.1 WHERE the badge is displayed THE SYSTEM SHALL position it `fixed` to the bottom-right corner of the viewport with a 12px offset from the right and bottom edges (`right-3 bottom-3`).
- 6.2 THE SYSTEM SHALL render the badge as a pill/chip shape using rounded-full styling, a border, and a background color derived from the existing `--code-bg` CSS custom property.
- 6.3 THE SYSTEM SHALL render the badge text using small font sizing (`text-xs`) and a color derived from the existing `--text` CSS custom property.
- 6.4 THE SYSTEM SHALL style the badge using Tailwind arbitrary-value syntax that references the existing hand-rolled CSS custom properties (`--border`, `--code-bg`, `--text`) rather than introducing new design tokens.
- 6.5 THE SYSTEM SHALL NOT set an explicit `z-index` on the badge or its wrapper.
- 6.6 THE SYSTEM SHALL NOT add a Shadcn semantic token set (e.g. `--background`, `--foreground`, `--muted-foreground`, or any `@theme` block) to `src/index.css` or `tailwind.config.ts`.

## Requirement 7: Print Behavior

**User Story:** As a user printing a page, I want the version badge to not appear on the printed output, so that it doesn't clutter printed documents.

- 7.1 WHEN the page is printed THE SYSTEM SHALL hide the badge via `print:hidden` applied to its outer wrapper element.

## Requirement 8: Non-Interactivity and Accessibility

**User Story:** As a user relying on assistive technology, I want the version text to be plain, reachable static text with no interactive behavior, so that it behaves predictably and doesn't introduce unexpected controls.

- 8.1 THE SYSTEM SHALL render the badge with no click handlers, no `<a>`/`<Link>` elements, and no clipboard-copy behavior.
- 8.2 THE SYSTEM SHALL NOT apply `aria-hidden` to the badge or its text.
- 8.3 THE SYSTEM SHALL expose the version text as plain, screen-reader-visible text, reachable like any other static text on the page.

## Requirement 9: Always-On Rendering

**User Story:** As a user or developer, I want the badge to show up consistently in every environment, so that the version is always available for reference regardless of build mode.

- 9.1 WHEN the app runs in either a development build or a production build THE SYSTEM SHALL render the badge unconditionally with identical markup.
- 9.2 THE SYSTEM SHALL NOT gate rendering of the badge using `import.meta.env.DEV` or `import.meta.env.PROD`.

## Requirement 10: No Configuration Surface

**User Story:** As a developer, I want the badge to be zero-configuration, so that there is no additional surface area to maintain or document.

- 10.1 THE SYSTEM SHALL NOT expose any props on `FooterVersionBadge`.
- 10.2 THE SYSTEM SHALL NOT introduce any new settings, context, or store entry to configure the badge.

## Requirement 11: Dependency and File Scope

**User Story:** As a maintainer, I want this feature to add no new dependencies and touch no files outside its declared boundary, so that the change stays minimal and reviewable.

- 11.1 THE SYSTEM SHALL implement this feature using only `react` (an existing dependency) and Tailwind utility classes, adding no new npm package.
- 11.2 THE SYSTEM SHALL NOT modify `src/index.css`, `tailwind.config.ts`, `components.json`, `App.css`, or any file under `src/assets/*` as part of this feature.
- 11.3 THE SYSTEM SHALL limit the total set of touched/created files to `src/components/footer-version-badge/footer-version-badge.tsx` (created, owned), `src/components/footer-version-badge/footer-version-badge.test.tsx` (created, direct unit test for the owned component), `src/vite-env.d.ts` (created if absent, bootstrapped), `vite.config.ts` (touched per Requirement 2), and `src/App.tsx` (touched per Requirement 5), with no other file added or modified.
