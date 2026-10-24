# skills-osceia

Repositório central para o desenvolvimento, teste e integração de habilidades (skills) e automações do ecossistema OSCEIA/Fóton.

## Conteúdo

O repositório é um **marketplace do Claude Code** (`skills-osceia`): cada skill e cada mod é um plugin
separado, e você instala só o que precisar. Além deles, há dois materiais que não são plugins:

| Pasta | Tipo | Descrição |
|---|---|---|
| [`authenticated-web-system-reverse-engineering/`](./authenticated-web-system-reverse-engineering/) | Skill metodológica | Orquestra engenharia reversa segura de sistemas web autenticados com Playwright/CDP e Crawlee opcional, incluindo gates de somente leitura e LGPD |
| [`speckit-preset-osceia/`](./speckit-preset-osceia/) | Preset Spec Kit | Localiza o [Spec Kit](https://github.com/github/spec-kit) para PT-BR com gates obrigatórios de Acessibilidade (WCAG 2.1 AA) e Privacidade (LGPD) |

## Instalar no Claude Code (marketplace)

O marketplace `skills-osceia` tem dois tipos de item, instalados do mesmo jeito:

- **Skills**: instruções que o Claude segue quando você as chama ou quando a conversa pede (ex.: `tdd`, `osceia`).
- **Plugins (mods)**: mudam a interface do Claude Code (tema, painel, linha de status).

Cada um é instalável **separadamente**: você instala só o que precisar.

### 1. Registrar o marketplace (uma vez por máquina)

```bash
/plugin marketplace add osceiatech/skills-osceia
```

### 2. Escolher o escopo

| Escopo | Onde fica | Quem usa |
|---|---|---|
| `user` | `~/.claude/settings.json` | você, em qualquer projeto |
| `project` | `.claude/settings.json` do repositório | todo o time, ao abrir o projeto |
| `local` | `.claude/settings.local.json` | só você, só neste projeto |

### Atualizar

```bash
/plugin marketplace update skills-osceia
claude plugin update <nome>@skills-osceia
```

## Skills

### Instalar uma skill

**Pelo menu**, escolhendo a skill e o escopo na tela:

```bash
/plugin
```

**Direto**, informando o escopo:

```bash
claude plugin install osceia@skills-osceia --scope user       # em todos os seus projetos
claude plugin install osceia@skills-osceia --scope project    # neste projeto, versionado (vale para o time)
claude plugin install osceia@skills-osceia --scope local      # neste projeto, só para você (não vai para o Git)
```

Em Claude Code 2.1.275 ou superior também funciona a forma curta:
`/plugin install <skill> --marketplace osceiatech/skills-osceia`.

### Instalar várias skills

Liste os nomes (exemplo: o tema Escrita e ensino):

```bash
for p in edit-article writing-beats writing-fragments writing-shape teach caveman; do
  claude plugin install "$p@skills-osceia" --scope user
done
```

### Instalar todas as skills

Lê o `marketplace.json` e instala tudo que não é mod:

```bash
gh api repos/osceiatech/skills-osceia/contents/.claude-plugin/marketplace.json -H 'Accept: application/vnd.github.raw' \
  | jq -r '.plugins[] | select(.category != "mods") | .name' \
  | while read -r p; do claude plugin install "$p@skills-osceia" --scope user; done
```

### Usar

A skill instalada aparece com o prefixo do plugin (ex.: `/tdd:tdd`, `/osceia:osceia`). Quem prefere o
nome curto (`/osceia`) pode linkar a pasta em `~/.claude/skills/`:

```bash
ln -s ~/.agents/skills/osceia ~/.claude/skills/osceia
```

### Skills disponíveis

#### Desenvolvimento OSCEIA

| Plugin | O que faz |
|---|---|
| `osceia` | Padrões Angular/React da OSCEA (Tailwind 4, signals, zoneless, a11y), Supabase, Twenty CRM, auth (Firebase ou Azure AD), harness de governança e ciclo de verificação a cada sessão. Já registra o hook de início de sessão |
| `osceia-design` | Guia de design institucional: paleta, tipografia, componentes, relatórios Word/PDF, processos BPMN e acessibilidade |
| `authenticated-web-system-reverse-engineering` | Engenharia reversa funcional de sistemas web autenticados (menus, rotas, formulários, regras) com navegação segura e LGPD |
| `feature-doc-generator` | Gera um "espelho" descritivo de uma feature Angular em `/doc/`, para passar à IA gastando menos tokens |
| `gh-issue-dor-dod` | Cria issues no GitHub com os checklists de Definition of Ready e Definition of Done, no template do repositório |
| `technical-design-doc-creator` | Cria Technical Design Documents (TDD) completos por descoberta interativa |
| `markitdown-local` | Converte PDF, DOCX, PPTX, XLSX, MSG e HTML locais em Markdown, com o MarkItDown da Microsoft |
| `md-to-pdf` | Converte Markdown em PDF com cabeçalho, rodapé, numeração de páginas e CSS próprio |

#### Escrita e ensino

| Plugin | O que faz |
|---|---|
| `caveman` | Modo de comunicação ultra-compacta, que corta cerca de 75% dos tokens mantendo a precisão técnica |
| `edit-article` | Edita e melhora artigos: reestrutura seções, clareia e enxuga a prosa |
| `teach` | Ensina uma habilidade ou conceito novo dentro do próprio workspace |
| `writing-beats` | Monta um artigo como jornada de "beats", no estilo escolha-sua-aventura |
| `writing-fragments` | Sessão de perguntas que extrai fragmentos de texto como matéria-prima para um artigo |
| `writing-shape` | Transforma notas e rascunhos em artigo publicável, parágrafo a parágrafo |

#### Fluxo de engenharia

| Plugin | O que faz |
|---|---|
| `codenavi` | Investiga código desconhecido, implementa com cirurgia e mantém uma base `.notebook/` entre sessões |
| `council` | Conselho de 6 conselheiros com lentes opostas para decisões reais, sem validação automática |
| `cyclomatic-complexity` | Mede e refatora complexidade ciclomática em Angular/TypeScript, com config de ESLint e testes |
| `design-an-interface` | Gera várias interfaces radicalmente diferentes para um módulo, com sub-agentes em paralelo |
| `diagnose` | Ciclo disciplinado para bugs difíceis: reproduzir, minimizar, hipótese, instrumentar, corrigir, teste de regressão |
| `git-guardrails` | Instala hooks que bloqueiam comandos git perigosos (push, `reset --hard`, `clean`, `branch -D`) |
| `grill-me` | Entrevista implacável sobre um plano até fechar o entendimento |
| `grill-with-docs` | Igual ao `grill-me`, mas confronta o plano com o modelo de domínio e atualiza CONTEXT.md e ADRs |
| `handoff` | Compacta a conversa num documento para outro agente continuar |
| `improve-codebase-architecture` | Acha oportunidades de aprofundar módulos e melhorar a arquitetura, guiado por CONTEXT.md e ADRs |
| `migrate-to-shoehorn` | Troca `as` por `@total-typescript/shoehorn` em arquivos de teste |
| `prototype` | Protótipo descartável: app de terminal para lógica/estado, ou várias variações de UI numa rota |
| `qa` | Sessão de QA conversacional que abre issues no GitHub |
| `request-refactor-plan` | Plano de refatoração em commits pequenos, via entrevista, publicado como issue |
| `review` | Revisa mudanças em dois eixos, padrões do repositório e aderência à spec, em paralelo |
| `scaffold-exercises` | Cria a estrutura de exercícios (seções, problemas, soluções) que passa no lint |
| `setup-matt-pocock-skills` | Configura o bloco `## Agent skills` e `docs/agents/` para as skills de engenharia |
| `setup-pre-commit` | Configura Husky, lint-staged (Prettier), checagem de tipos e testes no commit |
| `tdd` | Desenvolvimento orientado a testes com o ciclo red-green-refactor |
| `tlc-spec-driven` | Planejamento em 4 fases (Specify, Design, Tasks, Execute) com tarefas atômicas e verificação |
| `to-issues` | Quebra um plano ou PRD em issues independentes, em fatias verticais |
| `to-prd` | Transforma o contexto da conversa em PRD e publica no tracker |
| `triage` | Tria issues por uma máquina de estados e prepara as prontas para um agente |
| `ubiquitous-language` | Extrai um glossário de linguagem ubíqua (DDD) da conversa, sinalizando ambiguidades |
| `zoom-out` | Pede ao agente uma visão mais ampla de uma área de código desconhecida |

#### Criar e achar skills

| Plugin | O que faz |
|---|---|
| `find-skills` | Descobre e instala skills quando você pergunta "existe uma skill para X?" |
| `write-a-skill` | Cria skills novas com estrutura correta e recursos empacotados |

#### Outros

| Plugin | O que faz |
|---|---|
| `defuddle` | Extrai Markdown limpo de páginas web, sem navegação nem ruído, para gastar menos tokens |

## Plugins (mods do Claude Code)

### Instalar um mod

```bash
claude plugin install osceia-chat@skills-osceia --scope user
```

### Instalar todos os mods

```bash
for p in educa-lateral osceia-chat usage-line; do
  claude plugin install "$p@skills-osceia" --scope user
done
```

### Mods disponíveis

| Plugin | O que faz |
|---|---|
| `educa-lateral` | Painel lateral que explica as tecnologias escolhidas enquanto algo é desenvolvido |
| `osceia-chat` | Tema OSCEIA e chat com respiro entre as mensagens |
| `usage-line` | Linha de status com modelo, branch, contexto, limites 5h/7d, custo e cache |

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
