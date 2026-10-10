---
name: angular-oscea
description: >
  Padrões e diretrizes para desenvolvimento Angular na OSCEA (Secretaria) e para a
  governança de projetos, do levantamento de requisitos ao deploy.
  Use esta skill SEMPRE que o usuário pedir para criar, editar ou revisar qualquer
  componente, serviço, diretiva, rota, guard, interceptor ou qualquer arquivo Angular
  dentro do contexto de um projeto da OSCEA / Secretaria.
  Também use ao configurar autenticação (Firebase para projetos públicos, Azure AD/MSAL
  para projetos de uso interno), integração com Supabase self-hosted (banco auxiliar),
  integração com o Twenty CRM via Edge Functions, Edge Functions e a convenção de prefixo
  por projeto do repositório osceia-api, estilização com Tailwind 4 (PrimeNG foi abandonado), estrutura
  de pastas, lazy loading, signals, zoneless change detection, acessibilidade (AXE / WCAG AA)
  ou o fluxo de governança do projeto (pesquisa/BPMN → grill-me → tlc-spec-driven →
  gh-issue-dor-dod/gh-issue → implementação).
  Frases que disparam esta skill: "cria um componente", "novo serviço", "estrutura de pastas",
  "feature de", "rota lazy", "autenticação", "guard", "interceptor", "signal", "OnPush",
  "zoneless", "tailwind", "acessibilidade", "axe", "wcag", "supabase",
  "banco auxiliar", "edge function", "twenty crm", "msal", "firebase", "azure ad",
  "governança", "spec", "issue", "dor", "dod", "harness", "branch", "pr".
  TAMBÉM deve ser invocada NO INÍCIO DE TODA SESSÃO em qualquer projeto Angular da
  OSCEA (pasta com `angular.json`), antes de qualquer outra ação — ver seção 0.
---

# Angular OSCEA — Padrões e Diretrizes

Este documento define **como escrever código Angular** e **como conduzir um projeto**
nos projetos da OSCEA (Secretaria). Toda geração de código e todo fluxo de trabalho
deve seguir estas regras sem exceção.

Para templates, exemplos e detalhes, consulte os arquivos em `references/`:
- `references/component-templates.md` — Componente, serviço, guard, interceptor, form
- `references/auth-firebase.md` — Autenticação Firebase (projetos públicos)
- `references/auth-azure-ad.md` — Autenticação Azure AD / MSAL (projetos internos)
- `references/supabase.md` — Integração Supabase: SupabaseService, stores, Edge Functions
- `references/twenty-crm.md` — Integração com o Twenty CRM e convenção de prefixos do osceia-api
- `references/structure.md` — Estrutura de pastas, nomenclatura, checklist de PR
- `references/governance-hooks.md` — Hooks do Claude Code para as regras de governança (`hooks/`)
- `references/primeng-migration.md` — Plano de saída do PrimeNG: estado por projeto e equivalentes
- `templates/harness/` — Arquivos do harness (`.agents/`, `.githooks/`, `.github/`, `scripts/`, `.claude/`, `AGENTS.md`) copiados pelo bootstrap

---

## 0. Início de Sessão (obrigatório)

Esta skill é chamada **no início de toda sessão** em projeto Angular OSCEA (o hook
`hooks/session-start.sh` lembra disso; sem ele, invoque manualmente). Antes de qualquer
outra ação:

1. **Detectar o projeto:** `angular.json` na raiz. Se não for Angular OSCEA, ignorar esta seção.
2. **Verificar o harness:** rodar `bash ~/.agents/skills/angular-oscea/hooks/bootstrap-harness.sh --check`.
   Se faltar algo, rodar sem `--check`: ele cria só o que não existe (nunca sobrescreve),
   a partir de `templates/harness/`, adiciona `prepare`/`carimbo` ao `package.json`, liga
   o `core.hooksPath` e lista as pendências manuais (workflow Azure, repositório e comandos
   no `harness.config`). Cumprir as pendências ou avisar o usuário. Opcionalmente rodar
   `hooks/sync-harness.sh` para ver se guard, hooks git e `ci.yml` divergem dos templates.
