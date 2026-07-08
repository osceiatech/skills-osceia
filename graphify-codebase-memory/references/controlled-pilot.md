# Controlled Pilot Checklist

Use this checklist before deciding whether Graphify belongs in a workflow or portfolio.

## Setup

- [ ] Work in a temporary clone or clean branch.
- [ ] Record repo name and commit.
- [ ] Use pinned Graphify: `uvx --from graphifyy==0.9.9 graphify ...`.
- [ ] Do not run `graphify install`.
- [ ] Do not run `graphify hook install`.
- [ ] Do not commit `graphify-out/` by default.

## Baseline commands

```bash
cd /path/to/repo
uvx --from graphifyy==0.9.9 graphify version
uvx --from graphifyy==0.9.9 graphify update . --no-cluster
uvx --from graphifyy==0.9.9 graphify cluster-only . --no-viz --no-label
```

Record:

```text
repo:
commit:
graphify version:
AST elapsed time:
cluster elapsed time:
nodes:
edges:
communities:
graphify-out/graph.json size:
```

## Question battery

Run 5-10 representative questions. Include at least:

1. a known central service/helper;
2. an impact question before a hypothetical change;
3. a route/entrypoint to service/helper relationship;
4. a domain concept spanning docs and code;
5. a likely ambiguous symbol to expose failure modes.

Recommended command mix:

```bash
graphify explain <Symbol>
graphify affected <Symbol> --depth 2
graphify path <A> <B>
graphify query "specific domain terms" --budget 1200
```

For every result, record:

- Did it find the expected file/symbol?
- Did it reveal useful dependencies?
- Was it ambiguous or noisy?
- Which source files must be read to confirm?

## Compare to normal exploration

For 2-3 questions, compare against native tools:

- `search_files` / `grep` for locating symbols;
- `read_file` for confirming source;
- Graphify for relationship/impact view.

Graphify is useful if it reduces orientation time or reveals relationships normal search makes tedious.

## Approval criteria

Approve continued use only if:

- Graphify output is materially useful in at least two representative areas;
- AST-only update is fast enough for the repo;
- ambiguous/noisy outputs are understandable and manageable;
- source reads confirm the important graph claims;
- the team understands Graphify as an exploration map, not source of truth.

Reject or postpone if:

- most useful results require LLM labeling/extraction that is not approved;
- generated artifacts are too large/noisy;
- symbols are too ambiguous to trust;
- normal search/read is faster for the project;
- the tool encourages skipping source-file verification.
