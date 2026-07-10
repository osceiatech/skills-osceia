# Supabase — Integração Angular OSCEA

Supabase self-hosted é o **banco auxiliar** da OSCEA.
Armazena dados que **não vão para o Twenty CRM** (documentos, registros operacionais, uploads, etc.).

---

## 1. Instalação

```bash
npm install @supabase/supabase-js
npm install drizzle-orm
npm install -D drizzle-kit
```

**Não instalar:**
- `@supabase/ssr` — exclusivo para Next.js/SvelteKit (SSR)
- `@supabase/auth-helpers-angular` — descontinuado

---

## 2. Variáveis de Ambiente

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  firebase: { /* ... */ },
  supabase: {
    url: 'https://seu-supabase.oscea.gov.br',
    anonKey: 'eyJ...',
    schema: 'oscea',   // schema customizado do projeto
  },
};
```

```typescript
// src/environments/environment.production.ts
export const environment = {
  production: true,
  firebase: { /* ... */ },
  supabase: {
    url: 'https://supabase.oscea.gov.br',
    anonKey: 'eyJ...',
    schema: 'oscea',
  },
};
```

**No CI/CD (GitHub Actions) — gerar o environment antes do build:**
```yaml
- name: Gerar environment de produção
  run: |
    cat > src/environments/environment.production.ts << EOF
    export const environment = {
      production: true,
      firebase: {
        apiKey: '${{ secrets.FIREBASE_API_KEY }}',
        authDomain: '${{ secrets.FIREBASE_AUTH_DOMAIN }}',
        projectId: '${{ secrets.FIREBASE_PROJECT_ID }}',
        appId: '${{ secrets.FIREBASE_APP_ID }}',
      },
      supabase: {
        url: '${{ secrets.SUPABASE_URL }}',
        anonKey: '${{ secrets.SUPABASE_ANON_KEY }}',
        schema: 'oscea',
      },
    };
    EOF
```

---

## 3. SupabaseService — Singleton

Um único serviço detém o cliente. **Nunca chamar `createClient` fora deste serviço.**

```typescript
// src/app/core/supabase.service.ts
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly client: SupabaseClient;

  constructor() {
    this.client = createClient(
      environment.supabase.url,
      environment.supabase.anonKey,
      { db: { schema: environment.supabase.schema } }
    );
  }
}
```

Se uma query precisar de schema diferente do padrão:
```typescript
const { data } = await this.supabase.schema('outro_schema').from('tabela').select('*');
```

---

## 4. Tipagem com Drizzle ORM

O Drizzle é a **fonte de verdade dos tipos**. Nunca usar `any` nos retornos do Supabase.

```typescript
// drizzle/schema.ts
import { pgSchema, uuid, text, timestamp, numeric } from 'drizzle-orm/pg-core';

export const osceaSchema = pgSchema('oscea');

export const documentos = osceaSchema.table('documentos', {
  id:          uuid('id').defaultRandom().primaryKey(),
  titulo:      text('titulo').notNull(),
  descricao:   text('descricao'),
  valor:       numeric('valor'),          // retorna string no PostgREST
  dataEmissao: text('data_emissao'),      // date retorna string YYYY-MM-DD
  status:      text('status').notNull(),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
  updatedAt:   timestamp('updated_at').defaultNow().notNull(),
});

// Tipos inferidos — usar em todo o projeto
export type Documento = typeof documentos.$inferSelect;
export type InsertDocumento = typeof documentos.$inferInsert;
```

> **Tipos PostgREST a lembrar:**
> - `numeric`/`decimal` → `string` (não `number`) — usar `parseFloat()` onde precisar calcular
> - `date` → `string` (`'YYYY-MM-DD'`) — usar `new Date(valor)` onde precisar de objeto Date
> - `timestamp` → `string` ISO 8601
> - `uuid` → `string` — nunca `parseInt()`

Caminho de reexportação:
```typescript
// src/app/core/types/database.types.ts
export type * from '../../../../drizzle/schema';
```

---

## 5. Utilitário de Erro

```typescript
// src/app/core/utils/supabase-error.ts
import { PostgrestError } from '@supabase/supabase-js';

export function assertData<T>(
  data: T | null,
  error: PostgrestError | null,
  contexto: string
): T {
  if (error) throw new Error(`[${contexto}] ${error.message} (code: ${error.code})`);
  if (data === null) throw new Error(`[${contexto}] Nenhum dado retornado`);
  return data;
}
```

---

## 6. Serviço de Dados por Entidade

Componentes **nunca** chamam o cliente Supabase diretamente. Toda operação passa pelo service.

```typescript
// src/app/features/documentos/services/documentos.service.ts
import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../../core/supabase.service';
import { assertData } from '../../../core/utils/supabase-error';
import type { Documento, InsertDocumento } from '../../../core/types/database.types';

