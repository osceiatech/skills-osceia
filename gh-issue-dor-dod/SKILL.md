---
name: gh-issue-dor-dod
description: Cria e gerencia issues no GitHub via CLI gh, aplicando checklists de Definition of Ready (DoR) e Definition of Done (DoD) e o template de issue do repositório. Use SEMPRE que o usuário pedir para reportar um bug, abrir uma tarefa, criar feature request, "criar uma issue", "abrir issue", "criar tarefa no GitHub", ou quando mencionar "DoR", "DoD", "definição de pronto", "definição de feito", "critérios de aceite". Garante que a issue só seja criada após a pesquisa e a validação da prontidão (DoR), no formato exato do template do repositório (Contexto / DOR / DOD).
---

# GitHub Issue Creator (DoR/DoD)

Cria issues no GitHub via `gh` com dois gates de qualidade: **Definition of Ready**
(validado ANTES de criar) e **Definition of Done** (no corpo da issue, para rastrear a conclusão).

A issue é o **passo 2** do fluxo de toda task:

1. Pesquisa (registrada em `.notebook/`)
2. **Issue no GitHub** ← esta skill
3. Branch `<tipo>/<numero-da-issue>-<slug>`
4. Spec completa na branch
5. Execução

## Regras do repositório vêm primeiro

Antes de qualquer coisa, leia no repositório alvo, quando existirem:

- `AGENTS.md` / `CLAUDE.md`: regras do projeto (dados sensíveis, fluxo, GitHub Project).
- `.agents/harness.config`: regras e configuração do harness de agentes.
- `.github/ISSUE_TEMPLATE/`: **o template vigente manda no formato** (ver Fase 3).
- `docs/agents/issue-tracker.md`: convenções de issue e de Project, se houver.

Em conflito, vale a regra do repositório; entre duas regras, a mais restritiva.

## Pré-requisitos

```bash
command -v gh    # sem gh: pare e peça ao usuário para instalar (não use curl na API)
gh auth status   # sem login: peça ao usuário rodar `gh auth login` (login é pessoal; não faça por ele)
gh repo view     # confirmar o repositório alvo
```

## Workflow

### Fase 1 — Pesquisa (antes da issue)

A issue nasce de uma pesquisa, nunca do zero.

1. Leia `.notebook/INDEX.md`. Se o assunto já foi pesquisado, use e atualize o arquivo existente.
2. Senão, pesquise (código com arquivo:linha, decisões/ADRs, specs, docs externas) e grave em
   `.notebook/AAAA-MM-DD-<slug>.md`: pergunta, fontes, o que foi encontrado, conclusão.
3. **Se for o caso, chame a skill `grill-me`** (ver abaixo) e grave o resultado no mesmo arquivo.
4. Acrescente a linha no `INDEX.md`: `- [Título](arquivo.md) · AAAA-MM-DD · #issue · resumo de uma linha`
   (o `#issue` é preenchido na Fase 6, quando o número existir).

#### Quando e como usar o `grill-me`

Chame a skill `grill-me` quando a pesquisa mostrar:

- decisão em aberto ou caminhos concorrentes (ex.: biblioteca A ou B, escopo maior ou menor);
- termo ambíguo no pedido;
- **contradição** entre o pedido, o código, as decisões (AD-xxx/ADRs), o `AGENTS.md` e as fontes externas
  (ex.: o pedido diz "Ionic framework", mas o app já tem design system próprio).

Como conduzir:

- Uma pergunta por vez, cada uma com a recomendação do agente e o motivo.
- Cada contradição é mostrada com a fonte de cada lado (arquivo:linha, link, decisão).
- Quem decide é a pessoa. O agente nunca resolve uma contradição sozinho.
- Pergunta sem resposta é **bloqueio**: a issue não é criada.

Não chame quando a task é clara e não há decisão a tomar (ex.: bug com causa conhecida e correção óbvia).

O resultado alimenta a pesquisa e a issue:

```markdown
## Decisões (grill-me)

| Pergunta | Resposta | Contradição exposta |
|---|---|---|
| ... | ... | ... (ou —) |

Em aberto: ... (se houver, a issue espera)
```

Cada decisão vai também para o **DOR** da issue (Fase 3).

Se o repositório não usa `.notebook/`, pergunte ao usuário antes de criar a pasta.

### Fase 2 — Definition of Ready (gate de entrada)

**NÃO crie a issue** enquanto o DoR não estiver satisfeito. Se algo faltar, **pergunte ao usuário**.
Nunca invente conteúdo nem decisão técnica: ambiguidade se resolve conversando (ex.: `/grill-me`).

Comum a qualquer issue:
- [ ] Tipo definido: bug ou feature (define template, prefixo do título e label)
- [ ] Título conciso e descritivo
- [ ] Repositório alvo confirmado
- [ ] Pesquisa registrada (Fase 1), com as decisões do `grill-me` quando houve
- [ ] Nenhuma pergunta ou contradição em aberto
- [ ] Labels de escopo e assignees decididos (ou omitidos intencionalmente)

Se for **bug**, exigir também:
- [ ] Passos para reproduzir
- [ ] Comportamento esperado e comportamento real
- [ ] Ambiente/versão afetados
- [ ] Causa conhecida ou hipótese

