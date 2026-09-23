# 📄 Markdown → PDF Converter Skill

Converte arquivos Markdown em PDFs profissionais com formatação elegante, CSS customizável e suporte a múltiplos estilos.

## 🚀 Quick Start

### Instalação de Dependências

```bash
# Linux
sudo apt-get update
sudo apt-get install -y pandoc weasyprint

# macOS
brew install pandoc weasyprint

# Windows
# Baixe Pandoc em: https://github.com/jgm/pandoc/releases
# Instale WeasyPrint: pip install weasyprint
```

### Conversão Básica

```bash
# Simples (sem CSS)
pandoc documento.md -o documento.pdf

# Com CSS corporativo
pandoc documento.md \
  --pdf-engine=weasyprint \
  --css=references/osceia-brand.css \
  -o documento.pdf
```

### Usando o Script Python

```bash
python scripts/md2pdf.py documento.md documento.pdf references/osceia-brand.css
```

---

## 📁 Estrutura da Skill

```
md-to-pdf/
├── SKILL.md                      # Documentação principal
├── README.md                     # Este arquivo
├── scripts/
│   └── md2pdf.py               # Script Python com auto-instalação
└── references/
    ├── osceia-brand.css        # CSS corporativo OSCEIA
    └── exemplo.md              # Arquivo de teste
```

---

## 🎨 Estilos Disponíveis

### 1. **Corporativo OSCEIA** (`osceia-brand.css`)

Usa cores e tipografia da OSCEIA:
- Azul: `#003368`
- Verde: `#008036`
- Fonte: Segoe UI
- Cabeçalho e rodapé personalizados

**Uso**:
```bash
pandoc spec.md --pdf-engine=weasyprint --css=references/osceia-brand.css -o spec.pdf
```

### 2. **Minimalista**

Para documentos simples e limpos (implícito, sem CSS).

**Uso**:
```bash
pandoc documento.md -o documento.pdf
```

### 3. **Acadêmico**

Conforme normas ABNT (margem 3cm, Times New Roman, etc.).

Crie seu próprio `academico.css` com as settings mencionadas na SKILL.md.

---

## 📝 Exemplos de Conversão

### Exemplo 1: Documento Simples
```bash
pandoc relatorio.md -o relatorio.pdf
```

### Exemplo 2: Com Metadados
```bash
pandoc relatorio.md \
  --pdf-engine=weasyprint \
  --css=references/osceia-brand.css \
  --metadata title="Relatório HESK 2024" \
  --metadata author="Departamento de TI" \
  --metadata date="Goiânia - 2024" \
  -o relatorio.pdf
```

### Exemplo 3: Remover Seções Antes de Converter

```bash
# Remove comentários e seções marcadas
sed '/<!--.*SKIP_IN_PDF.*-->/,/<!--.*END_SKIP.*-->/d' documento.md > temp.md

pandoc temp.md \
  --pdf-engine=weasyprint \
  --css=references/osceia-brand.css \
  -o documento.pdf

rm temp.md
```

### Exemplo 4: Batch (Vários Arquivos)

```bash
for file in *.md; do
  pandoc "$file" \
    --pdf-engine=weasyprint \
    --css=references/osceia-brand.css \
    -o "${file%.md}.pdf"
done
```

---

## 🎯 Dicas de Formatação no Markdown

### Para melhor resultado no PDF:

| Objetivo | Markdown | Resultado |
|----------|----------|-----------|
| Quebra de página | `<div class="page-break"></div>` | Nova página no PDF |
| Sem quebra de página | `<div class="no-page-break">…</div>` | Mantém junto |
| Destacar | `**texto importante**` | Bold com cor azul |
| Citação | `> Texto citado` | Blockquote com barra verde |
| Código | `` ```python ``...`` ``` `` | Código com destaque |
| Tabela | Sintaxe MD padrão | Tabelas formatadas |
| Link | `[texto](url)` | Link interativo |

### Exemplo Markdown Completo

```markdown
# Título Principal

## Seção 1

Este é um parágrafo normal.

### Subseção

> Esta é uma citação importante com destaque.

```python
# Código formatado
def funcao():
    return "resultado"
```

| Coluna 1 | Coluna 2 |
|----------|----------|
| Valor A  | Valor B  |

<div class="page-break"></div>

## Seção 2

Continuação na próxima página.
```

---

## 🔧 Troubleshooting

### Problema: "pandoc: command not found"

**Solução**: Instale Pandoc
```bash
# Linux
sudo apt-get install pandoc

# macOS
brew install pandoc
```

### Problema: "ModuleNotFoundError: No module named 'weasyprint'"

**Solução**: Instale WeasyPrint
```bash
pip install weasyprint
```

### Problema: Fontes não renderizam no PDF

**Solução**: Use fontes web-safe no CSS:
```css
body {
  font-family: 'Segoe UI', 'Trebuchet MS', Arial, sans-serif;
}
```

### Problema: Tabelas saem mal formatadas

**Solução**: Adicione ao CSS:
```css
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 0.6em;
}
```

### Problema: Código envolve mal

**Solução**: Use `white-space` no CSS:
```css
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-x: auto;
}
```

### Problema: Imagens não aparecem

**Solução**: 
- Use caminhos absolutos
- Ou coloque imagens no mesmo diretório
- Ou embuta base64 no Markdown

---

## 🧪 Testar a Skill

### 1. Conversão Simples
```bash
pandoc references/exemplo.md -o teste1.pdf
```

### 2. Com CSS OSCEIA
```bash
pandoc references/exemplo.md \
  --pdf-engine=weasyprint \
  --css=references/osceia-brand.css \
  -o teste2.pdf
```

### 3. Com Script Python
```bash
python scripts/md2pdf.py references/exemplo.md teste3.pdf references/osceia-brand.css
```

Abra os três PDFs e compare formatação!

---

## 📚 Integração com Projetos OSCEIA

### Para HESK Analytics

```bash
pandoc CONTEXTO_HESK_OSCEIA.md \
  --pdf-engine=weasyprint \
  --css=osceia-brand.css \
  --metadata title="HESK Analytics - Documentação Técnica" \
  --metadata author="Desenvolvimento" \
  -o HESK_Documentacao.pdf
```

### Para Jovem Aprendiz Web

```bash
pandoc spec.md \
  --pdf-engine=weasyprint \
  --css=osceia-brand.css \
  --metadata title="Jovem Aprendiz Web - Especificação" \
  -o JovemAprendiz_Spec.pdf
```

### Para PJA Contratos

```bash
pandoc relatorio_pja.md \
  --pdf-engine=weasyprint \
  --css=osceia-brand.css \
  --metadata title="PJA Contracts - Análise de Billing" \
  -o PJA_Relatorio.pdf
```

---

## 🤝 Suporte

Para dúvidas ou problemas:
- **Email**: informatica@osceia.org.br
- **Contato**: Desenvolvimento (TI)

---

## 📄 Licença

Esta skill é de uso interno da OSCEIA.

---

**Última atualização**: Julho 2024  
**Versão**: 1.0
