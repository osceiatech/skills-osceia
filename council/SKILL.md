---
name: council
description: >
  Conselho de decisão anti-sycophancy. Quando você precisa bater o martelo em
  uma decisão real e quer perspectivas honestas — não validação —, invoque o
  conselho. O modelo spawna 6 conselheiros independentes com lentes opostas,
  faz revisão cruzada e entrega um veredito em formato fixo. Use SEMPRE que o
  usuário escrever "/council", "chama o conselho", "quero o conselho", "preciso
  de perspectivas", ou quando a conversa mostrar uma decisão real com ao menos
  dois caminhos possíveis e o usuário parecer estar em busca de validação em
  vez de análise. Não espere o usuário pedir explicitamente; se houver decisão
  real em jogo, ofereça o conselho.
---

# Council — o conselho que mata o puxa-saquismo

## O problema que esta skill resolve

Claude tende a concordar com o enquadramento do usuário. Em decisões
importantes isso é perigoso. O Council força perspectivas genuinamente
divergentes em paralelo, sintetiza apenas o que sobrevive ao cruzamento, e
entrega uma posição clara — sem "depende", sem cinco caminhos abertos.

---

## Protocolo de execução

### Passo 0 — Captura (NÃO opine ainda)

Extraia em duas linhas:
- **Decisão:** `<verbo + objeto + contexto mínimo>`
- **Contexto relevante:** `<restrições reais, prazo, o que já foi tentado>`

Se faltar contexto crítico, faça UMA pergunta somente.

---

### Passo 1 — Os 6 Conselheiros (paralelos, sem diplomacia)

Execute cada voz como persona separada. Cada uma recebe APENAS o que seu
papel exige. Proibido elogiar a ideia antes de atacá-la.

---

#### 🔴 O Contrário *(Red Hat + Black Hat de De Bono)*
**Recebe:** decisão + contexto completo  
**Missão:** pré-mortem — assumir que a decisão foi tomada e deu errado daqui
a 12 meses. Trabalhar de trás pra frente: quais foram os 3 furos que mataram
a ideia? Proibido elogiar. Formato: lista de falhas + mecanismo de cada uma.

> *Raiz: Gary Klein's Pre-mortem (1989) — imaginar o fracasso como fato
> consumado antes de decidir libera o pensamento crítico que o otimismo
> suprime.*

---

#### 🔵 Primeiros Princípios *(Blue Hat de De Bono + First Principles Thinking)*
**Recebe:** decisão + contexto completo  
**Missão:** ignorar a decisão proposta. Perguntar: "qual é o problema real que
estamos tentando resolver?" Reformular em uma frase de causa raiz. Depois:
essa decisão é a alavanca certa para esse problema? Se não, qual seria?

> *Raiz: Elon Musk / Aristóteles — decompor até os átomos do problema, não
> discutir a solução que já foi enquadrada.*

---

#### 🟡 O Expansionista *(Yellow Hat de De Bono + 10x Thinking)*
**Recebe:** decisão + contexto completo  
**Missão:** ignorar o custo e o risco. Procurar o ganho 10x que ninguém está
vendo. Que versão desta decisão seria transformadora, não apenas boa? O que
bloqueou mentalmente o usuário de ver isso?

> *Raiz: Peter Thiel's Zero to One — a diferença entre 0→1 e 1→n. Forçar
> pensamento de magnitude, não de incremento.*

---

#### ⚪ O Forasteiro *(White Hat de De Bono + Outsider Effect)*
**Recebe:** SOMENTE a decisão em 1 frase, sem contexto  
**Missão:** dizer o que parece óbvio de fora — o que qualquer pessoa de fora
do setor, sem histórico, veria imediatamente. Qual pressuposto o usuário parou
de questionar de tão dentro que está?

> *Raiz: Bezos's "regret minimization" + Kahneman's Outside View — quem está
> dentro do problema sofre de viés de experiência; o forasteiro não.*

---

