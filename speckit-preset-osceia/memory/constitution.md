# Constituição — Projetos OSCEIA / Fóton

> Documento-base de governança técnica. Copie para `.specify/memory/constitution.md`
> ao iniciar um projeto e ajuste o que for específico daquele projeto. Os princípios
> abaixo são vinculantes: `specify plan`, `tasks` e `implement` devem respeitá-los, e
> qualquer desvio precisa ser justificado explicitamente no plano.

## Princípios Fundamentais

### I. Especificação antes do código (SDD)

Toda funcionalidade começa por uma especificação que descreve **o que** e **por quê**,
nunca **como**. A spec é escrita para stakeholders não-técnicos (coordenação, parceiros,
educadores) e não menciona framework, biblioteca ou estrutura de código. O plano técnico
só é gerado depois da spec validada. Código sem spec correspondente é considerado dívida,
não entrega.

### II. Acessibilidade é não-negociável

Toda interface entregue deve atender **WCAG 2.1 nível AA** e passar limpa no AXE (zero
violações críticas ou sérias). Isso inclui: contraste mínimo, navegação completa por
teclado, foco visível, rótulos em todos os campos de formulário, textos alternativos e
hierarquia semântica correta. Acessibilidade é critério de aceitação, não item de backlog
adiável.

### III. Padrões de frontend Angular

Componentes Angular são **standalone**, usam **signals** para estado e **OnPush/zoneless**
para detecção de mudança. A UI usa **PrimeNG + Tailwind 4** com design tokens — nada de
valores hard-coded de cor, espaçamento ou tipografia. Rotas seguem lazy loading. A estrutura
de pastas é orientada a feature. Lógica de dados fica em serviços; componentes ficam finos.

### IV. Backend, dados e integrações explícitos

Backend principal em **Laravel/Filament**. **Supabase** atua como banco auxiliar (com Edge
Functions quando aplicável) e **Firebase** para autenticação por telefone. Toda integração
externa (TwentyCRM, n8n, Chatwoot, Azure Blob, Meta Cloud API) é declarada como contrato
explícito no plano — endpoints, payloads e tratamento de erro documentados antes da
implementação. Nenhuma credencial em código ou em artefatos versionados.

### V. LGPD e privacidade desde o design

Dados pessoais — em especial de jovens aprendizes e menores — são tratados com privacy by
design. A spec deve identificar quais dados pessoais são coletados, a base legal, retenção
e quem tem acesso. Recursos que lidam com menores recebem revisão extra. Coleta de dados
sensíveis exige justificativa registrada na spec.

### VI. Qualidade verificável

Todo requisito funcional precisa de critério de aceitação testável e inequívoco. Critérios
de sucesso são mensuráveis e independentes de tecnologia (ex.: "usuário conclui o cadastro
em menos de 2 minutos", não "endpoint responde em 200ms"). Requisito que não passa no teste
"testável e sem ambiguidade" volta para clarificação.

### VII. Simplicidade e YAGNI

Comece simples. O agente de IA tende a superdimensionar — adicionar camadas, abstrações ou
dependências que ninguém pediu. Qualquer componente ou dependência além do mínimo necessário
para satisfazer a spec precisa de justificativa explícita no plano. Na dúvida, menos.

## Restrições Tecnológicas

- **Frontend**: Angular (standalone, signals, zoneless/OnPush), PrimeNG, Tailwind 4, LESS/design tokens.
- **Backend**: Laravel + Filament; PostgreSQL; Supabase como auxiliar; Azure (Blob/hospedagem).
- **Auth**: Firebase Phone Auth no app do aprendiz; padrões da organização nos demais.
- **Automação/integrações**: n8n, Chatwoot, TwentyCRM, Meta Cloud API.
- **Idioma dos artefatos**: todos os artefatos do spec-kit (spec, plan, tasks, checklists) em **português do Brasil**.

## Fluxo de Desenvolvimento e Quality Gates

1. `constitution` → confirmar/ajustar este documento para o projeto.
2. `specify` → spec em PT-BR, focada em o quê/por quê, validada contra o checklist de qualidade.
3. `clarify` → resolver ambiguidades **antes** do plano (obrigatório, salvo protótipo declarado).
4. `plan` → tecnologia conforme as Restrições acima; desvios justificados.
5. `tasks` → quebra ordenada por dependência, com TDD quando houver testes.
6. `analyze` / `checklist` → consistência entre artefatos e gate de acessibilidade/LGPD.
7. `implement` → ambiente pronto (Node, dotnet, etc. instalados conforme o projeto).

**Gates obrigatórios antes de `implement`**: spec validada, plano sem violação de princípio
não justificada, gate de acessibilidade previsto nas tasks, gate de LGPD para dados pessoais.

## Governança

Esta constituição prevalece sobre preferências individuais e sobre a sugestão default do
agente. Toda mudança de princípio exige: registro do motivo, aprovação do coordenador do
projeto e nota de versão abaixo. PRs e revisões devem verificar conformidade. Complexidade
não justificada é motivo para reprovar o plano.

**Versão**: 1.0.0 | **Ratificada**: 2026-06-17 | **Última emenda**: 2026-06-17
