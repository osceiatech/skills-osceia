# Saída do PrimeNG — Plano de Migração

PrimeNG deixou de ser gratuito e foi **abandonado** na OSCEA. Projetos sem ele (contratos,
faturamento, ja-pedagogico) são a referência de como fica o resultado.

## Estado por projeto (levantado em out/2026 — reconferir com `grep -r "from 'primeng" src`)

| Projeto | Uso atual | Esforço |
|---|---|---|
| osceia-app | só `primeng/config` (tema) | trivial — remover config + `tailwindcss-primeui` |
| osceia-camara | `config` + `inputmask` (3 usos) | pequeno — trocar por diretiva de máscara |
| osceia-institucional | button, select, inputtext, dialog (+ dragdrop, tooltip) | médio |
| osceia-marketing | api (MessageService), button, tag, table, confirmdialog, tabs, paginator, skeleton | médio |
| osceia-admin | button, inputtext, tag, api, toast, select, table, tooltip, iconfield, dialog, textarea | grande |
| contratos / faturamento / ja-pedagogico | nenhum | feito |

## Equivalentes (padrão já usado nos projetos migrados)

| PrimeNG | Substituto |
|---|---|
| `p-button`, `pButton` | `<button>` com classes Tailwind; variantes em `shared/components/` se repetirem |
| `pInputText`, `pTextarea`, `iconfield/inputicon` | `<input>`/`<textarea>` + Tailwind, `<label>` associado (seção 7) |
| `p-select` | `shared/components/select-busca/` (exemplo: osceia-contratos) |
| `p-table` + `p-paginator` | `<table>` semântica + `shared/components/paginador/` |
| `p-tag` | `<span>` com tokens `@theme` |
| `p-toast` + `MessageService` | `toast-outlet.component.ts` + serviço de toast em signals (ex.: ja-pedagogico) |
| `p-dialog`, `p-confirmdialog` | `<dialog>` nativo ou `@angular/cdk/dialog` (foco preso, `aria-modal`, Esc) |
| `pTooltip` | atributo `title`/`aria-describedby`; CDK overlay se precisar de rich content |
| `p-tabs` | `role="tablist"/"tab"/"tabpanel"` + setas do teclado |
| `p-skeleton` | `<div class="animate-pulse ...">` |
| `p-inputmask` | diretiva `shared/directives/mask.directive.ts` |
| `pDragDrop` | `@angular/cdk/drag-drop` |
| `primeicons` | **pode ficar** (MIT, gratuito) ou componente `icon` próprio com SVG |

## Regras da migração

1. **Uma feature por issue** — nunca em lote dentro de outra task. Fluxo normal (seção 12).
2. Antes de trocar, escrever/atualizar o teste da tela; depois da troca, `npm test` + `npm run build`.
3. Cada substituto novo vira componente em `shared/components/` **com AXE/WCAG AA** (foco,
   teclado, ARIA, contraste) — não regredir a11y ao tirar o PrimeNG.
4. Reaproveitar os componentes já prontos de osceia-contratos e osceia-ja-pedagogico antes de criar novos.
5. Só remover `primeng`, `@primeuix/themes`, `@primeng/themes` e `tailwindcss-primeui` do
   `package.json` quando o último import sumir (`grep -r "primeng" src` vazio), e junto remover
   a camada `@layer ... primeng` do `styles.css` e `providePrimeNG` do `app.config.ts`.
