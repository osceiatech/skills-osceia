---
name: feature-doc-generator
description: Gera documentação técnica descritiva (um "espelho" do código, sem sugestões) de uma feature, módulo ou conjunto de arquivos Angular/TypeScript, salvando em /doc/feature-nome/. O objetivo é produzir um artefato compacto e fiel que possa ser passado para uma IA analisar gastando menos tokens (em vez de reenviar todo o código-fonte). Use SEMPRE que o usuário pedir para "documentar uma feature", "documentar o módulo de X", "gerar doc do que está feito", "criar um espelho do código", "documentar como está implementado", "gerar contexto de uma feature para a IA", "documentar login/checkout/cadastro/etc", ou quando mencionar querer reduzir tokens passando uma descrição em vez do código. Dispara para componentes, serviços, diretivas, guards, interceptors, rotas, stores de signals e templates Angular v20+.
---

# Feature Doc Generator

Gera documentação **puramente descritiva** de código Angular/TypeScript já implementado. O resultado é um "espelho" fiel do que existe — não um relatório de qualidade. O caso de uso central: o usuário quer passar essa doc para uma IA analisar/melhorar gastando muito menos tokens do que reenviar o código inteiro.

## Princípios inegociáveis

Estes princípios definem a skill. Violá-los a torna inútil para o propósito do usuário.

1. **ZERO sugestões.** Proibido sugerir melhorias, refatorações, correções de bug ou apontar desvios de boas práticas. Não escreva "poderia", "seria melhor", "recomenda-se", "atenção:", "⚠️". Se notar um bug óbvio, descreva o comportamento como está e siga em frente.
2. **Espelho, não crítica.** Descreva comportamento, dependências e estrutura exatamente como escritos. Documente o que o código *faz*, não o que *deveria* fazer.
3. **Não inventar.** Se algo não está no código, não está na doc. Nada de presumir uma config padrão que não foi vista, nem "provavelmente". Se um valor vem de outro arquivo não fornecido, registre isso explicitamente (ex.: "injeta `AuthService` — definição fora do escopo analisado").
4. **Vocabulário moderno como classificador, não como régua.** Use os termos do Angular v20+ (signals, standalone, control flow nativo, `input()`/`output()`, `inject()`) apenas para *nomear* com precisão o que existe. Encontrou `*ngIf`? Documente "usa `*ngIf`" — sem comentar que o nativo seria preferível.
5. **Compacto e dirigido a outra IA.** O leitor é um modelo que vai raciocinar sobre a feature sem ver o código. Densidade de sinal alta: priorize assinaturas, contratos, fluxo e dependências. Corte prosa decorativa. Caminhos de arquivo sempre presentes para rastreabilidade.

## Fluxo de trabalho

### 1. Determinar o escopo

Identifique o conjunto de arquivos da feature. O usuário costuma dar um nome ("módulo de login") ou um caminho (`src/app/features/auth/`).

- Se um diretório foi dado, mapeie-o: `find <dir> -type f \( -name '*.ts' -o -name '*.html' -o -name '*.scss' -o -name '*.css' \) | sort`.
- Se só o nome foi dado, busque: `grep -rl --include='*.ts' -i '<nome>' src/` e arquivos com o nome no path (`find src -ipath '*<nome>*'`).
- **Inclua os arquivos de template/estilo externos** referenciados em `templateUrl`/`styleUrl(s)`, mesmo fora do diretório.
- Se o escopo ficar ambíguo (vários módulos batem), **liste o que encontrou e confirme com o usuário antes de gerar** — não desperdice tokens documentando o módulo errado.

### 2. Ler e classificar cada arquivo

Leia cada arquivo do escopo. Para cada um, classifique o tipo (componente standalone, serviço singleton, guard funcional, interceptor, diretiva, resolver, arquivo de rotas, modelo/interface, store de signals) e extraia os fatos conforme o **template de saída** abaixo. Consulte `references/extraction-checklist.md` para a lista exaustiva de itens a procurar por tipo de arquivo — leia-o antes de documentar para não esquecer campos (ex.: `host`, `providers`, `exportAs`, deferrable views).

### 3. Definir o nome da feature

Derive um slug `kebab-case` curto e descritivo do propósito da feature (não do nome de um arquivo). Ex.: módulo de login → `autenticacao` ou `login`; checkout com Mercado Pago → `checkout-pagamento`. Pasta de saída: `doc/feature-<slug>/`. Pergunte/sugira o slug ao usuário se houver dúvida, mas siga com um padrão sensato se ele não responder.

### 4. Escrever a documentação

Crie `doc/feature-<slug>/README.md` com a estrutura abaixo. Para features com muitos arquivos, gere **um arquivo `.md` por unidade** (`login.component.md`, `auth.service.md`, ...) dentro da pasta e um `README.md` índice que liste cada unidade com 1 linha de propósito + tabela de fluxo entre elas. Para features pequenas (1–3 arquivos), um único `README.md` com seções por unidade basta.

Sempre comece o `README.md` com um cabeçalho de contexto:

