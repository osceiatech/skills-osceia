---
name: technical-design-doc-creator
description: Cria Technical Design Documents (TDD) completos com seções obrigatórias e opcionais através de descoberta interativa. Use SEMPRE que o usuário pedir para "criar um TDD", "escrever um design doc", "documentar design técnico", "especificação técnica", "documento de arquitetura", "RFC", "proposta de design", ou precisar documentar uma decisão técnica antes da implementação. Também dispara com "technical spec", "design proposal", "architecture document" e equivalentes em inglês ou espanhol. NÃO use para READMEs, documentação de API ou documentação geral (use docs-writer nesses casos).
---

# Technical Design Doc Creator

Você é especialista em criar Technical Design Documents (TDDs) que comunicam com clareza decisões de arquitetura de software, planos de implementação e avaliação de riscos, seguindo as melhores práticas da indústria.

## Quando Usar Esta Skill

Use esta skill quando:

- O usuário pedir para "criar um TDD", "escrever um design doc" ou "documentar design técnico"
- Iniciar um novo projeto de feature ou integração
- Projetar um sistema que exige alinhamento do time
- Planejar migração ou substituição de sistemas existentes
- O usuário mencionar necessidade de documentação para aprovação de stakeholders
- Antes de implementar mudanças técnicas significativas

## Adaptação de Idioma

**CRÍTICO**: Sempre gere o TDD no **mesmo idioma da solicitação do usuário**. O idioma padrão desta skill é português (pt-BR); se o usuário escrever em inglês ou espanhol, gere todo o conteúdo (cabeçalhos, prosa, explicações) nesse idioma.

**Diretrizes**:

- Mantenha termos técnicos em inglês quando consagrados (ex.: "API", "webhook", "JSON", "rollback", "feature flag", "circuit breaker")
- Mantenha exemplos de código e schemas agnósticos de idioma (JSON, diagramas, código)
- Nomes de empresas/produtos permanecem no idioma original
- Mantenha consistência de terminologia ao longo de todo o documento

**Traduções de cabeçalhos de seção** (referência rápida):

| Português                       | English                    | Español                      |
| ------------------------------- | -------------------------- | ---------------------------- |
| Contexto                        | Context                    | Contexto                     |
| Definição do Problema           | Problem Statement          | Definición del Problema      |
| Escopo                          | Scope                      | Alcance                      |
| Solução Técnica                 | Technical Solution         | Solución Técnica             |
| Riscos                          | Risks                      | Riesgos                      |
| Plano de Implementação          | Implementation Plan        | Plan de Implementación       |
| Considerações de Segurança      | Security Considerations    | Consideraciones de Seguridad |
| Estratégia de Testes            | Testing Strategy           | Estrategia de Pruebas        |
| Monitoramento e Observabilidade | Monitoring & Observability | Monitoreo y Observabilidad   |
| Plano de Rollback               | Rollback Plan              | Plan de Reversión            |

## Padrões da Indústria de Referência

Esta skill segue padrões consolidados:

- **Google Design Docs**: Context, Goals, Non-Goals, Design, Alternatives, Security, Testing
- **Amazon PR-FAQ**: Working Backwards — começar pelo problema do cliente
- **RFC Pattern**: Summary, Motivation, Explanation, Alternatives, Drawbacks
- **ADR (Architecture Decision Records)**: Context, Decision, Consequences
- **SRE Book (Google)**: Monitoring, Rollback, SLOs, Observability
- **PCI DSS**: Requisitos de segurança para sistemas de pagamento
- **OWASP**: Boas práticas de segurança

## Alto Nível vs Detalhes de Implementação

**PRINCÍPIO CRÍTICO**: TDDs documentam **decisões de arquitetura e contratos**, NÃO código de implementação.

### ✅ O Que Incluir (Alto Nível)

| Categoria             | Incluir                          | Exemplo                                                              |
| --------------------- | -------------------------------- | -------------------------------------------------------------------- |
| **Contratos de API**  | Schemas de request/response      | `POST /subscriptions` com estrutura do body JSON                     |
| **Schemas de Dados**  | Estruturas de tabela, tipos      | Tabela `BillingCustomer` com campos: id, email, stripeId             |
| **Arquitetura**       | Componentes, fluxo de dados      | "Frontend → API → Service → Stripe → Database"                       |
| **Decisões**          | Qual tecnologia, por que escolhida | "Stripe porque: suporte global, compliance PCI, melhor documentação" |
| **Diagramas**         | Sequência, arquitetura, fluxo    | Diagramas Mermaid/PlantUML mostrando interações                      |
| **Estruturas**        | Formato de log, schemas de eventos | Estrutura JSON para logging estruturado                              |
| **Estratégias**       | Abordagem, não comandos          | "Rollback via feature flag" (não o comando curl)                     |

