# Hooks de Governança — Angular OSCEA

Os scripts em `angular-oscea/hooks/` implementam, como hooks do Claude Code, parte das
regras da seção 12 (Governança de Projeto) do `SKILL.md`. Eles **avisam, não bloqueiam**
— ficam a critério de quem está desenvolvendo seguir ou ignorar o aviso (ex.: numa
`quick task` do `tlc-spec-driven`, não ter spec é esperado).

Os scripts ficam neste repositório (não em `~/.claude/`) porque este repositório é a
fonte compartilhada das skills da equipe. O que é local de cada máquina é apenas a
**ativação** dos hooks (o arquivo `settings.json` do Claude Code, que não é versionado).

---

## O que cada script faz

| Script | Evento | Regra |
|---|---|---|
| `feature-spec-check.sh` | `PostToolUse` (`Write\|Edit`) | Ao editar um arquivo em `src/app/features/[feature]/`, avisa (uma vez por feature/sessão) se não existir `.specs/features/[feature]/spec.md` |
| `ts-edit-counter.sh` | `PostToolUse` (`Write\|Edit`) | A cada 20 edições de `.ts`/`.tsx` na sessão, sugere rodar a skill `cyclomatic-complexity` |
| `commit-size-check.sh` | `PreToolUse` (`Bash`, filtrado para `git commit*`) | Avisa se o commit staged tiver mais de 8 arquivos ou 300 linhas adicionadas — incentiva commits pequenos e atômicos |
| `session-summary.sh` | `Stop` | Ao fim da sessão, lista as features alteradas e lembra de specs, testes e2e, `cyclomatic-complexity` e commits atômicos antes do PR |

Nenhum desses hooks consegue verificar de forma determinística se **existem testes de
ponta a ponta** (os projetos usam Vitest para unitários; não há framework e2e padrão) —
por isso esse item vira apenas um lembrete no resumo de fim de sessão, não uma checagem
automática.

---

## Como ativar na sua máquina

Adicione ao seu `~/.claude/settings.json` (para valer em todos os projetos OSCEA) ou ao
`.claude/settings.json` do projeto específico (para valer só ali). Ajuste o caminho dos
scripts se você clonou este repositório em outro lugar — o padrão assume
`~/.agents/skills` (mesma convenção usada pelos symlinks em `~/.claude/skills/`).

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.agents/skills/angular-oscea/hooks/commit-size-check.sh 2>/dev/null || true",
            "if": "Bash(git commit*)",
            "timeout": 10
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.agents/skills/angular-oscea/hooks/feature-spec-check.sh 2>/dev/null || true",
            "timeout": 10
          },
          {
            "type": "command",
            "command": "bash ~/.agents/skills/angular-oscea/hooks/ts-edit-counter.sh 2>/dev/null || true",
            "timeout": 10
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.agents/skills/angular-oscea/hooks/session-summary.sh 2>/dev/null || true",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

Se você já tem hooks configurados (ex.: o hook do RTK em `PreToolUse`/`Bash`), **mescle**
os arrays — não substitua o que já existe. Veja a skill `update-config` para o
procedimento de mesclagem e verificação.

Depois de editar, valide com:

```bash
jq empty ~/.claude/settings.json
```

Se o `.claude/settings.json` for novo (nunca existiu nesta pasta antes desta sessão),
pode ser necessário abrir `/hooks` uma vez no Claude Code para ele recarregar a
configuração.