```markdown
# Feature: <Nome legível>

> Documentação descritiva gerada automaticamente — espelho do código em `<caminho do escopo>`.
> Stack: Angular vXX, <libs relevantes detectadas>.
> Arquivos cobertos: N.

## Visão geral do fluxo
<2–5 linhas em prosa: o que a feature faz e como os arquivos se conectam — derivado SÓ do código lido.>

## Índice
- [`arquivo.ext`](#ancora) — propósito em 1 linha
```

### 5. Apresentar

Salve em `doc/feature-<slug>/` no workspace do projeto (ou em `/mnt/user-data/outputs/doc/feature-<slug>/` quando aplicável) e apresente os arquivos ao usuário com `present_files`. Termine com 1 linha factual (quantos arquivos, qual o caminho) — sem postâmbulo.

## Template de cada unidade

Use exatamente esta estrutura. **Omita seções que não se aplicam** ao arquivo (não escreva "N/A" para seções inteiras vazias; some-as).

```markdown
## `caminho/relativo/do/arquivo.ext`

Descrição do propósito e responsabilidade única, em 1–3 frases, derivada do código.

### Estrutura
- **Tipo:** Componente Standalone | Serviço Singleton (`providedIn: 'root'`) | Guard funcional | Interceptor | Diretiva | Resolver | Rotas | Modelo/Interface | Store de Signals
- **Seletor:** `app-...` (componentes/diretivas)
- **Change Detection:** OnPush | Default (componentes)
- **Encapsulation:** (só se explicitamente definido)
- **Template/Estilo:** inline | externo (`./x.html`) ; estilização via binding `[class.x]` / `[style.x]` / classes Tailwind / SCSS
- **`host`:** bindings e listeners declarados no objeto `host`
- **`imports`:** componentes/diretivas/pipes importados
- **`providers`:** providers locais declarados

### API pública
- **Inputs** (`input()` / `input.required()`): `nome: Tipo` — obrigatório/opcional, default se houver, alias/transform se houver
- **Outputs** (`output<T>()`): `nome: T` — o que dispara a emissão
- **Models** (`model()`): `nome: Tipo` — two-way binding
- **Queries** (`viewChild`/`contentChild`/...): alvo consultado
- **Métodos públicos:** `assinatura(): Retorno` — o que faz (1 linha)

### Estado e reatividade
- **Estado local** (`signal()`): `nome: Tipo` = valor inicial
- **Estado derivado** (`computed()`): `nome` ← do que depende; o que calcula
- **`linkedSignal` / `resource`:** fonte e comportamento
- **Effects** (`effect()`): o que observa e o efeito colateral declarado
- **RxJS:** Observables/Subjects e operadores relevantes; uso de `toSignal`/`toObservable`

### Dependências injetadas
- `inject(Servico)` — para que é usado no arquivo
- Injeção via construtor, se houver (documente como está)

### Template e fluxo de controle
- Estrutura geral do template
- Control flow: `@if` / `@for` (com `track`) / `@switch` ; ou legados `*ngIf`/`*ngFor`/`*ngSwitch` — documente o que existe
- Deferrable views: `@defer` (triggers, `@placeholder`/`@loading`/`@error`)
- Pipes: `async`, custom, built-in
- Mídia: `NgOptimizedImage` (`ngSrc`) ou `<img src>` comum
- Componentes de UI usados (PrimeNG, etc.)

### Acessibilidade (A11y)
- Atributos ARIA, `role`, `aria-*`, `alt`, `label`/`for`
- Gerenciamento de foco (`cdkTrapFocus`, `.focus()`, `tabindex`)
- Itens declarados no código relacionados a contraste/teclado

### Rotas (arquivos de rota)
- Path, componente/lazy `loadComponent`/`loadChildren`, guards (`canActivate`...), resolvers, `data`, `title`

### Contratos de dados (modelos/interfaces)
- Campos com tipos; enums; tipos de request/response de serviços
```

## Exemplo curto

**Entrada (trecho):**
```ts
@Component({ selector: 'app-login', changeDetection: ChangeDetectionStrategy.OnPush, template: `@if (loading()) { <p>...</p> }` })
export class LoginComponent {
  email = input.required<string>();
  submitted = output<Credentials>();
  private auth = inject(AuthService);
  loading = signal(false);
  canSubmit = computed(() => this.email().length > 0);
}
```

**Saída:**
```markdown
## `src/app/features/auth/login.component.ts`

Componente de tela de login; coleta credenciais e emite o evento de submissão.

### Estrutura
- **Tipo:** Componente Standalone
- **Seletor:** `app-login`
- **Change Detection:** OnPush
- **Template/Estilo:** inline

### API pública
- **Inputs:** `email: string` — obrigatório (`input.required`)
- **Outputs:** `submitted: Credentials` — emitido na submissão do formulário

### Estado e reatividade
- **Estado local:** `loading: boolean` = `false`
- **Estado derivado:** `canSubmit` ← depende de `email()`; verdadeiro quando o e-mail não está vazio

### Dependências injetadas
- `inject(AuthService)` — autenticação

### Template e fluxo de controle
- Control flow: `@if (loading())` exibe indicador de carregamento
```

Note como a saída não comenta que faltam tratamento de erro, validação ou ARIA — apenas registra o que existe.

## Lembrete final

Antes de finalizar, releia a doc e remova qualquer frase que avalie, recomende ou critique. Se uma frase responde "isso está bom/ruim?" em vez de "o que isto faz?", apague-a.
