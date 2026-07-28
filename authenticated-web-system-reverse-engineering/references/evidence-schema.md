# Contrato de evidências estruturais

O envelope de `templates/evidence-envelope.json` é a fonte de verdade. O formato evita texto integral e valores de registros.

## Envelope

- `schema_version`: versão do contrato.
- `assessment_id`: identificador não pessoal.
- `captured_at`: timestamp ISO 8601.
- `source.system`: nome genérico do sistema.
- `source.base_origin`: esquema + host + porta, sem credenciais ou query.
- `policy.mode`: deve ser `read_only`.
- `policy.authorized_scope`: prefixos autorizados.
- `policy.pii_values_captured`: deve ser `false`.
- `routes`: resultados estruturais.

## Rota

Campos obrigatórios:

- `route_id`: identificador estável e opaco.
- `menu_path`: caminho funcional, sem identidade da sessão.
- `path`: caminho relativo sem query sensível.
- `page_kind`: `listing`, `detail`, `form`, `report`, `dashboard`, `error` ou `unknown`.
- `status`: inteiro HTTP ou `null` quando não houve resposta.
- `access`: `ok`, `http_error`, `blocked`, `requires_parameter`, `out_of_scope` ou `unknown`.
- `attempts`: número de tentativas.
- `structure`: metadados da página.

## Estrutura permitida

- `labels`: rótulos genéricos dos controles.
- `buttons`: textos genéricos; ações perigosas são marcadas, nunca clicadas.
- `controls`: `tag`, `type`, `name`, `id`, `required`, `disabled`, `option_count`.
- `tables`: `column_labels`, `column_count`; nunca linhas ou células.
- `forms`: `method`, `action_path`; nunca payload.
- `internal_links`: caminhos normalizados dentro da allowlist.

## Chaves proibidas

O validador rejeita chaves associadas a conteúdo e autenticação, incluindo:

- `value`, `values`, `rows`, `cells`, `records`;
- `innerText`, `textContent`, `html`, `body`, `response_body`;
- `cookies`, `headers`, `authorization`, `token`, `password`;
- `localStorage`, `sessionStorage`, `screenshot`.

## Rastreabilidade analítica

Relatórios devem referenciar `route_id` e classificar afirmações:

- **Observado:** consta diretamente na evidência.
- **Inferido:** interpretação sustentada por uma ou mais evidências.
- **Validado:** confirmado por responsável operacional.
- **Pendente:** hipótese ainda sem confirmação.

Não eleve correlação de campos a regra de negócio sem validação humana.
