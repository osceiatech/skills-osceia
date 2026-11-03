# Regras para Geração de Mensagens de Commit

1. **Idioma:** Escreva TODAS as mensagens de commit em Português (PT-BR).
2. **Formato:** Siga estritamente o padrão Conventional Commits: `<tipo>(<escopo>): <descrição curta>`.
3. **Tipos Permitidos:**
  - `feat`: Uma nova funcionalidade.
  - `fix`: Correção de um bug.
  - `refactor`: Mudança de código que não corrige um bug nem adiciona uma funcionalidade (ex: refatoração de Standalone Components).
  - `style`: Formatação, pontos e vírgulas faltando, etc (sem mudança na lógica).
  - `docs`: Alterações apenas na documentação.
  - `perf`: Mudança de código que melhora a performance (ex: otimização de Signals).
  - `chore`: Atualização de dependências ou ferramentas de build.
4. **Tamanho:** A primeira linha (título) deve ter no máximo 72 caracteres.
5. **Corpo do Commit:** Se a alteração for complexa, adicione uma linha em branco após o título e explique o "porquê" da mudança em tópicos usando bullet points (`-`).
6. **Tom:** Use o verbo no imperativo na descrição curta (ex: "adiciona", "corrige", em vez de "adicionado" ou "corrigido").
7. **Autoria:** NUNCA acrescente `Co-Authored-By:` com Claude/Anthropic nem "Generated with Claude Code" (nem 🤖). O commit tem só a autoria de quem o faz.

## Versionamento (SemVer 2.0.0)

O título do PR (que vira o commit de squash na `main`) decide a próxima versão. Depois de cada merge, rode
`npm run release:pr`: o release-please lê esses títulos e abre ou atualiza o PR de release ("chore: release X.Y.Z")
com a versão nova e o `CHANGELOG.md`. Mergear esse PR é lançar: o workflow `.github/workflows/release-please.yml`
cria a tag `vX.Y.Z` e o GitHub Release. `npm run release:pr -- --dry-run` mostra a próxima versão sem criar nada.

| Título do PR | Efeito na versão |
|---|---|
| `feat(#12)!: ...` ou corpo com `BREAKING CHANGE: <o que quebra>` | MAJOR (`1.4.2` → `2.0.0`) |
| `feat(#12): ...` | MINOR (`1.4.2` → `1.5.0`) |
| `fix(#12): ...` ou `perf(#12): ...` | PATCH (`1.4.2` → `1.4.3`) |
| `docs`, `chore`, `refactor`, `test`, `style`, `ci` | nenhum (entra no próximo release com feat/fix) |

- **Incompatível (MAJOR)**, num app interno: remove tela ou funcionalidade, muda um fluxo obrigatório a ponto de a
  equipe precisar reaprender, ou exige publicar junto uma versão incompatível de outro sistema (ex.: osceia-api).
- Na dúvida entre `feat` e `fix`: algo que a equipe passa a conseguir fazer é `feat`; algo que deveria funcionar e
  não funcionava é `fix`.
- Não editar à mão a parte gerada do `CHANGELOG.md`, `package.json#version`, `.release-please-manifest.json` nem o
  arquivo de versão do app (`extra-files` do `release-please-config.json`): quem atualiza é o PR de release.
- Para forçar uma versão específica, use o rodapé `Release-As: X.Y.Z` no corpo do commit de squash.
