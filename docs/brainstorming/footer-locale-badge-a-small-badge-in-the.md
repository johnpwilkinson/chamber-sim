# Brainstorming: footer-locale-badge

## Feature Description

A small badge in the app footer, immediately before the existing env-mode badge, showing the browser locale read from `navigator.language` (for example `en-us`). Reuse the exact same pill styling and fixed-position pattern as the existing footer badges, visually identical apart from content. Always visible, text forced lowercase via `.toLowerCase()`, raw value with no label prefix, `title` attribute of `"browser locale"`. Unit tests for render and text content using a single active-locale test case, no multi-value mocking. No new dependencies, no `vite.config` changes, no new defines, no dark mode, no routing, no settings. Scope is one small component plus footer wiring and tests — same size as the env-mode-badge feature. Exact `right-N` offset and any adjustment to neighboring badges' offsets left to the design phase.

## Existing Pattern (context gathered during brainstorm)

- `src/components/footer-env-mode-badge/footer-env-mode-badge.tsx` renders a fixed-position `<div>` (`fixed right-20 bottom-3 print:hidden`) wrapping a `<span>` pill (`rounded-full border border-[var(--border)] bg-[var(--code-bg)] px-2 py-0.5 text-xs text-[var(--text)]`) with `title="vite mode"`, showing `import.meta.env.MODE.toLowerCase()`.
- Sibling footer badges: `FooterVersionBadge` at `right-3 bottom-3` (`src/components/footer-version-badge/footer-version-badge.tsx`), `FooterCommitBadge` at `right-44 bottom-3` with an added hover tooltip (`src/components/footer-commit-badge/footer-commit-badge.tsx`). Layout order left-to-right (by increasing `right-N`): version (`right-3`) → env-mode (`right-20`) → commit (`right-44`).
- Each footer badge is its own independently fixed-positioned component (not a shared flex/footer container) — components are stacked side by side purely via different `right-N` Tailwind offsets, and each is mounted directly in `src/App.tsx` alongside the others.
- `footer-env-mode-badge.test.tsx` is the direct precedent for this feature's tests: it covers text content/lowercasing, fixed positioning classes, print:hidden, pill styling classes, the static `title` attribute, no explicit z-index, no interactive elements, no `aria-hidden`, discoverable plain text, and a zero-arg component signature — all against a single active `MODE` value read at test time (no mocking of multiple modes).
- `import.meta.env.MODE` is a fixed build-time constant, always present. `navigator.language` is a runtime browser API without that same guarantee, which is why this brainstorm surfaced two new questions the env-mode-badge brainstorm didn't need: whether to read it statically or reactively, and how to handle it being unavailable.

## Questions and Answers

1. **Q: Should the badge read `navigator.language` once on mount (static, like the env-mode badge reads `import.meta.env.MODE`), or should it listen for the browser's `languagechange` event and update live if the locale changes during the session?**
   A: Static.

2. **Q: Should the component guard against `navigator.language` being missing/undefined (e.g. render a fallback like `"unknown"`, or fall back to `navigator.languages[0]`), or should it trust `navigator.language` is always present in-browser and read it directly with no fallback — consistent with the "no defensive code beyond what's needed" scope of the env-mode badge?**
   A: Fall back to an `"unknown"` string.

3. **Q: Should the fallback-to-"unknown" behavior get its own dedicated test (requiring one instance of mocking `navigator.language` as undefined), or should it be implemented in the component but left untested, keeping the test suite strictly to the single active-locale case?**
   A (after disambiguating a "Yes" reply against the two offered options): Option A — a dedicated test that mocks `navigator.language` as undefined to verify the `"unknown"` fallback renders. This is a single, scoped exception to the "no multi-value mocking" constraint (which applies to mocking multiple *locale values*, not to this one missing-value fallback test).

## Converged Scope

- New component (mirroring `FooterEnvModeBadge`'s structure) that renders a fixed-position, always-visible pill badge showing `navigator.language`, read once (static, not reactive to `languagechange`), lowercased explicitly via `.toLowerCase()`, with `title="browser locale"`.
- If `navigator.language` is missing/undefined, the badge falls back to rendering `"unknown"` instead.
- Same pill styling as the existing footer badges (`rounded-full border border-[var(--border)] bg-[var(--code-bg)] px-2 py-0.5 text-xs text-[var(--text)]`), positioned immediately before (to the left of) `FooterEnvModeBadge` using the existing `right-N` offset pattern.
- Wired into `src/App.tsx` alongside the other footer badges.
- Raw locale text only, no label prefix.
- Unit tests for render and text content, using a single active-locale test case (no multi-value locale mocking), plus one dedicated test mocking `navigator.language` as undefined to cover the `"unknown"` fallback path.
- No new dependencies, no `vite.config` changes, no new defines, no dark mode, no routing, no settings — scope matches the existing footer env-mode badge feature in size.
- Exact `right-N` offset value and any adjustment to neighboring badges' offsets (env-mode, commit) to make room are left to the design phase.
