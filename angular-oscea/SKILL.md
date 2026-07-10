---
name: angular-oscea
description: >
  Padrões e diretrizes para desenvolvimento Angular na OSCEA (Secretaria).
  Use esta skill SEMPRE que o usuário pedir para criar, editar ou revisar qualquer
  componente, serviço, diretiva, rota, guard, interceptor ou qualquer arquivo Angular
  dentro do contexto do projeto da OSCEA / Secretaria.
  Também use ao configurar autenticação Firebase, integração com Supabase (banco auxiliar),
  Edge Functions, estilização com Tailwind 4 + PrimeNG, estrutura de pastas, lazy loading,
  signals, zoneless change detection, ou acessibilidade (AXE / WCAG AA).
  Frases que disparam esta skill: "cria um componente", "novo serviço", "estrutura de pastas",
  "feature de", "rota lazy", "autenticação firebase", "guard", "interceptor", "signal",
  "OnPush", "zoneless", "tailwind", "primeng", "concafras", "acessibilidade", "axe", "wcag",
  "supabase", "banco auxiliar", "edge function", "twenty crm", "drizzle".
---

# Angular OSCEA — Padrões e Diretrizes

Este documento define **como escrever código Angular** nos projetos da OSCEA (Secretaria).
Toda geração de código deve seguir estas regras sem exceção.

Para templates e exemplos detalhados, consulte os arquivos em `references/`:
- `references/component-templates.md` — Componente, serviço, guard, interceptor, form
- `references/auth-firebase.md` — Autenticação Firebase (fluxo completo)
- `references/supabase.md` — Integração Supabase: SupabaseService, stores, Edge Functions
- `references/structure.md` — Estrutura de pastas, nomenclatura, checklist de PR

---

## 1. Stack e Versões

| Tecnologia | Uso | Observação |
|---|---|---|
| **Angular v20+** | Framework principal | Standalone é padrão; `standalone: true` NÃO deve ser declarado |
| **TypeScript** | Linguagem | `strict: true` obrigatório |
| **Firebase Auth** | Autenticação | Única solução de auth; sem MSAL/Azure AD |
| **Supabase (self-hosted)** | Banco auxiliar | Dados que não vão para o Twenty CRM |
| **Drizzle ORM** | Tipagem do schema Supabase | Fonte de verdade dos tipos do banco |
| **Tailwind CSS 4** | Estilização primária | Sempre presente |
| **PrimeNG** | UI Components | Opcional por projeto |
| **Concafras UI** | Design system interno | Tokens de cor e tema da OSCEA |
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

## 3. Arquitetura de Dados: Supabase como Banco Auxiliar

O Supabase self-hosted é o banco de dados auxiliar da OSCEA. Ele armazena **dados que
não vão para o Twenty CRM** — tipicamente dados operacionais, uploads, logs e entidades
internas de cada módulo.

### Separação de responsabilidades

```
Twenty CRM          → contatos, negócios, pipeline comercial, relacionamentos
Supabase (auxiliar) → dados operacionais, documentos, registros internos, uploads
```

### Regras do SupabaseService

- **Um único singleton** `SupabaseService` em `core/supabase.service.ts`
- Componentes **nunca** chamam o cliente Supabase diretamente
- Toda operação passa por um **serviço de dados** específico por entidade
- Usar `inject(SupabaseService).client` nos services de dados

### Tipagem

- Drizzle ORM é a **fonte de verdade dos tipos** do schema Supabase
- Nunca usar `any` nos retornos do Supabase — tipar com `InferSelectModel<typeof tabela>`
- Tipos PostgREST importantes: `numeric` → `string`; `date` → `string`; `uuid` → `string`

### Schema customizado

- Usar schema separado (ex: `oscea`) em vez de `public`
- Configurar no cliente: `createClient(url, key, { db: { schema: 'oscea' } })`
- Em self-hosted, adicionar ao `PGRST_DB_SCHEMAS` no `docker-compose.yml` do servidor

> Ver `references/supabase.md` para implementação completa de SupabaseService,
> stores com signals, tipagem Drizzle e Edge Functions.

---

## 4. Estrutura de Pastas

```text
src/
├── app/
│   ├── core/
│   │   ├── auth/                 # Firebase Auth — guards, serviço, interceptor
│   │   ├── supabase.service.ts   # Singleton do cliente Supabase
│   │   ├── services/             # API services globais
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
│   │       ├── services/         # [entidade].service.ts — operações Supabase
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
│       ├── deno.json             # mapa de imports Deno
│       ├── _shared/              # cors.ts, supabase.ts, auth.ts
│       └── [nome-da-funcao]/
│           └── index.ts
│
├── drizzle/
│   └── schema.ts                 # definição das tabelas — fonte de verdade dos tipos
│
├── public/
└── styles.css
```

> Para nomenclatura de arquivos e classes ver `references/structure.md`

---

## 5. Autenticação — Firebase

Auth usa **exclusivamente Firebase Authentication**. Nunca MSAL ou Azure AD.

Fluxo:
1. `FirebaseAuthService` (`core/auth/`) encapsula o SDK, expõe `currentUser` como signal
2. `authGuard` protege rotas privadas no nível do layout shell
3. `authInterceptor` injeta o `idToken` do Firebase em todas as requisições HTTP

> Ver `references/auth-firebase.md` para código completo.

---

## 6. Estilização

```css
/* styles.css — ordem obrigatória */
@import "concafras-ui/src/lib/assets/styles/tokens.css";
@import "concafras-ui/src/lib/assets/styles/theme.css";
@import "tailwindcss";
@layer tailwind-base, primeng, tailwind-utilities;
```

- Tokens Concafras UI para cores da marca — nunca hardcode
- Tailwind para layout e utilitários
- PrimeNG opcional; quando presente, camada `primeng` entre base e utilities

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
