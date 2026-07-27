#!/bin/bash
# PostToolUse (Write|Edit) em arquivos .ts/.tsx: a cada 20 edicoes na sessao,
# sugere rodar a skill cyclomatic-complexity para manter o codigo simples.
set -euo pipefail

input=$(cat)
file=$(echo "$input" | jq -r '.tool_input.file_path // .tool_response.filePath // empty')
session=$(echo "$input" | jq -r '.session_id // "nosession"')

[[ "$file" == *.ts || "$file" == *.tsx ]] || exit 0

state_dir="/tmp/claude-oscea-hooks/${session}"
mkdir -p "$state_dir"
counter_file="$state_dir/ts-edit-count"

count=$(( $(cat "$counter_file" 2>/dev/null || echo 0) + 1 ))
echo "$count" > "$counter_file"

if (( count % 20 == 0 )); then
  echo "{\"systemMessage\": \"Ja foram $count edicoes de arquivos .ts nesta sessao. Considere rodar a skill cyclomatic-complexity para checar se alguma funcao ficou complexa demais.\"}"
fi
