# Busca e descoberta técnica

## Preferência de ferramentas

1. Use `web_search`/`web_extract` do Hermes para buscas simples e páginas públicas.
2. Use Agent Reach/Exa quando precisar de busca semântica, pesquisa técnica/código ou fallback.
3. Use GitHub via `gh` para descoberta de repositórios/código quando a fonte for GitHub.

## Exa via mcporter

Verifique disponibilidade:

```bash
agent-reach doctor --json
```

Com Exa configurado via `mcporter`:

```bash
mcporter call 'exa.web_search_exa(query: "QUERY", numResults: 5)'
mcporter call 'exa.get_code_context_exa(query: "CODE QUESTION", tokensNum: 3000)'
```

## Estratégia de pesquisa OSCEIA

Para pesquisas de produto, educação, tecnologia ou mercado:

1. Comece por web aberta para contexto geral.
2. Use busca técnica/GitHub para maturidade de ferramentas.
3. Use comunidades sociais apenas para percepção e relatos, não como prova isolada.
4. Registre termos de busca e filtros quando o resultado apoiar decisão.

## Comparativo rápido

| Ferramenta | Melhor uso |
|---|---|
| Hermes `web_search` | busca geral e atualidades |
| Hermes `web_extract` | ler URLs públicas/documentos |
| Defuddle | limpar páginas HTML/artigos longos |
| Exa via Agent Reach | busca semântica e técnica |
| `gh search` | repositórios, issues, PRs e código |

## Cuidados

- Não confunda ranking de busca com relevância objetiva.
- Para claims importantes, confirme em fonte primária.
- Para relatórios, cite URLs e data aproximada da consulta.
