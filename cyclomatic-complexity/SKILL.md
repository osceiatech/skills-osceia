---
name: cyclomatic-complexity
description: >
  Analisa, calcula e refatora complexidade ciclomática em projetos Angular/TypeScript.
  Use esta skill SEMPRE que o usuário pedir para: analisar complexidade de código,
  refatorar funções com muitos ifs/switches/loops, verificar se uma função está complexa
  demais, gerar configuração de ESLint para limitar complexidade, gerar testes unitários
  para cobrir caminhos independentes, ou quando o usuário mencionar termos como
  "complexidade ciclomática", "código espaguete", "muitos ifs", "função muito grande",
  "difícil de testar", "refatorar lógica condicional" em projetos Angular ou TypeScript.
---

# Cyclomatic Complexity — Angular/TypeScript

## O que é Complexidade Ciclomática

Conta os **caminhos independentes** de execução dentro de uma função.
Fórmula simples: **CC = 1 + número de decisões**

Cada um desses tokens incrementa em +1:
`if` · `else if` · `? :` (ternário) · `&&` · `||` · `??` · `for` · `while` · `do` · `switch/case` · `catch`

Limites de referência:
| CC | Classificação | Ação |
|----|--------------|------|
| 1–5 | ✅ Simples | Nenhuma |
| 6–10 | ⚠️ Moderada | Considerar refatoração |
| 11–20 | 🔴 Alta | Refatorar obrigatoriamente |
| > 20 | 💀 Inaceitável | Reescrever |

O limite recomendado para o ESLint é **10**.

---

## Workflow de Análise

### 1. Calcular a complexidade

Ao receber um trecho de código, siga este processo:

1. Identifique cada função/método individualmente (incluindo arrow functions em propriedades de classe)
2. Para cada função, liste os pontos de decisão com o número da linha aproximada
3. Calcule: CC = 1 + total de decisões
4. Classifique conforme a tabela acima
5. Apresente o resultado em formato de tabela

**Exemplo de output esperado:**

```
Função: calcularDesconto(usuario, valor)
Decisões encontradas:
  - Linha 2: if (usuario.estaAtivo)       → +1
  - Linha 3: if (usuario.tipo === 'VIP')  → +1
  - Linha 5: else                         → +1
CC Total: 1 + 3 = 4 ⚠️ Moderada
```

### 2. Sugerir refatorações (quando CC > 5)

Aplicar as técnicas abaixo em ordem de preferência para Angular/TypeScript:

#### Técnica A — Early Return (Guard Clauses)
Inverter condições para sair cedo, eliminando aninhamento.

```typescript
// ❌ Antes (CC: 4)
function processar(usuario: Usuario): string {
  if (usuario.ativo) {
    if (usuario.verificado) {
      return usuario.nome.toUpperCase();
    }
  }
  return '';
}

// ✅ Depois (CC: 2)
function processar(usuario: Usuario): string {
  if (!usuario.ativo) return '';
  if (!usuario.verificado) return '';
  return usuario.nome.toUpperCase();
}
```

#### Técnica B — Tabela de Decisão (Object Lookup)
Substituir switch/if-else chains por objetos ou Maps.

```typescript
// ❌ Antes (CC: 5)
function getDesconto(tipo: string): number {
  if (tipo === 'VIP') return 0.20;
  else if (tipo === 'GOLD') return 0.15;
  else if (tipo === 'SILVER') return 0.10;
  else return 0;
}

// ✅ Depois (CC: 1)
const DESCONTOS: Record<string, number> = {
  VIP: 0.20,
  GOLD: 0.15,
  SILVER: 0.10,
};
function getDesconto(tipo: string): number {
  return DESCONTOS[tipo] ?? 0;
}
```

#### Técnica C — Extração de Função
Mover blocos lógicos coesos para funções privadas com nome semântico.

```typescript
// ❌ Antes (CC: 6 na função pai)
calcularTotal(pedido: Pedido): number {
  let total = pedido.itens.reduce((s, i) => s + i.preco, 0);
  if (pedido.cupom && pedido.cupom.ativo && pedido.cupom.validade > new Date()) {
    total = total * (1 - pedido.cupom.desconto);
  }
  return total;
}

// ✅ Depois (CC: 2 em cada função)
private isCupomValido(cupom: Cupom | null): boolean {
  return !!cupom && cupom.ativo && cupom.validade > new Date();
}

calcularTotal(pedido: Pedido): number {
  const subtotal = pedido.itens.reduce((s, i) => s + i.preco, 0);
  return this.isCupomValido(pedido.cupom)
    ? subtotal * (1 - pedido.cupom!.desconto)
    : subtotal;
}
```

