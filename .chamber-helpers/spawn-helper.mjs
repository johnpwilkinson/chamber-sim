#!/usr/bin/env node
// chamber/spawn-helper.mjs — delegation-as-verb for the spawn-verb propensity
// cell (spec: docs/superpowers/specs/2026-08-10-spawn-verb-propensity-cell-design.md).
// Delivered INTO fixture workspaces as a file; also lives here for the selftest.
// Contract it must never break: metas land in <cwd>/.pi-subagents/artifacts with
// the exact field shape os-v2/driver/legs.mjs:381-419 reads — that is the cell's
// primary measurement. Every metering failure degrades silently to zeros (floor
// semantics, matching the witness's own doctrine).
import { spawn } from 'node:child_process';
import {
  appendFileSync, existsSync, mkdirSync, readFileSync, readdirSync,
  rmSync, writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const HDIR = '.chamber-helpers';
const SELF = fileURLToPath(import.meta.url);

export function loadConfig(root) {
  // provider defaults to 'claude-p', NOT null: chamber/runner.mjs buildPiArgs
  // (:1091) ALWAYS emits --provider piProviderFor(model), and piProviderFor
  // (:1088) falls back to 'claude-p' for any prefix outside PI_PROVIDERS —
  // including the 'brain/' of the default model. Omitting the flag would hand pi
  // a different dialect than every other leg in the fleet, and a provider/dialect
  // mismatch is what truncated 4/5 legs of the l1 luna cell.
  const defaults = { model: 'brain/claude-sonnet', provider: 'claude-p', maxLive: 2 };
  try {
    const raw = JSON.parse(readFileSync(join(root, HDIR, 'config.json'), 'utf8'));
    return { ...defaults, ...(raw && typeof raw === 'object' ? raw : {}) };
  } catch { return defaults; }
}

// Traycer-inherited ergonomics (spec §2.3): omitted params inherit config;
// unknown/invalid input WARNS and defaults — never refuses (spec §4.1).
export function parseCreateArgs(argv, config) {
  const out = { taskFile: null, name: null, model: config.model, warnings: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--task') out.taskFile = argv[++i] ?? null;
    else if (a === '--name') out.name = argv[++i] ?? null;
    else if (a === '--model') out.model = argv[++i] ?? config.model;
    else {
      // One warning per unknown FLAG, not per token: `--bogus x` is a single
      // mistake, so the flag swallows its adjacent value instead of accusing it
      // separately (an unknown flag's value is never a second unknown flag).
      out.warnings.push(`warning: unknown argument ${a} ignored`);
      const next = argv[i + 1];
      if (a.startsWith('--') && next !== undefined && !String(next).startsWith('--')) i++;
    }
  }
  if (!out.taskFile) out.warnings.push('warning: --task <file> is required to spawn; nothing spawned');
  if (!out.name && out.taskFile) out.name = out.taskFile.replace(/[^A-Za-z0-9_-]/g, '_');
  return out;
}

// Accumulate usage across pi --mode json output lines. Tolerant of both
// {input,output} and {input_tokens,output_tokens} spellings; anything
// unparseable contributes nothing (floor, never a throw).
export function usageFromPiJson(text) {
  const acc = { input: 0, output: 0, cacheRead: 0, turns: 0 };
  for (const line of String(text ?? '').split('\n')) {
    let o = null;
    try { o = JSON.parse(line); } catch { continue; }
    const u = o?.usage;
    if (!u || typeof u !== 'object') continue;
    acc.input += Number(u.input ?? u.input_tokens) || 0;
    acc.output += Number(u.output ?? u.output_tokens) || 0;
    acc.cacheRead += Number(u.cacheRead ?? u.cache_read_input_tokens) || 0;
    acc.turns += Number(u.turns) || 0;
  }
  return acc;
}

// Exact shape legs.mjs sumChildUsage reads: timestamp = COMPLETION stamp.
export function metaFor(name, startedMs, usage, nowMs = Date.now()) {
  return {
    name,
    timestamp: nowMs,
    durationMs: Math.max(0, nowMs - startedMs),
    usage: {
      input: Number(usage?.input) || 0,
      output: Number(usage?.output) || 0,
      cacheRead: Number(usage?.cacheRead) || 0,
      turns: Number(usage?.turns) || 0,
    },
  };
}

// ── slot bookkeeping ───────────────────────────────────────────────────────
// The queue is NUMBERED (live/0.pid … live/<maxLive-1>.pid), not name-keyed, so
// a slot can be claimed atomically. The decision half is pure and selftested;
// only the wx-create and the unlink are impure.
export function slotPaths(liveDir, maxLive) {
  return Array.from({ length: Math.max(0, maxLive) }, (_, i) => join(liveDir, `${i}.pid`));
}

// Which occupied slots are stale? A helper killed by a signal (leg teardown,
// OOM) never reaches its `finally`, so its slot file outlives it and would wedge
// every later helper forever. A slot whose recorded pid is unparseable, non-
// positive, or no longer alive is reapable.
export function deadSlots(entries, isAlive) {
  return entries
    .filter((e) => !Number.isInteger(e.pid) || e.pid <= 0 || !isAlive(e.pid))
    .map((e) => e.path);
}

export function renderPlaybook(config) {
  return `# Helper playbook

This is the STANDARD PROCEDURE for implementing a section with
3 or more independent leaves (leaves whose file boundaries do not overlap):

1. Write one task file per leaf under ${HDIR}/tasks/ — the leaf's fenced text
   from your prompt, verbatim, plus the repo-relative files it owns.
2. Spawn one helper per leaf:
   node ${HDIR}/spawn-helper.mjs create --task ${HDIR}/tasks/<leaf>.md --name <leaf>
3. After spawning ALL leaves, wait for every helper to finish:
   node ${HDIR}/spawn-helper.mjs collect --timeout 3000
4. Review what the helpers wrote, fix anything wrong, then produce your final
   report yourself as normal.

A maximum of ${config.maxLive} helpers run at once; extra creates queue
automatically — spawn all leaves up front and let the queue drain.

Helper harness table (this cell):

| role | model |
| --- | --- |
| helper implementer | ${config.model} |

Helpers write files only — they never commit and never edit tasks.md.
`;
}

// ── impure below: CLI verbs ────────────────────────────────────────────────
const dirs = (root) => ({
  h: join(root, HDIR),
  tasks: join(root, HDIR, 'tasks'),
  live: join(root, HDIR, 'live'),
  out: join(root, HDIR, 'out'),
  results: join(root, HDIR, 'results'),
  metas: join(root, '.pi-subagents', 'artifacts'),
});
const ensure = (d) => { for (const p of Object.values(d)) mkdirSync(p, { recursive: true }); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const pidAlive = (pid) => { try { process.kill(pid, 0); return true; } catch { return false; } };

function reapDeadSlots(liveDir, maxLive) {
  const entries = [];
  for (const p of slotPaths(liveDir, maxLive)) {
    let raw = null;
    try { raw = readFileSync(p, 'utf8'); } catch { continue; } // absent = already free
    entries.push({ path: p, pid: Number(String(raw).trim()) });
  }
  for (const p of deadSlots(entries, pidAlive)) { try { rmSync(p, { force: true }); } catch {} }
}

// Atomic claim. `wx` fails with EEXIST when another helper already owns the slot,
// so the winner is decided by the filesystem in one syscall. The previous
// check-then-write let a burst of helpers all observe an empty live/ and run
// N-wide — and the playbook explicitly tells the leg to spawn every leaf up front.
function tryClaimSlot(liveDir, maxLive, pid) {
  for (const p of slotPaths(liveDir, maxLive)) {
    try { writeFileSync(p, String(pid), { flag: 'wx' }); return p; } catch {}
  }
  return null;
}

function cmdPlaybook(root) { process.stdout.write(renderPlaybook(loadConfig(root))); }

function cmdCreate(root, argv) {
  const d = dirs(root); ensure(d);
  const a = parseCreateArgs(argv, loadConfig(root));
  for (const w of a.warnings) console.log(w);
  if (!a.taskFile) return; // warned above; never a nonzero exit (verb is forgiving)
  if (!existsSync(join(root, a.taskFile))) {
    console.log(`warning: task file ${a.taskFile} not found; nothing spawned`);
    return;
  }
  appendFileSync(join(d.h, 'lineage.log'),
    `${new Date().toISOString()} create name=${a.name} task=${a.taskFile} model=${a.model} ppid=${process.pid}\n`);
  const child = spawn(process.execPath, [SELF, '_run', a.taskFile, a.name, a.model],
    { cwd: root, detached: true, stdio: 'ignore' });
  child.unref();
  console.log(`spawned helper ${a.name} (queued if ${loadConfig(root).maxLive} already live)`);
}

async function cmdRun(root, [taskFile, name, model]) {
  const d = dirs(root); ensure(d);
  const cfg = loadConfig(root);
  // Self-throttling queue: hold until we ATOMICALLY own a slot (2-slot doctrine,
  // spec §4.1). Reap first so a signal-killed helper's orphaned slot cannot wedge
  // the queue permanently.
  let slot = null;
  for (;;) {
    reapDeadSlots(d.live, cfg.maxLive);
    slot = tryClaimSlot(d.live, cfg.maxLive, process.pid);
    if (slot) break;
    await sleep(5000);
  }
  const startedMs = Date.now();
  let stdout = '', code = -1;
  try {
    const prompt = readFileSync(join(root, taskFile), 'utf8') +
      '\nImplement exactly this leaf in the current directory. Write files only.' +
      ' Do NOT commit. Do NOT edit tasks.md. When done, stop.';
    // argv shape: chamber/runner.mjs:1091. --provider is UNCONDITIONAL there, so
    // it is unconditional here too; an explicit null in config.json still lands
    // on the same 'claude-p' floor piProviderFor would have chosen.
    const args = ['-p', '--no-session', '--mode', 'json',
                  '--provider', cfg.provider ?? 'claude-p',
                  '--model', model, prompt];
    code = await new Promise((resolveP) => {
      const p = spawn('pi', args, { cwd: root });
      p.stdout.on('data', (c) => { stdout += c; });
      p.stderr.on('data', () => {});
      p.on('error', () => resolveP(-1));
      p.on('close', (c) => resolveP(c ?? -1));
    });
  } finally {
    const nowMs = Date.now();
    try { writeFileSync(join(d.out, `${name}.json`), stdout); } catch {}
    try {
      writeFileSync(join(d.metas, `helper_${name}_${nowMs}_meta.json`),
        JSON.stringify(metaFor(name, startedMs, usageFromPiJson(stdout), nowMs)));
    } catch {}
    try {
      writeFileSync(join(d.results, `${name}.json`),
        JSON.stringify({ name, taskFile, exitCode: code, durationMs: nowMs - startedMs }));
    } catch {}
    // Release the slot we actually CLAIMED (numbered), not a name-derived guess.
    try { if (slot) rmSync(slot, { force: true }); } catch {}
  }
}

async function cmdCollect(root, argv) {
  const d = dirs(root); ensure(d);
  const ti = argv.indexOf('--timeout');
  const timeoutS = ti >= 0 ? (Number(argv[ti + 1]) || 3000) : 3000;
  const expected = new Set();
  try {
    for (const line of readFileSync(join(d.h, 'lineage.log'), 'utf8').split('\n')) {
      const m = /name=(\S+)/.exec(line);
      if (m) expected.add(m[1]);
    }
  } catch {}
  const deadline = Date.now() + timeoutS * 1000;
  for (;;) {
    const done = new Set(readdirSync(d.results).map((f) => f.replace(/\.json$/, '')));
    if ([...expected].every((n) => done.has(n)) || Date.now() > deadline) break;
    await sleep(5000);
  }
  for (const n of expected) {
    let r = null;
    try { r = JSON.parse(readFileSync(join(d.results, `${n}.json`), 'utf8')); } catch {}
    console.log(r ? `helper ${n}: exit ${r.exitCode} in ${Math.round(r.durationMs / 1000)}s`
                  : `helper ${n}: NO RESULT (still running or died before writing)`);
  }
  // Repo-wide snapshot, not per-child: concurrent helpers share this worktree,
  // so per-child attribution is not honestly computable here (design deviation,
  // logged in the spec's deviations section).
  try {
    console.log('files touched (all helpers + you):');
    console.log(execFileSync('git', ['status', '--porcelain'], { cwd: root }).toString());
  } catch {}
}

const isMain = process.argv[1] && SELF === (await import('node:fs')).realpathSync(process.argv[1]);
if (isMain) {
  const [verb, ...rest] = process.argv.slice(2);
  const root = process.cwd();
  if (verb === 'playbook') cmdPlaybook(root);
  else if (verb === 'create') cmdCreate(root, rest);
  else if (verb === '_run') await cmdRun(root, rest);
  else if (verb === 'collect') await cmdCollect(root, rest);
  else console.log('usage: spawn-helper.mjs playbook|create|collect (see helper-playbook.md)');
}