3. **Ler o contexto do projeto:** `.agents/harness.config`, `AGENTS.md`, `.notebook/INDEX.md`
   e `.specs/` — o `harness.config` do projeto **prevalece** sobre esta skill; em conflito
   vale a regra mais restritiva.
4. **Repassar ao usuário um resumo curto:** projeto, branch atual, em que passo do fluxo
   (seção 12) a tarefa está e o que falta (pesquisa? issue? branch? spec?). Se estiver na
   `main`, avisar que só pesquisa em `.notebook/` é permitida.
5. Só então atender ao pedido.
---

## 1. Stack e Versões

| Tecnologia | Uso | Observação |
|---|---|---|
| **Angular v21/v22** | Framework principal | Standalone é padrão; `standalone: true` NÃO deve ser declarado. Em v22+, `OnPush` é o padrão (ver seção 2) |
| **TypeScript** | Linguagem | `strict: true` obrigatório |
| **Firebase Auth** ou **Azure AD (MSAL)** | Autenticação | Escolha é **por projeto**, nunca as duas no mesmo app — ver seção 5 |
| **Supabase (self-hosted)** | Banco auxiliar | Dados que não vão para o Twenty CRM |
| **Twenty CRM** | CRM principal | Contatos, negócios e pipeline — acessado via Edge Function proxy GraphQL |
| **Tailwind CSS 4** | Estilização primária | Sempre presente |
| ~~PrimeNG~~ | — | **Abandonado** (deixou de ser gratuito). Não adicionar em projeto novo; ver seção 6 |
| **Vitest** | Testes unitários | Não usar Karma/Jasmine |
| **Zoneless** | Change detection | `provideZonelessChangeDetection()` |

---

## 2. Regras Absolutas (nunca violar)

### TypeScript
- `strict: true` no `tsconfig.json`; proibido usar `any`; use `unknown`
- Prefira inferência de tipo quando óbvia

### Componentes Angular
- **NUNCA** declarar `standalone: true` — é o padrão no Angular v20+
- **NUNCA** usar `@HostBinding` / `@HostListener` — use `host: {}` no decorator
- **NUNCA** usar `ngClass` / `ngStyle` — use bindings `[class]` / `[style]`
- **NUNCA** usar `*ngIf`, `*ngFor`, `*ngSwitch` — use `@if`, `@for`, `@switch`
- **OnPush:** em Angular **v21 ou anterior**, declarar `changeDetection: ChangeDetectionStrategy.OnPush`;
  em **v22+** é o padrão e **NÃO** deve ser declarado (confira a versão no `package.json`)
- **SEMPRE** usar `input()` e `output()` (funções), nunca `@Input()` / `@Output()`
- **SEMPRE** usar `inject()` para injeção de dependências, nunca constructor injection
- Caminhos de template e estilos externos: **sempre relativos** ao arquivo `.ts`

### Estado
- `signal()` para estado local; `computed()` para derivado; `effect()` para side effects
- **NUNCA** usar `.mutate()` em signals — use `.update()` ou `.set()`

### Formulários
- Prefira **Reactive Forms** com tipagem explícita: `FormControl<string>`, `FormGroup<{...}>`

### Imagens
- Use `NgOptimizedImage` para imagens estáticas; não funciona com base64 inline

---

## 3. Arquitetura de Dados: Twenty CRM + Supabase como Banco Auxiliar

A OSCEA usa **duas fontes de dados** com responsabilidades bem separadas:

```
Twenty CRM          → contatos, negócios, pipeline comercial, relacionamentos
Supabase (auxiliar) → dados operacionais, documentos, registros internos, uploads
```

- Componentes **nunca** acessam Twenty CRM ou Supabase diretamente — sempre via um
  serviço de dados específico.
- Twenty CRM é acessado **exclusivamente via GraphQL, através de uma Edge Function
  proxy** (nunca direto do browser — a API do Twenty não deve ser exposta no cliente).
  Ver `references/twenty-crm.md` para o padrão completo (`TwentyService.graphql<T>()`,
  queries em `core/graphql/[entidade].queries.ts`).
