# Especificação de Funcionalidade: [NOME DA FUNCIONALIDADE]

**Diretório**: `specs/[NNN-nome-curto]/` | **Data**: [DATA] | **Branch**: `[NNN-nome-curto]`

> Escreva para a coordenação e parceiros, não para desenvolvedores. Foque no **o quê** e no
> **por quê**. **Não** mencione framework, biblioteca, banco ou estrutura de código aqui —
> isso fica no plano. Seções marcadas (obrigatória) não podem ser removidas.

## Visão Geral *(obrigatória)*

[Uma a três frases: que problema esta funcionalidade resolve e para quem.]

## Cenários de Usuário *(obrigatória)*

### História principal

[Como [tipo de usuário], quero [ação], para [benefício].]

### Cenários de aceitação

1. **Dado** [contexto], **quando** [ação], **então** [resultado esperado].
2. ...

### Casos de borda

- [O que acontece quando ...? / Como o sistema reage a ...?]

## Requisitos Funcionais *(obrigatória)*

Cada requisito deve ser testável e sem ambiguidade.

- **RF-001**: O sistema DEVE [comportamento verificável].
- **RF-002**: O sistema DEVE [comportamento verificável].
- *(Use [PRECISA CLARIFICAR: pergunta] — no máximo 3 — só quando não houver default razoável.)*

## Critérios de Sucesso *(obrigatória)*

Mensuráveis e independentes de tecnologia.

- **CS-001**: [ex.: "O aprendiz conclui o cadastro em menos de 2 minutos."]
- **CS-002**: ...

## Acessibilidade *(obrigatória — Princípio II)*

- Nível-alvo: **WCAG 2.1 AA**; AXE sem violações críticas/sérias.
- Fluxos que precisam funcionar por teclado: [listar].
- Considerações de leitor de tela / contraste / foco: [descrever ou "padrão da organização"].

## Privacidade e LGPD *(obrigatória quando há dados pessoais — Princípio V)*

- Dados pessoais coletados: [listar] | Envolve menores? [sim/não]
- Base legal: [consentimento / execução de contrato / obrigação legal / ...]
- Retenção e acesso: [quem acessa, por quanto tempo].
- *(Se não houver dados pessoais, escreva "Não aplicável" e justifique em uma linha.)*

## Entidades-Chave *(incluir se houver dados)*

- **[Entidade]**: [o que representa, atributos relevantes — sem detalhe de schema].

## Premissas e Dependências

- Premissas assumidas como default: [listar].
- Dependências de outras funcionalidades, parceiros ou integrações: [listar].

## Fora de Escopo

- [O que esta funcionalidade explicitamente NÃO faz.]
