---
name: gh-issue-dor-dod
description: Cria e gerencia issues no GitHub via CLI gh, aplicando checklists de Definition of Ready (DoR) e Definition of Done (DoD). Use SEMPRE que o usuário pedir para reportar um bug, abrir uma tarefa, criar feature request, "criar uma issue", "abrir issue", "criar tarefa no GitHub", ou quando mencionar "DoR", "DoD", "definição de pronto", "definição de feito", "critérios de aceite". Garante que a issue só seja criada após validar a prontidão (DoR) e embute o checklist de conclusão (DoD) no corpo.
---

# GitHub Issue Creator (DoR/DoD)

Cria issues no GitHub via `gh` CLI com dois gates de qualidade: **Definition of
Ready** (validado ANTES de criar) e **Definition of Done** (embutido no corpo da
issue para rastrear a conclusão).

## Pré-requisitos

```bash
gh auth status   # confirmar autenticação; se falhar, orientar: gh auth login
gh repo view     # confirmar o repositório alvo
```

## Workflow

### Fase 1 — Definition of Ready (gate de entrada)

**NÃO crie a issue** enquanto o DoR não estiver satisfeito. Valide os itens
abaixo; se algum faltar, **pergunte ao usuário**. Nunca invente conteúdo.

Comum a qualquer issue:
- [ ] Título conciso e descritivo
- [ ] Tipo definido: `bug` | `enhancement` | `documentation` | `task`
- [ ] Repositório alvo confirmado
- [ ] Labels e assignees decididos (ou omitidos intencionalmente)

Se for **bug**, exigir também:
- [ ] Passos para reproduzir
- [ ] Comportamento esperado
- [ ] Comportamento real
- [ ] Ambiente/versão (quando relevante)

Se for **feature/enhancement**, exigir também:
- [ ] Valor / justificativa
- [ ] Critérios de aceite definidos
- [ ] Escopo claro (o que está dentro/fora)

### Fase 2 — Montar o Corpo

Monte o corpo em Markdown a partir do modelo abaixo. Remova seções não
aplicáveis ao tipo. A seção **Definition of Done é obrigatória** e sempre vai ao
final. Salve em arquivo temporário (ex.: `/tmp/issue_body.md`).

```markdown
## Descrição
<!-- O que é / qual o problema ou objetivo -->

## Passos para Reproduzir (apenas bug)
1.
2.

## Comportamento Esperado / Real (apenas bug)
- Esperado:
- Real:

## Critérios de Aceite
- [ ]
- [ ]

## Contexto Adicional
<!-- Ambiente, versão, prints, logs -->

---

## Definition of Done (DoD)
Esta issue só será considerada **concluída** quando:
- [ ] Código implementado conforme os critérios de aceite
- [ ] Testes unitários escritos e validados
- [ ] Testes funcionais aprovados
- [ ] Código revisado (code review aprovado)
- [ ] Sem regressões introduzidas
- [ ] Documentação atualizada (quando aplicável)
- [ ] Critérios de aceite contemplados
- [ ] Aprovado pelo Product Owner / responsável
```

### Fase 3 — Execução

```bash
gh issue create \
  --title "Título da issue" \
  --body-file /tmp/issue_body.md \
  --label "bug" \
  --assignee "@me"
```

Flags opcionais: `--repo "owner/repo"`, `--label "a,b"`, `--assignee "user"`,
`--milestone "..."`. Se o repo tiver templates em `.github/ISSUE_TEMPLATE/`,
respeite-os e acrescente a seção DoD ao final.

### Fase 4 — Verificação

`gh issue create` imprime a URL da issue. Retorne o link ao usuário e ofereça
`gh issue view <número> --web`.

## Comandos Úteis

```bash
gh issue list --label bug              # listar
gh issue view <n>                      # ver detalhes
gh issue edit <n> --add-label "ready"  # editar
gh issue close <n>                     # fechar após DoD completo
```

## Regras

- Nunca pule o DoR: faltou informação, pergunte antes de criar.
- O corpo sempre termina com a seção DoD em checkboxes `- [ ]`.
- Use Markdown no corpo para legibilidade.
