# educa-lateral

Mod do Claude Code: um painel à direita (largura fixa, pensada para ~50% de um terminal comum —
ajuste `LARGURA_PAINEL` em `hooks/register.tsx` se destoar do seu terminal) que mostra textos
curtos explicando as tecnologias que estão sendo escolhidas enquanto algo é desenvolvido.

- A IA chama a ferramenta `explicar` (`titulo`, `texto`, `tecnologia?`) antes de decidir ou usar uma tecnologia.
- `/educar` abre ou fecha o painel; `/educar limpar` apaga as notas.
- O mod não injeta instrução no system prompt (não existe esse hook na API de mods hoje). O aviso
  para a IA chamar `explicar` vive na própria descrição da ferramenta; para reforçar em todos os
  projetos, uma instrução global complementar pode ser adicionada ao `~/.claude/CLAUDE.md` do usuário.

## Instalar

```bash
/plugin marketplace add osceiatech/skills-osceia
/plugin install educa-lateral --marketplace osceiatech/skills-osceia
```

Para testar a partir da pasta, sem instalar:

```bash
claude --plugin-dir ~/.agents/skills/educa-lateral
```

## Verificar

```bash
claude plugin validate .
```

(`claude plugin test .` não existe nesta versão do CLI — `tests/educa.test.ts` usa uma API de
teste de mods que não pôde ser confirmada como real; trate-a como não verificada até alguém
confirmar o comando/API corretos.)

Tipos: `tsc -p` com o `tsconfig.json` da pasta, depois que o Claude Code carregar o mod uma vez
(ele grava `.claude-plugin/types/`).
