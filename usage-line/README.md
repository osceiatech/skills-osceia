# usage-line

Mod do Claude Code que mostra o consumo da sessão numa linha de status compacta, abaixo do prompt:

```
Opus 5.5 ⎇ main │ ctx ▰▰▰▱▱▱▱▱ 42% │ 5h ▰▰▱▱▱▱▱▱ 23% 2h10 │ 7d ▰▰▰▰▰▱▱▱ 62% 3d4h │ $1.23 │ ⚡90% 4m
```

| Campo | O que é |
|---|---|
| `Opus 5.5 ⎇ main` | modelo da sessão e branch do git |
| `ctx` | janela de contexto ocupada |
| `5h` / `7d` | limites de uso da assinatura e tempo até resetar (vazio com API key) |
| `$1.23` | custo da sessão em USD |
| `⚡90% 4m` / `❄90%` | quanto da entrada do último turno veio do cache; quente com tempo restante, ou frio |

Atualiza a cada turno, a cada medição do Claude Code e a cada 15 s.

## Instalar

No prompt do Claude Code (terminal):

```
/plugin install usage-line --marketplace osceiatech/skills-osceia
```

Ou no shell:

```bash
claude plugin install usage-line@skills-osceia --scope user
```

Responda `y` para adicionar o marketplace e escolha o escopo. O mod passa a valer na hora.

Repositório privado: precisa de acesso de leitura ao `osceiatech/skills-osceia` e credencial git para o github.com
(chave SSH, ou `gh auth login` seguido de `gh auth setup-git`).

## Configurar

`/config` → **Prompt cache TTL** (`cacheTtl`): `5m` (padrão da API) ou `1h`. Ajuste para o TTL da sua conta, senão o
cache aparece frio antes da hora.

## Desenvolver

```bash
claude --plugin-dir ./usage-line   # carrega da pasta, com recarga ao salvar
claude plugin test ./usage-line
claude plugin validate ./usage-line
```
