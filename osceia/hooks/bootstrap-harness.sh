#!/bin/bash
# Cria, SEM sobrescrever, os arquivos do harness OSCEA que faltam no projeto atual.
# Uso: bootstrap-harness.sh [--check] [raiz-do-projeto]
#   --check  só lista o que falta (exit 1 se faltar algo); não cria nada.
set -euo pipefail

check=0
[[ "${1:-}" == "--check" ]] && { check=1; shift; }
root="${1:-$PWD}"
tpl="$(cd "$(dirname "${BASH_SOURCE[0]}")/../templates/harness" && pwd)"
cd "$root"

source "$tpl/../../hooks/lib-stack.sh"
[[ -n "$(osceia_stack)" ]] || { echo "bootstrap-harness: $root não é um projeto Angular nem React (sem angular.json nem react no package.json)." >&2; exit 0; }

repo=$(basename "$root")
projeto=$(echo "${repo#osceia-}" | sed 's/./\u&/')
workflow=$(cd .github/workflows 2>/dev/null && ls azure-static-web-apps-*.yml 2>/dev/null | head -1 || true)
workflow="${workflow:-azure-static-web-apps-<ID>.yml}"

missing=()
while IFS= read -r -d '' f; do
  rel="${f#"$tpl"/}"
  [[ -e "$rel" ]] || missing+=("$rel")
done < <(find "$tpl" -type f -print0)

# Estrutura de pastas que o guard exige
for d in .notebook .specs/features; do [[ -d "$d" ]] || missing+=("$d/"); done
[[ -f .notebook/INDEX.md ]] || missing+=(".notebook/INDEX.md")

if [[ ${#missing[@]} -eq 0 ]]; then echo "harness OSCEA completo."; exit 0; fi

printf 'Faltando:\n'; printf '  - %s\n' "${missing[@]}"
[[ $check -eq 1 ]] && exit 1

for rel in "${missing[@]}"; do
  case "$rel" in
    */) mkdir -p "$rel" ;;
    .notebook/INDEX.md)
      mkdir -p .notebook
      printf '# .notebook\n> Project intelligence — read before every mission\n\nLast updated: %s\n' "$(date +%F)" > "$rel" ;;
    *)
      mkdir -p "$(dirname "$rel")"
      sed -e "s#{{PROJETO}}#$projeto#g" -e "s#{{REPO}}#$repo#g" -e "s#{{WORKFLOW_AZURE}}#$workflow#g" "$tpl/$rel" > "$rel"
      [[ "$rel" == .githooks/* ]] && chmod +x "$rel" ;;
  esac
done

# --- Pós-criação: o que dá para automatizar sem risco ---
pendencias=()
if [[ -f package.json ]] && command -v jq >/dev/null; then
  if [[ "$(jq -r '.scripts.prepare // empty' package.json)" != *instalar-hooks* ]]; then
    tmp=$(mktemp); jq '.scripts.prepare="node scripts/instalar-hooks.mjs" | .scripts.carimbo="node scripts/carimbo.mjs mostrar"' package.json > "$tmp" && mv "$tmp" package.json
    echo "package.json: scripts prepare e carimbo adicionados."
  fi
else
  pendencias+=("adicionar em package.json: \"prepare\": \"node scripts/instalar-hooks.mjs\" e \"carimbo\": \"node scripts/carimbo.mjs mostrar\"")
fi
if git rev-parse --git-dir >/dev/null 2>&1; then
  git config core.hooksPath .githooks && echo "git: core.hooksPath = .githooks"
fi
grep -q 'harness.config' AGENTS.md 2>/dev/null || pendencias+=("AGENTS.md existente não cita .agents/harness.config — acrescentar a seção 'Regras do agente (harness)'")
grep -q 'azure-static-web-apps' .github/workflows/*.yml 2>/dev/null || pendencias+=("não há workflow Azure em .github/workflows — ajustar a seção 6 do harness.config")
pendencias+=("conferir em harness.config: repositório ($repo), comandos de verificação (lint? backend?) e exemplos")
pendencias+=("commit é por conta da pessoa: o agente não commita")

echo "Criados."
printf 'Pendências:\n'; printf '  - %s\n' "${pendencias[@]}"
