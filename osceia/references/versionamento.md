# Versionamento — projetos OSCEIA

SemVer 2.0.0, Conventional Commits e release-please. Primeiro aplicado no osceia-contratos
(osceiatech/osceia-contratos#32); os arquivos vêm do harness (`templates/harness/`) pelo `bootstrap-harness.sh`.

## Regra de numeração

O título do PR, que vira o commit de squash na `main`, decide a versão:

| Título do PR | Efeito |
|---|---|
| `feat(#12)!: ...` ou corpo com `BREAKING CHANGE:` | MAJOR (`1.4.2` → `2.0.0`) |
| `feat(#12): ...` | MINOR (`1.4.2` → `1.5.0`) |
| `fix(#12): ...`, `perf(#12): ...` | PATCH (`1.4.2` → `1.4.3`) |
| `docs`, `chore`, `refactor`, `test`, `style`, `ci` | nenhum |

- **Incompatível**, num app interno: remove tela ou funcionalidade, muda um fluxo obrigatório a ponto de a equipe
  precisar reaprender, ou exige publicar junto uma versão incompatível de outro sistema (ex.: osceia-api).
- Tag `vX.Y.Z`. Projeto que já está em produção começa em `1.0.0`.

## Fluxo

```
PR da feature mergeado na main
  └─ pessoa roda `npm run release:pr` (último passo do bloco de entrega do harness.config)
       └─ scripts/release.mjs → npx release-please@17.3.0 release-pr, com o token do `gh`
            └─ abre/atualiza "chore: release X.Y.Z": package.json, package-lock.json, manifest,
               CHANGELOG.md e o arquivo de versão do app
                 └─ pessoa mergeia quando quiser lançar (o merge dispara o deploy, como todo push na main)
                      └─ workflow release-please.yml (skip-github-pull-request) → tag vX.Y.Z + GitHub Release
```

- **Por que a pessoa abre o PR de release, e não o Actions:** a organização não permite que o GitHub Actions
  crie PR ("GitHub Actions is not permitted to create or approve pull requests"). O CLI usa o login de quem roda.
- **Por que depois do merge, e não dentro de cada PR:** PRs abertos ao mesmo tempo calculariam a mesma versão e
  conflitariam no `package.json`, no `CHANGELOG.md` e no arquivo de versão.
- `npm run release:pr -- --dry-run` mostra a próxima versão e o changelog sem criar nada.
- O script roda o `npx` com `--loglevel=warn`: sem isso o npm 11 imprime a linha de comando com o token.
- O `ci.yml` pula a conferência (carimbo, checklist, `Closes #`) só na branch `release-please--*`.

## Arquivos

| Arquivo | Origem | Sync |
|---|---|---|
| `scripts/release.mjs` | template | idêntico entre projetos (`sync-harness.sh`) |
| `.github/workflows/release-please.yml` | template | idêntico |
| `.github/workflows/ci.yml` (exceção do release) | template | idêntico |
| `.github/git-commit-instructions.md` (seção Versionamento) | template | idêntico |
| `release-please-config.json` | template com `{{REPO}}`, `{{BOOTSTRAP_SHA}}`, `{{ARQUIVO_VERSAO}}` | por projeto |
| `.release-please-manifest.json` | template com `{{VERSAO}}` (do `package.json`) | por projeto |
| `package.json` → `"release:pr": "node scripts/release.mjs"` | bootstrap (jq) | — |
| `CHANGELOG.md` | o release-please cria ou insere acima da primeira entrada `## <número>` | — |

- `bootstrap-sha` = HEAD da `origin/main` no bootstrap: o histórico anterior não entra no primeiro changelog.
  Se o projeto já tem um `CHANGELOG.md` manual, mantenha-o; escreva uma introdução no topo e deixe as entradas antigas
  abaixo. As versões novas entram entre as duas.

## Primeira versão

1. Rodar `bootstrap-harness.sh` na branch da issue de versionamento, criar o arquivo de versão (abaixo) e abrir o PR.
2. Projeto em produção com `package.json` em `0.x`: mergear com `gh pr merge --squash --body "Release-As: 1.0.0"`.
   Sem isso, o primeiro `feat` vira `0.1.0`.
3. `npm run release:pr`, conferir o PR "chore: release 1.0.0" e mergear. Conferir a tag e o Release.

## Mostrar a versão na tela

Arquivo atualizado pelo release-please (`extra-files`), marcado na linha com `x-release-please-version`. Nada de importar
o `package.json` no app (exigiria `resolveJsonModule` e levaria o arquivo para o bundle).

**Angular** — `src/app/core/versao.ts`:

```ts
/** Atualizada pelo release-please a cada release (release-please-config.json, extra-files). Não editar à mão. */
export const VERSAO_APP = '0.0.0'; // x-release-please-version
```

No componente do layout (menu lateral ou rodapé):

```ts
protected readonly versao = VERSAO_APP;
```

```html
<p class="text-xs" data-testid="versao-app">Versão {{ versao }}</p>
```

**React** — `src/versao.ts` com o mesmo conteúdo, usado direto no JSX.

- Contraste AA com o fundo; sem link para o GitHub Release (os repositórios são privados e a equipe não abre).
- Teste: o texto é `Versão ${VERSAO_APP}`, `VERSAO_APP` casa com `^\d+\.\d+\.\d+$` e o trecho passa no AXE.
