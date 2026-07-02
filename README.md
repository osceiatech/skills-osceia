# skills-osceia

Repositório central para o desenvolvimento, teste e integração de habilidades (skills), presets e automações do ecossistema OSCEIA/Fóton.

## Conteúdo

| Pasta | Tipo | Descrição |
|---|---|---|
| [`agent-reach/`](./agent-reach/) | Skill Hermes / Internet Research | Roteador de pesquisa multi-plataforma para web, RSS, YouTube, GitHub, Reddit, V2EX, Bilibili, Xiaohongshu, LinkedIn e social listening. Status: **opcional controlada** — usar com `doctor`, `--safe`/`--dry-run`, preferência por ferramentas nativas do Hermes e regras de segurança/LGPD. |
| [`speckit-preset-osceia/`](./speckit-preset-osceia/) | Preset Spec Kit | Localiza o [Spec Kit](https://github.com/github/spec-kit) para PT-BR com gates obrigatórios de Acessibilidade (WCAG 2.1 AA) e Privacidade (LGPD). |

## Uso rápido

```bash
# Instalar o preset OSCEIA num projeto já iniciado com o Spec Kit
specify preset add osceiatech/skills-osceia/speckit-preset-osceia

# Adotar a constituição-base no projeto
cp speckit-preset-osceia/memory/constitution.md .specify/memory/constitution.md
```

## Skills Hermes

As skills Hermes vivem em pastas com `SKILL.md` e, quando necessário, arquivos em `references/`.

### Agent Reach

Skill adaptada a partir de [`Panniantong/agent-reach`](https://github.com/Panniantong/agent-reach) para uso no portfólio OSCEIA/Fóton.

Diretrizes de uso:

- preferir ferramentas nativas do Hermes quando suficientes (`web_search`, `web_extract`, `browser`, `x_search`, `youtube-content`, skills GitHub);
- usar Agent Reach para lacunas multi-plataforma, comunidades, social listening e backends externos;
- rodar `agent-reach doctor --json` antes de canais multi-backend ou autenticados;
- usar `agent-reach install --env=auto --dry-run` e `--safe` antes de instalação real;
- não usar para escrita em plataformas externas;
- não usar cookies/sessões/credenciais sem autorização explícita;
- seguir `agent-reach/references/security-lgpd.md` para canais autenticados e dados pessoais.
