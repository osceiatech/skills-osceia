Repo analisado: https://github.com/affaan-m/ECC

## Veredito curto

**ECC pode agregar bastante, mas não como “importar tudo”.**

Eu trataria como uma **mina de referência/curadoria**, não como uma dependência direta do nosso portfólio OSCEIA.

Ele é um ecossistema grande de workflows para agentes: skills, agents, commands, hooks, regras, instalação multi-harness, segurança, auditoria, pesquisa e orquestração. Tem muita coisa boa, mas também muita sobreposição com o que já temos no Hermes/OSCEIA e várias partes são muito orientadas a Claude Code/OpenCode/Cursor.

Minha recomendação inicial:

> **Não adicionar o ECC como tap inteiro. Selecionar 5–10 ideias/skills de alto valor, adaptar para o padrão OSCEIA e manter triggers mais restritos.**

---

## Sinais objetivos do repositório

Via GitHub/API e clone local:

```text
Repo: affaan-m/ECC
Licença: MIT
Descrição: agent harness performance optimization system
Branch padrão: main
Criado em: 2026-01-18
Último push: 2026-07-03
Público: sim
Arquivado: não
```

Números reportados pelo GitHub:

```text
Stars: 225621
Forks: 34506
Watchers: 1151
```

Esses números são extremamente altos para um repo criado em 2026. Não estou dizendo que são falsos, mas eu colocaria como **sinal a validar**, não como prova automática de maturidade.

Estrutura local detectada:

```text
skills:   277
agents:   67
commands: 92
rules:    122
hooks:    4
scripts:  210
```

O repo é grande mesmo.

---

## O que o ECC parece ser

O ECC se define como:

> “Harness-native agent operating system”

Na prática, ele reúne:

- skills estilo `SKILL.md`;
- agentes especializados;
- comandos slash;
- regras por linguagem/framework;
- hooks;
- instalador seletivo;
- auditoria de configuração;
- workflows para Claude Code, Codex, Cursor, OpenCode, Gemini, Zed etc.;
- documentação de segurança e arquitetura de agentes;
- algumas ideias de controle operacional parecidas com Hermes.

Ele inclusive tem documentação explícita sobre Hermes:

```text
docs/HERMES-SETUP.md
docs/HERMES-OPENCLAW-MIGRATION.md
```

A visão deles é:

```text
Hermes = operator shell
ECC = reusable workflow substrate
```

Isso é interessante para nós porque conversa diretamente com o que estamos fazendo no OSCEIA: curadoria de skills, workflows reutilizáveis, segurança, automação e governança de agente.

---

## Validação técnica feita

Clonei o repo em `/tmp/ecc-analysis`.

Rodei validações do próprio projeto.

### Validação de skills

Passou:

```text
Validated 277 skill directories
```

### Validações do `npm test`

O início da suíte passou:

```text
Unicode safety check passed.
Validated 67 agent files
Validated 92 command files
Validated 122 rule files
Validated 277 skill directories
Validated 28 hook matchers
Validated 32 install modules, 78 install components, and 7 profiles
Validated: no personal absolute paths in shipped docs/skills/commands
Catalog counts:
- agents: 67
- commands: 92
- skills: 277
Documentation counts match the repository catalog.
```

Mas houve um problema no check de command registry:

```text
docs/COMMAND-REGISTRY.json is out of date; run npm run command-registry:write
EXIT:1
```

Também tentei rodar `node tests/run-all.js` diretamente, mas passou de 180s e deu timeout.

Então o sinal é:

- **estrutura de skills valida**;
- **catálogo e manifestos parecem consistentes**;
- **há pelo menos um check desatualizado**;
- **não consegui concluir toda a suíte dentro do tempo**.

---

## Instalação e risco operacional

O `install.sh` delega para Node:

```bash
node scripts/install-apply.js
```

O instalador suporta dry-run:

```bash
install.sh --dry-run --json ...
```

E há um planejador:

```bash
node scripts/install-plan.js
```

Depois de instalar dependências no clone temporário, rodei um dry-run:

```bash
node scripts/install-apply.js --dry-run --json --target claude-project --skills search-first,verification-loop
```

Funcionou e mostrou operações planejadas sem mutar.

Mas o instalador pode copiar arquivos para superfícies como:

- `.claude/`
- `.cursor/`
- `~/.codex/`
- `~/.opencode/`
- `.gemini/`
- `.zed/`
- configs MCP
- scripts
- hooks
- skills
- agents

Portanto, para nós:

> **Nunca rodar instalação real do ECC no ambiente principal sem dry-run e revisão.**

Se formos aproveitar algo, melhor copiar/adaptar skills específicas.

