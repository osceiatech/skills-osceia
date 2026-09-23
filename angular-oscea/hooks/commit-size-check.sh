#!/bin/bash
# PreToolUse (Bash), disparado so para comandos "git commit*" via filtro "if" no settings.json.
# Avisa (sem bloquear) se o commit staged for grande — incentiva commits pequenos e atomicos.
set -euo pipefail

files=$(git diff --cached --name-only 2>/dev/null | wc -l | tr -d ' ')
lines=$(git diff --cached --shortstat 2>/dev/null | grep -oE '[0-9]+ insertion' | grep -oE '[0-9]+' || true)
lines=${lines:-0}

if (( files > 8 || lines > 300 )); then
  echo "{\"systemMessage\": \"Commit grande: $files arquivo(s) staged, ~$lines linha(s) adicionadas. Prefira commits pequenos e atomicos (um passo do tasks.md por commit).\"}"
fi
