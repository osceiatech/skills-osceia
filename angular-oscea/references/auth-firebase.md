# Autenticação Firebase — Angular OSCEA

**Usar apenas em projetos públicos** (cidadãos, candidatos, uso externo — ex.: osceia-camara,
osceia-app). Para projetos de uso interno (colaboradores OSCEA), ver `references/auth-azure-ad.md`.
Um mesmo app Angular usa **um único provider**, nunca os dois.

---

## Instalação

```bash
npm install firebase @angular/fire
```

---

## Configuração no `app.config.ts`

```typescript
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
  ],
};
```

---

## `environment.ts`

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  firebase: {
    apiKey: 'SUA_API_KEY',
    authDomain: 'seu-projeto.firebaseapp.com',
    projectId: 'seu-projeto',
    storageBucket: 'seu-projeto.appspot.com',
    messagingSenderId: '000000000000',
    appId: '1:000000000000:web:xxxxxxxxxxxx',
  },
  apiUrl: 'https://api.oscea.gov.br',
};
```

> **Nunca commitar valores reais.** Use variáveis de ambiente no CI/CD.

---

## `FirebaseAuthService`

```typescript
// src/app/core/auth/firebase-auth.service.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { Auth, User, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class FirebaseAuthService {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  // Estado do usuário como signal
  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly isLoading = signal(true);

  constructor() {
    // Observa mudanças de estado de autenticação
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser.set(user);
      this.isLoading.set(false);
    });
  }

  async signIn(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
    await this.router.navigate(['/dashboard']);
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
    await this.router.navigate(['/login']);
  }

  getIdToken(): Promise<string> {
    const user = this.currentUser();
    if (!user) throw new Error('Usuário não autenticado');
    return user.getIdToken();
  }
}
```

---

## Página de Login

```typescript
// src/app/features/auth/pages/login-page.component.ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseAuthService } from '../../../core/auth/firebase-auth.service';

@Component({
  selector: 'app-login-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <main class="flex min-h-screen items-center justify-center bg-gray-50" aria-labelledby="login-title">
      <div class="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <h1 id="login-title" class="mb-6 text-2xl font-bold text-gray-800">
          Acesso ao Sistema
        </h1>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="mt-1 w-full rounded-md border px-3 py-2"
              autocomplete="email"
              [attr.aria-invalid]="form.controls.email.invalid && form.controls.email.touched"
            />
          </div>

          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700">Senha</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              class="mt-1 w-full rounded-md border px-3 py-2"
              autocomplete="current-password"
            />
          </div>

          @if (errorMessage()) {
            <p role="alert" class="mb-4 text-sm text-red-600">{{ errorMessage() }}</p>
          }

          <button
            type="submit"
            class="w-full rounded-md bg-primary px-4 py-2 font-semibold text-white disabled:opacity-50"
            [disabled]="form.invalid || isLoading()"
          >
            @if (isLoading()) { Entrando... } @else { Entrar }
          </button>
        </form>
      </div>
    </main>
  `,
})
export class LoginPageComponent {
  private readonly authService = inject(FirebaseAuthService);

  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');

  protected readonly form = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
  });

  protected async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const { email, password } = this.form.getRawValue();
      await this.authService.signIn(email, password);
    } catch (err: unknown) {
      this.errorMessage.set('E-mail ou senha inválidos.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
```

---

## Rotas de Auth com Guard

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { AppLayoutComponent } from './layout/app.layout.component';

export const routes: Routes = [
  // Rota pública
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login-page.component').then(m => m.LoginPageComponent),
  },
  // Rotas protegidas — guard no nível do layout shell
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
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
