# Checklist de extração por tipo de arquivo

Procure cada item abaixo no código. Documente apenas o que existir; não infira nem complete defaults não vistos. Caminhos de arquivo sempre presentes.

## Índice
- [Componente](#componente)
- [Serviço](#servico)
- [Diretiva](#diretiva)
- [Guard / Resolver / Interceptor (funcionais)](#guard-resolver-interceptor)
- [Arquivo de rotas](#rotas)
- [Modelo / Interface / Tipo](#modelo)
- [Store de signals](#store)
- [Template (HTML)](#template)

<a id="componente"></a>
## Componente

Do decorator `@Component`:
- `selector`, `changeDetection`, `encapsulation`, `template` vs `templateUrl`, `styles`/`styleUrl(s)`
- `imports` (lista exata)
- `providers` / `viewProviders`
- `host` (bindings `[attr.x]`, `[class.x]`, `[style.x]`, `(evento)`) — substitui `@HostBinding`/`@HostListener`
- `hostDirectives`
- `exportAs`
- `animations` (apenas nomes/triggers)

Da classe:
- Inputs: `input()`, `input.required()`, com tipo, default, `alias`, `transform`
- Outputs: `output<T>()`, `outputFromObservable`
- Models: `model()` / `model.required()`
- Queries: `viewChild`, `viewChildren`, `contentChild`, `contentChildren` (signal queries) e legados `@ViewChild`/`@ContentChild`
- Signals: `signal()` (tipo + valor inicial)
- `computed()` (dependências + o que calcula)
- `linkedSignal()`, `resource()`/`rxResource()`
- `effect()` (o que observa, efeito declarado)
- `inject(...)` e injeções por construtor
- Lifecycle hooks implementados (`ngOnInit`, `ngOnDestroy`, `afterNextRender`, `afterRenderEffect`, etc.) — o que fazem em 1 linha
- Métodos públicos (assinatura + 1 linha)
- Formulários: Reactive (`FormGroup`/`FormControl`/`FormBuilder`/`NonNullableFormBuilder`, validators) ou Template-driven (`ngModel`)

<a id="servico"></a>
## Serviço

- Escopo: `@Injectable({ providedIn: 'root' | 'platform' | 'any' })` ou provido em rota/componente
- `inject(...)` (HttpClient, outros serviços, tokens)
- Estado exposto: signals públicos, `computed`, `BehaviorSubject`/`Subject`, `toSignal`
- Métodos públicos: assinatura, verbo HTTP + endpoint quando houver, tipo de retorno (`Observable<T>`, `Promise<T>`, `Signal<T>`)
- Efeitos colaterais declarados (cache, storage, navegação)

<a id="diretiva"></a>
## Diretiva

- `selector` (atributo/classe), `exportAs`, `standalone`
- `host`, `hostDirectives`
- Inputs/outputs/models (mesma extração de componente)
- Métodos e lifecycle

<a id="guard-resolver-interceptor"></a>
## Guard / Resolver / Interceptor (funcionais)

- Tipo: `CanActivateFn`, `CanMatchFn`, `CanDeactivateFn`, `ResolveFn<T>`, `HttpInterceptorFn`
- `inject(...)` usados dentro da função
- Lógica de decisão: o que retorna (`true`/`UrlTree`/redirect) e sob qual condição — descrição factual do branch
- Interceptor: o que adiciona/transforma na request/response (headers, retry, erros)

<a id="rotas"></a>
## Arquivo de rotas

Para cada rota:
- `path`, `component` / `loadComponent` / `loadChildren` (lazy)
- `canActivate`/`canMatch`/`canDeactivate`, `resolve`
- `data`, `title`, `providers` de rota
- `children`, `redirectTo`, `pathMatch`

<a id="modelo"></a>
## Modelo / Interface / Tipo

- Campos com tipos, opcionais (`?`), readonly
- Enums e union types
- Tipos de request/response usados por serviços
- Generics

<a id="store"></a>
## Store de signals

- Signals privados (estado) e públicos (`asReadonly()`)
- `computed` derivados
- Métodos que fazem `set`/`update` (nunca documente como "mutate" — Angular não tem mutate; descreva o que existe)
- Integração com serviços/efeitos

<a id="template"></a>
## Template (HTML)

- Control flow nativo: `@if`/`@else if`/`@else`, `@for` (com `track`, `@empty`), `@switch`/`@case`/`@default`
- Control flow legado: `*ngIf`, `*ngFor`, `*ngSwitch`, `ng-template`, `ng-container`
- Deferrable views: `@defer` com triggers (`on idle`, `on viewport`, `on interaction`, `when`), `@placeholder`, `@loading`, `@error`
- Bindings: `[prop]`, `(evento)`, `[(ngModel)]`, `[class.x]`, `[style.x]`, `[attr.x]`
- Pipes: `async`, built-in (`date`, `currency`...), custom
- Pontos de projeção: `<ng-content>` (com `select`)
- Referências de template (`#ref`)
- Imagens: `NgOptimizedImage` (`ngSrc`, `priority`, `fill`) vs `<img src>`
- Bibliotecas de UI: PrimeNG (`p-*`), Angular Material, etc.
- A11y no template: `role`, `aria-*`, `alt`, `<label for>`, `tabindex`, `cdkTrapFocus`
