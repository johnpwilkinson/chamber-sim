# Helper playbook

This is the STANDARD PROCEDURE for implementing a section with
3 or more independent leaves (leaves whose file boundaries do not overlap):

1. Write one task file per leaf under .chamber-helpers/tasks/ — the leaf's fenced text
   from your prompt, verbatim, plus the repo-relative files it owns.
2. Spawn one helper per leaf:
   node .chamber-helpers/spawn-helper.mjs create --task .chamber-helpers/tasks/<leaf>.md --name <leaf>
3. After spawning ALL leaves, wait for every helper to finish:
   node .chamber-helpers/spawn-helper.mjs collect --timeout 3000
4. Review what the helpers wrote, fix anything wrong, then produce your final
   report yourself as normal.

A maximum of 2 helpers run at once; extra creates queue
automatically — spawn all leaves up front and let the queue drain.

Helper harness table (this cell):

| role | model |
| --- | --- |
| helper implementer | claude-p/claude-sonnet-5 |

Helpers write files only — they never commit and never edit tasks.md.
