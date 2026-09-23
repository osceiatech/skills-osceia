---
description: "Template de lista de tarefas para implementação de funcionalidade (OSCEIA/Fóton)"
---

# Tarefas: [NOME DA FUNCIONALIDADE]

**Entrada**: Documentos de design em `/specs/[NNN-nome-curto]/`

**Pré-requisitos**: plan.md (obrigatório), spec.md (obrigatório p/ histórias), research.md, data-model.md, contracts/

**Testes**: As tarefas de teste são OPCIONAIS — inclua apenas se solicitado na spec.

**Organização**: Tarefas agrupadas por história de usuário, para implementação e teste independentes.

## Formato: `[ID] [P?] [História] Descrição`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependência)
- **[História]**: A qual história a tarefa pertence (ex.: H1, H2, H3)
- Inclua caminhos de arquivo exatos nas descrições

<!--
  ============================================================================
  IMPORTANTE: As tarefas abaixo são EXEMPLOS ilustrativos.

  O comando __SPECKIT_COMMAND_TASKS__ DEVE substituí-las por tarefas reais com base em:
  - Histórias de usuário do spec.md (com prioridades P1, P2, P3...)
  - Requisitos do plan.md
  - Entidades do data-model.md
  - Endpoints de contracts/

  As Fases de Conformidade (Acessibilidade e LGPD) NÃO são opcionais e
  DEVEM ser mantidas em todo tasks.md gerado — são exigência da constituição
  (Princípios II e V). Remova apenas os exemplos das fases de história.
  ============================================================================
-->

## Fase 1: Setup (Infraestrutura Compartilhada)

- [ ] T001 Criar estrutura do projeto conforme o plano
- [ ] T002 Inicializar projeto [linguagem] com dependências [framework]
- [ ] T003 [P] Configurar lint, formatação e tokens de design

---

## Fase 2: Fundação (Pré-requisitos Bloqueantes)

**⚠️ CRÍTICO**: Nenhuma história pode começar antes desta fase concluir.

- [ ] T004 Configurar schema/migrações de banco
- [ ] T005 [P] Implementar autenticação/autorização (ex.: Firebase Phone Auth)
- [ ] T006 [P] Estrutura de rotas/serviços base
- [ ] T007 Modelos/entidades base compartilhados
- [ ] T008 Tratamento de erros e logging

**Checkpoint**: Fundação pronta — histórias podem começar.

---

## Fase 3: História 1 - [Título] (Prioridade: P1) 🎯 MVP

**Objetivo**: [O que esta história entrega]

**Teste Independente**: [Como verificar isoladamente]

### Implementação da História 1

- [ ] T010 [P] [H1] Criar modelo [Entidade] em [caminho]
- [ ] T011 [H1] Implementar [serviço/componente] em [caminho]
- [ ] T012 [H1] Validação e tratamento de erro

**Checkpoint**: História 1 funcional e testável de forma independente.

---

[Adicione mais fases de história seguindo o mesmo padrão]

---

## Fase N: Polimento e Preocupações Transversais

- [ ] TXXX [P] Atualizar documentação em docs/
- [ ] TXXX Refatoração e limpeza
- [ ] TXXX Otimização de performance

---

## Fase de Conformidade — Acessibilidade *(OBRIGATÓRIA — Princípio II)*

> Gate de qualidade. Não marcar a funcionalidade como concluída antes destes itens passarem.

- [ ] TA01 Auditar a UI com AXE — registrar resultado; **zero violações críticas ou sérias** para aprovar
- [ ] TA02 [P] Verificar navegação completa por teclado e foco visível nos fluxos definidos na spec
- [ ] TA03 [P] Verificar contraste mínimo, rótulos em formulários e textos alternativos (WCAG 2.1 AA)
- [ ] TA04 Corrigir as violações encontradas e reauditar até o AXE ficar limpo

**Checkpoint de Acessibilidade**: AXE limpo e fluxos-chave operáveis por teclado.

---

## Fase de Conformidade — LGPD *(OBRIGATÓRIA quando há dados pessoais — Princípio V)*

> Se a seção "Privacidade e LGPD" da spec marcou "Não aplicável", registre isso aqui e pule. Caso contrário, é gate.

- [ ] TL01 Conferir que os dados pessoais implementados batem com os declarados na spec (sem coleta não documentada)
- [ ] TL02 Confirmar base legal e finalidade para cada dado pessoal coletado
- [ ] TL03 [P] Verificar retenção, controle de acesso e que nenhum dado pessoal vaza em logs/URLs
- [ ] TL04 Revisão extra para dados de menores (aprendizes), se aplicável

**Checkpoint de LGPD**: dados conferidos, base legal registrada, sem vazamento em logs.

---

## Dependências e Ordem de Execução

- **Setup (Fase 1)**: sem dependências.
- **Fundação (Fase 2)**: depende do Setup — BLOQUEIA todas as histórias.
- **Histórias (Fase 3+)**: dependem da Fundação; podem ir em paralelo ou por prioridade (P1 → P2 → P3).
- **Polimento**: depois das histórias desejadas.
- **Conformidade (Acessibilidade e LGPD)**: rodam por último, **antes** de declarar a funcionalidade concluída. São gates obrigatórios.

### Dentro de cada história

- Testes (se houver) escritos e falhando antes da implementação
- Modelos antes de serviços; serviços antes de endpoints; núcleo antes da integração

---

## Estratégia de Implementação

1. Setup → Fundação (crítica) → História 1 (MVP) → **PARAR e VALIDAR**
2. Entrega incremental: cada história testada e entregue sem quebrar as anteriores
3. Antes de fechar: passar pelas duas Fases de Conformidade

---

## Notas

- [P] = arquivos diferentes, sem dependência
- [História] mapeia a tarefa à história para rastreabilidade
- As Fases de Conformidade não são removíveis; LGPD só é dispensada se a spec declarar ausência de dados pessoais
- Commit após cada tarefa ou grupo lógico