@Injectable({ providedIn: 'root' })
export class DocumentosService {
  private readonly supabase = inject(SupabaseService).client;

  async listar(): Promise<Documento[]> {
    const { data, error } = await this.supabase
      .from('documentos')
      .select('*')
      .order('created_at', { ascending: false });
    return assertData(data, error, 'DocumentosService.listar') as Documento[];
  }

  async buscar(id: string): Promise<Documento> {
    const { data, error } = await this.supabase
      .from('documentos')
      .select('*')
      .eq('id', id)
      .single();
    return assertData(data, error, 'DocumentosService.buscar') as Documento;
  }

  async criar(dados: Omit<InsertDocumento, 'id' | 'createdAt' | 'updatedAt'>): Promise<Documento> {
    const { data, error } = await this.supabase
      .from('documentos')
      .insert(dados)
      .select()
      .single();
    return assertData(data, error, 'DocumentosService.criar') as Documento;
  }

  async atualizar(id: string, dados: Partial<InsertDocumento>): Promise<void> {
    const { error } = await this.supabase
      .from('documentos')
      .update(dados)
      .eq('id', id);
    if (error) throw new Error(`[DocumentosService.atualizar] ${error.message}`);
  }

  async excluir(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('documentos')
      .delete()
      .eq('id', id);
    if (error) throw new Error(`[DocumentosService.excluir] ${error.message}`);
  }
}
```

---

## 7. Signal Store por Feature

Cada feature com Supabase tem seu próprio store de signals. Sem NgRx.

```typescript
// src/app/features/documentos/store/documentos.store.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { DocumentosService } from '../services/documentos.service';
import type { Documento, InsertDocumento } from '../../../core/types/database.types';

@Injectable({ providedIn: 'root' })
export class DocumentosStore {
  private readonly service = inject(DocumentosService);

  // Estado
  readonly itens = signal<Documento[]>([]);
  readonly carregando = signal(false);
  readonly erro = signal<string | null>(null);

  // Derivados
  readonly total = computed(() => this.itens().length);
  readonly ativos = computed(() => this.itens().filter(d => d.status === 'ativo'));
  readonly temErro = computed(() => this.erro() !== null);

  async carregar(): Promise<void> {
    this.carregando.set(true);
    this.erro.set(null);
    try {
      const dados = await this.service.listar();
      this.itens.set(dados);
    } catch (e: unknown) {
      this.erro.set(e instanceof Error ? e.message : 'Erro desconhecido');
    } finally {
      this.carregando.set(false);
    }
  }

  async criar(dados: Parameters<DocumentosService['criar']>[0]): Promise<void> {
    const novo = await this.service.criar(dados);
    this.itens.update(lista => [novo, ...lista]);
  }

  async atualizar(id: string, dados: Partial<InsertDocumento>): Promise<void> {
    await this.service.atualizar(id, dados);
    this.itens.update(lista =>
      lista.map(item => item.id === id ? { ...item, ...dados } : item)
    );
  }

