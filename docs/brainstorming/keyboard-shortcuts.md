# Brainstorm: Keyboard Shortcuts

Date: 2026-07-11

## Summary

A fixed, non-customizable set of keyboard shortcuts for the web app, covering a
small core set of actions (search, save) plus a discoverability mechanism
(help overlay). Mac-only key conventions, mostly single-key (Gmail-style)
bindings with a couple of modifier-based exceptions. Shortcuts are disabled
while typing in inputs/forms, except for Escape.

- **Search**: `⌘K` (command palette style)
- **Save**: `⌘S`
- **Help overlay / cheat sheet**: `?` (conventional)
- **Escape**: closes modals/overlays, clears search, cancels actions — works
  even while typing in an input/form field.

Navigation shortcuts (e.g. `j`/`k`, `g`-prefixed "go to") were considered but
deferred — out of scope for this initial pass.

## Questions and Answers

1. **Q: How many keyboard shortcuts / commands are you envisioning covering
   initially — a small core set (e.g. navigation, save, search) or a
   comprehensive set across most app actions?**
   A: Small core set (navigation, save, search, etc.)

2. **Q: What kind of application is this for — a web app, desktop app, or
   something else — since that affects which key combos are safe to use
   without conflicting with the browser/OS?**
   A: Web app

3. **Q: Should the shortcuts be customizable/rebindable by the user, or fixed
   and predefined by the app?**
   A: Fixed and predefined by the app

4. **Q: Should there be a way for users to discover the available shortcuts,
   like a "?" help overlay or cheat sheet?**
   A: Yes — help overlay / cheat sheet

5. **Q: Should shortcuts be disabled/ignored while the user is typing in a
   text input or form field (to avoid conflicts with normal typing), or
   should some still work even then?**
   A: Disable most while typing (except Escape, etc.)

6. **Q: Do you want the same shortcuts to work identically on Mac and
   Windows/Linux (e.g. mapping Cmd vs Ctrl automatically), or are you only
   targeting one platform's convention?**
   A: Mac only

7. **Q: Do you want to use single-key shortcuts (like Gmail's `j`/`k`/`c`),
   modifier-based combos (like `⌘K`), or a mix depending on the action?**
   A: Mostly single-key (Gmail-style)

8. **Q: Which specific actions do you want shortcuts for in this initial
   set — e.g., what should trigger save, search, and navigation, and are
   there other core actions to include?**
   A: Search

9. **Q: What key should trigger Search (e.g., `/` like Gmail/Slack, or
   something else)?**
   A: ⌘K (command palette style)

10. **Q: What key(s) should trigger Save?**
    A: ⌘S

11. **Q: What keys should handle navigation (e.g., `j`/`k` to move up/down a
    list, `g` then a letter for "go to" sections, arrow keys, etc.)?**
    A: Just save and search for now

12. **Q: Earlier you mentioned Escape should still work while typing — what
    should Escape do (e.g., close modals/overlays, clear search, cancel an
    action)?**
    A: Sure — Escape should close modals/overlays, clear search, and cancel
    actions

13. **Q: What key should open the help overlay/cheat sheet — the
    conventional `?`?**
    A: ? (conventional)

14. **Q: Is there anything else you'd like to cover, or should we consider
    this brainstorm complete?**
    A: Complete — wrap it up