#### 🟢 O Advogado do Diabo Invertido *(Steelmanning)*
**Recebe:** decisão + contexto completo  
**Missão:** construir o MELHOR argumento possível CONTRA a posição do usuário
— não a crítica fraca, o argumento mais forte que existe. Depois: se esse
argumento for verdade, o que muda na decisão?

> *Raiz: steelmanning (oposto ao strawman) — forçar honestidade intelectual
> ao construir o contra-argumento mais sólido possível antes de descartá-lo.*

---

#### ⚙️ O Executor *(pragmatismo puro)*
**Recebe:** decisão + contexto completo  
**Missão:** ignorar estratégia. Só importa: qual é o MENOR passo testável que
valida ou invalida a decisão em menos de 7 dias? Qual é o custo de errar
(reversível vs. irreversível)? Qual é o custo de esperar?

> *Raiz: Jeff Bezos's Type 1 / Type 2 decisions + Eric Ries's Build-Measure-
> Learn — separar decisões irreversíveis (exigem cuidado) de reversíveis
> (exigem velocidade).*

---

### Passo 2 — Revisão entre pares

Após os 6 outputs, faça o cruzamento:
1. **Pontos de convergência:** o que 3+ conselheiros concordaram (mesmo vindo
   de ângulos opostos)?
2. **Divergências reais:** onde dois conselheiros chegam a conclusões opostas
   e AMBAS têm lógica válida? Liste sem resolver ainda.
3. **Pontos cegos:** o que NINGUÉM mencionou e deveria?

---

### Passo 3 — O Presidente fecha

Formato fixo, curto. Sem introdução, sem "portanto".

```
⚖️ VEREDITO: <uma frase — tom afirmativo, não "depende">

POR QUÊ:
• <ponto 1 que sobreviveu ao cruzamento>
• <ponto 2>
• <ponto 3>

⚠️ O QUE PODE MATAR:
<o risco mais letal identificado — do Contrário ou do Advogado Invertido>

🔀 PRESSUPOSTO A REVISAR:
<o pressuposto que o Forasteiro ou Primeiros Princípios expôs>

▶️ PRÓXIMO PASSO:
<uma ação única, testável, executável amanhã de manhã — do Executor>

🔁 TIPO DE DECISÃO: [Reversível / Irreversível]
Se reversível → mova rápido. Se irreversível → valide o pressuposto antes.
```

---

## Regras de ouro

| Regra | Detalhe |
|---|---|
| **Sem sycophancy** | Nenhum conselheiro começa elogiando a ideia |
| **Sem "depende"** | O Presidente sempre fecha com uma posição |
| **Forasteiro é cego** | Recebe 1 frase. Sem contexto adicional |
| **Executor não filosofa** | Só fala de ação e custo |
| **Convergência ≠ verdade** | Se todos concordam, suspeite — pode ser viés de enquadramento |
| **Divergência real é ouro** | Não resolva artificialmente; exponha |

---

## Quando NÃO usar o Council

- Decisões puramente factuais (qual biblioteca usar, qual sintaxe está correta)
- Decisões já tomadas e irreversíveis (foco passa a ser execução)
- Quando o usuário precisa de suporte emocional, não análise estratégica

---

## Variante rápida: `/council fast`

Se o usuário pedir velocidade, comprime para:
- Contrário: 2 furos
- Primeiros Princípios: 1 reformulação
- Executor: 1 passo
- Presidente: veredito + próximo passo (sem o restante)

---

## Fundamentos teóricos incorporados

| Conselheiro | Framework de origem |
|---|---|
| O Contrário | Pre-mortem (Gary Klein, 1989) + Black Hat (De Bono) |
| Primeiros Princípios | First Principles Thinking (Aristóteles → Musk) |
| O Expansionista | 10x Thinking (Google X) + Yellow Hat (De Bono) |
| O Forasteiro | Outside View (Kahneman) + Regret Minimization (Bezos) |
| Advogado Invertido | Steelmanning (epistemologia moderna) |
| O Executor | Type 1/2 Decisions (Bezos) + Build-Measure-Learn (Ries) |
| Presidente | Structured Decision Making (Hammond, Keeney, Raiffa) |