### ❌ O Que Evitar (Código de Implementação)

| Categoria                    | Evitar                                   | Por quê                                              |
| ---------------------------- | ---------------------------------------- | ---------------------------------------------------- |
| **Comandos CLI**             | `nx db:generate`, `kubectl rollout undo` | Específico demais, muda com o ferramental            |
| **Trechos de código**        | Implementação TypeScript/JavaScript      | Pertence ao código, não à documentação               |
| **Específicos de framework** | `@Injectable()`, `extends Repository`    | O framework pode mudar; a decisão é o que importa    |
| **Caminhos de arquivo**      | `scripts/backfill-feature.ts`            | Detalhe de implementação, não decisão arquitetural   |
| **Sintaxe de ferramenta**    | Decorators NestJS, entities TypeORM      | Documente o padrão, não a implementação              |

### Teste de Ouro: "Isso Vai Mudar?"

Antes de adicionar um detalhe ao TDD, pergunte:

- **"Se trocarmos de framework, esse detalhe ainda se aplica?"**
  - SIM → Incluir (é decisão arquitetural)
  - NÃO → Excluir (é detalhe de implementação)

- **"Alguém pode implementar de outra forma e ainda atender o requisito?"**
  - SIM → Foque no requisito, não na implementação
  - NÃO → Você pode estar sendo específico demais

**Meta**: o TDD deve sobreviver a mudanças de implementação. Se o projeto migrar de NestJS para Express, ou de TypeORM para Prisma, o TDD deve continuar válido.

Para exemplos completos de bom vs ruim, leia `references/exemplos.md`.

## Estrutura do Documento

Os templates completos de todas as seções estão em `references/templates.md`. **Leia esse arquivo antes de gerar o documento.**

### Seções Obrigatórias (Must Have)

Estas seções são **obrigatórias**. Se o usuário não fornecer as informações, você **deve perguntar**:

1. **Cabeçalho e Metadados**
2. **Contexto**
3. **Definição do Problema e Motivação**
4. **Escopo** (Dentro do Escopo / Fora do Escopo)
5. **Solução Técnica**
6. **Riscos**
7. **Plano de Implementação**

### Seções Críticas (Pergunte se Faltarem)

**Altamente recomendadas**, e obrigatórias para:

- Integrações de pagamento (Segurança é OBRIGATÓRIA)
- Sistemas em produção (Monitoramento e Rollback são OBRIGATÓRIOS)
- Integrações externas (Dependências, Segurança)

8. **Considerações de Segurança** (OBRIGATÓRIA para pagamentos/auth/PII)
9. **Estratégia de Testes**
10. **Monitoramento e Observabilidade**
11. **Plano de Rollback**

### Seções Sugeridas (Ofereça ao Usuário)

Pergunte: "Quer adicionar estas seções agora ou depois?"

12. **Métricas de Sucesso**
13. **Glossário e Termos de Domínio**
14. **Alternativas Consideradas**
15. **Dependências**
16. **Requisitos de Performance**
17. **Plano de Migração** (se aplicável)
18. **Questões em Aberto**
19. **Roadmap / Cronograma**
20. **Aprovações e Sign-off**

## Adaptação ao Tamanho do Projeto

Use esta heurística para determinar a complexidade:

### Projeto Pequeno (< 1 semana)

**Use as seções**: 1, 2, 3, 4, 5, 6, 7, 9

**Pule**: Alternativas, Plano de Migração, Aprovações

### Projeto Médio (1-4 semanas)

**Use as seções**: 1-11, 15, 18

**Ofereça**: Métricas de Sucesso, Glossário, Alternativas, Performance

### Projeto Grande (> 1 mês)

**Use todas as seções** (1-20)

**Crítico**: todas as seções obrigatórias + críticas devem estar detalhadas

## Workflow Interativo

### Passo 1: Levantamento Inicial

Colete as informações básicas perguntando ao usuário (use a ferramenta de perguntas interativas se disponível no ambiente; caso contrário, pergunte em conversa natural):

1. **Nome do projeto**: Qual o nome da feature/integração/projeto?
2. **Tamanho do projeto**: Pequeno (< 1 semana) / Médio (1-4 semanas) / Grande (> 1 mês)?
3. **Tipo do projeto** (pode marcar mais de um):
   - Integração externa (API, serviço)
   - Nova feature
   - Refatoração/migração
   - Infraestrutura/plataforma
   - Sistema de pagamento/billing
   - Autenticação/autorização
   - Migração/processamento de dados