---

## Pontos fortes

### 1. Curadoria enorme de workflows

277 skills é muita coisa. Mesmo que parte seja sobreposição, serve como biblioteca de padrões.

### 2. Boa preocupação com segurança

O repo tem um guia forte sobre segurança de agentes:

```text
the-security-guide.md
```

Ele fala de:

- prompt injection;
- CVEs de Claude Code;
- hooks maliciosos;
- MCPs perigosos;
- sandboxing;
- permissões;
- hidden Unicode;
- tool poisoning;
- credenciais;
- “lethal trifecta”: dados privados + conteúdo não confiável + comunicação externa.

Isso conversa muito bem com nosso trabalho recente em skills com guardrails.

### 3. Instalação seletiva

A arquitetura de `install-plan` / `install-apply` é boa: profiles, módulos, componentes e dry-run.

Perfis detectados:

```text
minimal
opencode
core
developer
security
research
full
```

Isso é uma ideia boa para o OSCEIA: não instalar tudo, mas ter “packs” por contexto.

### 4. Cross-harness

Ele tenta padronizar skills/regras para vários ambientes:

- Claude Code
- Codex
- Cursor
- OpenCode
- Gemini
- Zed
- Qwen
- Kiro
- CodeBuddy

Isso pode inspirar nosso portfólio OSCEIA para não ficar preso só a Hermes.

### 5. Algumas skills são realmente boas como conceito

Especialmente nas áreas:

- auditoria de agent stack;
- orçamento de contexto;
- busca antes de construir;
- pesquisa evidence-first;
- compliance de skills;
- produção/launch readiness;
- segurança de agentes.

---

## Pontos de atenção

### 1. Não é “uma skill”, é um ecossistema inteiro

Diferente de `agent-reach`, aqui não estamos falando de uma skill isolada. ECC é quase um framework/operating system de agente.

Importar tudo seria pesado e provavelmente bagunçaria nosso portfólio.

### 2. Forte acoplamento a Claude Code

Muitos exemplos usam:

- `~/.claude/skills`
- `claude -p`
- hooks de Claude
- `.claude/settings.json`
- Task/Agent/subagent do Claude Code

Para Hermes, várias coisas precisam ser traduzidas.

### 3. Triggers muito amplos em algumas skills

Algumas descriptions são boas, mas outras têm gatilhos amplos demais ou linguagem “mandatory/essential”. Para OSCEIA, precisaríamos reduzir escopo como fizemos com `agent-reach`.

### 4. Sobreposição com skills que já temos

Já temos skills como:

- `diagnose`
- `systematic-debugging`
- `test-driven-development`
- `github-code-review`
- `requesting-code-review`
- `skill-portfolio-curation`
- `council`
- `to-prd`
- `technical-design-doc-creator`
- `research/*`

Então muitas ECC skills não devem entrar como cópia direta.

### 5. Check de registry desatualizado

O próprio `npm test` acusa:

```text
docs/COMMAND-REGISTRY.json is out of date
```

Não é grave para análise de ideias, mas mostra que o repo está em movimento e nem tudo está 100% verde no clone atual.

### 6. Instalação mexe em superfícies sensíveis

Hooks, MCP configs, agents, commands e configs de harness são superfície de execução. A importação precisa ser **manual, revisada e seletiva**.

---

## Skills/ideias que mais podem agregar ao OSCEIA

Eu dividiria em três grupos.

---

# Grupo A — Alta prioridade para adaptação

## 1. `agent-architecture-audit`

Arquivo:

```text
skills/agent-architecture-audit/SKILL.md
```

Ideia central:

> Diagnóstico full-stack de aplicações com agentes/LLMs, usando uma pilha de 12 camadas.

Camadas citadas:

1. System prompt
2. Session history
3. Long-term memory
4. Distillation
5. Active recall
6. Tool selection
7. Tool execution
8. Tool interpretation
9. Answer shaping
10. Platform rendering
11. Hidden repair loops
12. Persistence

Isso é muito bom para nós.

### O que agrega

Ajuda a diagnosticar problemas como:

- “o agente piorou”;
- memória contaminando resposta;
- tool routing errado;
- o modelo diz que executou algo mas não executou;
- plataforma/GUI corrompendo markdown/JSON;
- retry/fallback invisível alterando resposta final.

### Fit OSCEIA

**Muito alto.**

Eu adaptaria como uma skill nossa, talvez:

```text
agent-architecture-audit
```

ou em PT-BR:

```text
auditoria-arquitetura-agentes
```

Mas provavelmente vale manter nome em inglês para compatibilidade.

### Cuidado

