module.exports = {
  forbidden: [
    // EDIT-ME: sdd-derived rules (begin)
    {"name":"sdd-keyboard-shortcuts-no-internal-imports","severity":"warn","comment":"Only index.ts is a public entry point; consumers outside the feature must not import its internal files directly.","from":{"path":"^(?!src/keyboard-shortcuts/).+"},"to":{"path":"^src/keyboard-shortcuts/(?!index\\.ts$).+"}},
    {"name":"sdd-keyboard-shortcuts-no-shared-css","severity":"warn","comment":"The feature must not edit or depend on the shared App/index global stylesheets.","from":{"path":"^src/keyboard-shortcuts/"},"to":{"path":"^src/(App|index)\\.css$"}},
    // EDIT-ME: sdd-derived rules (end)
  ],
  options: { doNotFollow: { path: "node_modules" } },
};
