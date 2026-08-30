# Exemplos de Uso - Skill osceia-design

Guia prático com exemplos reais de como usar a skill em projetos OSCEIA.

---

## 📱 Exemplo 1: Novo Componente Angular

**Contexto:** Seu time está desenvolvendo a tela de login do ERP escolar (Supabase + Angular).

### Passo 1: Inicializar o projeto
```
/osceia-design init
```

Responde:
- Tipo de projeto: **app** (é um sistema web)
- Nome: **ERP Escolar - Autenticação**
- Tem design system já? **Não, começar do zero**

→ Gera `OSCEIA.design.md` com:
- Paleta OSCEIA (#003368, #008036)
- Tipografia (Inter 700 + system fonts)
- Spacing scale (4px base)
- Componentes Angular example

### Passo 2: Criar o componente LoginForm

```
/osceia-design component LoginForm
```

Gera código pronto:

```typescript
// login-form.component.ts
import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="login-form">
      <!-- Email input -->
      <div class="form-group">
        <label for="email" class="form-label">Email</label>
        <input
          pInputText
          id="email"
          type="email"
          formControlName="email"
          class="w-full"
          placeholder="seu@email.com"
          aria-label="Email para login"
        />
        <div class="error-message" *ngIf="email?.invalid && email?.touched">
          Email inválido
        </div>
      </div>

      <!-- Password input -->
      <div class="form-group">
        <label for="password" class="form-label">Senha</label>
        <input
          pInputText
          id="password"
          type="password"
          formControlName="password"
          class="w-full"
          placeholder="••••••••"
          aria-label="Senha para login"
        />
        <div class="error-message" *ngIf="password?.invalid && password?.touched">
          Senha é obrigatória
        </div>
      </div>

      <!-- Submit button -->
      <button
        pButton
        type="submit"
        [disabled]="form.invalid"
        class="w-full"
        label="Entrar"
        [loading]="isLoading()"
        aria-label="Enviar formulário de login"
      />
    </form>
  `,
  styles: [`
    .login-form {
      display: flex;
      flex-direction: column;
      gap: var(--gap-lg);
      padding: var(--padding-lg);
      max-width: 28rem;
      margin: 0 auto;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--gap-sm);
    }

    .form-label {
      font-weight: var(--font-semibold);
      font-size: var(--text-sm);
      color: var(--color-text-primary);
    }

    .error-message {
      font-size: var(--text-xs);
      color: var(--color-error);
      margin-top: var(--gap-xs);
    }

    :host ::ng-deep {
      .p-inputtext {
        border: var(--input-border);
        border-radius: var(--border-radius-md);
        height: var(--input-height);
        padding: var(--input-padding-v) var(--input-padding-h);
      }

      .p-button {
        background-color: var(--color-blue-osceia);
        border-color: var(--color-blue-osceia);
        height: var(--button-height-md);
      }

      .p-button:hover:not(:disabled) {
        background-color: #002347;
        border-color: #002347;
      }
    }
  `],
  changeDetection: 'OnPush'
})
export class LoginFormComponent {
  private fb = inject(FormBuilder);

  isLoading = signal(false);
  submit = output<{ email: string; password: string }>();

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading.set(true);
      this.submit.emit(this.form.value as any);
    }
  }
}
```

### Passo 3: Auditar o componente

```
/osceia-design audit LoginForm
```

Retorna:
```
✅ Acessibilidade: WCAG AA em 3 pontos
  - ✓ Contraste email label (5.2:1)
  - ✓ Contraste button (6.1:1)
  - ✓ Focus states implementados
  - ✓ Labels associadas (aria-label)
  - ⚠ Mensagem de erro poderia ter aria-live="polite"

✅ Design: Conformidade OSCEIA
  - ✓ Cores: azul #003368 em button ✓
  - ✓ Tipografia: system font + semibold em label ✓
  - ✓ Spacing: gaps em múltiplos de 4px ✓
  - ✓ Border radius: 8px conforme padrão ✓

⚠ Sugestões:
  - Adicionar "Esqueceu senha?" link
  - Loading state visual melhorar
  - Empty state (first visit) com help text
```

### Passo 4: Refinar

```
/osceia-design onboard LoginForm
```

Adiciona:
- First-time help text ("Digite suas credenciais da OSCEIA")
- Hint visual (ícone de cadeado)
- Success message após login bem-sucedido

---

## 📄 Exemplo 2: Documento - Boletim Escolar

**Contexto:** Gerar boletim em Word para impressão/assinatura.

### Passo 1: Criar template

```
/osceia-design document boletim
```

Gera `boletim-template.docx` com:

```
═════════════════════════════════════════════════════════════════════
                    INSTITUTO DE EDUCAÇÃO EURÍPEDES BARSANULFO
                             BOLETIM ESCOLAR
═════════════════════════════════════════════════════════════════════

Aluno: __________________________________________  Matrícula: ___________
Período: 1º Bimestre de 2024                       Turma: ________________
Responsável: ____________________________________  Data: ___/___/_______

─────────────────────────────────────────────────────────────────────────
DESEMPENHO ACADÊMICO
─────────────────────────────────────────────────────────────────────────

