# Autenticação Azure AD / MSAL — Angular OSCEA

**Usar apenas em projetos de uso interno** (colaboradores OSCEA — ex.: osceia-marketing,
osceia-admin, osceia-contratos). Para projetos públicos, ver `references/auth-firebase.md`.
Um mesmo app Angular usa **um único provider**, nunca os dois.

---

## Instalação

```bash
npm install @azure/msal-angular @azure/msal-browser
```

---

## Configuração no `app.config.ts`

```typescript
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import {
  MSAL_INSTANCE,
  MSAL_GUARD_CONFIG,
  MSAL_INTERCEPTOR_CONFIG,
  MsalService,
  MsalGuard,
  MsalBroadcastService,
} from '@azure/msal-angular';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

const msalInstance = new PublicClientApplication({
  auth: {
    clientId: environment.azureAd.clientId,
    authority: `https://login.microsoftonline.com/${environment.azureAd.tenantId}`,
    redirectUri: environment.azureAd.redirectUri,
  },
  cache: { cacheLocation: 'localStorage' },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([])), // MsalInterceptor registrado via HTTP_INTERCEPTORS abaixo
    { provide: MSAL_INSTANCE, useValue: msalInstance },
    {
      provide: MSAL_GUARD_CONFIG,
      useValue: { interactionType: InteractionType.Redirect, authRequest: { scopes: ['user.read'] } },
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useValue: {
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map([[environment.apiUrl, ['api://oscea/access_as_user']]]),
      },
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
  ],
};
```

> `MsalInterceptor` cuida da injeção do token automaticamente para as URLs mapeadas em
> `protectedResourceMap` — não é necessário um `authInterceptor` manual como no Firebase.

---

## `environment.ts`

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  azureAd: {
    clientId: 'SEU_CLIENT_ID',
    tenantId: 'SEU_TENANT_ID',
    redirectUri: 'http://localhost:4200',
  },
  apiUrl: 'https://api.oscea.gov.br',
};
```

> **Nunca commitar valores reais.** Use variáveis de ambiente no CI/CD.

---

## `AzureAuthService` (wrapper fino sobre `MsalService`)

```typescript
// src/app/core/auth/azure-auth.service.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus, AccountInfo } from '@azure/msal-browser';
import { filter } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AzureAuthService {
  private readonly msal = inject(MsalService);
  private readonly broadcast = inject(MsalBroadcastService);
  private readonly router = inject(Router);

  readonly currentUser = signal<AccountInfo | null>(null);
  readonly isAuthenticated = computed(() => !!this.currentUser());

  constructor() {
    this.broadcast.inProgress$
      .pipe(filter((status) => status === InteractionStatus.None))
      .subscribe(() => {
        const account = this.msal.instance.getActiveAccount() ?? this.msal.instance.getAllAccounts()[0];
        this.currentUser.set(account ?? null);
      });
  }

  signIn(): void {
    this.msal.loginRedirect();
  }

  async signOut(): Promise<void> {
    await this.msal.logoutRedirect();
    this.currentUser.set(null);
    await this.router.navigate(['/login']);
  }
}
```

---

## Guard de Autenticação

```typescript
// src/app/core/auth/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AzureAuthService } from './azure-auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AzureAuthService);
  const router = inject(Router);

  if (auth.currentUser()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
```

---

## Rotas — guard no shell, `MsalRedirectComponent` como bootstrap

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { AppLayoutComponent } from './layout/app.layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [MsalGuard],       // guard no shell, não em cada feature
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
```

> `main.ts` deve renderizar `MsalRedirectComponent` como fallback para tratar o
> redirect de retorno do login — ver documentação oficial do `@azure/msal-angular`
> para o bootstrap completo.
