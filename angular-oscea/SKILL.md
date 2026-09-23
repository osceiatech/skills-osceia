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
  por projeto do repositório osceia-api, estilização com Tailwind 4 + PrimeNG, estrutura
  de pastas, lazy loading, signals, zoneless change detection, acessibilidade (AXE / WCAG AA)
  ou o fluxo de governança do projeto (pesquisa/BPMN → grill-me → tlc-spec-driven →
  gh-issue-dor-dod/gh-issue → implementação).
  Frases que disparam esta skill: "cria um componente", "novo serviço", "estrutura de pastas",
  "feature de", "rota lazy", "autenticação", "guard", "interceptor", "signal", "OnPush",
  "zoneless", "tailwind", "primeng", "acessibilidade", "axe", "wcag", "supabase",
  "banco auxiliar", "edge function", "twenty crm", "msal", "firebase", "azure ad",
  "governança", "spec", "issue", "dor", "dod".
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

---

## 1. Stack e Versões

| Tecnologia | Uso | Observação |
|---|---|---|
| **Angular v20+** | Framework principal | Standalone é padrão; `standalone: true` NÃO deve ser declarado |
| **TypeScript** | Linguagem | `strict: true` obrigatório |
| **Firebase Auth** ou **Azure AD (MSAL)** | Autenticação | Escolha é **por projeto**, nunca as duas no mesmo app — ver seção 5 |
| **Supabase (self-hosted)** | Banco auxiliar | Dados que não vão para o Twenty CRM |
| **Twenty CRM** | CRM principal | Contatos, negócios e pipeline — acessado via Edge Function proxy GraphQL |
| **Tailwind CSS 4** | Estilização primária | Sempre presente |
| **PrimeNG** | UI Components | Opcional por projeto; tema **Aura** via `@primeuix/themes` quando presente |
| **Vitest** | Testes unitários | Não usar Karma/Jasmine |
| **Zoneless** | Change detection | `provideExperimentalZonelessChangeDetection()` |

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
- **SEMPRE** usar `changeDetection: ChangeDetectionStrategy.OnPush`
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
@layer tailwind-base, primeng, tailwind-utilities;

/* Design Tokens — variáveis CSS próprias do projeto, nunca hardcode nos componentes */
:root {
  --color-primary-900: #0F3A22;
  --color-primary-500: #3FA06D;
  /* ... paleta definida por projeto */
}
```

- Tailwind para layout e utilitários — sempre presente
- Tokens de cor/tema em `:root` como CSS custom properties, definidos por projeto
  (não existe um pacote de design system compartilhado — cada projeto define a própria
  paleta em `styles.css`)
- PrimeNG opcional; quando presente, usar o tema **Aura** via `@primeuix/themes` e
  `providePrimeNG({ theme: { preset: Aura } })` no `app.config.ts`; camada `primeng`
  entre `tailwind-base` e `tailwind-utilities`

---

## 7. Acessibilidade (A11y)

Todo componente deve passar no AXE e seguir WCAG AA:
- Contraste mínimo 4.5:1 (texto normal) e 3:1 (texto grande)
- Foco de teclado lógico e visível
- ARIA correto em componentes customizados
- Todo `<input>` com `<label>` associado ou `aria-label`

---

## 8. Change Detection e Performance

- **Zoneless**: `provideExperimentalZonelessChangeDetection()` no `app.config.ts`
- Nunca depender de `NgZone` para disparar detecção
- Todo componente: `ChangeDetectionStrategy.OnPush`
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
4. **`gh-issue-dor-dod`** — transforma as tasks em issues no GitHub,
   aplicando os checklists de Definition of Ready e Definition of Done.
5. **Implementação** — segue o `tasks.md`, com commits atômicos e verificação a cada passo.

Todos os documentos gerados (specs, ADRs, PRDs, etc.) devem estar **em português**.
Quando for necessário exportar um `.md` para PDF (ex.: para compartilhar com quem não
usa Git), usar a skill `md-to-pdf`.

Parte dessas regras (spec antes de codar, commits pequenos, lembrete de testes e2e e de
rodar `cyclomatic-complexity`) tem hooks prontos em `hooks/` — ver
`references/governance-hooks.md` para o que cada um faz e como ativar.

---

## 13. Fluxo de Git

- Toda tarefa nasce de uma **branch** criada pelo responsável pela tarefa.
- Ao concluir, o responsável abre o **PR** — nunca commit direto para revisão.
- **Depois do go-live do projeto, nunca trabalhar diretamente na `main`.**
- Commits atômicos, seguindo o `tasks.md` gerado pelo `tlc-spec-driven`.

---

## 14. Eficiência de Tokens

- Priorize o **RTK** (Rust Token Killer — `rtk`) para operações de dev via CLI quando
  disponível; é aplicado automaticamente via hook, então basta usar os comandos normais.
- Use a skill `caveman` quando o usuário pedir modo compacto/menos tokens.
