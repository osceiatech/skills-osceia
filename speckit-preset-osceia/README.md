# Preset `osceia` para o Spec Kit

Localiza o [Spec Kit](https://github.com/github/spec-kit) para PT-BR e aplica os padrões
técnicos e de conformidade da OSCEIA/Fóton.

## O que ele faz

- Sobrescreve o `spec-template` por uma versão em **português** com seções obrigatórias de
  **Acessibilidade (WCAG 2.1 AA)** e **Privacidade (LGPD)**.
- Sobrescreve o `tasks-template` por uma versão em **português** que injeta duas **Fases de
  Conformidade obrigatórias** em todo `tasks.md`: gate de acessibilidade (auditoria AXE, zero
  violações críticas/sérias) e revisão LGPD (com atenção extra a dados de menores).
- Acompanha uma **constituição-base** (`memory/constitution.md`) com os princípios da
  organização: SDD, acessibilidade, padrões Angular (standalone + signals + PrimeNG/Tailwind),
  backend Laravel/Filament + Supabase/Firebase, LGPD e YAGNI.

> A constituição **não** é aplicada automaticamente pelo preset — ela é por projeto. Copie o
> arquivo na instalação (passo 2 abaixo) ou gere-a com `/speckit.constitution`.

## Instalação

A partir de um projeto já iniciado com `specify init ... --integration claude --integration-options="--skills"`:

```bash
# 1. Instalar o preset (a partir deste repositório/pasta)
specify preset add osceia

# 2. Adotar a constituição-base no projeto
cp osceia/memory/constitution.md .specify/memory/constitution.md
```

A partir daí o fluxo normal usa os artefatos em PT-BR:

```
/speckit.constitution   # confirmar/ajustar a constituição para este projeto
/speckit.specify        # gera spec.md em PT-BR com as seções de acessibilidade e LGPD
/speckit.clarify
/speckit.plan
/speckit.tasks
/speckit.implement
```

## Próximas extensões (ideias)

- Override do comando `plan` para checar as Restrições Tecnológicas da constituição automaticamente.
- Versões por organização (ex.: `osceia-app`, `concafras`) empilháveis por prioridade.

## Compatibilidade

- Spec Kit `>= 0.6.0`.
- Resolução de templates é em runtime; overrides locais em `.specify/templates/overrides/`
  têm prioridade sobre este preset, caso precise de ajuste pontual num projeto.
