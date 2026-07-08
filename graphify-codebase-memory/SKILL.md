---
name: graphify-codebase-memory
description: Use Graphify as a version-pinned local codebase/documentation knowledge graph for architecture onboarding, dependency impact analysis, and repo navigation. Use when the user wants to map a repo, understand dependencies, inspect affected symbols, or run a controlled Graphify pilot. Do not use as conversational memory, do not vendor Graphify upstream, and do not install global skills/hooks unless explicitly approved.
version: 0.1.0
author: OSCEIA + Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [graphify, codebase-memory, architecture, dependency-analysis, osceia]
    related_skills: [improve-codebase-architecture, diagnose, request-refactor-plan]
---

# Graphify Codebase Memory

Use Graphify as a **local, version-pinned knowledge graph** for a repository's code and documentation. It is useful for onboarding, architecture navigation, dependency impact analysis, and finding structural relationships before reading individual files.

This is a thin OSCEIA wrapper around the upstream Graphify runtime. **Do not copy/vendor the upstream Graphify skill or runtime into this repo.** Keep Graphify as an upstream package and pin the version used in each pilot.

## Current Pin

Use this package/version unless the user explicitly asks to evaluate an upgrade:

```bash
uvx --from graphifyy==0.9.9 graphify ...
```

Notes:

- PyPI package name: `graphifyy` with two `y`.
- CLI command exposed by the package: `graphify`.
- Graphify output directory: `graphify-out/`.

## When to Use

Use this skill when the user asks to:

- map a codebase or documentation corpus into a graph;
- understand a repo's architecture, dependencies, or central modules;
- inspect what depends on a symbol before changing it;
- compare Graphify against normal `search_files`/`read_file` exploration;
- run a controlled pilot before adding a tool-skill to the OSCEIA portfolio;
- create evidence for whether a thin OSCEIA Graphify setup skill is justified.

Do **not** use this skill for:

- persistent conversational memory or decision logs;
- storing user preferences or session learnings;
- replacing source-file reads before making code changes;
- automatic global installation of Graphify;
- installing Git hooks without explicit user approval;
- committing `graphify-out/` unless the user intentionally wants generated graph artifacts versioned.

## Operating Rules

1. **Keep it controlled.** Use `uvx --from graphifyy==0.9.9 graphify ...`; do not rely on a `graphify` binary already on PATH. Done when `uvx --from graphifyy==0.9.9 graphify version` prints the expected version.
2. **Do not mutate the agent environment by default.** Avoid `graphify install`, global skill install, and `graphify hook install` during pilots. Done when no global skill/hook was added.
3. **Start AST-only.** Run `graphify update . --no-cluster` first to get a cheap baseline. Done when `graphify-out/graph.json` exists and the command exits 0.
4. **Cluster/report separately.** Run `graphify cluster-only . --no-viz --no-label` only after AST extraction works. Done when `graphify-out/GRAPH_REPORT.md` exists.
5. **Treat the graph as a map, not truth.** Use Graphify to find candidate files/symbols; read the source files before changing code or making final claims. Done when source-file evidence is cited for any code decision.
6. **Keep generated artifacts out of git by default.** Add or respect `graphify-out/` in `.gitignore` unless there is a deliberate reason to version reports. Done when `git status` shows no accidental generated graph files staged.

## Quick Pilot Workflow

From a clean temporary clone or working tree:

```bash
cd /path/to/repo
uvx --from graphifyy==0.9.9 graphify version
uvx --from graphifyy==0.9.9 graphify update . --no-cluster
uvx --from graphifyy==0.9.9 graphify cluster-only . --no-viz --no-label
```

Then run focused queries:

```bash
uvx --from graphifyy==0.9.9 graphify explain AuthService
uvx --from graphifyy==0.9.9 graphify affected AuthService --depth 2
uvx --from graphifyy==0.9.9 graphify path login.component.ts AuthService
uvx --from graphifyy==0.9.9 graphify query "CPF APIBrasil validação lookup" --budget 1600
```

Prefer these commands by task:

| Task | Preferred command |
|---|---|
| Find where a symbol lives and what touches it | `graphify explain <Symbol>` |
| Estimate impact before changing a shared helper | `graphify affected <Symbol> --depth 2` |
| Check a relationship between two known points | `graphify path <A> <B>` |
| Explore a domain concept across docs and code | `graphify query "specific domain terms" --budget 1200-2000` |
| Get architecture overview/god nodes | read `graphify-out/GRAPH_REPORT.md` |

See [command-reference.md](references/command-reference.md) for more examples and caveats.

## Evaluation Pattern

A successful pilot should compare Graphify to normal exploration.

For each repo, record:

- repo name and commit;
- Graphify version;
- command timings;
- node/edge counts;
- generated file sizes;
- 5-10 representative questions;
- whether Graphify found correct files/symbols;
- where Graphify was ambiguous or noisy;
- whether source-file reads confirmed the graph.

Use [controlled-pilot.md](references/controlled-pilot.md) as the checklist.

## Known OSCEIA Findings

Two controlled pilots justified this thin wrapper:

- `osceia-admin` / Angular frontend: Graphify was useful for `AuthService`, `ApiService`, routes, stores, and component/service impact analysis.
- `osceia-api` / Supabase Edge Functions: Graphify was useful for shared auth helpers, queue/Supabase clients, LGPD/consentimento, CPF/APIBrasil lookup, and documentation-to-code navigation.

See [pilot-findings.md](references/pilot-findings.md) for details.

## Common Pitfalls

1. **Using an old global `graphify`.** If `graphify` is on PATH, it may be stale. Prefer `uvx --from graphifyy==0.9.9 graphify ...` every time.
2. **Updating global skills during a pilot.** `graphify install` can write agent skills/configs. Do not run it unless the user explicitly approves global or project-scoped installation.
3. **Installing hooks too early.** `graphify hook install` changes Git hooks. Keep updates manual until the workflow proves valuable.
4. **Trusting ambiguous symbols.** Repos with many `handler()` or `index.ts` files need more specific labels or follow-up `query`/source reads.
5. **Overusing open-ended queries.** Broad Portuguese questions can be noisy. Prefer specific symbols or domain terms.
6. **Treating Graphify as memory of decisions.** It maps the corpus; ADRs, `learnings.md`, Obsidian, or Hermes memory still handle durable decisions and user preferences.

## Verification Checklist

- [ ] Graphify was run via `uvx --from graphifyy==0.9.9`, not an unpinned PATH binary.
- [ ] No global Graphify skill, hook, or config was installed without explicit user approval.
- [ ] `graphify update . --no-cluster` exited 0 and produced `graphify-out/graph.json`.
- [ ] If clustering was needed, `cluster-only . --no-viz --no-label` exited 0 and produced `GRAPH_REPORT.md`.
- [ ] At least 5 representative questions were tested for a pilot decision.
- [ ] Ambiguous/noisy results were recorded, not hidden.
- [ ] Final architectural/code claims were confirmed by reading source files.
- [ ] `graphify-out/` was not accidentally committed.
