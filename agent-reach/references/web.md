# Web aberta e RSS

## Web pública

Prefira ferramentas nativas do Hermes para URLs simples:

- `web_extract` para páginas e PDFs públicos;
- `browser` quando houver conteúdo dinâmico/interação;
- `defuddle` quando uma página HTML vier poluída por navegação, anúncios ou boilerplate.

Agent Reach pode ser usado como fallback com Jina Reader:

```bash
curl -s "https://r.jina.ai/http://r.jina.ai/http://example.com"
```

ou, para URL normal:

```bash
curl -s "https://r.jina.ai/http://example.com"
```

Se a URL já for markdown, texto, JSON, CSV ou PDF bem extraível, use ferramenta nativa em vez de Jina.

## RSS/Atom

Use RSS quando o objetivo for monitorar fontes recorrentes, blogs, changelogs ou portais.

Exemplo Python simples:

```bash
python - <<'PY'
import feedparser, sys
feed = feedparser.parse(sys.argv[1])
for e in feed.entries[:10]:
    print(e.get('title'))
    print(e.get('link'))
    print()
PY "FEED_URL"
```

Se o pacote `feedparser` não existir, ele vem como dependência do `agent-reach`.

## Boas práticas

- Salve temporários em `/tmp/`, não no workspace.
- Remova HTML/boilerplate antes de sintetizar.
- Preserve URL de origem em relatórios.
- Verifique data de publicação e se o conteúdo é fonte primária, repost ou agregador.
