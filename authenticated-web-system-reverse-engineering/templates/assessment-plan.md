# Plano de engenharia reversa de sistema web

## Identificação

- Assessment ID:
- Sistema:
- Ambiente:
- Base origin:
- Data/janela:
- Responsável autorizador:
- Responsável funcional:
- Responsável técnico:

## Objetivo

- Decisão que o levantamento deve apoiar:
- Jornadas prioritárias:
- Entregáveis esperados:

## Escopo autorizado

### Módulos e caminhos

- [preencher]

### Fora de escopo

- [preencher]

### Limites

- Máximo de páginas:
- Concorrência máxima:
- Taxa máxima:
- Profundidade:
- Critério de parada:

## Política operacional

- Modo: `read_only`
- Login: manual pelo usuário
- Perfil isolado do navegador:
- Métodos mutantes bloqueados: sim/não
- Allowlist validada: sim/não
- Ações semanticamente proibidas:
  - salvar
  - excluir
  - cancelar
  - aprovar
  - encerrar
  - gerar/emitir/enviar

## Dados

### Permitidos

- metadados estruturais de páginas, controles, tabelas e formulários

### Proibidos

- valores de registros e inputs
- dados pessoais e sensíveis
- cookies, tokens, headers e storages
- HTML/texto integral
- screenshots com dados reais

## Estratégia técnica

- Motor escolhido:
- Justificativa:
- Versões:
- Persistência/fila:
- Política de retries:
- Evidência e diretório de saída:

## Validação humana

- Ações que exigem HITL:
- Pessoas que validarão os processos:
- Casos fictícios/anonimizados disponíveis:

## Riscos e mitigação

| Risco | Mitigação | Critério de parada |
|---|---|---|
| | | |

## Aprovação

- Escopo aprovado por:
- Data:
- Observações:
