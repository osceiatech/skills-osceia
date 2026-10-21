# skills-osceia

Repositório central para o desenvolvimento, teste e integração de habilidades (skills) e automações do ecossistema OSCEIA/Fóton.

## Conteúdo

| Pasta | Tipo | Descrição |
|---|---|---|
| [`authenticated-web-system-reverse-engineering/`](./authenticated-web-system-reverse-engineering/) | Skill metodológica | Orquestra engenharia reversa segura de sistemas web autenticados com Playwright/CDP e Crawlee opcional, incluindo gates de somente leitura e LGPD |
| [`speckit-preset-osceia/`](./speckit-preset-osceia/) | Preset Spec Kit | Localiza o [Spec Kit](https://github.com/github/spec-kit) para PT-BR com gates obrigatórios de Acessibilidade (WCAG 2.1 AA) e Privacidade (LGPD) |

## Instalar no Claude Code (marketplace)

Cada skill e cada mod é um **plugin separado**: você instala só o que quiser e escolhe o escopo.

```bash
# 1. registrar o marketplace (uma vez)
/plugin marketplace add osceiatech/skills-osceia

# 2. escolher o que instalar, em menu interativo (pede o escopo)
/plugin
```

Ou direto, sem menu:

```bash
claude plugin install tdd@skills-osceia --scope user       # em todos os seus projetos
claude plugin install tdd@skills-osceia --scope project    # neste projeto, versionado em .claude/settings.json (vale para o time)
claude plugin install tdd@skills-osceia --scope local      # neste projeto, só para você (não vai para o Git)
```

| Escopo | Onde fica | Quem usa |
|---|---|---|
| `user` | `~/.claude/settings.json` | você, em qualquer projeto |
| `project` | `.claude/settings.json` do repositório | todo o time, ao abrir o projeto |
| `local` | `.claude/settings.local.json` | só você, só neste projeto |

Vários de uma vez (exemplo: o tema Escrita e ensino):

```bash
for p in edit-article writing-beats writing-fragments writing-shape teach caveman; do
  claude plugin install "$p@skills-osceia" --scope user
done
```

### Plugins disponíveis

| Tema | Plugins |
|---|---|
| Desenvolvimento OSCEIA | `osceia-dev`, `authenticated-web-system-reverse-engineering`, `feature-doc-generator`, `gh-issue-dor-dod`, `markitdown-local`, `md-to-pdf`, `osceia-design`, `technical-design-doc-creator` |
| Escrita e ensino | `caveman`, `edit-article`, `teach`, `writing-beats`, `writing-fragments`, `writing-shape` |
| Fluxo de engenharia | `codenavi`, `council`, `cyclomatic-complexity`, `design-an-interface`, `diagnose`, `git-guardrails`, `grill-me`, `grill-with-docs`, `handoff`, `improve-codebase-architecture`, `migrate-to-shoehorn`, `prototype`, `qa`, `request-refactor-plan`, `review`, `scaffold-exercises`, `setup-matt-pocock-skills`, `setup-pre-commit`, `tdd`, `tlc-spec-driven`, `to-issues`, `to-prd`, `triage`, `ubiquitous-language`, `zoom-out` |
| Criar e achar skills | `find-skills`, `write-a-skill` |
| Outros | `defuddle` |
| Mods do Claude Code | `educa-lateral`, `osceia-chat`, `usage-line` |

A skill instalada aparece com o prefixo do plugin (ex.: `/tdd:tdd`).

### Mod `educa-lateral`

Painel à direita (~40% do terminal) que explica, em textos curtos, as tecnologias escolhidas enquanto algo é
desenvolvido. Detalhes em [`educa-lateral/README.md`](./educa-lateral/README.md).

```bash
claude plugin install educa-lateral@skills-osceia --scope user
```

### Mod `osceia-chat`

Tema **OSCEIA Chat** (azul-marinho `#101840`, verde `#00CA6A` e dourado `#FBC26E`, as cores do site) e chat com
respiro: linha em branco entre as mensagens, texto recuado sob o marcador `●` e a mensagem da pessoa em bloco
sombreado, ao estilo do Codex. Depois de instalar, escolha o tema em `/theme` ("OSCEIA Chat").

```bash
claude plugin install osceia-chat@skills-osceia --scope user
```

O mascote do Claude Code é recolorido (verde sobre azul-marinho), mas a imagem em si não pode ser trocada por um mod.

### Mod `usage-line`

Linha de status compacta com o consumo da sessão: modelo, branch, barras de contexto e dos limites 5h/7d, custo e
estado do cache de prompt. Detalhes em [`usage-line/README.md`](./usage-line/README.md).

```bash
claude plugin install usage-line@skills-osceia --scope user
```

### Atualizar

```bash
/plugin marketplace update skills-osceia
claude plugin update <plugin>@skills-osceia
```

### Manter (mantenedores)

- Nova skill: crie a pasta com `SKILL.md` e adicione uma entrada em `.claude-plugin/marketplace.json`
  (`source: "./<pasta>"`, `strict: false`, `skills: ["./"]`, `category`).
- Mudou uma skill: **incremente o `version`** da entrada; sem isso, quem já instalou não recebe a atualização.
- Valide com `claude plugin validate .`.

## Uso rápido

```bash
# Instalar o preset OSCEIA num projeto já iniciado com o Spec Kit
specify preset add osceiatech/skills-osceia/speckit-preset-osceia

# Adotar a constituição-base no projeto
cp speckit-preset-osceia/memory/constitution.md .specify/memory/constitution.md
```
