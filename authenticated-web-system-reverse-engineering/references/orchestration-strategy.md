# Estratégia Playwright, CDP e Crawlee

## Papéis distintos

- **Playwright:** controla páginas, DOM, eventos, rede e aplicações JavaScript.
- **CDP:** conecta a uma instância Chrome preparada e autenticada manualmente.
- **Crawlee:** fornece fila, deduplicação, retries, persistência, concorrência, datasets e estatísticas.
- **Análise funcional:** converte evidências em processos, regras, estados e decisões; não é substituída por crawler.

## Árvore de decisão

### Playwright direto

Escolha quando:

- a sessão autenticada existente é o principal requisito;
- a exploração é única ou tem poucas dezenas de páginas;
- formulários progressivos exigem interação dirigida;
- segurança e controle fino importam mais que throughput.

### Crawlee + Cheerio

Escolha quando:

- HTML vem pronto do servidor;
- há centenas ou milhares de páginas;
- fila, retomada e retries geram valor;
- não é necessário navegador real.

### Crawlee + Playwright

Escolha quando:

- a aplicação exige JavaScript;
- há muitas rotas e execuções repetidas;
- o custo de integrar BrowserPool/sessão é menor que manter orquestração própria;
- um piloto confirmou login, bloqueios e retomada.

### Combinação híbrida

Quando conectar Crawlee diretamente à sessão CDP for frágil, mantenha:

1. Playwright/CDP para descoberta autenticada e casos dinâmicos;
2. fila persistente própria ou Crawlee para orquestrar rotas aprovadas;
3. extrator estrutural comum;
4. dataset neutro validado.

Não force uma integração só para “usar Crawlee”.

## Piloto controlado do Crawlee

1. Crie diretório ou repositório temporário separado.
2. Registre Node e gerenciador de pacotes.
3. Instale pacote mínimo com versão exata; evite o metapacote quando `@crawlee/cheerio` ou `@crawlee/playwright` bastar.
4. Preserve lockfile.
5. Não instale globalmente, não adicione hooks ao repositório principal e não vendorize upstream.
6. Rode auditoria de dependências e registre advisories.
7. Faça smoke test com 2–3 páginas inócuas.
8. Teste deduplicação, retry, limite e retomada após interrupção.
9. Meça páginas/minuto, memória, falhas e manutenção específica.
10. Só promova se o ganho superar a complexidade e os riscos.

## Política de fila

Cada item deve carregar apenas contexto estrutural:

```json
{
  "route_id": "sha256-ou-id-estavel",
  "path": "/modulo/listar",
  "menu_path": ["Modulo", "Listar"],
  "page_kind": "listing",
  "authorized": true,
  "requires_id": false
}
```

Não inclua cookies, tokens, payloads, dados pessoais ou query strings de registros.

## Concorrência

Comece conservadoramente:

- sistema operacional real: 1–2 páginas;
- homologação estável: 2–4 páginas;
- aumente apenas após observar CPU, memória, taxa de erro e impacto no servidor.

Autoscaling não substitui limite institucional. Configure teto explícito.

## Retentativas

- Retry apenas para timeout, conexão, 429 e 5xx transitório.
- Não repita automaticamente 401/403, rotas perigosas ou falhas de validação.
- Diferencie 404 permanente de rota parametrizada sem ID.
- Limite tentativas e registre o motivo terminal.

## Critérios de promoção

Adote Crawlee no fluxo recorrente somente se o piloto comprovar:

- retomada real após interrupção;
- deduplicação determinística;
- redução de código operacional;
- nenhuma regressão na sessão autenticada;
- evidências válidas e sem PII;
- dependências sem risco inaceitável;
- métricas melhores que Playwright direto.
