---
name: md-to-pdf
description: Converte arquivos Markdown em PDF com suporte a formatação profissional (cabeçalho, rodapé, numeração de páginas, CSS customizado). Use SEMPRE que o usuário pedir para "converter md em pdf", "transformar markdown para pdf", "gerar pdf do markdown", "exportar md como pdf", "converter .md para .pdf", ou quando mencionar "pdf" e "markdown" juntos. Também sugira esta skill quando o usuário tiver um arquivo .md e quiser uma versão em PDF para compartilhar, imprimir ou distribuir.
compatibility: bash_tool, Pandoc + WeasyPrint (auto-instalação)
---

# Markdown → PDF Converter

Converte arquivos Markdown em PDFs profissionais com formatação avançada, suporte a CSS, numeração de páginas e estilos customizáveis.

## Quando Usar Esta Skill

- Converter `.md` em `.pdf` para compartilhamento, impressão ou arquivamento
- Gerar documentação, relatórios, especificações em PDF
- Aplicar estilos profissionais (fontes, cores, espaçamento)
- Adicionar cabeçalho/rodapé, numeração de páginas
- Preprocessar Markdown antes da conversão (validar sintaxe, remover seções específicas)

## Workflow

### 1. Verificar Instalação de Dependências

```bash
#!/bin/bash
# Detectar SO e instalar Pandoc + WeasyPrint

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    sudo apt-get update
    sudo apt-get install -y pandoc weasyprint
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    brew install pandoc weasyprint
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    # Windows (Git Bash ou similar)
    echo "Windows detectado."
    echo "Para Windows, instale manualmente:"
    echo "1. Pandoc: https://github.com/jgm/pandoc/releases"
    echo "2. WeasyPrint: pip install weasyprint"
    exit 1
else
    echo "SO desconhecido. Instale Pandoc e WeasyPrint manualmente."
    exit 1
fi
```

**Resposta esperada**: Ferramentas confirmadas ou instaladas com sucesso.

---

### 2. Validar e Preparar Markdown

Antes de converter, verifique:
- Sintaxe Markdown válida
- Codificação UTF-8
- Remova seções não desejadas (ex: `<!-- SKIP_IN_PDF -->`)
- Confirme estrutura de headings (`#`, `##`, `###`, etc.)

---

### 3. Converter com Pandoc + WeasyPrint

#### Opção A: PDF Simples (Rápido)
```bash
pandoc input.md -o output.pdf
```

#### Opção B: PDF com CSS Customizado (Recomendado)
```bash
pandoc input.md \
  --pdf-engine=weasyprint \
  --css=styles.css \
  -o output.pdf
```

#### Opção C: PDF com Metadados e Variáveis
```bash
pandoc input.md \
  --pdf-engine=weasyprint \
  --css=styles.css \
  --metadata title="Meu Documento" \
  --metadata author="Seu Nome" \
  --metadata date="2024" \
  -o output.pdf
```

---

## Sugestões de Formatação Profissional

### 1. **CSS Base Elegante** (`styles.css`)

