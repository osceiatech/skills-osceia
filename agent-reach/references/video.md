# Vídeo, legendas e podcasts

## YouTube

Prefira a skill/ferramenta nativa `youtube-content` quando disponível. Use Agent Reach/`yt-dlp` como fallback para extrair legendas.

Com `yt-dlp`:

```bash
yt-dlp --write-sub --write-auto-sub --skip-download -o "/tmp/%(id)s" "YOUTUBE_URL"
```

Se `agent-reach doctor --json` avisar que falta JS runtime para YouTube, siga a recomendação do doctor antes de tentar grandes coletas.

## Bilibili

Não assuma que `yt-dlp` funciona para Bilibili. O Agent Reach recomenda `bili-cli`, OpenCLI ou API pública de busca conforme `active_backend`.

Exemplos:

```bash
bili search "QUERY" --type video -n 5
```

Sempre rode:

```bash
agent-reach doctor --json
```

antes de escolher backend.

## Podcasts / Xiaoyuzhou

O Agent Reach pode usar transcrição via Groq/OpenAI Whisper, mas isso exige chave de API e pode processar áudio longo.

Regras:

- peça autorização antes de usar API paga ou chave do usuário;
- informe limites de quota/custo;
- salve transcript temporário em `/tmp/`;
- cite link original no resumo.

## Síntese de vídeo

Ao resumir vídeo/podcast:

1. Identifique título, fonte e data quando disponíveis.
2. Separe resumo executivo, tópicos principais e citações/trechos importantes.
3. Avise se a transcrição veio de legenda automática.
4. Não invente conteúdo ausente da legenda/transcrição.
