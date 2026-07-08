# Graphify Command Reference

Use these commands through the pinned package form:

```bash
uvx --from graphifyy==0.9.9 graphify <command>
```

Do not assume a `graphify` executable on PATH is current.

## Version check

```bash
uvx --from graphifyy==0.9.9 graphify version
```

Expected:

```text
graphify 0.9.9
```

If a PATH binary exists, compare it but do not rely on it:

```bash
command -v graphify || true
graphify version || true
```

## Build/update the graph

Cheap AST-only baseline:

```bash
uvx --from graphifyy==0.9.9 graphify update . --no-cluster
```

Expected artifacts:

```text
graphify-out/graph.json
graphify-out/manifest.json
graphify-out/cache/stat-index.json
```

Run after code changes when manually maintaining the graph.

## Cluster/report

```bash
uvx --from graphifyy==0.9.9 graphify cluster-only . --no-viz --no-label
```

Expected artifact:

```text
graphify-out/GRAPH_REPORT.md
```

Use `--no-viz` during pilots to avoid extra HTML artifact handling. Use `--no-label` to avoid LLM/API labeling cost.

## Explain a symbol or file

```bash
uvx --from graphifyy==0.9.9 graphify explain AuthService
uvx --from graphifyy==0.9.9 graphify explain getSupabaseClient
uvx --from graphifyy==0.9.9 graphify explain mkt-twenty-crm-client.ts
```

Best for:

- locating the source file/line for a known symbol;
- seeing direct imports/calls/methods;
- checking degree/centrality quickly.

## Affected analysis

```bash
uvx --from graphifyy==0.9.9 graphify affected AuthService --depth 2
uvx --from graphifyy==0.9.9 graphify affected createQueueClient --depth 2
```

Best for estimating impact before touching shared services/helpers.

Caveat: duplicate names can fail with `No unique node match`. Use a more specific query or inspect with `query`/`explain` first.

## Path between two known points

```bash
uvx --from graphifyy==0.9.9 graphify path login.component.ts AuthService
uvx --from graphifyy==0.9.9 graphify path app.routes.ts AuthService
```

Best for known files/symbols with unique labels. Less reliable with generic labels such as `handler`, `index.ts`, or partial paths.

## Domain query

```bash
uvx --from graphifyy==0.9.9 graphify query "CPF APIBrasil validação lookup" --budget 1600
uvx --from graphifyy==0.9.9 graphify query "LGPD consentimento consent função" --budget 1600
```

Best for mapping a domain concept across docs and code. Use specific terms. Broad natural-language questions can be noisy.

## Output hygiene

Keep generated files out of commits by default:

```gitignore
graphify-out/
```

Before committing unrelated work:

```bash
git status --short
git diff --stat
```
