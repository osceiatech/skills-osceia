#!/bin/bash

###############################################################################
# Script de Instalação - osceia-design Skill
# 
# Uso:
#   bash install-osceia-design.sh [--global] [--project]
#
# Opções:
#   --global    Instalar globalmente (~/.claude/skills/)
#   --project   Instalar no projeto atual (./.claude/skills/)
#   (padrão)    Perguntar ao usuário
#
###############################################################################

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Detectar sistema operacional
OS_TYPE=$(uname -s)
case "$OS_TYPE" in
    Darwin*) OS="macos" ;;
    Linux*)  OS="linux" ;;
    MINGW*|MSYS*|CYGWIN*) OS="windows" ;;
    *) OS="unknown" ;;
esac

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  osceia-design Skill - Instalador${NC}"
echo -e "${BLUE}  Design integrado para projetos OSCEIA${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

# Determinar scope de instalação
SCOPE=${1:--ask}

if [ "$SCOPE" == "--ask" ] || [ "$SCOPE" == "" ]; then
    echo -e "${YELLOW}Escolha onde instalar:${NC}"
    echo "  1) Globalmente (~/.claude/skills/) - Disponível em todos os projetos"
    echo "  2) No projeto atual (./.claude/skills/) - Apenas este projeto"
    echo ""
    read -p "Opção (1 ou 2): " choice
    
    case $choice in
        1) SCOPE="--global" ;;
        2) SCOPE="--project" ;;
        *) echo -e "${RED}✗ Opção inválida${NC}"; exit 1 ;;
    esac
fi

# Definir caminhos
if [ "$SCOPE" == "--global" ]; then
    if [ "$OS" == "windows" ]; then
        INSTALL_PATH="$USERPROFILE/.claude/skills/osceia-design"
    else
        INSTALL_PATH="$HOME/.claude/skills/osceia-design"
    fi
    SCOPE_NAME="Global"
elif [ "$SCOPE" == "--project" ]; then
    INSTALL_PATH="./.claude/skills/osceia-design"
    SCOPE_NAME="Projeto Atual"
else
    echo -e "${RED}✗ Opção inválida: $SCOPE${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Instalando em: ${GREEN}$INSTALL_PATH${NC}"
echo -e "${BLUE}🎯 Escopo: ${GREEN}$SCOPE_NAME${NC}"
echo ""

# Criar diretórios
echo -e "${YELLOW}📁 Criando diretórios...${NC}"
mkdir -p "$(dirname "$INSTALL_PATH")"
mkdir -p "$INSTALL_PATH/references"
mkdir -p "$INSTALL_PATH/assets"

# Copiar arquivos
echo -e "${YELLOW}📄 Copiando arquivos...${NC}"

# Arquivos principais
if [ -f "SKILL.md" ]; then
    cp SKILL.md "$INSTALL_PATH/"
    echo -e "${GREEN}  ✓ SKILL.md${NC}"
else
    echo -e "${RED}  ✗ SKILL.md não encontrado${NC}"
fi

if [ -f "README.md" ]; then
    cp README.md "$INSTALL_PATH/"
    echo -e "${GREEN}  ✓ README.md${NC}"
else
    echo -e "${RED}  ✗ README.md não encontrado${NC}"
fi

# Referências
if [ -f "references/tokens.css" ]; then
    cp references/tokens.css "$INSTALL_PATH/references/"
    echo -e "${GREEN}  ✓ references/tokens.css${NC}"
fi

if [ -f "references/exemplos-uso.md" ]; then
    cp references/exemplos-uso.md "$INSTALL_PATH/references/"
    echo -e "${GREEN}  ✓ references/exemplos-uso.md${NC}"
fi

# Assets
if [ -f "assets/OSCEIA.config.json" ]; then
    cp assets/OSCEIA.config.json "$INSTALL_PATH/assets/"
    echo -e "${GREEN}  ✓ assets/OSCEIA.config.json${NC}"
fi

echo ""

# Verificar instalação
if [ -f "$INSTALL_PATH/SKILL.md" ]; then
    echo -e "${GREEN}✓ Instalação concluída com sucesso!${NC}"
    echo ""
    echo -e "${BLUE}📋 Próximos passos:${NC}"
    echo ""
    
    if [ "$SCOPE" == "--global" ]; then
        echo "1. Reinicie seu IDE (Claude Code, Cursor, GitHub Copilot)"
        echo "2. Digite /osceia-design no seu IDE"
        echo "3. Execute: /osceia-design init"
    else
        echo "1. Reinicie seu IDE (Claude Code, Cursor, GitHub Copilot)"
        echo "2. Abra um arquivo do projeto"
        echo "3. Digite /osceia-design no seu IDE"
        echo "4. Execute: /osceia-design init"
    fi
    
    echo ""
    echo -e "${BLUE}📚 Documentação:${NC}"
    echo "  • Referência: $INSTALL_PATH/SKILL.md"
    echo "  • Instalação: $INSTALL_PATH/README.md"
    echo "  • Exemplos: $INSTALL_PATH/references/exemplos-uso.md"
    echo "  • Tokens: $INSTALL_PATH/references/tokens.css"
    echo ""
    echo -e "${GREEN}Skill osceia-design pronta para uso! 🎨✨${NC}"
else
    echo -e "${RED}✗ Erro na instalação${NC}"
    echo "Verifique se os arquivos estão no diretório atual"
    exit 1
fi
