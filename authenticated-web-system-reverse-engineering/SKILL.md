---
name: authenticated-web-system-reverse-engineering
description: Orquestra engenharia reversa funcional e estrutural de sistemas web autenticados com navegação segura, Playwright/CDP e Crawlee opcional. Use quando for preciso inventariar menus, rotas, formulários, tabelas, regras, processos e lacunas de um sistema existente sem copiar dados pessoais nem alterar registros.
version: 1.0.0
author: OSCEIA
license: MIT
metadata:
  hermes:
    tags: [reverse-engineering, web, playwright, crawlee, lgpd, process-analysis]
    related_skills: [business-process-analysis, ubiquitous-language, technical-design-doc-creator]
---

# Engenharia reversa segura de sistemas web autenticados

## Visão geral

Transforme um sistema existente em evidências estruturais, processos AS-IS, regras de negócio e decisões arquiteturais. Use automação para a coleta mecânica; preserve a interpretação funcional para análise orientada a processos.

**Princípio:** mapear capacidades e regras, não clonar telas nem coletar registros reais.

## Quando usar

- Auditoria autorizada de aplicação web autenticada.
- Inventário de menus, rotas, formulários, tabelas, relatórios e integrações.
- Descoberta de entidades, campos transversais e duplicações entre módulos.
- Preparação de migração, substituição ou modularização de sistema legado.
- Comparação entre sistema de referência, solução atual e necessidade futura.

Não use para pentest, bypass de autenticação, scraping de dados pessoais, automação transacional ou exploração sem autorização.

## Gate 0 — Autorização e escopo

Antes de navegar, registre no plano de avaliação:

1. sistema e ambiente autorizados;
2. módulos e rotas permitidos;
3. responsáveis funcional e técnico;
4. modo padrão `read_only`;
5. dados que não podem ser coletados;
6. ações proibidas;
7. critério de parada e janela de execução.

Use `templates/assessment-plan.md`. Não prossiga sem escopo identificável. Leia `references/safety-and-read-only.md` antes de automatizar qualquer aplicação operacional.

**Concluído quando:** origem, escopo, modo, proibições e responsável estão documentados.

## Gate 1 — Escolher o motor mínimo

Use a menor ferramenta que resolva o caso:

| Situação | Escolha |
|---|---|
| Poucas páginas públicas e HTML estático | HTTP/HTML simples |
| Muitas páginas HTML, fila, retries e retomada | Crawlee + Cheerio |
| Aplicação JavaScript | Playwright |
| Login manual e Chrome já autenticado | Playwright via CDP |
| Muitas rotas autenticadas e execução repetível | Playwright + orquestração Crawlee, após piloto |
| Formulário condicional ou fluxo crítico | Playwright dirigido, baixa concorrência e HITL |

Crawlee é opcional. Não o instale globalmente nem o incorpore à skill. Se necessário, faça piloto isolado, fixe versão, preserve lockfile, rode auditoria e smoke test. Veja `references/orchestration-strategy.md`.

**Concluído quando:** a escolha e sua justificativa constam no plano.

## Gate 2 — Preparar sessão segura

1. Crie perfil de navegador isolado.
2. Inicie Chrome com porta CDP dedicada.
3. Peça ao usuário para autenticar manualmente; nunca solicite senha ou token.
4. Reutilize a sessão apenas no escopo autorizado.
5. Instale bloqueio de métodos mutantes e bloqueio semântico de ações perigosas.
6. Faça uma navegação de prova em página inócua.

Não grave cookies, headers de autenticação, local storage ou credenciais nas evidências.

**Concluído quando:** página autenticada inócua abre, identidade não foi persistida e bloqueios estão ativos.

## Gate 3 — Descoberta controlada

1. Extraia a árvore de menus sem clicar em ações.
2. Normalize caminhos e remova duplicidades.
3. Classifique cada rota: listagem, detalhe, formulário, relatório, dashboard, erro ou desconhecida.
4. Separe rotas navegáveis de rotas que exigem IDs/parâmetros.
5. Crie allowlist antes do crawl estrutural.

Não presuma que `GET` é seguro: sistemas legados podem executar mutações por links. Rotas com verbos como excluir, cancelar, aprovar, encerrar, gerar ou salvar exigem revisão humana.

**Concluído quando:** há uma fila deduplicada, classificada e limitada ao escopo.

## Gate 4 — Crawl estrutural

Para cada rota autorizada, capture apenas metadados:

- caminho, menu de origem, status e tipo de acesso;
- labels e botões, sem valores adjacentes;
- controles: tag, tipo, nome técnico, id, obrigatoriedade, estado e quantidade de opções;
- tabelas: nomes das colunas e quantidade, nunca células;
- formulários: método e caminho da ação, sem payload;
- links internos normalizados;
- erros, duração e número de tentativas.

