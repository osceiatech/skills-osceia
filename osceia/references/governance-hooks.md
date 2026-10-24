# Hooks e Harness — Angular OSCEA

Duas camadas, com papéis diferentes:

| Camada | Onde vive | Natureza |
|---|---|---|
| **Hooks da skill** (`hooks/`) | `~/.agents/skills/osceia/hooks/` + ativação em `~/.claude/settings.json` | Contexto e bootstrap, por máquina |
| **Harness do projeto** (`templates/harness/`) | Versionado em cada repositório | **Bloqueante**, vale para toda a equipe e todo agente |

Os antigos hooks de aviso (`feature-spec-check`, `ts-edit-counter`, `commit-size-check`,
`session-summary`) foram **removidos**: o guard do projeto passou a bloquear de verdade o que
eles só avisavam.

---

## Hooks da skill

| Script | Evento | O que faz |
|---|---|---|
| `session-start.sh` | `SessionStart` | Em pasta com `angular.json`, manda o Claude invocar a skill `osceia`, repassar o contexto (projeto, branch, passo do fluxo) e criar o que faltar do harness |
| `bootstrap-harness.sh [--check] [raiz]` | manual / pela skill | Cria, **sem sobrescrever**, os arquivos do harness a partir de `templates/harness/`; adiciona `prepare`/`carimbo` ao `package.json`; liga `core.hooksPath`; lista pendências manuais |
| `sync-harness.sh [--apply] [raiz]` | manual | Mostra (ou aplica) divergências dos arquivos de enforcement idênticos entre projetos (guard, carimbo, hooks git, ci.yml, templates de issue). Nunca toca em `harness.config`, `AGENTS.md` nem no template de PR |

### Instalar pelo marketplace (recomendado)

```bash
claude plugin marketplace add osceiatech/skills-osceia
claude plugin install osceia@skills-osceia --scope user
```

O plugin traz o hook `SessionStart` (`hooks/hooks.json`), então **não** é preciso editar o
`settings.json`. Se já houver o hook manual abaixo, remova-o para o hook não rodar duas vezes.

### Ativar manualmente na máquina (`~/.claude/settings.json`)

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.agents/skills/osceia/hooks/session-start.sh 2>/dev/null || true",
            "timeout": 15
          }
        ]
      }
    ]
  }
}
```

Mescle com os hooks já existentes (ex.: RTK em `PreToolUse`/`Bash`); não substitua. Valide com
`jq empty ~/.claude/settings.json`. Se o hook não aparecer, abra `/hooks` uma vez para recarregar.

---

## Harness do projeto (bloqueante)

Arquivos em `templates/harness/` (placeholders: `{{PROJETO}}`, `{{REPO}}`, `{{WORKFLOW_AZURE}}`):

| Arquivo | Função |
|---|---|
| `.agents/harness.config` | Regras do agente: git, testes, fluxo, `.notebook/`, issues/PRs, deploy |
| `.githooks/pre-commit` | Chama o guard: sem commit na `main`; código só com pesquisa + branch + spec |
| `.githooks/commit-msg` | Recusa mensagem com `Co-Authored-By:` de Claude/Anthropic ou "Generated with Claude Code" |
| `.githooks/pre-push` | Bloqueia push na `main`; roda `npm test` e `npm run build`; grava o carimbo |
| `scripts/guard-implementacao.mjs` | Lógica do guard (modos `commit` e `claude`) |
| `scripts/carimbo.mjs` | Gera/confere `refs/verificacoes/<sha>` |
| `scripts/instalar-hooks.mjs` | `npm install` → `core.hooksPath .githooks` |
| `.claude/settings.json` | PreToolUse: bloqueia Edit/Write fora do fluxo |
| `.github/workflows/ci.yml` | Confere carimbo, checklist e `Closes #<issue>` (não roda testes) |
| `.github/ISSUE_TEMPLATE/*`, `PULL_REQUEST_TEMPLATE.md`, `git-commit-instructions.md` | Formatos obrigatórios |
| `AGENTS.md`, `.claude/CLAUDE.md` | Regras Angular + ponteiro para o harness |

O workflow de deploy Azure (`azure-static-web-apps-*.yml`) é específico de cada projeto e
**não** está nos templates.

Fluxo para corrigir o enforcement: alterar em `templates/harness/` → `sync-harness.sh --apply`
em cada projeto → abrir issue/PR por projeto (a regra de git vale para a própria manutenção).