Já temos `diagnose` e `systematic-debugging`. A diferença é que essa skill é específica para **sistemas agentic/LLM**, não bug genérico.

---

## 2. `context-budget`

Arquivo:

```text
skills/context-budget/SKILL.md
```

Ideia central:

> Auditar consumo de contexto por agents, skills, MCP servers, rules e CLAUDE.md.

### O que agrega

Muito relevante para Hermes/OSCEIA porque nosso portfólio de skills está crescendo.

A skill ensina a estimar overhead de:

- skills;
- agents;
- MCP tools;
- rules;
- arquivos de instrução;
- descrições carregadas sempre;
- redundâncias.

Ela também destaca algo importante:

> MCP tool schemas podem custar mais contexto que as skills.

### Fit OSCEIA

**Alto.**

Nós poderíamos adaptar como:

```text
context-budget-audit
```

com foco em:

- Hermes skills;
- tools habilitadas;
- cron jobs;
- plugins;
- MCPs;
- memórias;
- descrições longas no system prompt.

Essa pode virar uma skill muito útil para manter o Hermes leve.

---

## 3. `skill-scout`

Arquivo:

```text
skills/skill-scout/SKILL.md
```

Ideia central:

> Antes de criar uma skill nova, procurar skills existentes localmente, no marketplace, GitHub e web.

### O que agrega

Isso é diretamente ligado ao nosso fluxo atual. Estamos descobrindo skills externas e decidindo se entram no portfólio.

Já temos uma skill `skill-portfolio-curation`, mas `skill-scout` complementa com uma etapa anterior:

- procurar antes de criar;
- evitar duplicação;
- ranquear candidatos;
- preferir fonte local;
- vetar comandos suspeitos antes de recomendar.

### Fit OSCEIA

**Alto, mas talvez como fusão.**

Eu não criaria uma skill separada imediatamente. Melhor incorporar ideias dela na nossa `skill-portfolio-curation` ou criar uma etapa “scout” dentro dela.

---

## 4. `research-ops`

Arquivo:

```text
skills/research-ops/SKILL.md
```

Ideia central:

> Pesquisa evidence-first, separando fato, contexto fornecido pelo usuário, inferência e recomendação.

### O que agrega

Tem uma disciplina boa:

```text
QUESTION TYPE
EVIDENCE
INFERENCE
RECOMMENDATION
```

E força rotular:

- sourced facts;
- user-provided context;
- inference;
- recommendation.

### Fit OSCEIA

**Alto**, especialmente para:

- pesquisas educacionais;
- decisões estratégicas do IEE;
- análise de tecnologias;
- inteligência de mercado;
- avaliação de ferramentas;
- relatórios para diretoria.

Tem sobreposição com `agent-reach`, mas não é a mesma coisa:

- `agent-reach` = coleta multi-plataforma;
- `research-ops` = estrutura de raciocínio e relatório.

Eu adaptaria.

---

## 5. `production-audit`

Arquivo:

```text
skills/production-audit/SKILL.md
```

Ideia central:

> Auditoria de prontidão para produção baseada em evidência local, sem mandar repo para serviço externo.

### O que agrega

Muito útil para Fóton/engenharia.

Cobre:

- segurança/autorização;
- dados;
- pagamentos/webhooks;
- operações;
- rollback;
- health checks;
- UX;
- readiness score.

### Fit OSCEIA

**Alto para projetos de software.**

Pode complementar nossa área de QA/code review.

Eu adaptaria como skill de **pré-lançamento / readiness audit**, com gatilho claro:

> “está pronto para deploy?”, “o que quebra em produção?”, “audite antes de lançar”.

---

# Grupo B — Boas ideias, mas talvez já temos equivalente

## 6. `search-first`

Arquivo:

```text
skills/search-first/SKILL.md
```

Ideia:

> Pesquisar soluções existentes antes de escrever código.

Muito bom, mas já temos esse comportamento parcialmente por disciplina e por skills de pesquisa/código.

### Fit

**Médio-alto.**

Eu talvez não adicionaria como skill própria; incorporaria como seção em:

- TDD;
- codebase inspection;
- planning;
- refactor plans;
- skill portfolio curation.

Mas o princípio é excelente:

> antes de construir, buscar se já existe.

---

## 7. `verification-loop`

Arquivo:

```text
skills/verification-loop/SKILL.md
```

Ideia:

> Build, type check, lint, tests, security scan, diff review.

### Fit

**Médio.**

Nós já temos bastante coisa nesse eixo:

- `test-driven-development`
- `requesting-code-review`
- `setup-pre-commit`
- skills GitHub/code review
- `qa`
- `diagnose`

A ECC skill é simples e útil, mas eu não importaria diretamente. Talvez extrair o formato do relatório.