  async excluir(id: string): Promise<void> {
    await this.service.excluir(id);
    this.itens.update(lista => lista.filter(item => item.id !== id));
  }
}
```

**Uso no componente (Smart Page):**
```typescript
@Component({
  selector: 'app-documentos-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (store.carregando()) {
      <p>Carregando...</p>
    } @else if (store.temErro()) {
      <p role="alert" class="text-red-600">{{ store.erro() }}</p>
    } @else {
      @for (doc of store.itens(); track doc.id) {
        <app-documento-card [data]="doc" (excluir)="store.excluir(doc.id)" />
      }
    }
  `,
})
export class DocumentosPageComponent {
  protected readonly store = inject(DocumentosStore);

  constructor() {
    this.store.carregar();
  }
}
```

---

## 8. Edge Functions

Edge Functions rodam em **Deno** (não Node.js) dentro do Supabase self-hosted.

### Diferenças críticas Deno vs Node.js

| | Node.js | Deno |
|---|---|---|
| Env vars | `process.env.VAR` | `Deno.env.get("VAR")` |
| Pacotes npm | `import from 'pkg'` | `import from "npm:pkg"` |
| Entry point | `export default handler` | `Deno.serve(async (req) => {...})` |

### Template de função com CORS (obrigatório)

```typescript
// supabase/functions/minha-funcao/index.ts
import { createClient } from "npm:@supabase/supabase-js";
import { handleCors, json } from "../_shared/cors.ts";

Deno.serve(async (req: Request) => {
  // CORS preflight — SEMPRE o primeiro bloco
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!  // service role server-side
    );

    // lógica aqui
    return json({ ok: true });
  } catch (error) {
    console.error("[minha-funcao]", error);
    return json({ error: "Erro interno" }, 500);
  }
});
```

### `_shared/cors.ts` — centralizar CORS

```typescript
// supabase/functions/_shared/cors.ts
export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

export function handleCors(req: Request): Response | null {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }
  return null;
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}
```

### `deno.json` — mapa de imports

```json
{
  "unstable": ["sloppy-imports"],
  "imports": {
    "@supabase/supabase-js": "npm:@supabase/supabase-js",
    "jose": "npm:jose"
  }
}
```

### `supabase/config.toml` — JWT por função

```toml
[functions.minha-funcao]
verify_jwt = true    # exige JWT válido do Supabase (padrão)

[functions.webhook-publico]
verify_jwt = false   # função pública ou com auth própria
```

### Chamar Edge Functions do Angular

```typescript
// src/app/core/services/edge-functions.service.ts
import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../supabase.service';

@Injectable({ providedIn: 'root' })
export class EdgeFunctionsService {
  private readonly supabase = inject(SupabaseService).client;

  async invocar<T>(nome: string, payload?: object): Promise<T> {
    const { data, error } = await this.supabase.functions.invoke<T>(nome, {
      body: payload,
    });
    if (error) throw new Error(`[EdgeFunctions.${nome}] ${error.message}`);
    return data as T;
  }
}
```

---

## 9. Configuração do Servidor (Self-Hosted)

### Expor schema no PostgREST — `docker-compose.yml`

```yaml
rest:
  environment:
    PGRST_DB_SCHEMAS: "public,oscea"
    PGRST_DB_EXTRA_SEARCH_PATH: "oscea,public,extensions"
```

Após alterar: `docker compose restart rest`

### Permissões e RLS — rodar no SQL Editor

```sql
-- Rodar como supabase_admin no SQL Editor do Supabase

GRANT USAGE ON SCHEMA oscea TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA oscea TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA oscea TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA oscea
  GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA oscea
  GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- Desabilitar RLS (auth é feita pelo Firebase, não pelo Supabase)
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'oscea'
  LOOP
    EXECUTE format('ALTER TABLE oscea.%I DISABLE ROW LEVEL SECURITY', r.tablename);
  END LOOP;
END $$;
```

> **Por que desabilitar RLS?** O projeto usa Firebase Auth, não Supabase Auth.
> RLS do Supabase só agrega valor com autenticação nativa do Supabase.

---

## 10. Checklist Supabase

- [ ] `environment.ts` com `supabase.url`, `supabase.anonKey`, `supabase.schema`
- [ ] `SupabaseService` como singleton em `core/supabase.service.ts`
- [ ] Schema `oscea` adicionado ao `PGRST_DB_SCHEMAS` no servidor
- [ ] Container PostgREST reiniciado após configuração
- [ ] SQL de permissões + disable RLS rodado no SQL Editor
- [ ] Drizzle schema em `drizzle/schema.ts` com tipos exportados
- [ ] Services de dados em `features/[feature]/services/` — sem chamadas diretas em componentes
- [ ] Stores em `features/[feature]/store/` usando signals

### Erros comuns

| Erro | Causa | Solução |
|---|---|---|
| `401 Unauthorized` | Schema não exposto no PostgREST | Adicionar a `PGRST_DB_SCHEMAS` e reiniciar container |
| `42501 row-level security` | RLS ativo | Rodar `DISABLE ROW LEVEL SECURITY` no SQL Editor |
| `numeric` chegando como `string` | Comportamento padrão PostgREST/JSON | Usar `parseFloat()` onde precisar calcular |
| `date` chegando como `'2025-01-15'` | Comportamento padrão PostgREST | Usar `new Date(valor)` onde precisar de Date |
| `Cannot read properties of undefined (reading 'from')` | Cliente não inicializado | Confirmar que `SupabaseService` é `providedIn: 'root'` |
| `404` em Edge Function | Nome da pasta diferente ou deploy não aplicado | Verificar nome e reiniciar container |
| CORS bloqueado | Falta handler `OPTIONS` na função | Adicionar bloco `handleCors(req)` como primeiro bloco |