- Supabase self-hosted é o **banco auxiliar**: um único singleton `SupabaseService`
  em `core/supabase.service.ts`; toda operação passa por um serviço de dados por entidade.
- Tipos das entidades: definidos manualmente em `core/types/` ou `models/` da feature.

### Schema customizado

- Usar schema separado (ex: `oscea`, `camara`, `marketing`) em vez de `public`
- Configurar no cliente: `createClient(url, key, { db: { schema: 'meu-schema' } })`
- Em self-hosted, adicionar ao `PGRST_DB_SCHEMAS` no `docker-compose.yml` do servidor

> Ver `references/supabase.md` para implementação completa de SupabaseService,
> stores com signals e Edge Functions. Ver `references/twenty-crm.md` para a
> integração com o Twenty CRM.

---

## 4. Estrutura de Pastas

```text
src/
├── app/
│   ├── core/
│   │   ├── auth/                 # Firebase OU Azure AD — guards, serviço, interceptor
│   │   ├── supabase.service.ts   # Singleton do cliente Supabase
│   │   ├── graphql/              # Queries/mutations do Twenty CRM (raw GraphQL strings)
│   │   ├── services/             # API services globais (edge-functions.service.ts, twenty.service.ts)
│   │   └── utils/                # Helpers globais (supabase-error.ts, etc.)
│   │
│   ├── layout/                   # Shell (header, sidebar, router-outlet)
│   │   ├── components/
│   │   ├── app.layout.component.ts
│   │   └── layout.service.ts
│   │
│   ├── shared/
│   │   ├── components/           # UI Atoms reutilizáveis
│   │   ├── directives/           # A11y, máscaras
│   │   └── models/               # Interfaces, Enums, Types globais
│   │
│   ├── features/                 # Domínios de negócio — SEMPRE lazy loaded
│   │   └── [feature]/
│   │       ├── components/       # Dumb components
│   │       ├── pages/            # Smart components (gerenciam estado)
│   │       ├── services/         # [entidade].service.ts — operações Supabase/Twenty
│   │       ├── store/            # [feature].store.ts — signals store
│   │       └── [feature].routes.ts
│   │
│   ├── app.config.ts
│   ├── app.routes.ts
│   └── app.component.ts
│
├── supabase/
│   ├── config.toml               # verify_jwt por função
│   └── functions/
│       ├── deno.json              # mapa de imports Deno
│       ├── _shared/                # cors.ts, supabase.ts, auth.ts
│       └── [prefixo]-[acao]/       # ex.: cam-create-inscricao — ver seção 11
│           └── index.ts
│
├── public/
└── styles.css
```

> Para nomenclatura de arquivos e classes ver `references/structure.md`

---

## 5. Autenticação — Firebase (público) ou Azure AD/MSAL (interno)

**A escolha do provider de auth é relativa ao tipo de projeto — nunca as duas no
mesmo app:**

| Tipo de projeto | Provider | Exemplos reais |
|---|---|---|
| **Público** — cidadãos, candidatos, uso externo | **Firebase Auth** | osceia-camara, osceia-app |
| **Interno** — uso exclusivo de colaboradores OSCEA | **Azure AD / MSAL** | osceia-marketing, osceia-admin, osceia-contratos |

Ao iniciar um novo projeto Angular, pergunte (ou confirme no `.specs/project/PROJECT.md`)
se o público-alvo é externo ou interno **antes** de configurar auth. Nunca assuma Firebase
por padrão.

- Projetos públicos: ver `references/auth-firebase.md` (`FirebaseAuthService`, `authGuard`,
  `authInterceptor` injetando `idToken`).
- Projetos internos: ver `references/auth-azure-ad.md` (`MsalService`, `MsalGuard`,
  `MsalInterceptor` injetando o token do Azure AD).
- Em ambos os casos: guard no nível do layout shell (não em cada feature), estado do
  usuário exposto como signal, e o token é injetado automaticamente via interceptor —
  services nunca lidam com o token manualmente.

---

