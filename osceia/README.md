# osceia

Padrões Angular/React da OSCEA, harness de governança (hooks git, guard, CI), ciclo de verificação e fluxo do levantamento ao deploy. Chamada com `/osceia`.

## Instalar

```bash
/plugin marketplace add osceiatech/skills-osceia
/plugin install osceia --marketplace osceiatech/skills-osceia
```

Ou, sem menu: `claude plugin install osceia@skills-osceia --scope user`.

O plugin já registra o hook `SessionStart`, que em projeto Angular ou React manda invocar a skill e rodar o ciclo de verificação. Detalhes em [`references/governance-hooks.md`](./references/governance-hooks.md).
