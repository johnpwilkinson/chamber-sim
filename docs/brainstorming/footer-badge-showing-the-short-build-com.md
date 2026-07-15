# Brainstorming: Footer Build Commit SHA Badge

## Topic

A small badge in the footer showing the short build commit sha, with the
full sha revealed on hover. Placed next to the existing `FooterVersionBadge`
(bottom-right, `v{version}`). Also relevant: the existing `HeaderBuildBadge`
(top-right, `built {time}`), since both use the same build-time `define`
pattern in `vite.config.ts` (`__APP_VERSION__`, `__BUILD_TIME__`) that a new
`__COMMIT_SHA__` global should follow.

## Discussion

**Q1: Where should the commit sha get injected into the build — a Vite
`define`/env var populated by CI (e.g. reading `git rev-parse` at build
time), or should the app fetch it at runtime from some other source (e.g. a
`version.json` or an API)?**
A: Whatever is simpler. Resolved to build-time injection via Vite `define`
(matches the existing `__APP_VERSION__`/`__BUILD_TIME__` pattern already in
`vite.config.ts`).

**Q2: Should the commit sha be added into the existing `FooterVersionBadge`
(e.g. `v1.2.3 (abc1234)`), or should it be a separate new badge?**
A: New badge, placed right next to the existing one.

**Q3: For the hover-to-reveal full sha, should it use the browser's native
`title` attribute tooltip, or a custom-styled tooltip consistent with the
app's existing badge look-and-feel?**
A: Custom styled tooltip (colors left to implementer's discretion).

**Q4: What length should the "short" sha be — git's default of 7
characters, or a different fixed length?**
A: Match `git rev-parse --short HEAD`'s own output length (git's default
abbreviation, not a hardcoded length).

**Q5: What should happen if the commit sha can't be determined at build
time (e.g. no `.git` directory, git not installed, building from a
tarball)?**
A: Fall back to the literal text "whoops".

**Q6: Should the full sha also be reachable without a mouse (e.g. focusable
so the tooltip shows on keyboard focus / tap), or is mouse-hover-only
acceptable, matching the other badges which are static/non-interactive?**
A: Mouse-hover only.

**Q7: Should clicking the badge copy the full sha to clipboard, or remain
purely non-interactive, matching the other badges?**
A: Match the other badges — non-interactive, no click handler.

**Q8: Should the badge link out to the commit on a repo host (e.g. GitHub
commit URL), or stay as plain non-interactive text with no link?**
A: Match the other badges — no link, plain text.
(User noted: default to "match" for any subsequent question where matching
existing badge behavior is an option.)

**Q9: Should the new sha badge sit to the left of the existing version
badge, or to the right of it (further from the edge)?**
A: Right of the version badge.

**Q10: What text/format should the badge show — the bare short sha (e.g.
`abc1234`), or with a prefix like `#abc1234` or `commit abc1234`?**
A: Bare short sha, no prefix.

**Q11: Should the hover tooltip show just the bare full sha, or with a
label like `Full: abc1234...`?**
A: Bare full sha, no label.

**Q12: When the sha is unavailable and the badge shows "whoops", should
hovering still show a tooltip (e.g. also "whoops"), or should there be no
tooltip in that case?**
A: No tooltip in the fallback state.

## Converged Scope

- New component (separate from `FooterVersionBadge`), rendered once,
  positioned in the bottom-right footer area immediately to the right of
  the existing `FooterVersionBadge`.
- New `__COMMIT_SHA__` build-time global set in `vite.config.ts` via
  `define`, computed the same way `__APP_VERSION__`/`__BUILD_TIME__` are
  today (e.g. `git rev-parse --short HEAD` for the short sha, and the full
  sha for the tooltip) — no runtime fetch, no CI-only env var dependency.
- Badge displays the bare short sha (git's own abbreviation length, e.g.
  `abc1234`) with no prefix.
- On mouse hover only, a custom-styled tooltip (not the native `title`
  attribute) reveals the bare full sha, no label, styled consistently with
  the app's existing badge look (e.g. existing `--border`/`--code-bg`/
  `--text` custom properties); exact colors left to implementation.
- No keyboard/touch access to the tooltip — hover-only, matching the
  static/non-interactive nature of the sibling badges.
- No click behavior, no clipboard copy, no outbound link — purely
  non-interactive text, matching `HeaderBuildBadge` and
  `FooterVersionBadge`.
- Fallback: if the commit sha can't be determined at build time (no
  `.git`, git missing, tarball build), the badge displays the literal text
  "whoops" and has no tooltip at all in that state.
