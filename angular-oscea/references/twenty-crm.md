# Twenty CRM — Integração Angular OSCEA

O Twenty CRM é o CRM principal da OSCEA (contatos, negócios, pipeline). **Nunca é
acessado diretamente do browser** — sempre por trás de uma Edge Function proxy que
repassa a query/mutation GraphQL, injeta a API key do Twenty no servidor e valida o
token de auth do usuário (Firebase ou Azure AD, conforme o projeto).

```
Angular → EdgeFunctionsService.invocar('cam-sync-twenty', { query, variables })
        → Edge Function (Deno) valida idToken/Azure AD, chama Twenty GraphQL API
        → resposta { data } retorna ao Angular
```

---

## 1. Serviço central: `TwentyService`

Um único serviço por projeto encapsula a chamada GraphQL. Nenhum outro service chama
a Edge Function do Twenty diretamente.

```typescript
// src/app/core/services/twenty.service.ts
import { Injectable, inject } from '@angular/core';
import { EdgeFunctionsService } from './edge-functions.service';
import { FirebaseAuthService } from '../auth/firebase-auth.service'; // ou AzureAuthService

interface TwentyFunctionResponse<T> {
  data: T;
}

@Injectable({ providedIn: 'root' })
export class TwentyService {
  private readonly edgeFunctions = inject(EdgeFunctionsService);
  private readonly auth = inject(FirebaseAuthService);

  /**
   * Executa qualquer query ou mutation GraphQL no Twenty CRM.
   *
   * @example
   * const result = await twenty.graphql<{ people: { edges: ... } }>(GET_PESSOA_BY_ID, { id });
   */
  async graphql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const idToken = await this.auth.getIdToken();
    const result = await this.edgeFunctions.invocar<TwentyFunctionResponse<T>>(
      'cam-sync-twenty', // nome da Edge Function proxy — prefixo do domínio do projeto
      { query, variables },
      idToken,
    );
    return result.data;
  }
}
```

---

## 2. Queries/Mutations como strings GraphQL puras

Organizadas por entidade em `core/graphql/`, sem SDK gerado — apenas template strings
tipadas no retorno via generics do `TwentyService.graphql<T>()`.

```typescript
// src/app/core/graphql/pessoa.queries.ts
const PESSOA_FIELDS = `
  id
  cpf
  firebaseauthuid
  nomeSocial
  name { firstName lastName }
  emails { primaryEmail additionalEmails }
  phones { primaryPhoneNumber primaryPhoneCallingCode primaryPhoneCountryCode }
  createdAt
  updatedAt
`;

export const GET_PESSOA_BY_ID = `
  query GetPessoaById($id: UUID!) {
    person(filter: { id: { eq: $id } }) {
      ${PESSOA_FIELDS}
    }
  }
`;

export const GET_PESSOA_BY_CPF = `
  query GetPessoaByCpf($cpf: String!) {
    people(filter: { cpf: { eq: $cpf } }) {
      edges { node { ${PESSOA_FIELDS} } }
    }
  }
`;
```

```typescript
// src/app/core/graphql/pessoa.mutations.ts
export const UPDATE_PESSOA = `
  mutation UpdatePessoa($id: UUID!, $input: PersonUpdateInput!) {
    updatePerson(id: $id, input: $input) {
      id
    }
  }
`;
```

**Regras:**
- Um arquivo `[entidade].queries.ts` e `[entidade].mutations.ts` por entidade do CRM
- Campos comuns extraídos em uma constante (`[ENTIDADE]_FIELDS`) para reuso entre queries
- Nunca montar a string GraphQL inline dentro de um componente ou service de feature —
  sempre importar de `core/graphql/`

---

## 3. Uso em um service de feature

```typescript
// src/app/features/candidatos/services/candidato.service.ts
import { Injectable, inject } from '@angular/core';
import { TwentyService } from '../../../core/services/twenty.service';
import { GET_PESSOA_BY_CPF } from '../../../core/graphql/pessoa.queries';

@Injectable({ providedIn: 'root' })
export class CandidatoService {
  private readonly twenty = inject(TwentyService);

  async buscarPorCpf(cpf: string) {
    return this.twenty.graphql<{ people: { edges: { node: unknown }[] } }>(
      GET_PESSOA_BY_CPF,
      { cpf },
    );
  }
}
```

---

## 4. Edge Function proxy — convenção de prefixos (osceia-api)

Cada projeto tem sua própria Edge Function proxy do Twenty, nomeada com o **prefixo
do domínio** — a mesma convenção usada em todas as functions do projeto (ver
`SKILL.md` seção 11):

| Prefixo | Domínio/Projeto | Function proxy do Twenty (exemplo) |
|---|---|---|
| `cam-` | Câmara Municipal (osceia-camara) | `cam-sync-twenty` |
| `mkt-` | Marketing Hub (osceia-marketing) | `mkt-sync-crm` |
| `oapp-` | App de Vagas (osceia-app) | `oapp-twenty-proxy` |

O repositório `osceia-api` consolida o deploy de todas essas functions
(`node scripts/deploy-functions.mjs --only <prefixo>`), mesmo quando o código-fonte
também vive dentro do `supabase/functions/` do projeto Angular correspondente.

### Template mínimo da Edge Function (Deno)

```typescript
// supabase/functions/cam-sync-twenty/index.ts
import { handleCors, json } from "../_shared/cors.ts";

const TWENTY_API_URL = Deno.env.get("TWENTY_CRM_API_URL")!;
const TWENTY_API_KEY = Deno.env.get("TWENTY_CRM_API_KEY")!;

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // validar idToken (Firebase ou Azure AD conforme o projeto) antes de prosseguir
    const { query, variables } = await req.json();

    const res = await fetch(`${TWENTY_API_URL}/graphql`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TWENTY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    const body = await res.json();
    return json(body);
  } catch (error) {
    console.error("[cam-sync-twenty]", error);
    return json({ error: "Erro ao consultar o Twenty CRM" }, 500);
  }
});
```
