## O que foi feito

<!-- Descreva de forma clara e concisa o que foi implementado. -->

### Commits (TDD)

<!-- Liste os commits seguindo o fluxo Red → Green → Refactor -->

1. `test(#N)`: ...
2. `feat(#N)`: ...
3. `refactor(#N)`: ...

## Testes

<!-- Cole aqui o resultado local de `npm test` e `npm run build` (o CI do GitHub não roda testes). -->

- **X novos testes**
- **Y/Y passando**

O carimbo é criado pelo hook no `git push` e conferido pelo CI; commit novo exige novo push. Não precisa colar nada.

## Checklist

- [ ] Testes passam: `npm test -- --no-watch`
- [ ] Build ok: `npm run build`
- [ ] Depende de mudança em Edge Function, migration ou RLS: publicada antes pela pessoa responsável (ou N/A)
- [ ] Acessibilidade: AXE e WCAG AA (foco, contraste, ARIA)
- [ ] Nenhum dado pessoal real (candidato, pessoa, telefone, CPF), token ou chave em código, teste, seed, log ou captura de tela
- [ ] Spec em `.specs/features/<issue>-<slug>/` e pesquisa em `.notebook/` (com linha no `INDEX.md`)
- [ ] Branch segue o padrão `<tipo>/<numero-da-issue>-<slug>`

Closes #<!-- número da issue -->