Use o envelope de `templates/evidence-envelope.json`. Não capture `innerText`, HTML integral, screenshots indiscriminados, valores de inputs, linhas de tabela ou respostas de API.

Valide imediatamente:

```bash
python authenticated-web-system-reverse-engineering/scripts/validate_evidence.py caminho/evidence.json
```

Se o validador encontrar PII ou chaves proibidas, interrompa, corrija o extrator e gere evidência limpa novamente. Não “limpe depois” mantendo o original inseguro.

**Concluído quando:** todas as rotas têm resultado terminal e o validador retorna zero erros.

## Gate 5 — Análise dinâmica dirigida

Explore formulários progressivos somente quando a estrutura estática for insuficiente:

1. escolha casos fictícios ou opções sem persistência;
2. fotografe o estado estrutural antes da interação;
3. altere uma variável por vez;
4. registre campos exibidos/ocultos e requisições pretendidas;
5. bloqueie submissões e confirme que nenhum registro foi alterado;
6. encaminhe ações ambíguas para HITL.

A ausência de botão “Salvar” não prova segurança; eventos `change`, autosave e endpoints GET podem mutar estado.

**Concluído quando:** cada regra condicional observada tem condição, efeito, evidência e nível de confiança.

## Gate 6 — Síntese funcional

Transforme páginas em capacidades e jornadas:

```text
menu/rota → tarefa → ator → estado → regra → documento → integração → indicador
```

Produza:

- inventário de módulos e capacidades;
- jornadas AS-IS e exceções;
- entidades e dados mestres;
- estados e transições;
- permissões e responsabilidades;
- campos transversais e duplicações;
- integrações e documentos;
- dificuldades e controles paralelos;
- classificação Manter / Melhorar / Substituir / Descartar;
- matriz sistema de referência × sistema atual × necessidade futura.

Campos repetidos são evidência de possível transversalidade, não prova de que representam a mesma entidade. Valide com responsáveis operacionais.

**Concluído quando:** toda conclusão relevante aponta para evidência e separa observado, inferido e pendente de validação.

## Gate 7 — Catálogos e verificação

Gere artefatos derivados somente depois de validar a evidência:

```bash
python authenticated-web-system-reverse-engineering/scripts/build_catalogs.py \
  caminho/evidence.json --output caminho/artefatos
```

Verifique:

- contagem de rotas descobertas, processadas, falhas e excluídas;
- nenhuma URL fora do escopo;
- nenhuma mutação registrada;
- zero PII/segredos nas evidências e relatórios;
- amostra manual de páginas de cada categoria;
- falhas 401/403/404/500 diferenciadas de rotas parametrizadas;
- decisões arquiteturais rastreáveis às evidências;
- limitações e lacunas explicitadas.

## Artefatos mínimos

- plano de avaliação e autorização;
- árvore de menus e fila de rotas;
- envelope de evidências validado;
- catálogo de páginas;
- índice técnico de campos;
- resumo quantitativo;
- relatório funcional AS-IS;
- matriz de gaps e decisões;
- backlog de validações humanas;
- registro de ferramentas, versões e limitações.

## Armadilhas comuns

1. **Confundir crawl com engenharia reversa.** Crawl coleta estrutura; análise explica processos e regras.
2. **Guardar texto integral “para analisar depois”.** Ele frequentemente contém nome, CNPJ, CPF e dados operacionais.
3. **Clicar para descobrir.** Primeiro inspecione DOM, destino, método e listeners; ações ambíguas são HITL.
4. **Usar navegador onde HTTP basta.** Comece leve e escale apenas por necessidade comprovada.
5. **Adicionar Crawlee cedo demais.** Para uma auditoria única e pequena, Playwright direto pode ser mais simples.
6. **Tratar erro como módulo inexistente.** Diferencie falha real, permissão, sessão expirada e rota que requer ID.
7. **Copiar o legado.** Modele o processo desejado; não replique limitações de telas antigas.

## Checklist de conclusão

- [ ] Escopo e autorização documentados
- [ ] Motor mínimo escolhido e versões registradas
- [ ] Sessão autenticada sem credenciais persistidas
- [ ] Allowlist e bloqueios de mutação ativos
- [ ] Inventário deduplicado e crawl retomável quando necessário
- [ ] Evidências validadas sem PII, segredos ou valores de registros
- [ ] Resultados quantitativos reconciliados
- [ ] Regras observadas separadas de inferências
- [ ] AS-IS, gaps e decisões vinculados a evidências
- [ ] Nenhuma alteração operacional realizada
