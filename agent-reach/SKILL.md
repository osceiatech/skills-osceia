---
name: agent-reach
description: >
  Roteia pesquisa multi-plataforma na internet com Agent Reach, usando doctor + backends como Jina Reader, Exa, yt-dlp, gh CLI, RSS, OpenCLI e CLIs específicas. Use quando o usuário precisar pesquisar/coletar conteúdo em múltiplas fontes ou plataformas pouco cobertas pelas ferramentas nativas: Reddit, Bilibili, Xiaohongshu, V2EX, RSS, YouTube subtitles, GitHub discovery, LinkedIn, Facebook/Instagram via sessão de navegador, ou social listening. Prefira ferramentas nativas do Hermes quando bastarem. Não use para postar/comentar/curtir, scraping massivo de dados pessoais, ou uso de cookies sem consentimento explícito.
version: 1.0.0
author: OSCEIA/Fóton + Agent Reach upstream
license: MIT
metadata:
  hermes:
    tags: [research, intelligence, internet, social-listening, osceia]
    homepage: https://github.com/Panniantong/agent-reach
    related_skills: [defuddle, youtube-content, github-code-review, github-issues, technical-design-doc-creator, to-prd]
---

# Agent Reach — roteador de pesquisa multi-plataforma

## Visão geral

Agent Reach é uma camada de capacidade para pesquisa na internet. Ele não substitui o julgamento do agente nem as ferramentas nativas do Hermes; ele ajuda a escolher e diagnosticar backends externos para fontes específicas: web, RSS, YouTube, GitHub, Reddit, Twitter/X, Bilibili, Xiaohongshu, V2EX, LinkedIn, Facebook/Instagram e outras.

Use esta skill como **opcional controlada** no portfólio OSCEIA: ótima para intelligence, pesquisa de mercado, tendências, comunidades, conteúdo técnico e social listening; inadequada para automações de escrita em plataformas, coleta indiscriminada de dados pessoais ou uso de contas principais.

## Quando usar

Use quando a tarefa pedir:

- pesquisa multi-fonte ou social listening;
- opinião pública/comunidades sobre produto, tecnologia, instituição, concorrente ou tendência;
- leitura de YouTube com legendas, RSS, V2EX, Bilibili, Xiaohongshu, Reddit ou LinkedIn;
- descoberta de repositórios/código no GitHub além de uma consulta simples;
- comparação entre sinais de web aberta + comunidades + vídeos + redes sociais;
- diagnóstico de quais canais externos estão disponíveis via `agent-reach doctor --json`.

Não use quando:

- `web_search`, `web_extract`, `browser`, `x_search`, `youtube-content` ou skills GitHub nativas resolvem com menor risco;
- a tarefa é só escrever, editar, resumir ou analisar material já fornecido;
- a operação envolve postar, comentar, curtir, seguir, enviar mensagem ou qualquer escrita em plataforma externa;
- o usuário não autorizou uso de cookies, sessão de navegador ou credenciais;
- a coleta envolve dados pessoais identificáveis sem base clara, necessidade e minimização.

## Regra de roteamento Hermes-first

1. **Ferramenta nativa primeiro:** para buscas simples, URLs públicas, GitHub comum, YouTube simples ou X/Twitter quando `x_search` está disponível, prefira as ferramentas nativas do Hermes.
2. **Agent Reach quando há lacuna:** use Agent Reach para plataformas específicas, múltiplas fontes, fallbacks, canais com login controlado ou diagnóstico de backends.
3. **Explique a rota:** antes de coletar, diga brevemente qual fonte/backend será usado e por quê.
4. **Colete só o necessário:** limite escopo, quantidade de resultados e profundidade de comentários/feeds.
5. **Separe coleta de síntese:** Agent Reach coleta conteúdo; análise, PRD, TDD, issues e decisões usam as skills correspondentes.

## Pré-check obrigatório

Antes de usar canais multi-backend ou que podem depender de login, rode:

```bash
agent-reach doctor --json
```

Use o campo `active_backend` para decidir o comando. Se `agent-reach` não estiver instalado, não instale automaticamente. Primeiro faça:

```bash
agent-reach install --env=auto --dry-run
agent-reach install --env=auto --safe
```

Só prossiga com instalação real após autorização do usuário, explicando o que será instalado.

## Instalação segura sugerida

Instalação isolada preferencial:

```bash
pipx install https://github.com/Panniantong/agent-reach/archive/main.zip
agent-reach install --env=auto --safe
agent-reach doctor --json
```

Alternativa com `uv` para teste temporário, sem instalação global:

```bash
uv run --with https://github.com/Panniantong/agent-reach/archive/main.zip agent-reach doctor --json
```