---

## 8. `prompt-optimizer`

Ideia:

> Analisar prompt cru, mapear intenção, escolher skills/commands/agents, devolver prompt otimizado.

### Fit

**Médio.**

Pode ser útil, mas tem risco de virar meta-skill genérica demais. Para OSCEIA talvez seria útil em contexto de:

- estruturar demandas;
- transformar pedido vago em plano;
- preparar briefing para subagentes.

Mas eu deixaria em backlog.

---

## 9. `skill-comply`

Arquivo:

```text
skills/skill-comply/SKILL.md
```

Ideia:

> Medir se skills/regras são realmente seguidas, gerando cenários e classificando comportamento.

### Fit

**Conceitualmente alto, operacionalmente médio/baixo agora.**

É uma ideia excelente para QA de skills, mas a implementação depende de:

```text
claude -p
stream-json
scripts.run
```

Ou seja, muito acoplado ao Claude Code.

Para Hermes/OSCEIA, a ideia poderia virar uma skill futura:

```text
skill-compliance-eval
```

Mas exigiria adaptação real.

---

## 10. `token-budget-advisor`

Ideia:

> Oferecer ao usuário escolha de profundidade/tamanho da resposta.

### Fit

**Baixo/médio.**

É interessante, mas no Hermes já temos preferências de resposta e a interação via `clarify` pode ser pesada. Eu não priorizaria.

---

# Grupo C — Não recomendo importar agora

## ECC inteiro / `configure-ecc`

Não recomendo instalar/adotar direto.

Motivos:

- altera várias superfícies;
- orientado a Claude Code;
- pode conflitar com Hermes;
- grande demais;
- exige curadoria.

## Hooks e MCP configs

Não importaria sem revisão manual aprofundada.

## Skills muito específicas de linguagem/framework

Exemplos:

- `django-patterns`
- `react-patterns`
- `quarkus-*`
- `springboot-*`
- `laravel-*`
- `perl-*`

Podem ser boas, mas só devem entrar quando tivermos demanda real nesses stacks.

## Skills de trading/prediction market

Exemplos:

- `ito-*`
- `prediction-market-*`
- `llm-trading-agent-security`

Não parecem prioritárias para OSCEIA/Fóton neste momento.

---

## Comparação com `agent-reach`

| Critério | agent-reach | ECC |
|---|---|---|
| Escopo | Uma ferramenta/skill de pesquisa multi-plataforma | Ecossistema inteiro de agentes/skills/hooks |
| Melhor abordagem | Adaptar uma skill controlada | Minerar ideias e adaptar seletivamente |
| Risco | Cookies, plataformas externas, scraping | Configs, hooks, MCPs, instalação multi-harness |
| Valor para OSCEIA | Pesquisa/social listening | Governança, qualidade, segurança, agent engineering |
| Recomendação | Adicionar como skill opcional controlada | Não adicionar inteiro; curar partes |

---

## Recomendações práticas para refletirmos

Eu sugiro tratar ECC como **fonte upstream de padrões**, com uma fila de curadoria.

### Prioridade 1 — adaptar em breve

1. **agent-architecture-audit**
   Para diagnosticar sistemas agentic/LLM/Hermes.

2. **context-budget**
   Para controlar crescimento do nosso portfólio de skills/tools/MCPs.

3. **research-ops**
   Para padronizar pesquisas evidence-first.

4. **production-audit**
   Para prontidão de deploy/lançamento em projetos Fóton.

5. **skill-scout**
   Talvez fundir na nossa `skill-portfolio-curation`.

### Prioridade 2 — estudar depois

6. `skill-comply`
7. `prompt-optimizer`
8. `search-first`
9. `workspace-surface-audit`
10. `continuous-learning-v2`

### Evitar por enquanto

- instalar ECC inteiro;
- importar hooks;
- importar MCP configs;
- importar tudo de `skills/`;
- usar `configure-ecc` no ambiente principal;
- trazer agents/commands sem tradução para Hermes.

---

## Minha recomendação final

Eu classificaria o ECC como:

```text
Fonte estratégica de curadoria: SIM
Tap/import direto: NÃO
Adicionar agora ao portfólio: NÃO
Selecionar e adaptar skills individuais: SIM
```

Se formos seguir, eu faria uma próxima rodada com foco em apenas **3 candidatas**:

1. `agent-architecture-audit`
2. `context-budget`
3. `research-ops`

E para cada uma produziria:

- análise detalhada;
- comparação com skills OSCEIA existentes;
- proposta de adaptação;
- riscos;
- nome sugerido;
- trigger sugerido;
- se vira skill nova ou patch em skill existente.