```css
/* Página e Margem */
@page {
  size: A4;
  margin: 2.5cm;
  line-height: 1.6;
}

/* Fonte Corporativa */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, sans-serif;
  font-size: 11pt;
  color: #333;
  line-height: 1.6;
  background: white;
}

/* Headings Hierárquicos */
h1 {
  font-size: 24pt;
  font-weight: 700;
  color: #003368; /* Azul corporativo OSCEIA */
  margin-top: 1.2em;
  margin-bottom: 0.8em;
  page-break-after: avoid;
  border-bottom: 3px solid #008036; /* Verde OSCEIA */
  padding-bottom: 0.5em;
}

h2 {
  font-size: 16pt;
  font-weight: 600;
  color: #008036;
  margin-top: 1em;
  margin-bottom: 0.6em;
  page-break-after: avoid;
}

h3 {
  font-size: 13pt;
  font-weight: 600;
  color: #1a1a1a;
  margin-top: 0.8em;
  margin-bottom: 0.4em;
}

/* Parágrafos */
p {
  margin-bottom: 0.6em;
  text-align: justify;
}

/* Listas */
ul, ol {
  margin: 0.6em 0;
  padding-left: 1.5em;
}

li {
  margin-bottom: 0.3em;
}

/* Código */
code {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 10pt;
  background: #f5f5f5;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  color: #d73a49;
}

pre {
  background: #f8f8f8;
  border-left: 4px solid #008036;
  padding: 0.8em;
  overflow-x: auto;
  border-radius: 4px;
}

pre code {
  background: none;
  color: #1a1a1a;
  padding: 0;
}

/* Tabelas */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 0.8em 0;
}

thead {
  background: #f0f0f0;
  font-weight: 600;
}

th, td {
  padding: 0.6em;
  border: 1px solid #ddd;
  text-align: left;
}

tbody tr:nth-child(even) {
  background: #fafafa;
}

/* Links */
a {
  color: #0366d6;
  text-decoration: none;
}

a:visited {
  color: #6f42c1;
}

/* Blockquote */
blockquote {
  border-left: 4px solid #008036;
  padding-left: 1em;
  margin-left: 0;
  margin-right: 0;
  color: #666;
  font-style: italic;
}

/* Quebras de Página */
.page-break {
  page-break-after: always;
}

.no-break {
  page-break-inside: avoid;
}

/* Rodapé e Cabeçalho */
@page {
  @bottom-center {
    content: "Página " counter(page) " de " counter(pages);
    font-size: 10pt;
    color: #999;
  }

  @top-left {
    content: "OSCEIA - Obras Sociais";
    font-size: 9pt;
    color: #999;
  }
}
```

### 2. **CSS Minimalista** (sem cores corporativas)

```css
@page {
  size: A4;
  margin: 2cm;
}

body {
  font-family: Georgia, serif;
  font-size: 12pt;
  line-height: 1.7;
  color: #222;
}

h1 { font-size: 28pt; margin-bottom: 0.5em; }
h2 { font-size: 18pt; margin-top: 1.2em; }
h3 { font-size: 14pt; margin-top: 0.8em; }

code { font-family: monospace; background: #eee; padding: 0.2em; }
pre { background: #f5f5f5; padding: 1em; overflow-x: auto; }

a { color: #0066cc; }
```

### 3. **CSS Acadêmica** (para relatórios/teses)

```css
@page {
  size: A4;
  margin: 3cm 2.5cm 3cm 3.5cm; /* Conforme ABNT */
}

body {
  font-family: 'Times New Roman', serif;
  font-size: 12pt;
  line-height: 1.5;
  color: #000;
}

h1 {
  font-size: 16pt;
  font-weight: bold;
  text-transform: uppercase;
  margin-top: 2em;
  margin-bottom: 1em;
}

h2 { font-size: 14pt; font-weight: bold; margin-top: 1.5em; }
h3 { font-size: 12pt; font-weight: bold; margin-top: 1.2em; }

p { text-align: justify; margin-bottom: 0.75em; }
ul { padding-left: 2.5cm; }

/* Recuo de primeira linha (ABNT) */
p + p { text-indent: 1.25cm; }
```

---

## Script Python Completo (Alternativa)

Crie `md2pdf.py` para automação avançada:

```python
#!/usr/bin/env python3
import subprocess
import sys
import os
from pathlib import Path

def detect_os():
    """Detecta sistema operacional."""
    if sys.platform == "linux":
        return "linux"
    elif sys.platform == "darwin":
        return "macos"
    elif sys.platform == "win32":
        return "windows"
    return "unknown"

def check_dependencies():
    """Verifica se Pandoc e WeasyPrint estão instalados."""
    try:
        subprocess.run(["pandoc", "--version"], capture_output=True, check=True)
        print("✓ Pandoc encontrado")
    except:
        print("✗ Pandoc não encontrado. Instalando...")
        install_pandoc()

def install_pandoc():
    """Instala Pandoc conforme SO detectado."""
    os_type = detect_os()
    if os_type == "linux":
        subprocess.run(["sudo", "apt-get", "update"], check=True)
        subprocess.run(["sudo", "apt-get", "install", "-y", "pandoc", "weasyprint"], check=True)
    elif os_type == "macos":
        subprocess.run(["brew", "install", "pandoc", "weasyprint"], check=True)
    elif os_type == "windows":
        print("Windows: Instale manualmente (https://github.com/jgm/pandoc/releases)")
        sys.exit(1)

def convert_md_to_pdf(md_file, pdf_file, css_file=None, metadata=None):
    """Converte Markdown em PDF."""
    cmd = ["pandoc", md_file, "--pdf-engine=weasyprint", "-o", pdf_file]
    
    if css_file and os.path.exists(css_file):
        cmd.extend(["--css", css_file])
    
    if metadata:
        for key, value in metadata.items():
            cmd.extend(["--metadata", f"{key}={value}"])
    
    print(f"Convertendo: {md_file} → {pdf_file}")
    subprocess.run(cmd, check=True)
    print(f"✓ PDF gerado: {pdf_file}")

if __name__ == "__main__":
    check_dependencies()
    
    md_input = sys.argv[1] if len(sys.argv) > 1 else "input.md"
    pdf_output = sys.argv[2] if len(sys.argv) > 2 else "output.pdf"
    css_input = sys.argv[3] if len(sys.argv) > 3 else None
    
    convert_md_to_pdf(md_input, pdf_output, css_input)
```

