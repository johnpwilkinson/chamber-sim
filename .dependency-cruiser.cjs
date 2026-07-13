module.exports = {
  forbidden: [
    // EDIT-ME: sdd-derived rules (begin)
    {
      name: "sdd-command-palette-src-components-command-palette-is-exclusively-this-features",
      comment: "sdd-derived from kiro design commitment \"`src/components/command-palette/` is exclusively this feature's\": Nothing unrelated gets added there, and this feature adds nothing outside it except the integration touches listed above. Forbids sibling folders under src/components/ (e.g. ui/ or any future feature directory) from depending on command-palette internals, while permitting command-palette's own internal imports and the sanctioned src/App.tsx integration touch (which lives outside src/components/).",
      severity: "error",
      from: { path: "^src/components/(?!command-palette/)" },
      to: { path: "^src/components/command-palette/" },
    },
    {
      name: "sdd-command-palette-src-components-ui-is-a-shared-shadcn-primitives-folder-not-command-palette-owned",
      comment: "sdd-derived from kiro design commitment \"`src/components/ui/` is a shared Shadcn primitives folder, not command-palette-owned\": This feature adds only the two primitives it needs (`command`, `dialog`) and does not pre-populate the rest of Shadcn's catalog. Future features add their own primitives here without needing command-palette's sign-off.",
      severity: "error",
      from: { path: "^src/components/ui" },
      to: { path: "^src/components/command-palette" },
    },
    {
      name: "sdd-command-palette-tailwind-shadcn-config-is-a-one-time-project-bootstrap-not-a-long-term-command-palette-possession",
      comment: "sdd-derived from kiro design commitment \"Tailwind/Shadcn config is a one-time project bootstrap, not a long-term command-palette possession\": `components.json` and the Tailwind wiring exist because this is the first feature to need them; once merged, they belong to the project, not to this feature.",
      severity: "error",
      from: { path: "^src/(components/ui|lib/utils)" },
      to: { path: "^src/components/command-palette" },
    },
    {
      name: "sdd-command-palette-no-real-command-entries",
      comment: "sdd-derived from kiro design commitment \"No real command entries\": `commands.ts` ships with empty category arrays. Populating navigation targets, quick actions, or search results is follow-on work, gated on the app having real pages/content.",
      severity: "error",
      from: { path: "^src/components/command-palette/commands\\.ts$" },
      to: { path: "^src/(?!components/command-palette/)" },
    },
    {
      name: "sdd-command-palette-no-runtime-registration-api",
      comment: "sdd-derived from kiro design commitment \"No runtime registration API\": The command list is a static, hand-edited array. Nothing in this feature exposes a way for other parts of the app to register commands dynamically (brainstorm Q3).",
      severity: "error",
      from: { path: "^src/(?!components/command-palette/)" },
      to: { path: "^src/components/command-palette/commands\\.ts$" },
    },
    {
      name: "sdd-command-palette-no-visible-trigger-ui",
      comment: "sdd-derived from kiro design commitment \"No visible trigger UI\": `Cmd/Ctrl+K` is the only entry point; no header button/icon is added (brainstorm Q5). App.tsx is the sole mount point for this feature (req 4.1/4.2) and may only import the sanctioned root `command-palette.tsx`; any other file wired in from that folder (e.g. a trigger/button component) would be the smuggled-in visible trigger this commitment forbids.",
      severity: "error",
      from: { path: "^src/App\\.tsx$" },
      to: { path: "^src/components/command-palette/(?!command-palette\\.tsx$).+" },
    },
    {
      name: "sdd-command-palette-no-custom-selection-filter-logic",
      comment: "sdd-derived from kiro design commitment \"No custom selection/filter logic\": Keyboard and mouse selection, and empty-state rendering, come from `cmdk`/Shadcn's `Command` primitive as-is — this feature does not fork or reimplement that behavior. Feature files under src/components/command-palette/ (command-palette.tsx, commands.ts) must consume cmdk only via the shared wrapper at src/components/ui/command.tsx, never import cmdk directly, which is how a fork/reimplementation of its selection, filter, or empty-state behavior would enter this feature.",
      severity: "error",
      from: { path: "^src/components/command-palette" },
      to: { path: "^cmdk$" },
    },
    // EDIT-ME: sdd-derived rules (end)
  ],
  options: { doNotFollow: { path: "node_modules" } },
};
