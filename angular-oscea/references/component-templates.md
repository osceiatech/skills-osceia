# Templates de Código — Angular OSCEA

Copie e adapte os templates abaixo. Todos seguem as regras da skill.

---

## Componente Smart (Page)

```typescript
// features/dashboard/pages/dashboard-page.component.ts
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isLoading()) {
      <p>Carregando...</p>
    } @else {
      <ul>
        @for (item of items(); track item.id) {
          <li>{{ item.name }}</li>
        }
      </ul>
    }
  `,
})
export class DashboardPageComponent {
  private readonly service = inject(DashboardService);

  protected readonly items = this.service.items;
  protected readonly isLoading = this.service.isLoading;
  protected readonly count = computed(() => this.items().length);
}
```

---

## Componente Dumb (Presentational)

```typescript
// shared/components/card/card.component.ts
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface CardData {
  id: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block rounded-lg border border-gray-200 p-4',
    role: 'article',
  },
  template: `
    <h3 class="text-lg font-semibold">{{ data().title }}</h3>
    <p class="text-sm text-gray-600">{{ data().description }}</p>
    <button
      type="button"
      class="mt-2 text-primary underline"
      (click)="selected.emit(data())"
      [attr.aria-label]="'Selecionar ' + data().title"
    >
      Selecionar
    </button>
  `,
})
export class CardComponent {
  readonly data = input.required<CardData>();
  readonly selected = output<CardData>();
}
```

---

## Serviço com Signals

```typescript
// features/dashboard/services/dashboard.service.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';

export interface DashboardItem {
  id: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  readonly isLoading = signal(false);
  readonly items = signal<DashboardItem[]>([]);
  readonly hasItems = computed(() => this.items().length > 0);

  loadItems(): void {
    this.isLoading.set(true);
    this.http.get<DashboardItem[]>('/api/dashboard').subscribe({
      next: (data) => {
        this.items.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
}
```

---

## Guard de Autenticação

> Exemplo abaixo usa Firebase (projeto público). Para projeto interno (Azure AD/MSAL),
> ver o guard e interceptor equivalentes em `references/auth-azure-ad.md`.

```typescript
// core/auth/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseAuthService } from './firebase-auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(FirebaseAuthService);
  const router = inject(Router);

  if (auth.currentUser()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
```

---

## Interceptor de Auth (Firebase token)

```typescript
// core/auth/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { FirebaseAuthService } from './firebase-auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(FirebaseAuthService);
  const user = auth.currentUser();

  if (!user) return next(req);

  return from(user.getIdToken()).pipe(
    switchMap((token) => {
      const cloned = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
      return next(cloned);
    })
  );
};
```

---

## Reactive Form com Tipagem Estrita

```typescript
// features/cadastros/pages/novo-membro.component.ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface MembroForm {
  nome: FormControl<string>;
  email: FormControl<string>;
  cargo: FormControl<string>;
}

@Component({
  selector: 'app-novo-membro',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <label for="nome">Nome</label>
      <input id="nome" formControlName="nome" type="text" />

      @if (form.controls.nome.invalid && form.controls.nome.touched) {
        <span role="alert">Nome é obrigatório</span>
      }

      <button type="submit" [disabled]="form.invalid">Salvar</button>
    </form>
  `,
})
export class NovoMembroComponent {
  protected readonly form = new FormGroup<MembroForm>({
    nome: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    cargo: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  protected onSubmit(): void {
    if (this.form.invalid) return;
    console.log(this.form.getRawValue());
  }
}
```

---

## Layout Shell

```typescript
// layout/app.layout.component.ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';

@Component({
  selector: 'app-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, NavComponent],
  template: `
    <div class="flex h-screen overflow-hidden">
      <app-nav aria-label="Navegação principal" />
      <main class="flex-1 overflow-auto p-6" id="main-content" tabindex="-1">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AppLayoutComponent {}
```