## 6. Estilização

```css
/* styles.css */
@import "tailwindcss";

/* Design Tokens — variáveis CSS próprias do projeto, nunca hardcode nos componentes */
@theme {
  --color-primary-900: #0F3A22;
  --color-primary-500: #3FA06D;
  /* ... paleta definida por projeto */
}
```

- **Tailwind 4 é a única base de estilo.** Layout, utilitários e tokens (`@theme`) por projeto
  (não existe design system compartilhado — cada projeto define a própria paleta em `styles.css`)
- **PrimeNG foi abandonado** (versão paga). Em projetos que ainda o usam (osceia-admin,
  osceia-app, osceia-camara, osceia-marketing, osceia-institucional), **não expandir o uso**:
  novos componentes saem em Tailwind + componentes próprios em `shared/components/`, e a
  remoção é feita por feature, via issue/spec — nunca em lote dentro de outra task
- Ícones: `primeicons` (pacote gratuito, MIT) é aceito onde já existe, como no osceia-ja-pedagogico
- Componentes interativos próprios (modal, select, tabela, datepicker) devem cumprir a
  seção 7 (foco, ARIA, teclado); pode-se usar `@angular/cdk` para a11y/overlay

---

## 7. Acessibilidade (A11y)

Todo componente deve passar no AXE e seguir WCAG AA:
- Contraste mínimo 4.5:1 (texto normal) e 3:1 (texto grande)
- Foco de teclado lógico e visível
- ARIA correto em componentes customizados
- Todo `<input>` com `<label>` associado ou `aria-label`

---

## 8. Change Detection e Performance

- **Zoneless**: `provideZonelessChangeDetection()` no `app.config.ts`
- Nunca depender de `NgZone` para disparar detecção
- Todo componente em OnPush (explícito em v21, padrão em v22+ — ver seção 2)
- Reatividade via signals

---

## 9. Rotas e Lazy Loading

```typescript
export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/pages/login-page.component').then(m => m.LoginPageComponent) },
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],         // guard no shell, não em cada feature
    children: [
      { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
```

---

## 10. Testes

- **Vitest** — não Karma, não Jasmine
- `*.spec.ts` no mesmo diretório do arquivo testado
- Foco: lógica de negócio nos services e stores; interações de usuário nos componentes

---

## 11. Edge Functions e Convenção de Prefixos (osceia-api)

Todas as Edge Functions da OSCEA seguem a convenção **`[prefixo-do-projeto]-[acao]`**
(kebab-case), documentada e consolidada no repositório `osceia-api`:

| Prefixo | Domínio/Projeto |
|---|---|
| `cam-` | Câmara Municipal (osceia-camara) |
| `mkt-` | Marketing Hub (osceia-marketing) |
| `oapp-` | App de Vagas (osceia-app) |
| `edu-` | Educação (consulta IES/escolas) |
| `contratos-` | OSCEA Contratos |
| *(sem prefixo)* | Projetos internos (`auth-me`, `upload`) |

- Cada projeto Angular mantém suas próprias functions em `supabase/functions/` já
  nomeadas com o prefixo correto (ex.: `cam-create-inscricao` dentro de osceia-camara).
- O repositório `osceia-api` é a fonte consolidada de deploy multi-domínio (self-hosted
  via SSH/SCP): `node scripts/deploy-functions.mjs --only <prefixo>` ou
  `--fn <nome-da-funcao>` para hotfix pontual.
- Nunca crie uma function sem prefixo de domínio, exceto utilitários genéricos já
  estabelecidos (`upload`, `auth-me`).

> Ver `references/twenty-crm.md` para o detalhe do proxy GraphQL do Twenty CRM
> (`cam-sync-twenty` e equivalentes por domínio).

---

## 12. Governança de Projeto

Todo projeto ou feature nova segue este fluxo, sem pular etapas:

1. **Pesquisa e formação** — levantamento do processo (BPMN) ou do escopo do projeto.
2. **`grill-me`** — stress-test do plano/design com o usuário até fechar entendimento.
3. **`tlc-spec-driven`** — cria as specs (`spec.md`, `design.md`, `tasks.md`, `context.md`)
   em `.specs/features/[feature]/` a partir do que foi decidido no grill.