#### Técnica D — Polimorfismo / Strategy (para switch em tipos)
Quando `switch` ou `if-else` testa o tipo/papel de um objeto, considerar Strategy Pattern ou Angular DI.

```typescript
// ❌ Antes — switch sobre tipo de notificação (CC: 5)
enviar(notif: Notificacao): void {
  switch (notif.tipo) {
    case 'email': this.emailService.send(notif); break;
    case 'sms': this.smsService.send(notif); break;
    case 'push': this.pushService.send(notif); break;
  }
}

// ✅ Depois — injetar strategy por token (CC: 1)
// Cada serviço implementa NotificacaoStrategy
enviar(notif: Notificacao): void {
  this.strategies.get(notif.tipo)?.send(notif);
}
```

---

### 3. Gerar configuração do ESLint

Quando o usuário pedir a config do ESLint, detectar qual formato o projeto usa:
- Se há `eslint.config.js` (ou `.mjs`) → formato **Flat Config** (ESLint ≥ 9)
- Se há `.eslintrc.json` / `.eslintrc.js` → formato **Legacy**
- Em projetos Angular modernos (v17+), o padrão é **Flat Config**

**Flat Config (`eslint.config.js` / `eslint.config.mjs`):**
```javascript
// @ts-check
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...tseslint.configs.recommended,
  {
    rules: {
      // Limite máximo de complexidade ciclomática
      'complexity': ['error', 10],
    },
  }
);
```

**Legacy (`.eslintrc.json`):**
```json
{
  "rules": {
    "complexity": ["error", 10]
  }
}
```

**Importante:** A regra `complexity` é nativa do ESLint — não precisa de plugin extra.
Ao rodar `npm run lint`, qualquer função que ultrapassar CC 10 quebrará o build.

---

### 4. Gerar testes unitários (Jest / Jasmine)

A complexidade ciclomática determina o **número mínimo de testes** necessários:
> **Testes mínimos = CC da função**

Para cada função analisada, gerar um `describe` com um caso de teste por caminho independente.

**Template de teste para Angular (Jest):**
```typescript
describe('NomeDoServico - nomeDoMetodo', () => {
  let service: NomeDoServico;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [NomeDoServico] });
    service = TestBed.inject(NomeDoServico);
  });

  // --- Caminho 1: [descrever condição] ---
  it('deve [resultado esperado] quando [condição]', () => {
    // Arrange
    const input = /* valor que aciona este caminho */;
    // Act
    const result = service.nomeDoMetodo(input);
    // Assert
    expect(result).toBe(/* valor esperado */);
  });

  // Repetir para cada caminho independente (CC vezes)
});
```

Ao gerar os testes:
1. Listar explicitamente **qual caminho** cada `it` cobre
2. Garantir que o conjunto cobre **todos os branches** (100% branch coverage)
3. Nomear os testes no formato: `'deve [comportamento] quando [condição]'`

---

## Como Usar

A skill é ativada automaticamente quando você menciona complexidade ciclomática, código com muitos ifs, ou refatoração de lógica condicional em Angular/TypeScript. Basta colar o código e pedir o que precisa:

**Analisar um componente ou serviço:**
> "Analisa a complexidade ciclomática desse componente" + cole o código

**Refatorar funções complexas:**
> "Esse método tem muitos ifs, refatora pra reduzir a complexidade" + cole o código

**Gerar config do ESLint:**
> "Gera a config do ESLint pra limitar complexidade ciclomática no meu projeto Angular"

**Gerar testes unitários:**
> "Gera os testes unitários cobrindo todos os caminhos dessa função" + cole o código

**Tudo junto:**
> "Analisa esse serviço, refatora o que estiver acima de 10, configura o ESLint e gera os testes"

---

## Checklist de Entrega

Ao finalizar a análise de um trecho de código, sempre entregar:

- [ ] Tabela com CC de cada função
- [ ] Funções acima de 5: refatoração proposta com antes/depois
- [ ] Config ESLint (se solicitado ou se CC > 10 em alguma função)
- [ ] Testes unitários mínimos cobrindo todos os caminhos (se solicitado)
- [ ] Comentário se alguma função está próxima do limite (CC 8–10): avisar preventivamente
