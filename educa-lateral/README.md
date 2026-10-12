# educa-lateral

Mod do Claude Code: um painel à direita (~40% do terminal) que mostra textos curtos explicando as
tecnologias que estão sendo escolhidas enquanto algo é desenvolvido.

- A IA chama a ferramenta `mcp__educa-lateral__explicar` (`titulo`, `texto`, `tecnologia?`) antes de decidir ou usar uma tecnologia.
- `/educar` abre ou fecha o painel; `/educar limpar` apaga as notas.
- Uma seção no system prompt pede notas em pt-BR, curtas, sem dado pessoal.

## Usar

```bash
claude --plugin-dir ~/.agents/skills/educa-lateral
```

## Verificar

```bash
claude plugin validate .
claude plugin test .
```

Tipos: `tsc -p` com o `tsconfig.json` da pasta, depois que o Claude Code carregar o mod uma vez
(ele grava `.claude-plugin/types/`).