│ Disciplina        │ 1º Bim │ 2º Bim │ 3º Bim │ 4º Bim │ Média Anual │
├───────────────────┼────────┼────────┼────────┼────────┼─────────────┤
│ Português         │   8.0  │        │        │        │      —      │
│ Matemática        │   7.5  │        │        │        │      —      │
│ Ciências          │   8.5  │        │        │        │      —      │
└───────────────────┴────────┴────────┴────────┴────────┴─────────────┘

Frequência:  ____ faltas permitidas / ____ faltas cometidas

─────────────────────────────────────────────────────────────────────────
OBSERVAÇÕES PEDAGÓGICAS
─────────────────────────────────────────────────────────────────────────

O aluno demonstra boa assimilação dos conteúdos e participação em sala.
Recomenda-se continuidade no apoio às atividades complementares.

Encaminhamentos (se houver): ___________________________________________
_____________________________________________________________________________

─────────────────────────────────────────────────────────────────────────
ASSINATURAS
─────────────────────────────────────────────────────────────────────────

Professor(a): ________________________     Data: ___/___/_______

Gestor(a): __________________________     Data: ___/___/_______

Responsável: _________________________     Data: ___/___/_______
```

### Passo 2: Preencher dados

```
/osceia-design polish-doc
```

Corrige:
- Fontes: Calibri 11pt → sistema OSCEIA
- Cores: Cabeçalho azul (#003368)
- Tabelas: bordas conforme padrão
- Assinaturas: linhas no tamanho certo
- Impressão: ajusta margens

→ Arquivo `boletim-final.docx` pronto para assinatura

---

## 🔄 Exemplo 3: Processo BPMN - Contratação de Aprendiz

**Contexto:** Documentar fluxo de contratação de aprendiz (PJA).

### Passo 1: Iniciar mapeamento

```
/osceia-design bpmn contratacao-aprendiz
```

Pergunta:
- Atores: Admin, Gestor PJA, Câmara Municipal, Aprendiz, Empresa
- Pontos de decisão: aprovação, rejeição, documentação incompleta
- Artefatos: contrato, comprovantes, certidão

### Passo 2: Estrutura gerada

```xml
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                   xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                   targetNamespace="http://osceia.org/pja/contratacao">

  <bpmn:process id="contratacao_aprendiz" name="Contratação de Aprendiz">
    
    <!-- INÍCIO -->
    <bpmn:startEvent id="inicio" name="Formulário Recebido"/>
    
    <!-- TAREFA 1: Validar Documentação -->
    <bpmn:userTask id="validar_docs" name="Validar Documentação">
      <bpmn:incoming>inicio</bpmn:incoming>
      <bpmn:outgoing>docs_validos</bpmn:outgoing>
      <bpmn:documentation>Gestor verifica: CPF, RG, comprovante endereço, declaração escolar</bpmn:documentation>
    </bpmn:userTask>
    
    <!-- DECISÃO: Documentação Válida? -->
    <bpmn:exclusiveGateway id="docs_ok" name="Docs OK?"/>
    
    <!-- SE NÃO: Rejeitar -->
    <bpmn:userTask id="solicitar_docs" name="Solicitar Documentação Corrigida">
      <bpmn:incoming>docs_nao</bpmn:incoming>
      <bpmn:outgoing>volta_validacao</bpmn:outgoing>
    </bpmn:userTask>
    
    <!-- SE SIM: Gerar Contrato -->
    <bpmn:serviceTask id="gerar_contrato" name="Gerar Contrato">
      <bpmn:incoming>docs_sim</bpmn:incoming>
      <bpmn:outgoing>contrato_pronto</bpmn:outgoing>
      <bpmn:documentation>Sistema gera contrato com dados do aprendiz + empresa</bpmn:documentation>
    </bpmn:serviceTask>
    
    <!-- TAREFA: Assinatura Câmara -->
    <bpmn:userTask id="assinar_camara" name="Assinar Contrato (Câmara)">
      <bpmn:incoming>contrato_pronto</bpmn:incoming>
      <bpmn:outgoing>contrato_assinado</bpmn:outgoing>
      <bpmn:documentation>Assessor Jur. assina + carimba contrato</bpmn:documentation>
    </bpmn:userTask>
    
    <!-- FIM -->
    <bpmn:endEvent id="fim" name="Contrato Vigente">
      <bpmn:incoming>contrato_assinado</bpmn:incoming>
    </bpmn:endEvent>
    
  </bpmn:process>

</bpmn:definitions>
```

### Passo 3: Visualizar e validar

```
/osceia-design critique contratacao-aprendiz
```

Validações:
- ✅ 5 atores identificados
- ✅ 3 decisões com caminhos alternativos
- ✅ Artefatos (contrato, docs) mapeados
- ⚠️ Sugestão: adicionar "timeout" para documentação pendente > 30 dias

---

## 📊 Exemplo 4: Auditoria Completa de Projeto Existente

**Contexto:** Projeto ERP escolar já em andamento, quer garantir conformidade.

### Comando único:

```
/osceia-design audit
```

Retorna relatório:

```
═════════════════════════════════════════════════════════════════════
  AUDITORIA DE DESIGN - ERP Escolar
  Data: 15 ago 2024 | Escopo: /src
