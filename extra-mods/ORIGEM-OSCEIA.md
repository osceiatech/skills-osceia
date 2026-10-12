# Origem e alterações (OSCEIA)

Cópia do plugin `extra-mods` de **Jhonatan de Souza**
(<https://github.com/Jhonatan-de-Souza/ClaudeMods>, `plugins/extra-mods`), na base do commit
`9b4b59f9b9683465e5044828f00c6a4abd1e5f63`, mantida **neste repositório privado** para uso interno.

> **Licença:** o repositório de origem não declara licença. Esta cópia não deve sair deste repositório
> privado sem a autorização do autor. Se ele pedir, remova esta pasta e volte a referenciar o original no
> `marketplace.json` (`source: git-subdir`, `sha: 9b4b59f…`).

## O que foi alterado

- **Painel "OSCEIA skills"** (opção 5 do menu `◆ extra-mods ▲`, ou `/tools skills`): lista as skills e mods do
  marketplace `skills-osceia` por tema; Enter copia o comando de instalação. Nada é instalado pelo painel.
  - `hooks/lib/osceia.ts` — catálogo (dados) e os comandos copiados.
  - `hooks/register.tsx` — painel `skills`, linha no menu e argumento do comando.
  - `types/index.d.ts` — `Panel` ganha `'skills'`.
  - `tests/extra-mods.test.tsx` — teste novo; os demais ficam como no original.
- **Versão:** `0.4.1-osceia.1`.

## Manter o catálogo

`hooks/lib/osceia.ts` foi gerado do `.claude-plugin/marketplace.json` deste repositório e **fica defasado** a cada
skill nova. Atualize-o junto com o manifesto.

## Verificar

```bash
claude plugin validate .
claude plugin test .
```