**Uso**:
```bash
python md2pdf.py documento.md documento.pdf styles.css
```

---

## Exemplos de Conversão

### Exemplo 1: Markdown → PDF Simples
```bash
pandoc spec.md -o spec.pdf
```

### Exemplo 2: Com Estilo Corporativo
```bash
pandoc relatorio.md \
  --pdf-engine=weasyprint \
  --css=styles-osceia.css \
  --metadata title="Relatório HESK" \
  --metadata author="Departamento de Informática" \
  -o relatorio.pdf
```

### Exemplo 3: Remover Seções Antes de Converter
```bash
# Remover comentários HTML e seções SKIP
sed '/<!--.*SKIP_IN_PDF.*-->/,/<!--.*END_SKIP.*-->/d' documento.md > documento_limpo.md

pandoc documento_limpo.md -o documento.pdf
```

---

## Dicas de Formatação para Melhor Resultado

| Elemento | Markdown | Dica |
|----------|----------|------|
| **Título Principal** | `# Título` | Use apenas um `#` por documento |
| **Seções** | `## Seção` | Organize hierarquicamente |
| **Rodapé** | Usar CSS `@page @bottom-center` | Evite `---` no final |
| **Quebra de Página** | `<div class="page-break"></div>` | No Markdown, use HTML inline |
| **Código** | ` ```lang ``` ` | Especifique linguagem para syntax highlighting |
| **Tabelas** | Markdown padrão | Pandoc converte bem para PDF |
| **Links** | `[texto](url)` | Funcionam em PDF (interativos em alguns leitores) |

---

## Troubleshooting

### Problema: "Pandoc not found"
**Solução**: Execute a seção "Verificar Instalação" acima.

### Problema: Fonte não renderiza em PDF
**Solução**: Adicione `font-family` em CSS com fallbacks (ex: `'Segoe UI', Arial, sans-serif`)

### Problema: Tabelas saem mal formatadas
**Solução**: Use CSS `table { width: 100%; border-collapse: collapse; }`

### Problema: Código envolve mal
**Solução**: Use `white-space: pre-wrap; word-wrap: break-word;` em `pre` e `code`

### Problema: Imagens não aparecem
**Solução**: Use caminhos absolutos ou coloque imagens no mesmo diretório que o `.md`

---

## Workflow Padrão Recomendado

1. **Preparar Markdown** → Validar sintaxe, remover SKIP
2. **Escolher CSS** → Corporativo, minimalista ou acadêmico
3. **Executar Conversão** → `pandoc ... --pdf-engine=weasyprint`
4. **Revisar PDF** → Abra em leitor (Adobe Reader, Foxit, etc.)
5. **Ajustar se Necessário** → Modifique Markdown ou CSS e reconverta

---

## Integração com Projetos OSCEIA

Para projetos OSCEIA (HESK, Jovem Aprendiz, PJA):

```bash
# Converter especificação de projeto
pandoc spec.md \
  --pdf-engine=weasyprint \
  --css=/path/to/osceia-brand.css \
  --metadata title="Especificação: Jovem Aprendiz Web" \
  --metadata author="Desenvolvimento" \
  -o spec-jovem-aprendiz.pdf
```

Use as cores OSCEIA em `osceia-brand.css`:
- Azul: `#003368`
- Verde: `#008036`
- Cinza neutro: `#666666`