═════════════════════════════════════════════════════════════════════

📊 RESUMO EXECUTIVO
───────────────────────────────────────────────────────────────────
  Conformidade OSCEIA:          78%  ⚠️ (Objetivo: 90%+)
  Acessibilidade (WCAG AA):      82%  ✓
  Responsividade (Mobile):        94%  ✓
  Performance (LCP):             1.2s  ✓

🎨 DESIGN - CONFORMIDADE OSCEIA
───────────────────────────────────────────────────────────────────
  ✅ Cores primárias:            OK
     - #003368 (azul) em botões
     - #008036 (verde) em badges de sucesso

  ⚠️  Tipografia:                PARCIAL
     - dashboard.component.ts: Arial usado (linha 45)
       → Substituir por -apple-system
     - relatorio.component.ts: Inter 400 sem tinta (linha 120)
       → Adicionar tracking +0.5px

  ⚠️  Spacing:                   PARCIAL
     - card-aprendiz: padding 15px (não múltiplo de 4)
     - section-encaminhamentos: gap 10px (esperado 8 ou 12)

  ✅ Border radius:              OK (todos 8px conforme)

🦾 ACESSIBILIDADE (WCAG 2.1 AA)
───────────────────────────────────────────────────────────────────
  ✅ Contraste mínimo 4.5:1      OK (18/18 elementos)
  ⚠️  Focus states:              8/12 implementados
     - Faltam: botões em modal, inputs de select
  ✅ Touch targets (44px):       OK
  ⚠️  Headings:                  Há 1 skip de nível (H1 → H3)
     → Arquivo: dashboard/student-view.component.html:42
  ✅ Aria labels:                OK (14/14)
  ⚠️  Aria live regions:         Faltam em 2 formulários dinâmicos

📱 RESPONSIVIDADE
───────────────────────────────────────────────────────────────────
  ✅ Mobile (320px):             OK
  ✅ Tablet (768px):             OK
  ✅ Desktop (1024px):           OK
  ⚠️  UltraWide (1920px):        Line length > 100 chars em 1 seção

⚡ PERFORMANCE
───────────────────────────────────────────────────────────────────
  LCP (Largest Contentful Paint): 1.2s  ✓
  FID (First Input Delay):        45ms   ✓
  CLS (Cumulative Layout Shift):  0.05   ✓

🔧 AÇÕES RECOMENDADAS (Prioridade)
───────────────────────────────────────────────────────────────────

1. 🔴 CRÍTICO - Tipografia
   - dashboard.component.ts:45 → remover Arial
   - relatorio.component.ts:120 → adicionar tracking
   → Estimado: 2 horas

2. 🟡 IMPORTANTE - Acessibilidade
   - Adicionar focus states em modal buttons
   - Adicionar aria-live em forms dinâmicos
   → Estimado: 3-4 horas

3. 🟡 IMPORTANTE - Spacing
   - Revisar card-aprendiz padding (15px → 16px)
   - Revisar encaminhamentos gap (10px → 12px)
   → Estimado: 1-2 horas

4. 🟢 MELHORIAS - Heading hierarchy
   - dashboard/student-view: H1 → H3 (adicionar H2)
   → Estimado: 1 hora

═════════════════════════════════════════════════════════════════════
Total de ações: 7 | Tempo estimado: 7-9 horas
Próximo: /osceia-design critique para UX review
═════════════════════════════════════════════════════════════════════
```

---

## 🎯 Sumário: Quando Usar Cada Comando

| Situação | Comando | Exemplo |
|----------|---------|---------|
| Novo projeto | `/osceia-design init` | Inicia ERP escolar novo |
| Novo componente | `/osceia-design component` | Cria FormLogin |
| Validar design | `/osceia-design audit` | Verifica projeto inteiro |
| Review UX | `/osceia-design critique` | Antes de enviar para produção |
| Documento Word | `/osceia-design document` | Gera boletim.docx |
| Processo BPMN | `/osceia-design bpmn` | Mapeia contratação PJA |
| Amplificar design | `/osceia-design bolder` | Design tímido precisa impacto |
| Reduzir design | `/osceia-design quieter` | Muita cor/movimento |
| Atalhos | `/osceia-design pin audit` | Usa `/audit` depois |

---

## 🚀 Fluxo Típico de Projeto

```
1️⃣ PLANEJAMENTO
   /osceia-design init
   ↓

2️⃣ DESENVOLVIMENTO
   /osceia-design component LoginForm
   /osceia-design component CardAprendiz
   /osceia-design component ReportTable
   ↓

3️⃣ REVISÃO MID-SPRINT
   /osceia-design audit
   ↓

4️⃣ PRÉ-PRODUÇÃO
   /osceia-design critique
   /osceia-design polish
   ↓

5️⃣ DOCUMENTOS
   /osceia-design document boletim
   /osceia-design polish-doc
   ↓

6️⃣ PROCESSOS
   /osceia-design bpmn novo-processo
   ↓

7️⃣ SHIP! 🚀
```
