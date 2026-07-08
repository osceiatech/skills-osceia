# OSCEIA Graphify Pilot Findings

Date: 2026-07-07
Pinned package: `graphifyy==0.9.9`

These findings justify a thin OSCEIA skill while keeping Graphify as upstream runtime.

## Pilot 1 — osceia-admin

Repo type: Angular frontend.
Commit analyzed: `c63d3f4`.

Baseline:

```text
AST extraction: 143/143 uncached files
Nodes: 1291
Edges: 2414 before cluster / 2027 after cluster
Communities: 87
AST elapsed: ~5s
LLM token cost: 0
```

Useful queries:

```bash
graphify explain AuthService
graphify affected AuthService --depth 2
graphify path login.component.ts AuthService
graphify explain ApiService
graphify affected ApiService --depth 2
graphify path app.routes.ts AuthService
graphify explain PermissoesStore
graphify explain VagasService
```

Good results:

- `AuthService` mapped to `src/app/core/services/auth/auth.service.ts:L16` with guards, layout, stores, directives, pages, and components depending on it.
- `ApiService` mapped to `src/app/core/services/api/api.service.ts:L13` with HTTP/GraphQL methods and service consumers.
- `path app.routes.ts AuthService` found `app.routes.ts --imports_from--> role.guard.ts --imports--> AuthService`.
- `PermissoesStore` and `VagasService` were well explained by dependents and methods.

Caveats:

- broad Portuguese queries can return many loosely related nodes;
- `--no-label` leaves communities named `Community N`;
- generated `graph.json` can be large enough to avoid committing by default.

## Pilot 2 — osceia-api

Repo type: Supabase Edge Functions / TypeScript / SQL.
Commit analyzed: `ddac593`.

Baseline:

```text
AST extraction: 122/122 uncached files
Nodes: 467
Edges: 920 before cluster / 859 after cluster
Communities: 18
AST elapsed: ~16s
LLM token cost: 0
```

Useful queries:

```bash
graphify explain validateFirebaseToken
graphify explain verifyAnyToken
graphify explain handleCreate
graphify explain createQueueClient
graphify affected createQueueClient --depth 2
graphify explain getSupabaseClient
graphify query "LGPD consentimento consent função" --budget 1600
graphify query "CPF APIBrasil validação lookup" --budget 1600
```

Good results:

- `validateFirebaseToken()` mapped to `_shared/auth.ts:L15` and showed many function imports.
- `verifyAnyToken()` mapped to `_shared/auth-any.ts:L32` for multi-auth.
- `handleCreate()` in `mkt-admin-forms/_handler.ts` exposed calls to `getClient`, `logAudit`, `slugify`, `uniqueSlug`, and response helpers.
- `createQueueClient()` showed impact across `mkt-admin-forms`, `mkt-submissions`, `mkt-sync-worker`, and tests.
- `getSupabaseClient()` showed its bridge role for marketing handlers and queue client.
- LGPD query connected README entries with `cam-save-lgpd/index.ts`, `LgpdInput`, `computeHash`, consent functions, auth, and Supabase helpers.
- CPF/APIBrasil query connected `cam-validate-cpf` and `oapp-cpf-lookup`, showing duplicated/convergent logic.

Caveats:

- generic symbols like `handler()` and `index.ts` reduce god-node legibility;
- duplicate symbols can make `affected` fail with `No unique node match`;
- `path` is weaker with partial/ambiguous labels;
- SQL migrations are less deeply represented than TypeScript.

## Portfolio Decision

Create a thin OSCEIA skill for controlled use. Do not vendor upstream Graphify or install global Graphify skills/hooks by default.

Default posture:

```text
experimental / optional controlled / codebase intelligence
```

Promote only after repeated successful use in real tasks.
