# Social listening e comunidades

## Princípio

Use fontes sociais para captar sinais, perguntas recorrentes, objeções, dores, linguagem de usuários e tendências. Não trate essas fontes como amostra representativa sem validação adicional.

Antes de usar canais autenticados, leia `security-lgpd.md`.

## Pré-check

```bash
agent-reach doctor --json
```

Escolha comandos conforme `active_backend`. Se o backend exigir login/cookie, peça autorização explícita e use conta secundária.

## V2EX

Canal público útil para tecnologia e discussões de comunidade.

```bash
curl -s "https://www.v2ex.com/api/topics/hot.json" -H "User-Agent: agent-reach/1.0"
```

Use para sinais qualitativos, não para estatística.

## Reddit

Reddit frequentemente exige login/backend específico. Não há rota anônima confiável em muitos casos.

Possíveis comandos, se doctor indicar backend ativo:

```bash
opencli reddit search "QUERY" -f yaml
rdt search "QUERY" --limit 10
```

Cuidados:

- servidores/VPS podem sofrer bloqueio;
- respeite rate limits;
- não colete usuários individualmente se comentários agregados bastam.

## Twitter/X

Prefira `x_search` nativo do Hermes quando disponível. Use Agent Reach quando precisar de backend local, timeline, artigo ou fallback diagnosticável.

Exemplos, se configurado:

```bash
twitter search "QUERY" -n 10
twitter tweet URL_OR_ID
twitter user-posts @username -n 20
opencli twitter search "QUERY" -f yaml
```

Cuidados:

- cookies `auth_token`/`ct0` são credenciais;
- busca pode quebrar com mudanças de GraphQL;
- use conta secundária e baixa frequência.

## Xiaohongshu / 小红书

Use para pesquisa de percepção/consumo, especialmente quando sinais do ecossistema chinês forem relevantes.

Backends possíveis:

```bash
opencli xiaohongshu search "QUERY" -f yaml
opencli xiaohongshu note "NOTE_URL" -f yaml
mcporter call 'xiaohongshu.search_feeds(keyword: "QUERY")' --timeout 120000
```

Cuidados:

- requer login/sessão em muitos fluxos;
- não use conta principal;
- respeite xsec_token/URLs completas vindas de busca;
- evite deep scraping de comentários.

## Bilibili

Para vídeo/comunidade chinesa. Veja também `video.md`.

```bash
bili search "QUERY" --type video -n 5
```

Não force `yt-dlp` para Bilibili se o doctor indicar bloqueio.

## Facebook/Instagram

Uso restrito e somente leitura. Preferência por OpenCLI em desktop com sessão local do usuário.

```bash
opencli facebook search "QUERY" -f yaml
opencli facebook groups -f yaml
opencli instagram search "QUERY" -f yaml
opencli instagram user USERNAME -f yaml
```

Regras:

- não usar para grupos privados sem autorização clara;
- não capturar perfis/comentários em massa;
- não interagir com conteúdo;
- documentar limitações de acesso.

## Padrão de relatório social listening

```markdown
## Fontes consultadas
- Plataforma / consulta / limite / data aproximada

## Sinais encontrados
- Tema recorrente 1 — evidências
- Tema recorrente 2 — evidências

## Interpretação
- O que parece forte
- O que é fraco ou enviesado

## Limitações
- Amostra exploratória
- Plataformas não consultadas
- Possíveis vieses de idioma, comunidade e algoritmo
```