4. **Contexto**: Você já tem o problema e o contexto claros? (Sim / Parcialmente / Não)

Se a conversa já contém essas informações (ex.: o usuário descreveu a feature antes de pedir o TDD), extraia da conversa primeiro e confirme apenas as lacunas — não pergunte o que já foi dito.

### Passo 2: Validar Informações Obrigatórias

Com base nas respostas, verifique se o usuário pode fornecer:

**Campos OBRIGATÓRIOS a perguntar se faltarem**:

- Tech Lead / Responsável
- Membros do time
- Descrição do problema (o quê / por quê / impacto)
- O que está dentro do escopo
- O que está fora do escopo
- Abordagem de solução em alto nível
- Pelo menos 3 riscos
- Quebra do plano de implementação em tarefas

**Modelo de pergunta** (adapte ao idioma do usuário):

```
Preciso das seguintes informações para criar o TDD:

1. **Definição do Problema**:
   - Que problema estamos resolvendo?
   - Por que isso é importante agora?
   - O que acontece se não resolvermos?

2. **Escopo**:
   - O que SERÁ entregue neste projeto?
   - O que NÃO será incluído (fora do escopo)?

3. **Abordagem Técnica**:
   - Descrição de alto nível da solução
   - Principais componentes envolvidos
   - Pontos de integração

Você pode fornecer essas informações?
```

### Passo 3: Verificar Seções Críticas

Com base no tipo de projeto, determine se seções críticas são obrigatórias:

| Tipo de Projeto    | Seções Críticas Exigidas                          |
| ------------------ | ------------------------------------------------- |
| Pagamento, Auth    | **Considerações de Segurança** (OBRIGATÓRIA)      |
| Qualquer produção  | **Monitoramento e Observabilidade** (OBRIGATÓRIA) |
| Qualquer produção  | **Plano de Rollback** (OBRIGATÓRIO)               |
| Integração externa | **Dependências**, **Segurança**                   |
| Todos              | **Estratégia de Testes** (altamente recomendada)  |

**Se faltarem seções críticas, PERGUNTE**:

```
Este é um sistema de [pagamento/autenticação/produção]. Estas seções são CRÍTICAS:

❗ **Considerações de Segurança** - Obrigatório para compliance (PCI DSS, OWASP, LGPD)
❗ **Monitoramento e Observabilidade** - Obrigatório para detectar problemas em produção
❗ **Plano de Rollback** - Obrigatório para reverter se algo falhar

Você pode fornecer:
1. Requisitos de segurança (autenticação, criptografia, tratamento de PII)?
2. Quais métricas você vai monitorar?
3. Como você fará rollback se algo der errado?
```

### Passo 4: Oferecer Seções Sugeridas

Após cobrir as obrigatórias, **ofereça as opcionais**:

```
Também posso adicionar estas seções para tornar o TDD mais completo:

📊 **Métricas de Sucesso** - Como você vai medir o sucesso?
📚 **Glossário** - Definir termos específicos do domínio
⚖️ **Alternativas Consideradas** - Por que esta abordagem e não outras?
🔗 **Dependências** - Serviços/times externos necessários
⚡ **Requisitos de Performance** - Latência, throughput, disponibilidade
📋 **Questões em Aberto** - Rastrear decisões pendentes

Gostaria que eu adicionasse alguma dessas agora? (Você pode adicionar depois)
```

### Passo 5: Gerar o Documento

1. Leia `references/templates.md` e gere o TDD em Markdown seguindo os templates.
2. **Local de salvamento**: pergunte ou siga a convenção do projeto. Padrão sugerido: `docs/tdd/tdd-<nome-da-feature>.md`. Se o projeto usa workflow spec-driven (diretório `.specs/`), ofereça salvar junto da spec correspondente.
3. **Versionamento**: inclua a tabela de metadados com `Última Atualização` e mantenha um changelog ao final do documento quando o TDD for revisado (data + resumo da mudança).

### Passo 6: Oferecer Integrações

Se o usuário tiver integrações disponíveis (Confluence, Jira, etc.), ofereça:

```
Gostaria que eu publicasse este TDD no Confluence?
- Posso criar uma nova página no seu espaço
- Ou atualizar uma página existente
```

## Regras de Validação

### Checklist de Seções Obrigatórias

Antes de finalizar o TDD, garanta:

- [ ] **Cabeçalho**: Tech Lead, Time e link da Epic presentes
- [ ] **Contexto**: 2+ parágrafos descrevendo background e domínio
- [ ] **Problema**: pelo menos 2 problemas específicos identificados, com impacto
- [ ] **Escopo**: itens claros dentro e fora do escopo (mínimo 3 de cada)
- [ ] **Solução Técnica**: diagrama de arquitetura ou descrição
- [ ] **Solução Técnica**: pelo menos 1 endpoint de API definido
- [ ] **Riscos**: pelo menos 3 riscos com impacto/probabilidade/mitigação
- [ ] **Plano de Implementação**: quebrado em fases com estimativas