Se for **feature**, exigir também:
- [ ] Valor / justificativa (onde dói, por que importa)
- [ ] Escopo claro (o que está dentro e fora)
- [ ] Regras de negócio e critérios de aceite
- [ ] Decisões técnicas acordadas com o usuário

### Fase 3 — Montar o corpo pelo template do repositório

**Se o repositório tem `.github/ISSUE_TEMPLATE/`, ele é obrigatório e vence o modelo desta skill.**
Leia o template vigente antes de redigir (ele pode ter mudado):

| Tipo | Template | Título | Label |
|---|---|---|---|
| Bug | `bug_report.md` | `[Bug] - <título>` | `bug` |
| Feature | `feature_request.md` | `[Feature] - <título>` | `enhancement` |

O padrão OSCEA/IEEEB tem **exatamente três seções, nesta ordem e sem seções extras**:
`**Contexto:**`, `**DOR:**` e `**DOD:**`. Todo o conteúdo cabe nelas:

```markdown
**Contexto:**

- Cenário atual e o problema/necessidade (bug: comportamento observado, passos para reproduzir, impacto).
- Pesquisa: `.notebook/AAAA-MM-DD-<slug>.md`

**DOR:**

- [x] Comportamento esperado definido: ...
- [x] Escopo: dentro ... / fora ...
- [x] Regras de negócio: ...
- [x] Decisões técnicas acordadas: ...
- [x] Termos novos (glossário): ...

**DOD:**

- [ ] Critério de aceite 1 (verificável)
- [ ] Critério de aceite 2 (verificável)
- [ ] Testes cobrindo os critérios, passando antes e depois de cada incremento
- [ ] Lint, testes e build passando (comandos do repositório)
- [ ] Spec completa em `.specs/features/<numero>-<slug>/` (spec.md, design.md, tasks.md)
- [ ] Documentação atualizada (quando aplicável)
- [ ] PR aberto com o template do repositório e `Closes #<numero>`
```

Acrescente ao DOD os itens que o `AGENTS.md` do projeto exigir (ex.: RLS + teste de isolamento,
auditoria, acessibilidade, offline). Decisões técnicas e glossário ficam **no corpo da issue**, não em
arquivos de documentação.

**Só sem template no repositório**, use o modelo genérico: Descrição, Passos para Reproduzir (bug),
Esperado/Real (bug), Critérios de Aceite, Contexto Adicional e, por último, `## Definition of Done (DoD)` em checkboxes.

Salve o corpo em arquivo temporário (no scratchpad da sessão, se houver; senão `/tmp/issue_body.md`).

### Fase 4 — Dados sensíveis (gate antes de publicar)

Issue é publicação: fica no GitHub, em notificações e e-mails, mesmo se editada depois. Revise o corpo:

- Nunca dado real de pessoa, e **nunca dado de criança** (nome, foto, texto de registro), nem em log colado ou captura de tela.
- Nunca token, chave, senha, URL com credencial ou conteúdo de `.env`.
- Exemplos sempre com dados fictícios.

### Fase 5 — Execução

```bash
gh issue create \
  --title "[Feature] - Título da issue" \
  --body-file /caminho/issue_body.md \
  --label "enhancement" \
  --label "<label-de-escopo>"
```

Flags opcionais: `--repo "owner/repo"`, `--assignee "user"`, `--milestone "..."`.
Use só labels que existem (`gh label list`); label nova, pergunte antes de criar.

**GitHub Project:** se o `AGENTS.md`/`docs/agents/issue-tracker.md` definir um Project, inclua a issue
(`gh project item-add <n> --owner <org> --url <url-da-issue>`), **pergunte ao usuário** se o status é
`Backlog` ou `Ready` e preencha os campos que o projeto pedir (ex.: Priority, Size, Estimate).
Issue grande demais (ex.: Size `XL`) é quebrada antes de ir para `Ready`.

### Fase 6 — Verificação e próximo passo

1. `gh issue create` imprime a URL. Confira com `gh issue view <numero>` (título, labels, seções).
2. Atualize a linha da pesquisa no `.notebook/INDEX.md` com o `#numero`.
3. Retorne o link ao usuário e indique o próximo passo do fluxo:
   branch `<tipo>/<numero>-<slug>` a partir da `main` atualizada (siga os prefixos do repositório,
   ex.: `feature/`, `hotfix/`, `chore/`, `docs/`) e, nela, a spec completa.

## Comandos úteis

```bash
gh issue list --state open --label bug       # listar
gh issue view <n> --comments                 # ver detalhes e discussão
gh issue edit <n> --add-label "..."          # editar labels
gh issue comment <n> --body "..."            # comentar
gh issue close <n> --comment "..."           # fechar após DoD completo
```

## Regras

- Pesquisa antes da issue; DoR antes de criar. Faltou informação, pergunte.
- Decisão em aberto ou contradição na pesquisa: `grill-me`, com o resultado gravado no `.notebook/` e no DOR.
- O template do repositório manda: título com prefixo, label de tipo, seções Contexto / DOR / DOD, nada a mais.
- Nada de dado sensível ou de criança na issue.
- Esta skill **cria issue, e só**: nunca faz `git commit`, `git push` nem abre PR. Commit, push e PR
  só com autorização explícita do usuário, a cada vez. Nunca push na `main`: toda mudança entra por PR.
