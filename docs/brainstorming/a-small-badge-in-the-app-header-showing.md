# Brainstorming: Header Build Timestamp Badge

## Topic

A small badge in the app header showing the build timestamp, styled to match
the existing footer version badge (`src/components/footer-version-badge/`).
That badge is a single component rendered directly in `App.tsx` (there is no
separate header/footer shell in the app), fixed to the bottom-right corner,
and sourced from a build-time constant (`__APP_VERSION__`) injected via a
Vite `define` reading `package.json`. No build-timestamp injection currently
exists in the repo.

## Discussion

**Q1: What should the badge's timestamp source be — a value injected at
build time (e.g. a Vite `define` set to the build's `Date.now()`, analogous
to how `__APP_VERSION__` is injected from `package.json`), or something else
like the last git commit's date / CI build metadata?**
A: Whatever is least friction.
Resolved as: a build-time injected constant via a Vite `define`, mirroring
`__APP_VERSION__`.

**Q2: Should the timestamp be displayed as a raw ISO string, a formatted
date/time, or a relative form (e.g. "built 3h ago")?**
A: Formatted.

**Q3: Should the formatted timestamp use the viewer's local timezone, or a
fixed timezone (e.g. UTC)?**
A: Local (viewer's browser timezone).

**Q4: Should this badge be visible in all environments (dev, staging,
production — like the footer version badge), or only in non-production
environments?**
A: All environments, like the footer version badge.

**Q5: Since there's no existing header shell component (everything renders
directly in `App.tsx`), where should the badge be positioned?**
A: Fixed top-right, mirroring the footer badge's fixed bottom-right
placement.

**Q6: What label/prefix should the badge text have?**
A: `built {timestamp}`.

**Q7: Should the header badge also hide when printing (the footer badge has
`print:hidden`), or stay visible in printed views?**
A: Hide from print.

## Converged Scope

- New component (e.g. `src/components/header-build-badge/`), rendered once
  in `App.tsx` alongside the existing `FooterVersionBadge`, fixed to the
  top-right corner of the viewport (mirroring the footer badge's fixed
  bottom-right placement and margin).
- Timestamp is a build-time injected constant (new Vite `define`, e.g.
  `__BUILD_TIME__`, set at build time), following the same pattern as
  `__APP_VERSION__` in `vite.config.ts`.
- Displayed formatted (not raw ISO, not relative), rendered in the viewer's
  local timezone.
- Text content: `built {timestamp}`.
- Rendered in all environments (dev, staging, production) — no env gating,
  same as the footer version badge.
- Hidden when printing (`print:hidden` or equivalent).
- Styling to match the footer version badge: same chip/pill treatment and
  shared CSS vars/theme tokens (`--border`, `--code-bg`, `--text`), just
  repositioned to the top-right.