Nunca rode instaladores que modifiquem sistema, Node/npm global, browser extensions ou cookies sem consentimento explícito.

## Matriz rápida de fontes

| Fonte | Preferência Hermes/OSCEIA | Quando Agent Reach ajuda | Referência |
|---|---|---|---|
| Web aberta | `web_search`, `web_extract`, Defuddle | Jina Reader/Exa como fallback ou pesquisa técnica | `references/web.md`, `references/search.md` |
| GitHub | skills GitHub + `gh` | descoberta ampla de repos/código/issues | `references/dev.md` |
| YouTube | `youtube-content` | fallback com `yt-dlp` e legendas | `references/video.md` |
| RSS | ferramentas/terminal | monitorar feeds e extrair posts | `references/web.md` |
| Reddit/V2EX | Agent Reach | comunidades e relatos de problemas | `references/social.md` |
| Bilibili/Xiaohongshu | Agent Reach | sinais de ecossistema chinês/consumo/social | `references/social.md`, `references/video.md` |
| LinkedIn | cuidado + público | vagas, empresas e perfis públicos | `references/career.md` |
| Facebook/Instagram | só com autorização | leitura via sessão local/OpenCLI | `references/social.md` |

## Segurança, LGPD e contas

Leia `references/security-lgpd.md` antes de qualquer canal autenticado.

Regras mínimas:

- não peça nem aceite senha; se precisar de autenticação, prefira sessão local/OpenCLI;
- cookies equivalem a acesso de conta: use conta secundária dedicada;
- não use conta principal da OSCEIA/Fóton ou de cliente para scraping;
- não colete dados pessoais além do necessário para a pergunta;
- não contorne CAPTCHA, paywall, bloqueio técnico ou rate limit;
- registre limitações e incertezas no relatório final.

## Workflows

### Pesquisa multi-fonte

1. Defina pergunta, fontes-alvo, limite de resultados e janela temporal.
2. Rode `agent-reach doctor --json` se alguma fonte depender de Agent Reach.
3. Colete em paralelo quando possível: web aberta + comunidades + vídeos + GitHub/RSS.
4. Salve temporários em `/tmp/` quando necessário; não polua o workspace do projeto.
5. Sintetize separando fatos, evidências, sinais fracos, vieses da amostra e próximos passos.

### Avaliação de tendência/produto

1. Busque web aberta e GitHub para contexto técnico.
2. Use Reddit/V2EX/Twitter/X/Xiaohongshu/Bilibili apenas quando agregarem percepção social.
3. Classifique evidências por fonte e confiabilidade.
4. Evite extrapolar de amostras pequenas; deixe claro o tamanho/limite da coleta.

### Coleta para PRD/TDD/issues

1. Use Agent Reach só para levantar evidências externas.
2. Depois carregue `to-prd`, `technical-design-doc-creator`, `to-issues` ou `gh-issue-dor-dod` conforme o artefato pedido.
3. Referencie URLs/fontes no artefato final, sem colar dados sensíveis desnecessários.

## Referências detalhadas

- `references/search.md` — Exa/mcporter e busca técnica.
- `references/web.md` — Jina Reader, RSS e páginas públicas.
- `references/dev.md` — GitHub via `gh`.
- `references/video.md` — YouTube, Bilibili e transcrição de podcasts.
- `references/social.md` — Reddit, V2EX, Twitter/X, Xiaohongshu, Bilibili, Facebook/Instagram.
- `references/career.md` — LinkedIn e pesquisa de vagas/empresas.
- `references/security-lgpd.md` — regras de segurança, cookies e compliance.

## Armadilhas comuns

1. **Instalar tudo por padrão.** Instale só canais necessários e use `--safe`/`--dry-run` primeiro.
2. **Deixar a descrição dominar todas as pesquisas.** Esta skill é para lacunas e multi-plataforma; Hermes nativo continua preferencial para tarefas simples.
3. **Tratar cookies como detalhe técnico.** Cookies são credenciais; peça autorização e use conta secundária.
4. **Confundir coleta com verdade.** Dados de redes são amostra enviesada; sintetize com cautela.
5. **Fazer escrita em plataformas.** Esta skill é somente leitura/coleta.

## Checklist de verificação

- [ ] Ferramentas nativas do Hermes foram consideradas primeiro.
- [ ] Escopo, fontes e limites de coleta estão claros.
- [ ] `agent-reach doctor --json` foi usado quando necessário.
- [ ] Nenhuma credencial/cookie foi usado sem consentimento explícito.
- [ ] Dados pessoais foram minimizados.
- [ ] Resultado final separa evidência, interpretação e limitações.
