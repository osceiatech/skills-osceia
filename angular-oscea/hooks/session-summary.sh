#!/bin/bash
# Stop: ao final da sessao, resume quais features foram alteradas e lembra
# de testes e2e, specs atualizadas e cyclomatic-complexity antes do PR.
set -euo pipefail

input=$(cat)
session=$(echo "$input" | jq -r '.session_id // "nosession"')
state_dir="/tmp/claude-oscea-hooks/${session}"

[[ -d "$state_dir" ]] || exit 0

features=$(ls "$state_dir" 2>/dev/null | grep '^feature-' | sed 's/^feature-//' | tr '\n' ',' | sed 's/,$//' | sed 's/,/, /g')
[[ -z "$features" ]] && { rm -rf "$state_dir"; exit 0; }

echo "{\"systemMessage\": \"Features alteradas nesta sessao: $features. Antes de abrir o PR: (1) specs atualizadas em .specs/features/, (2) testes de ponta a ponta cobrindo o fluxo, (3) rode a skill cyclomatic-complexity se mexeu em logica condicional, (4) commits pequenos e atomicos.\"}"

rm -rf "$state_dir"
