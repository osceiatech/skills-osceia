# skills-osceia

Repositório central para o desenvolvimento, teste e integração de habilidades (skills) e automações do ecossistema OSCEIA/Fóton.

## Conteúdo

| Pasta | Tipo | Descrição |
|---|---|---|
| [`authenticated-web-system-reverse-engineering/`](./authenticated-web-system-reverse-engineering/) | Skill metodológica | Orquestra engenharia reversa segura de sistemas web autenticados com Playwright/CDP e Crawlee opcional, incluindo gates de somente leitura e LGPD |
| [`speckit-preset-osceia/`](./speckit-preset-osceia/) | Preset Spec Kit | Localiza o [Spec Kit](https://github.com/github/spec-kit) para PT-BR com gates obrigatórios de Acessibilidade (WCAG 2.1 AA) e Privacidade (LGPD) |

## Instalar como marketplace do Claude Code

Este repositório é um marketplace (`.claude-plugin/marketplace.json`) com plugins agrupados por tema:

| Plugin | Conteúdo |
|---|---|
| `osceia-dev` | osceia-design, angular-oscea, TDD técnico, DoR/DoD, md-to-pdf, markitdown-local, engenharia reversa |
| `engineering-workflow` | tdd, diagnose, review, qa, triage, to-prd, to-issues, grill-me, etc. |
| `obsidian-tools` | obsidian-*, json-canvas, defuddle |
| `writing-tools` | edit-article, writing-*, teach, caveman |
| `skill-authoring` | find-skills, write-a-skill |

```
/plugin marketplace add osceiatech/skills-osceia
/plugin install osceia-dev@skills-osceia
```

**Atualizar:** `/plugin marketplace update skills-osceia` e depois `/plugin update <plugin>@skills-osceia`.

**Publicar uma nova versão (mantenedores):** adicione a skill em `.claude-plugin/marketplace.json` (no plugin do tema) e **incremente o `version`** do plugin alterado — sem isso, usuários não recebem a atualização. Valide com `claude plugin validate .`.

## Uso rápido

```bash
# Instalar o preset OSCEIA num projeto já iniciado com o Spec Kit
specify preset add osceiatech/skills-osceia/speckit-preset-osceia

# Adotar a constituição-base no projeto
cp speckit-preset-osceia/memory/constitution.md .specify/memory/constitution.md
```
