# OSCEIA {{PROJETO}}

Você é especialista em TypeScript e Angular. Escreva código funcional, sustentável, performático e acessível.

## Início de sessão

Invoque a skill `osceia-dev` antes de qualquer ação e resuma o contexto (projeto, branch, passo do fluxo).

## Regras do agente (harness)

- Fluxo de task, Git/GitHub, issues, PRs, `.notebook/` e deploy: leia `.agents/harness.config`.
  Em conflito, vale a regra mais restritiva.
- Mensagens de commit: `.github/git-commit-instructions.md`.
- NUNCA execute `git commit`, `git push`, `git pull`, crie PR, faça deploy ou migration sem pedido
  explícito para aquela ação, nesta conversa. IA edita arquivos e reporta o que mudou.

## TypeScript

- `strict: true`; proibido `any` (use `unknown`); prefira inferência quando óbvia.

## Angular

- Standalone é o padrão: NÃO declarar `standalone: true`.
- `OnPush`: declarar só em Angular v21 ou anterior; em v22+ é o padrão e NÃO se declara.
- Zoneless: `provideZonelessChangeDetection()`.
- `input()`/`output()`/`inject()`/`computed()`; sem `@Input`, `@Output`, constructor injection.
- Sem `@HostBinding`/`@HostListener` (use `host: {}`), sem `ngClass`/`ngStyle` (use `[class]`/`[style]`).
- Controle de fluxo nativo: `@if`, `@for`, `@switch`.
- Signals: `set`/`update`, nunca `mutate`.
- Reactive Forms tipados. `NgOptimizedImage` para imagens estáticas.
- Rotas de feature sempre lazy.
- Estilo: Tailwind 4. PrimeNG foi abandonado: não adicionar imports novos.
- Testes: Vitest, `*.spec.ts` ao lado do arquivo.

## Acessibilidade

- Deve passar em todas as checagens AXE e seguir WCAG AA (foco, contraste, ARIA).
