# 🚀 Guia de Instalação - osceia-design Skill

Instruções passo a passo para instalar a skill de design OSCEIA em seu ambiente.

---

## 📋 Pré-requisitos

- **Claude Code**, **Cursor**, **GitHub Copilot** ou outra ferramenta com suporte a skills
- Terminal/PowerShell (Windows)
- Acesso de leitura/escrita em `~/.claude/` ou projeto local

---

## ⚡ Opção 1: Instalação Automática (Recomendado)

### macOS / Linux

```bash
# Navegue até a pasta descompactada
cd osceia-design-skill

# Execute o script de instalação
bash install-osceia-design.sh

# Ou especifique o escopo diretamente:
bash install-osceia-design.sh --global    # Instalar globalmente
bash install-osceia-design.sh --project   # Instalar no projeto
```

### Windows (PowerShell)

```powershell
# Navegue até a pasta descompactada
cd osceia-design-skill

# Execute o script (você pode precisar permitir execução)
powershell -ExecutionPolicy Bypass -File install-osceia-design.ps1

# Ou especifique o escopo:
powershell -ExecutionPolicy Bypass -File install-osceia-design.ps1 -Scope global
powershell -ExecutionPolicy Bypass -File install-osceia-design.ps1 -Scope project
```

---

## 🔧 Opção 2: Instalação Manual

### Passo 1: Descompactar Arquivo

**Se recebeu `osceia-design.tar.gz`:**

```bash
# macOS / Linux
tar -xzf osceia-design.tar.gz
cd osceia-design

# Windows (PowerShell)
tar -xzf osceia-design.tar.gz
cd osceia-design
```

**Se recebeu `osceia-design.zip`:**

```bash
# Descompacte usando seu gerenciador de arquivos
# ou:
unzip osceia-design.zip
cd osceia-design
```

### Passo 2: Escolher Escopo

#### 📍 Instalação Global (Disponível em Todos os Projetos)

**macOS / Linux:**
```bash
mkdir -p ~/.claude/skills/
cp -r osceia-design ~/.claude/skills/
```

**Windows (PowerShell):**
```powershell
New-Item -ItemType Directory -Path "$env:USERPROFILE\.claude\skills" -Force | Out-Null
Copy-Item -Path .\osceia-design -Destination "$env:USERPROFILE\.claude\skills\" -Recurse -Force
```

#### 📁 Instalação por Projeto (Apenas Este Projeto)

**macOS / Linux:**
```bash
# Na raiz do seu projeto
mkdir -p .claude/skills/
cp -r osceia-design .claude/skills/
```

**Windows (PowerShell):**
```powershell
# Na raiz do seu projeto
New-Item -ItemType Directory -Path .\.claude\skills -Force | Out-Null
Copy-Item -Path .\osceia-design -Destination .\.claude\skills\ -Recurse -Force
```

### Passo 3: Recarregar IDE

Reinicie sua ferramenta:
- **Claude Code:** Feche e abra novamente
- **Cursor:** Feche e abra novamente
- **GitHub Copilot:** Recarregue a extensão

---

## ✅ Verificar Instalação

### Claude Code / Cursor

1. Abra um arquivo ou novo projeto
2. Digite `/` no editor
3. Procure por `osceia-design` no autocomplete
4. Deve aparecer `/osceia-design init` e outros comandos

### GitHub Copilot (VS Code)

1. Abra a paleta de comandos (`Ctrl/Cmd + Shift + P`)
2. Digite `@` para ativar Copilot Chat
3. Digite `/`
4. Procure por `osceia-design`

---

## 🚀 Primeiro Uso

### 1. Inicializar Projeto

```
/osceia-design init
```

Escolha o tipo de projeto:
- **app** → Sistema web (Angular, Supabase)
- **documento** → Word/PDF (boletins, relatórios)
- **processo** → BPMN (fluxos)

### 2. Criar Componente Angular

```
/osceia-design component LoginForm
```

### 3. Auditar Projeto

```
/osceia-design audit
```

### 4. Gerar Documento

```
/osceia-design document boletim
```

---

## 📁 Estrutura de Diretórios

Após instalação, sua pasta terá:

```
osceia-design/
├── SKILL.md                    # Definição da skill (23 comandos)
├── README.md                   # Documentação
├── references/
│   ├── tokens.css              # CSS variables (paleta OSCEIA)
│   └── exemplos-uso.md         # 4 casos reais
└── assets/
    └── OSCEIA.config.json      # Configuração padrão
```

---

## 🆘 Troubleshooting

### "Comando /osceia-design não aparece"

**Solução:**
1. ✓ Verifique que `SKILL.md` está no lugar correto:
   - Global: `~/.claude/skills/osceia-design/SKILL.md`
   - Projeto: `./.claude/skills/osceia-design/SKILL.md`

2. ✓ Reinicie o IDE completamente (feche e abra)

3. ✓ Se ainda não aparecer, procure por "osceia" ou "design" no autocomplete

### "Erro de permissão ao copiar"

**Solução:**
```bash
# macOS / Linux
chmod -R 755 osceia-design

# Tente instalar novamente
bash install-osceia-design.sh
```

### "PowerShell não executa script"

**Solução:**
```powershell
# Permitir execução temporária
powershell -ExecutionPolicy Bypass -File install-osceia-design.ps1

# Ou, se preferir mudar globalmente (não recomendado):
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "Arquivo não encontrado ao descompactar"

**Solução:**
1. Certifique-se de que descompactou completamente
2. Verifique que está no diretório `osceia-design/`
3. Tente novo download se arquivo estiver corrompido

---

## 📚 Documentação

Após instalar, consulte:

- **SKILL.md** - Referência completa de comandos (23 comandos)
- **README.md** - Como usar
- **exemplos-uso.md** - 4 casos reais:
  - LoginForm Angular com acessibilidade
  - Boletim escolar Word
  - Processo BPMN
  - Auditoria completa

---

## 🔄 Atualizar Skill

Para atualizar a skill no futuro:

**Opção 1: Reinstalar**
```bash
# Delete a pasta antiga
rm -rf ~/.claude/skills/osceia-design  # global
# ou
rm -rf ./.claude/skills/osceia-design  # projeto

# Copie a nova versão
bash install-osceia-design.sh
```

**Opção 2: Git (para times)**
```bash
cd ~/.claude/skills/osceia-design
git pull origin main
```

---

## 🎯 Próximos Passos

1. ✅ Instale a skill
2. ✅ Execute `/osceia-design init` em novo projeto
3. ✅ Explore os comandos:
   - `/osceia-design component <nome>`
   - `/osceia-design audit`
   - `/osceia-design document <tipo>`
4. ✅ Consulte `exemplos-uso.md` para inspiração

---

## 💬 Suporte

Se encontrar problemas:

1. **Verifique a instalação:** Você seguiu um dos guias acima?
2. **Consulte a documentação:** Veja `SKILL.md` ou `README.md`
3. **Veja exemplos:** `references/exemplos-uso.md` tem 4 casos reais
4. **Procure por "osceia":** No autocomplete, procure por esse termo

---

## 📦 Arquivos de Instalação

Os seguintes arquivos foram fornecidos:

- `osceia-design.tar.gz` - Arquivo compactado (Linux/macOS)
- `osceia-design.zip` - Arquivo compactado (Windows)
- `install-osceia-design.sh` - Script automático (macOS/Linux)
- `install-osceia-design.ps1` - Script automático (Windows PowerShell)
- `INSTALACAO.md` - Este guia

---

**Skill osceia-design pronta para uso! 🎨✨**

Versão 1.0 | Agosto 2026 | OSCEIA
