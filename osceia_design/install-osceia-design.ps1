#############################################################################
# Script de Instalação - osceia-design Skill (Windows PowerShell)
# 
# Uso:
#   powershell -ExecutionPolicy Bypass -File install-osceia-design.ps1 [-Scope global|project]
#
#############################################################################

param(
    [ValidateSet('global', 'project')]
    [string]$Scope = 'ask'
)

# Cores
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Error { Write-Host $args -ForegroundColor Red }
function Write-Info { Write-Host $args -ForegroundColor Blue }
function Write-Warning { Write-Host $args -ForegroundColor Yellow }

Write-Info "════════════════════════════════════════════════════════════"
Write-Info "  osceia-design Skill - Instalador (Windows)"
Write-Info "  Design integrado para projetos OSCEIA"
Write-Info "════════════════════════════════════════════════════════════"
Write-Host ""

# Perguntar escopo se não especificado
if ($Scope -eq 'ask') {
    Write-Warning "Escolha onde instalar:"
    Write-Host "  1) Globalmente (%USERPROFILE%\.claude\skills\) - Disponível em todos os projetos"
    Write-Host "  2) No projeto atual (.\.claude\skills\) - Apenas este projeto"
    Write-Host ""
    $choice = Read-Host "Opção (1 ou 2)"
    
    switch ($choice) {
        '1' { $Scope = 'global' }
        '2' { $Scope = 'project' }
        default {
            Write-Error "✗ Opção inválida"
            exit 1
        }
    }
}

# Definir caminhos
if ($Scope -eq 'global') {
    $InstallPath = Join-Path $env:USERPROFILE '.claude\skills\osceia-design'
    $ScopeName = 'Global'
} else {
    $InstallPath = '.\.claude\skills\osceia-design'
    $ScopeName = 'Projeto Atual'
}

Write-Info "📦 Instalando em: $(Write-Success $InstallPath)"
Write-Info "🎯 Escopo: $(Write-Success $ScopeName)"
Write-Host ""

# Criar diretórios
Write-Warning "📁 Criando diretórios..."
try {
    New-Item -ItemType Directory -Path $InstallPath -Force | Out-Null
    New-Item -ItemType Directory -Path "$InstallPath\references" -Force | Out-Null
    New-Item -ItemType Directory -Path "$InstallPath\assets" -Force | Out-Null
    Write-Success "  ✓ Diretórios criados"
} catch {
    Write-Error "  ✗ Erro ao criar diretórios: $_"
    exit 1
}

# Copiar arquivos
Write-Warning "📄 Copiando arquivos..."

$files = @{
    'SKILL.md' = "$InstallPath\"
    'README.md' = "$InstallPath\"
    'references/tokens.css' = "$InstallPath\references\"
    'references/exemplos-uso.md' = "$InstallPath\references\"
    'assets/OSCEIA.config.json' = "$InstallPath\assets\"
}

foreach ($file in $files.GetEnumerator()) {
    $source = $file.Key
    $dest = $file.Value
    
    if (Test-Path $source) {
        Copy-Item -Path $source -Destination $dest -Force
        Write-Success "  ✓ $source"
    } else {
        Write-Warning "  ⚠ $source não encontrado"
    }
}

Write-Host ""

# Verificar instalação
if (Test-Path "$InstallPath\SKILL.md") {
    Write-Success "✓ Instalação concluída com sucesso!"
    Write-Host ""
    
    Write-Info "📋 Próximos passos:"
    Write-Host ""
    
    if ($Scope -eq 'global') {
        Write-Host "1. Reinicie seu IDE (Claude Code, Cursor, GitHub Copilot)"
        Write-Host "2. Digite /osceia-design no seu IDE"
        Write-Host "3. Execute: /osceia-design init"
    } else {
        Write-Host "1. Reinicie seu IDE (Claude Code, Cursor, GitHub Copilot)"
        Write-Host "2. Abra um arquivo do projeto"
        Write-Host "3. Digite /osceia-design no seu IDE"
        Write-Host "4. Execute: /osceia-design init"
    }
    
    Write-Host ""
    Write-Info "📚 Documentação:"
    Write-Host "  • Referência: $InstallPath\SKILL.md"
    Write-Host "  • Instalação: $InstallPath\README.md"
    Write-Host "  • Exemplos: $InstallPath\references\exemplos-uso.md"
    Write-Host "  • Tokens: $InstallPath\references\tokens.css"
    Write-Host ""
    Write-Success "Skill osceia-design pronta para uso! 🎨✨"
} else {
    Write-Error "✗ Erro na instalação"
    Write-Host "Verifique se os arquivos estão no diretório atual"
    exit 1
}
