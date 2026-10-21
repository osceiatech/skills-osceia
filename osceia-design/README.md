# osceia-design

🎨 **Skill de Design Integrado para Projetos OSCEIA**

Orientação completa de design para interfaces Angular, documentos institucionais e processos de negócio. Inclui 23 comandos, paleta de cores OSCEIA, tipografia, spacing, componentes PrimeNG e conformidade WCAG AA.

## ✨ O Que Faz

- 🎯 **Design UI:** Componentes Angular com padrões OSCEIA (PrimeNG + Tailwind)
- 📄 **Documentos:** Templates Word/PDF (boletins, relatórios, certificados)
- 🔄 **Processos:** Mapear e validar fluxos BPMN
- ♿ **Acessibilidade:** WCAG 2.1 AA integrado
- 🔍 **Auditoria:** Detecta problemas de conformidade automaticamente

## 🚀 Instalação Rápida

### Opção 1: NPX CLI (Recomendado)

```bash
# Na raiz do seu projeto OSCEIA
npx impeccable install --providers=claude

# Depois, em seu IDE (Claude Code, Cursor, etc):
/osceia-design init
```

### Opção 2: Cópia Manual

```bash
# Copiar skill diretamente
cp -r osceia-design ~/.claude/skills/

# Ou para projeto específico
cp -r osceia-design seu-projeto/.claude/skills/
```

### Opção 3: Git Submodule (Para Times)

```bash
git submodule add https://github.com/seu-usuario/osceia-design-skill .osceia-design
cp -r .osceia-design ~/.claude/skills/osceia-design

# Depois, para atualizar:
git submodule update --remote
```

## 📖 Uso Básico

### 1. Inicializar Projeto

```
/osceia-design init
```

Escolha o tipo:
- **app** → Sistema web (Angular, Supabase)
- **documento** → Word/PDF (boletins, relatórios)
- **processo** → BPMN (fluxos de negócio)

Gera `OSCEIA.design.md` com contexto visual.

### 2. Criar Componentes

```
/osceia-design component LoginForm
/osceia-design component CardAprendiz
/osceia-design component ReportTable
```

Cada um gera código Angular standalone + Tailwind + PrimeNG + a11y.

### 3. Auditar Projeto

```
/osceia-design audit
```

Retorna relatório com:
- Conformidade com padrões OSCEIA (cores, tipografia, spacing)
- WCAG AA compliance
- Performance
- Ações recomendadas

### 4. Gerar Documentos

```
/osceia-design document boletim
/osceia-design document relatorio
/osceia-design document certificado
```

Cria templates Word prontos para preenchimento.

### 5. Mapear Processos

```
/osceia-design bpmn contratacao-aprendiz
/osceia-design bpmn conselho-professores
```

Gera BPMN 2.0 XML com atores, eventos e decisões.

## 📋 Todos os 23 Comandos

```
/osceia-design init               Inicializar projeto
/osceia-design component <nome>   Novo componente Angular
/osceia-design audit              Auditar conformidade
/osceia-design critique           Review completo de UX
/osceia-design polish             Último polimento
/osceia-design document <tipo>    Template Word/PDF
/osceia-design palette            Paleta de cores
/osceia-design typeset            Revisar tipografia
/osceia-design layout <área>      Revisar grid/spacing
/osceia-design bpmn <processo>    Mapear processo BPMN
/osceia-design flow <fluxo>       Desenhar UX flow
/osceia-design bolder             Amplificar design
/osceia-design quieter            Reduzir design
/osceia-design distill            Remover complexidade
/osceia-design animate            Adicionar movimento
/osceia-design onboard            First-run flows
/osceia-design clarify            Melhorar copy/textos
/osceia-design polish-doc         Polir documento
/osceia-design colorize           Estratégia de cores
/osceia-design adapt              Responsividade
/osceia-design optimize           Performance
/osceia-design live               Modo visual iterativo
/osceia-design pin <cmd>          Criar atalho (/cmd)
```

## 🎨 Paleta OSCEIA

```css
--color-blue-osceia: #003368;      /* Azul corporativo */
--color-green-osceia: #008036;     /* Verde institucional */
--color-text-primary: #1F2937;     /* Texto com tinta */
--color-border: #E5E7EB;           /* Bordas */
```

Fontes: `-apple-system`, `SF Mono` (nunca Arial/Helvetica puro)

## 📦 Estrutura da Skill

```
osceia-design/
├── SKILL.md                          # Definição e comandos
├── references/
│   ├── tokens.css                    # CSS variables
│   ├── exemplos-uso.md               # Casos reais
│   └── componentes-padrao.md         # (Opcional)
├── assets/
│   └── logo-osceia.svg               # (Opcional)
└── README.md                         # Este arquivo
```

## 🔗 Integração com Outras Skills

Esta skill trabalha junto com:

- **`osceia-dev`** → Patterns Angular/TypeScript
- **`tlc-spec-driven`** → Planejar features
- **`feature-doc-generator`** → Documentar implementações
- **`bpmn-generator`** → Validar BPMN
- **`docx`** → Editar documentos Word
- **`council`** → Deliberar decisões de design

## 📚 Exemplos Práticos

Veja `references/exemplos-uso.md` para:
- ✅ Criar componente LoginForm com acessibilidade
- ✅ Gerar boletim escolar pronto para assinatura
- ✅ Mapear processo de contratação (BPMN)
- ✅ Auditar projeto inteiro

## ✅ Conformidade

Esta skill garante:

- ✅ **WCAG 2.1 AA** - Acessibilidade (mínimo)
- ✅ **Identidade visual** - Cores/tipografia OSCEIA
- ✅ **Responsive** - Mobile-first (testado 320px+)
- ✅ **Performance** - LCP < 2.5s
- ✅ **Documentação** - Português claro

## 🆘 Troubleshooting

**Comando `/osceia-design` não aparece?**
- Reinicie sua IDE (Claude Code, Cursor, etc)
- Verifique que o arquivo `.claude/skills/osceia-design/SKILL.md` existe
- Certifique-se da pasta estar no lugar correto (`~/.claude/` ou projeto)

**Auditar retorna muitos erros?**
- Normal! Execute: `/osceia-design audit | grep 🔴`
- Foque em ações marcadas como "CRÍTICO"
- Depois `/osceia-design critique` para review de UX

**Como fazer atalhos?**
```
/osceia-design pin audit
→ Depois use simplesmente `/audit`

/osceia-design pin polish
→ Depois use simplesmente `/polish`
```

## 📞 Suporte

- 📖 Referência completa: veja `SKILL.md`
- 💡 Exemplos práticos: veja `references/exemplos-uso.md`
- 🎨 Tokens e cores: veja `references/tokens.css`

## 📝 Licença

Apache 2.0 (compatível com Impeccable)

---

**Criada para OSCEIA - Obras Sociais do Centro Espírita Irmão Áureo**  
Baseada no framework Impeccable de Paul Bakaus
