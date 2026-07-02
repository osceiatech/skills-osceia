# GitHub e descoberta de código

## Preferência

Para tarefas GitHub dentro do Hermes, prefira as skills/ferramentas nativas (`github-*`, `gh` CLI, leitura do repo local). Use Agent Reach quando a necessidade for descoberta ampla na internet ou quando o `doctor` indicar rotas de GitHub como parte de pesquisa multi-fonte.

## Comandos úteis via gh

```bash
# Ver resumo de um repo público ou privado com acesso autenticado
gh repo view OWNER/REPO

# Buscar repositórios
gh search repos "QUERY" --sort stars --limit 10

# Buscar issues
gh search issues "QUERY" --limit 20

# Buscar PRs
gh search prs "QUERY" --limit 20

# Listar releases
gh release list -R OWNER/REPO --limit 10
```

## Avaliação rápida de maturidade

Colete:

- stars/forks apenas como sinal fraco;
- última atualização e releases;
- licença;
- issues abertas/fechadas;
- README e documentação;
- testes/CI;
- dependências e superfície de segurança;
- compatibilidade com nosso ambiente.

## Quando virar artefato OSCEIA

Depois da coleta, use outra skill conforme o objetivo:

- `technical-design-doc-creator` para decisão técnica;
- `to-prd` para produto;
- `to-issues` ou `gh-issue-dor-dod` para backlog;
- `council` para decisão com trade-offs.
