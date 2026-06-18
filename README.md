# skills-osceia

Repositório central para o desenvolvimento, teste e integração de habilidades (skills) e automações do ecossistema OSCEIA/Fóton.

## Conteúdo

| Pasta | Tipo | Descrição |
|---|---|---|
| [`speckit-preset-osceia/`](./speckit-preset-osceia/) | Preset Spec Kit | Localiza o [Spec Kit](https://github.com/github/spec-kit) para PT-BR com gates obrigatórios de Acessibilidade (WCAG 2.1 AA) e Privacidade (LGPD) |

## Uso rápido

```bash
# Instalar o preset OSCEIA num projeto já iniciado com o Spec Kit
specify preset add osceiatech/skills-osceia/speckit-preset-osceia

# Adotar a constituição-base no projeto
cp speckit-preset-osceia/memory/constitution.md .specify/memory/constitution.md
```
