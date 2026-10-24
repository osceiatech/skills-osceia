---
name: osceia-design
description: Guia de design integrado para projetos OSCEIA (UI/Angular, documentos, processos). Use esta skill SEMPRE que o desenvolvedor precisar de orientação visual ou de padrões em qualquer projeto OSCEIA: componentes Angular, design de relatórios Word/PDF, estrutura de processos BPMN, paleta de cores institucional (#003368/#008036), tipografia, spacing, acessibilidade, ou quando mencionar termos como "design OSCEIA", "padrão institucional", "componente", "layout", "relatório", "boletim", "processo", "workflow", "interface", "UI", "UX", "acessibilidade", "WCAG", ou "marca OSCEIA".
---

# Design OSCEIA

Orientação integrada de design para todos os projetos OSCEIA: interfaces de usuário (Angular, PrimeNG), documentos institucionais (Word, PDF), e fluxos de processos (BPMN).

## 🎯 Princípios de Design OSCEIA

### Identidade Visual
- **Cores principais:** Azul corporativo (`#003368`) + Verde institucional (`#008036`)
- **Paleta neutra:** Tons de cinza com tinta (nunca preto/cinza puro)
- **Fundo:** Branco (`#FFFFFF`) ou cinza muito claro (`#F8F9FA`)
- **Acentos:** Verde para ações primárias, azul para contexto/informação

### Tipografia
- **Headlines (H1–H3):** Inter 700, 28–18px, tracking +0.5px
- **Body text:** -apple-system, sans-serif (system fonts), 14–16px, line-height 1.5–1.6
- **Monospace (código, dados):** SF Mono, Monaco, ou system monospace
- **Nunca usar:** Arial, Helvetica (genéricos), Inter genérico sem tinta institucional

### Espaçamento e Ritmo
- **Scale:** 4px base, múltiplos de 4 (4, 8, 12, 16, 20, 24, 32, 40, 48, 64px)
- **Padding:** Mínimo 12px (componentes), 16px (cartões/seções)
- **Gaps:** 8px (compacto), 16px (normal), 24px (generoso)
- **Line-height:** 1.5 (body), 1.4 (headlines)

### Componentes Angular + PrimeNG
- **Standalone components** com `OnPush` change detection (zoneless)
- **Signals** para state (`input()`, `output()`, `computed()`)
- **Tailwind CSS 4** + PrimeNG (sem sobrescrever cores OSCEIA)
- **Paleta de cores PrimeNG:** Usar temas "lara-light" + customização OSCEIA

### Acessibilidade (WCAG 2.1 AA)
- **Contraste mínimo:** 4.5:1 para texto normal, 3:1 para texto grande
- **Touch targets:** Mínimo 44×44px (mobile) ou 40×40px (desktop)
- **Sem cor como único indicador:** Sempre adicionar ícone/texto/padrão
- **Focus states:** Sempre visível (outline 2px sólido em azul `#003368`)
- **Headings:** Nunca pular níveis (H1 → H2 → H3, não H1 → H3)
- **Nomes descritivos:** `aria-label`, `aria-describedby`, `aria-live` quando apropriado

### Anti-Padrões OSCEIA
- ❌ Texto cinzento puro em fundo colorido (reduz contraste)
- ❌ Cards aninhados (máximo 1 nível de profundidade)
- ❌ Ícones genéricos sem labels em UI crítica
- ❌ Bounce/elastic easing (usar ease-in-out, ease-out)
- ❌ Gradientes roxo-azul genéricos (usar degradês OSCEIA: azul→verde ou monoclromático)
- ❌ Fonte pequena sem leading adequado (mínimo 14px com line-height 1.5)
- ❌ Páginas > 120 caracteres de width (quebra leitura)

---

## 📋 Comandos de Design OSCEIA

Todos os comandos usam o prefixo `/osceia-design`:

### Inicialização e Setup

**`/osceia-design init`**
- Setup inicial do projeto
- Define tipo de projeto (app, landing, documento, processo)
- Cria `OSCEIA.design.md` com contexto visual
- Instala Tailwind + PrimeNG (se Angular)

**`/osceia-design audit`**
- Verifica conformidade com padrões OSCEIA
- Testa acessibilidade (WCAG AA)
- Valida uso de cores, tipografia, spacing
- Retorna relatório com problemas + soluções

### Componentes e UI

**`/osceia-design component <nome>`**
- Gera novo componente Angular standalone com padrões OSCEIA
- Ex: `/osceia-design component FormLogin`, `/osceia-design component CardAprendiz`
- Inclui: structure, signals, Tailwind + PrimeNG, acessibilidade, testes

**`/osceia-design palette`**
- Mostra paleta completa OSCEIA com valores HEX/RGB
- Gera arquivo `tokens.css` com CSS variables
- Útil para onboarding visual

**`/osceia-design typeset`**
- Audita e corrige tipografia
- Aplica escala de tamanhos conforme padrão
- Verifica contraste e legibilidade

**`/osceia-design layout <area>`**
- Revisa grid/flexbox de uma seção
- Verifica spacing, alinhamento, ritmo visual
- Ex: `/osceia-design layout header`, `/osceia-design layout forms`

### Documentos e Relatórios

**`/osceia-design document <tipo>`**
- Gera template Word/PDF com padrão OSCEIA
- Tipos: `boletim`, `relatorio`, `parecer`, `contrato`, `comunicado`, `certificado`
- Inclui: cabeçalho, rodapé, fontes, cores, margens
- Ex: `/osceia-design document boletim`

**`/osceia-design polish-doc`**
- Final pass em documentos Word/PDF
- Corrige cores, tipografia, espaçamento, alinhamento
- Prepara para impressão/assinatura

### Processos e Fluxos

**`/osceia-design bpmn <processo>`**
- Revisa diagrama BPMN conforme padrões OSCEIA
- Valida atores, eventos, decisões
- Ex: `/osceia-design bpmn contratacao-aprendiz`

**`/osceia-design flow <fluxo>`**
- Desenha ou melhora fluxo de usuário (UX flow)
- Ex: `/osceia-design flow registro-aprendiz`

### Refinamento e Iteração

**`/osceia-design critique`**
- Review completo de UX/design (visual + funcional)
- Testa com padrões OSCEIA
- Sugere melhorias

**`/osceia-design bolder`**
- Amplifica designs tímidos (cores, tipografia, spacing)

**`/osceia-design quieter`**
- Reduz designs muito ousados (remove redundâncias visuais)

**`/osceia-design distill`**
- Remove complexidade visual desnecessária
- Foca na essência

**`/osceia-design animate`**
- Adiciona movimento proposital (transições, loading, feedback)
- Segue padrões de easing OSCEIA

**`/osceia-design onboard`**
- Cria fluxos de first-run (onboarding, empty states, tutoriais)

**`/osceia-design clarify`**
- Melhora copy/textos de UI (clareza, tom institucional)

---

## 🎨 Variantes de Projeto

### 1️⃣ Projeto Angular (App/Dashboard OSCEIA)

**Stack típico:**
```
Angular 20+ standalone, zoneless
├── Tailwind CSS 4 + OSCEIA tokens
├── PrimeNG (lara-light theme + override)
├── Supabase (banco auxiliar)
├── Firebase Auth (autenticação)
└── Acessibilidade: AXE DevTools
```

**Ao iniciar um projeto Angular:**
```
/osceia-design init
→ Escolhe "app" ou "dashboard"
→ Gera OSCEIA.design.md
→ Instala Tailwind tokens
→ Cria primeiro componente exemplo
```

**Comandos úteis:**
- `/osceia-design component LoginForm` - novo componente
- `/osceia-design audit` - verificar conformidade
- `/osceia-design layout main-nav` - revisar navegação
- `/osceia-design typeset` - verificar fontes

### 2️⃣ Projeto de Documentos (Word/PDF)

**Stack típico:**
```
docx (template OSCEIA)
├── Cabeçalho com logo
├── Cores: #003368, #008036
├── Tipografia: Calibri/Arial (compatível)
├── Rodapé numerado
└── Assinatura + data
```

**Ao iniciar um documento:**
```
/osceia-design document boletim
→ Gera template .docx com padrão OSCEIA
→ Pronto para preenchimento de dados
```

**Exemplos de documentos:**
- **Boletim escolar:** grades, faltas, observações, bimestres
- **Relatório:** análise, gráficos, recomendações
- **Parecer:** avaliação, conclusão, assinatura
- **Contrato:** termos, assinaturas, datas
- **Certificado:** nome, curso, data, assinatura

### 3️⃣ Projeto de Processos (BPMN)

**Stack típico:**
```
BPMN 2.0 XML
├── Atores: Admin, Gestor, Professor, Aprendiz
├── Eventos: início, término, erro
├── Decisões: aprovação, rejeição, encaminhamento
└── Artefatos: documentos, dados
```

**Ao iniciar um processo:**
```
/osceia-design bpmn novo-processo
→ Define tipo (parceria, contratação, avaliação, etc.)
→ Mapeia atores e eventos
→ Gera BPMN 2.0 XML + visualização
```

**Processos OSCEIA modelados:**
- Parceria nova (PJA)
- Contratação de aprendiz
- Aditivo de contrato
- Conselho de professores
- Emissão de certificado
- Encaminhamento de aprendiz

---

## 📚 Referências Rápidas

### Paleta OSCEIA (CSS Variables)

```css
--color-primary: #003368;      /* Azul corporativo */
--color-secondary: #008036;    /* Verde institucional */
--color-success: #008036;      /* Ações bem-sucedidas */
--color-warning: #F59E0B;      /* Alertas */
--color-error: #DC2626;        /* Erros */
--color-info: #003368;         /* Informações */
--color-bg: #FFFFFF;           /* Fundo principal */
--color-bg-alt: #F8F9FA;       /* Fundo alternativo */
--color-border: #E5E7EB;       /* Bordas */
--color-text: #1F2937;         /* Texto principal */
--color-text-muted: #6B7280;   /* Texto secundário (com tinta) */
```

### Tipografia Scale

```
H1: 28px, 700, tracking +0.5px
H2: 24px, 600, tracking +0.3px
H3: 20px, 600
H4: 18px, 600
Body: 16px, 400, line-height 1.5
Small: 14px, 400
Caption: 12px, 500 (muted)
```

### Spacing Scale

```
xs: 4px    | sm: 8px   | md: 12px | lg: 16px
xl: 20px   | 2xl: 24px | 3xl: 32px | 4xl: 40px | 5xl: 48px | 6xl: 64px
```

### Componentes PrimeNG Customizados

```
Button Primary → bg-blue (#003368), text-white
Button Secondary → border blue, text blue
Card → border #E5E7EB, shadow-sm, padding 16px
Input → border #E5E7EB, focus:border-blue
Badge → bg-green (#008036), text-white
```

---

## ✅ Checklist Pré-Produção

- [ ] Todos os textos em português claro e institucional
- [ ] Contraste verificado (mínimo 4.5:1)
- [ ] Touch targets ≥ 44px (mobile)
- [ ] Headings em sequência (sem pular níveis)
- [ ] Focus states visíveis (outline azul)
- [ ] Cores OSCEIA (#003368 e #008036) aplicadas
- [ ] Tipografia conforme scale (sem Arial/Inter puro)
- [ ] Spacing em múltiplos de 4px
- [ ] Responsive testado (mobile, tablet, desktop)
- [ ] Loading states com feedback visual
- [ ] Error states com ícone + texto
- [ ] Empty states com copy descritiva
- [ ] Testes unitários para componentes críticos
- [ ] Acessibilidade auditada (AXE, WAVE)

---

## 🔗 Integração com Skills Existentes

Esta skill se complementa com:

- **`osceia`** → Padrões Angular/TypeScript específicos OSCEIA
- **`tlc-spec-driven`** → Planejamento spec-driven de features
- **`feature-doc-generator`** → Documentar features implementadas
- **`bpmn-generator`** → Gerar/validar diagramas BPMN
- **`docx`** → Criar/editar documentos Word
- **`pdf`** → Gerar/manipular PDFs
- **`council`** → Deliberar sobre decisões de design

**Quando usar cada:**
- Novo componente Angular? → `/osceia component` depois `/osceia-design component`
- Design de feature nova? → `/tlc-spec-driven` (spec) → `/osceia-design audit` (visual)
- Documentar o que foi feito? → `/feature-doc-generator` → `/osceia-design polish-doc`
- Decisão de design complexa? → `/council` (deliberar estratégia)

---

## 🚀 Quick Start

### Para novo projeto Angular:
```
/osceia-design init
→ (escolhe "app")
→ /osceia-design component LoginForm
→ /osceia-design audit
```

### Para novo documento:
```
/osceia-design document boletim
→ (gera template)
→ /osceia-design polish-doc
```

### Para auditar projeto existente:
```
/osceia-design audit
→ (verifica conformidade)
→ /osceia-design critique
→ /osceia-design bolder ou /osceia-design quieter
```

---

## 📧 Dúvidas Comuns

**P: Posso usar outras cores?**  
R: Verde e azul OSCEIA são obrigatórios. Acentos (warning, error) podem variar conforme contexto, mas sempre com contraste testado.

**P: E se a marca exigir fonte diferente?**  
R: Use tipografia do sistema (Inter, SF Pro, -apple-system) + tinta OSCEIA. Nunca Arial/Helvetica. Fonte customizada só com aprovação de marca.

**P: Como lidar com temas dark mode?**  
R: OSCEIA ainda não tem guia dark. Use light mode. Se cliente insistir, consulte `/council`.

**P: Acessibilidade é obrigatória?**  
R: Sim. Mínimo WCAG 2.1 AA. Projetos com dados sensíveis (educacional) precisam AAA em certas seções.

---

## 📞 Próximos Passos

1. Executar `/osceia-design init` em novo projeto
2. Gerar primeiro componente ou documento
3. Rodar `/osceia-design audit` regularmente
4. Consultar `/osceia-design critique` antes de ship
5. Usar `/osceia-design pin <comando>` para atalhos frequentes

Boa sorte! 🎨✨
