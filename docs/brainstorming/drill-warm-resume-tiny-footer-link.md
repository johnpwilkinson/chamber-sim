# Brainstorm: Drill Warm Resume — Tiny Footer Link

## Summary

A minimal feature: add a small, subtle "Resume" link to the app footer that points to `/resume`. Static, no state, no logic — a single component touch.

## Discussion

**Q: What problem is "drill warm resume" solving — is this about letting a user quickly resume an in-progress drill/exercise session from where they left off (a "warm" cached state), and the "tiny footer link" is the UI entry point for that resume action? Can you describe the core user scenario in a sentence or two?**
A: Nothing fancy — literally a tiny footer link. Add a small subtle "Resume" link in the app footer pointing to "/resume". Static, no state, no logic, one component touch. That's the entire feature.

**Q: Should this "Resume" link always be visible in the footer, or only conditionally shown (e.g., only when a drill session actually exists to resume)?**
A: For now always.

**Q: Should the link open `/resume` in the same tab (standard navigation), or in a new tab?**
A: New tab.

**Q: Should the link have any icon, or just be plain text ("Resume")?**
A: Text.

**Q: Any specific placement within the footer (e.g., far right, next to existing links) or styling detail to match "subtle" (like matching existing footer link muted-text style)?**
A: Bottom left.

**Q: Anything else to add, or should the brainstorming be finalized?**
A: Write it up.

## Converged Feature Definition

- Add a plain-text "Resume" link to the app footer.
- Always visible (no conditional logic).
- Positioned bottom left of the footer.
- Links to `/resume`, opens in a new tab.
- Styled subtly (matching existing footer link style).
- No additional state, data fetching, or logic — a single static component change.