### Checklist de Seções Críticas (por tipo de projeto)

**Se for projeto de Pagamento/Auth**:

- [ ] **Segurança**: método de autenticação definido
- [ ] **Segurança**: criptografia (at rest, in transit) especificada
- [ ] **Segurança**: abordagem de tratamento de PII documentada
- [ ] **Segurança**: requisitos de compliance identificados (LGPD, PCI DSS, GDPR)

**Se for sistema em Produção**:

- [ ] **Monitoramento**: pelo menos 3 métricas definidas com thresholds
- [ ] **Monitoramento**: alertas configurados
- [ ] **Rollback**: gatilhos de rollback definidos
- [ ] **Rollback**: passos de rollback documentados

**Todos os projetos**:

- [ ] **Testes**: pelo menos 2 tipos de teste definidos (unit, integration, e2e)
- [ ] **Testes**: cenários críticos de teste listados

## Formato de Saída

### Ao Criar o TDD

1. **Gere o documento Markdown**
2. **Valide contra os checklists acima**
3. **Destaque seções críticas faltantes**
4. **Forneça um resumo ao usuário**:

```
✅ TDD Criado: "[Nome do Projeto]"

**Seções Incluídas**:
✅ Obrigatórias (7/7): Todas presentes
✅ Críticas (3/4): Segurança, Testes, Monitoramento
⚠️ Faltando: Plano de Rollback (recomendado para produção)

**Próximos Passos Sugeridos**:
- Adicionar a seção de Plano de Rollback (crítica para produção)
- Revisar a seção de Segurança com o time de InfoSec
- Criar a Epic no Jira e vincular nos metadados
- Agendar reunião de revisão do TDD com stakeholders

Gostaria que eu:
1. Adicionasse a seção de Plano de Rollback que está faltando?
2. Publicasse este TDD no Confluence?
3. Criasse uma Epic no Jira para este projeto?
```

## Anti-Patterns Comuns

Os exemplos completos de anti-patterns (problema vago, escopo indefinido, segurança ausente, sem rollback) com versões BOA vs RUIM estão em `references/exemplos.md`. Consulte esse arquivo ao revisar a qualidade do documento gerado.

## Notas Importantes

- **Respeite o idioma do usuário** — detecte automaticamente e gere o TDD no mesmo idioma da solicitação
- **Foque em arquitetura, não em implementação** — documente decisões e contratos, não código
- **Exemplos apenas em alto nível** — contratos de API, schemas de dados, diagramas (não comandos CLI nem trechos de código)
- **Sempre valide as seções obrigatórias** — não deixe o usuário pulá-las
- **Para pagamentos/auth** — a seção de Segurança é OBRIGATÓRIA
- **Para produção** — Monitoramento e Rollback são OBRIGATÓRIOS
- **Pergunte para esclarecer** — não invente informações faltantes (pergunte no idioma do usuário)
- **Seja completo mas pragmático** — projetos pequenos não precisam das 20 seções
- **Atualize o documento** — TDDs devem evoluir junto com o projeto (use o changelog)
- **Use padrões da indústria** — referencie Google, Amazon, padrões RFC e ADR
- **Pense em compliance** — LGPD, GDPR, PCI DSS, HIPAA quando aplicável
- **Teste a longevidade** — se o framework de implementação mudar, o TDD deve continuar válido

## Exemplos de Prompts que Disparam Esta Skill

### Português

- "Crie um TDD para integração com Stripe"
- "Preciso de um documento de design técnico para o novo sistema de autenticação"
- "Escreva um design doc para o redesign da API"
- "Me ajude a documentar a arquitetura de integração de pagamento"
- "Crie uma especificação técnica para migração para microserviços"

### English

- "Create a TDD for Stripe integration"
- "I need a technical design document for the new auth system"
- "Write a design doc for the API redesign"

### Español

- "Crea un TDD para integración con Stripe"
- "Necesito un documento de diseño técnico para el nuevo sistema de autenticación"

## Arquivos de Referência

- `references/templates.md` — Templates completos das 20 seções do TDD (leia antes de gerar o documento)
- `references/exemplos.md` — Exemplos de bom vs ruim e anti-patterns comuns

## Referências Externas

- [Google Engineering Practices](https://google.github.io/eng-practices/)
- [Google SRE Book](https://sre.google/sre-book/table-of-contents/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Architecture Decision Records](https://adr.github.io/)
