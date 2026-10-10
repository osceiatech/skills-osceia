# Regras para Geração de Mensagens de Commit

1. **Idioma:** Escreva TODAS as mensagens de commit em Português (PT-BR).
2. **Formato:** Siga estritamente o padrão Conventional Commits: `<tipo>(<escopo>): <descrição curta>`.
3. **Tipos Permitidos:**
  - `feat`: Uma nova funcionalidade.
  - `fix`: Correção de um bug.
  - `refactor`: Mudança de código que não corrige um bug nem adiciona uma funcionalidade (ex: refatoração de Standalone Components).
  - `style`: Formatação, pontos e vírgulas faltando, etc (sem mudança na lógica).
  - `docs`: Alterações apenas na documentação.
  - `perf`: Mudança de código que melhora a performance (ex: otimização de Signals).
  - `chore`: Atualização de dependências ou ferramentas de build.
4. **Tamanho:** A primeira linha (título) deve ter no máximo 72 caracteres.
5. **Corpo do Commit:** Se a alteração for complexa, adicione uma linha em branco após o título e explique o "porquê" da mudança em tópicos usando bullet points (`-`).
6. **Tom:** Use o verbo no imperativo na descrição curta (ex: "adiciona", "corrige", em vez de "adicionado" ou "corrigido").