4. **`gh-issue-dor-dod`** — cria a issue no GitHub pelo template do repositório (corpo só com
   `Contexto` / `DOR` / `DOD`), aplicando os checklists de Definition of Ready e Done.
5. **Branch** `<tipo>/<issue>-<slug>` a partir da `main` atualizada, e **spec completa**
   (`spec.md`, `design.md`, `tasks.md`) em `.specs/features/<issue>-<slug>/`.
6. **Implementação** — uma task do `tasks.md` por vez, com verificação (`npm test` +
   `npm run build`) antes e depois de cada uma. **Nunca na `main`.**
7. **Entrega** — o agente não commita/pusha/abre PR: entrega à pessoa o bloco de comandos
   pronto (commit, push, `gh pr create`, checks, merge) com o resultado real da verificação.

Toda pesquisa vai para `.notebook/AAAA-MM-DD-<slug>.md` (+ linha em `.notebook/INDEX.md`
com `#<issue>`), sem dado pessoal real, token ou credencial. Dúvidas em aberto na pesquisa
disparam o `grill-me`; pergunta sem resposta bloqueia a criação da issue.

Todos os documentos gerados (specs, ADRs, PRDs, etc.) devem estar **em português**.
Quando for necessário exportar um `.md` para PDF (ex.: para compartilhar com quem não
usa Git), usar a skill `md-to-pdf`.

Spec antes de codar, branch/issue e testes são **bloqueados** pelo harness do projeto
(seção 13), não apenas lembrados. Ao mexer em lógica condicional densa, rodar a skill
`cyclomatic-complexity`; ao planejar mudança de interface, `design-an-interface`.
Detalhes de hooks e templates em `references/governance-hooks.md`.

---

## 13. Git e Restrições (impostas por hooks)

Fonte da verdade: `.agents/harness.config` de cada projeto (modelo em
`templates/harness/`). Resumo:

- **Agente nunca** faz `git commit`, `push`, `pull`, `rebase`, `reset --hard`, `--amend`,
  abre PR, faz merge, deploy (`supabase functions deploy`, `db push`) nem mexe em secrets
  sem autorização explícita **para aquela ação**. Autorização vale uma vez; "pode seguir" não autoriza.
- **Ninguém faz push na `main`** (pessoa ou agente). Tudo entra por PR de branch
  `<tipo>/<issue>-<slug>`. Tipos: feat, fix, refactor, docs, test, chore.
  Push na `main` dispara deploy automático na Azure.
- **Nada é implementado na `main`** — nem pequeno, nem urgente. Lá só se escreve pesquisa em `.notebook/`.
- **Camadas de proteção:** `.githooks/pre-commit` (guard: sem pesquisa+branch+spec não commita código),
  `.githooks/pre-push` (roda `npm test` e `npm run build`, grava o carimbo `refs/verificacoes/<sha>`),
  `.claude/settings.json` PreToolUse (bloqueia Edit/Write fora do fluxo) e `ci.yml` (confere
  carimbo, checklist do PR e `Closes #<issue>`). O CI **não** roda testes — roda na máquina.
- **Proibido** `--no-verify`, desligar `core.hooksPath`, editar o guard para se liberar,
  criar `refs/verificacoes/*` à mão ou mergear PR com check vermelho.
- Commits: Conventional Commits em PT-BR, verbo no imperativo, título ≤ 72 caracteres
  (`.github/git-commit-instructions.md`). PR pelo template, perguntando antes
  "Ready for review ou Draft?".
- Ao concluir, o agente deixa tudo no working tree e entrega o bloco de comandos (seção 12, passo 7).

---

## 14. Eficiência de Tokens

- Priorize o **RTK** (Rust Token Killer — `rtk`) para operações de dev via CLI quando
  disponível; é aplicado automaticamente via hook, então basta usar os comandos normais.
- Use a skill `caveman` quando o usuário pedir modo compacto/menos tokens.
