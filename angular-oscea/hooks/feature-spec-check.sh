#!/bin/bash
# PostToolUse (Write|Edit): avisa se a feature editada nao tem spec em .specs/
# e marca a feature como "tocada" nesta sessao (lido depois pelo session-summary.sh no Stop).
# Nao bloqueia — so avisa uma vez por feature por sessao.
set -euo pipefail

input=$(cat)
file=$(echo "$input" | jq -r '.tool_input.file_path // .tool_response.filePath // empty')
session=$(echo "$input" | jq -r '.session_id // "nosession"')

[[ -z "$file" ]] && exit 0
[[ "$file" =~ src/app/features/([^/]+)/ ]] || exit 0

feature="${BASH_REMATCH[1]}"
root=$(git -C "$(dirname "$file")" rev-parse --show-toplevel 2>/dev/null || true)
[[ -z "$root" ]] && exit 0

state_dir="/tmp/claude-oscea-hooks/${session}"
mkdir -p "$state_dir"
touch "$state_dir/feature-${feature//\//_}"

spec_marker="$state_dir/spec-warned-${feature//\//_}"
if [[ ! -f "$root/.specs/features/$feature/spec.md" && ! -f "$spec_marker" ]]; then
  touch "$spec_marker"
  printf '{"systemMessage": "Feature \\"%s\\" sem spec em .specs/features/%s/spec.md. Fluxo esperado: grill-me -> tlc-spec-driven -> gh-issue-dor-dod -> implementacao. Ignore se for uma quick task."}\n' "$feature" "$feature"
fi
