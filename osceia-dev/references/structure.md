# Estrutura e Convenções de Nomenclatura — Angular OSCEA

---

## Convenções de Nomenclatura de Arquivos

| Tipo | Padrão | Exemplo |
|---|---|---|
| Componente | `[nome].component.ts` | `user-card.component.ts` |
| Serviço | `[nome].service.ts` | `dashboard.service.ts` |
| Guard | `[nome].guard.ts` | `auth.guard.ts` |
| Interceptor | `[nome].interceptor.ts` | `auth.interceptor.ts` |
| Rotas | `[feature].routes.ts` | `dashboard.routes.ts` |
| Interface/Model | `[nome].model.ts` | `membro.model.ts` |
| Pipe | `[nome].pipe.ts` | `cpf-mask.pipe.ts` |
| Diretiva | `[nome].directive.ts` | `focus-trap.directive.ts` |
| Spec | `[nome].spec.ts` | `dashboard.service.spec.ts` |

**Regra:** sempre kebab-case, sem abreviações desnecessárias.

---

## Convenções de Nomenclatura de Classes

| Tipo | Padrão | Exemplo |
|---|---|---|
| Componente | `PascalCase + Component` | `UserCardComponent` |
| Serviço | `PascalCase + Service` | `DashboardService` |
| Guard (função) | `camelCase + Guard` | `authGuard` |
| Interceptor (função) | `camelCase + Interceptor` | `authInterceptor` |
| Interface | `PascalCase` | `Membro`, `DashboardItem` |
| Enum | `PascalCase` | `StatusMembro` |
| Constante de rotas | `UPPER_SNAKE_CASE` | `DASHBOARD_ROUTES` |

---

## Estrutura Interna de uma Feature

```text
features/[nome-da-feature]/
├── components/               # Dumb components — recebem input(), emitem output()
│   └── [nome]/
│       ├── [nome].component.ts
│       └── [nome].component.spec.ts
├── pages/                    # Smart components — injetam serviços, gerenciam estado
│   └── [nome]-page/
│       ├── [nome]-page.component.ts
│       └── [nome]-page.component.spec.ts
├── services/                 # Services locais — providedIn: 'root' se necessário
│   ├── [nome].service.ts
│   └── [nome].service.spec.ts
├── models/                   # Interfaces e types específicos da feature (opcional)
│   └── [nome].model.ts
└── [nome].routes.ts          # Rotas filhas da feature
```

---

## Estrutura do `core/`

```text
core/
├── auth/
│   ├── firebase-auth.service.ts   # projetos públicos — ver references/auth-firebase.md
│   │   (ou azure-auth.service.ts para projetos internos — ver references/auth-azure-ad.md)
│   ├── auth.guard.ts
│   └── auth.interceptor.ts        # não existe no Azure AD — MsalInterceptor cobre isso
├── graphql/
│   └── [entidade].queries.ts       # Queries/mutations do Twenty CRM — ver references/twenty-crm.md
├── services/
│   ├── edge-functions.service.ts   # invoca Edge Functions do Supabase
│   ├── twenty.service.ts           # proxy GraphQL para o Twenty CRM
│   └── [nome]-api.service.ts       # outros services globais de API
└── utils/
    └── [nome].util.ts               # Funções puras utilitárias
```

**Regra:** nada em `core/` deve ser lazy loaded. É carregado com o app.

---

## Estrutura do `shared/`

```text
shared/
├── components/
│   └── [nome]/
│       └── [nome].component.ts
├── directives/
│   └── [nome].directive.ts
└── models/
    └── [nome].model.ts     # Interfaces globais (ex: ApiResponse<T>, Pagination)
```

**Regra:** nada em `shared/` deve ter lógica de negócio. Apenas UI e utilitários.

---

## Interfaces e Models Globais Sugeridos

```typescript
// shared/models/api.model.ts

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination;
}
```

---

## `app.config.ts` Completo (projeto público — Firebase)

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
  ],
};
```

> Para projetos internos (Azure AD/MSAL), ver o `app.config.ts` completo em
> `references/auth-azure-ad.md` — os providers de auth mudam, o resto (zoneless e
> router) é igual.

---

## Checklist de Code Review

Antes de submeter qualquer PR, verifique:

**Angular / TypeScript**
- [ ] Nenhum `standalone: true` declarado explicitamente
- [ ] Nenhum `@Input()` / `@Output()` — apenas `input()` / `output()`
- [ ] Nenhum `constructor` com injeção — apenas `inject()`
- [ ] Nenhum `*ngIf` / `*ngFor` — apenas `@if` / `@for`
- [ ] Nenhum `ngClass` / `ngStyle`
- [ ] Nenhum import novo de `primeng` (ver `references/primeng-migration.md`)
- [ ] Componente interativo novo cumpre AXE/WCAG AA (foco, teclado, ARIA)
- [ ] OnPush: declarado em Angular v21; **não** declarado em v22+ (já é o padrão)
- [ ] Todo `<input>` de formulário tem `<label>` associado
- [ ] Nenhum `any` no TypeScript
- [ ] Signals usam `.set()` ou `.update()`, nunca `.mutate()`

**Autenticação (Firebase ou Azure AD, conforme o projeto)**
- [ ] Autenticação passa pelo `FirebaseAuthService`/`AzureAuthService`, nunca chama o SDK diretamente no componente
- [ ] Token injetado via interceptor (`authInterceptor` no Firebase, `MsalInterceptor` no Azure AD), nunca manualmente nos services
- [ ] Projeto usa **um único** provider de auth — nunca Firebase e Azure AD juntos no mesmo app

**Fluxo / Git**
- [ ] Branch `<tipo>/<issue>-<slug>`, pesquisa em `.notebook/` (com `#issue` no `INDEX.md`) e spec em `.specs/features/<issue>-<slug>/`
- [ ] `npm test -- --no-watch` e `npm run build` passando; carimbo gerado pelo `pre-push`
- [ ] PR pelo template, com `Closes #<issue>` e checklist marcado
- [ ] Nenhum dado pessoal real, token ou chave em código, teste, seed, log ou captura

**Supabase**
- [ ] Nenhum componente chama o cliente Supabase diretamente — sempre via service
- [ ] Tipos das entidades definidos em `core/types/` (ou gerados via `supabase gen types`) — sem `any` nos retornos
- [ ] IDs tratados como `string` (UUID), nunca `parseInt()`
- [ ] `numeric`/`date` do PostgREST convertidos corretamente onde necessário
- [ ] Edge Functions com handler `OPTIONS` como primeiro bloco
- [ ] Nome da Edge Function segue o prefixo do domínio do projeto (`cam-`, `mkt-`, `oapp-`, etc.)

**Twenty CRM**
- [ ] Nenhum componente/service de feature monta GraphQL inline — sempre via `core/graphql/` + `TwentyService`
- [ ] Twenty CRM nunca é chamado direto do browser — sempre via Edge Function proxy
