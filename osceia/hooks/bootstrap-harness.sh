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
# Versionamento (references/versionamento.md): versão atual, commit de partida do changelog e arquivo de versão do app
versao=$(jq -r '.version // "0.0.0"' package.json 2>/dev/null || echo 0.0.0)
bootstrap_sha=$(git rev-parse --verify -q origin/main 2>/dev/null || git rev-parse --verify -q HEAD 2>/dev/null || true)
if [[ "$(osceia_stack)" == angular ]]; then arquivo_versao=src/app/core/versao.ts; else arquivo_versao=src/versao.ts; fi

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
      sed -e "s#{{PROJETO}}#$projeto#g" -e "s#{{REPO}}#$repo#g" -e "s#{{WORKFLOW_AZURE}}#$workflow#g" \
          -e "s#{{VERSAO}}#$versao#g" -e "s#{{BOOTSTRAP_SHA}}#$bootstrap_sha#g" -e "s#{{ARQUIVO_VERSAO}}#$arquivo_versao#g" \
          "$tpl/$rel" > "$rel"
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
  if [[ -z "$(jq -r '.scripts["release:pr"] // empty' package.json)" ]]; then
    tmp=$(mktemp); jq '.scripts["release:pr"]="node scripts/release.mjs"' package.json > "$tmp" && mv "$tmp" package.json
    echo "package.json: script release:pr adicionado."
  fi
else
  pendencias+=("adicionar em package.json: \"prepare\": \"node scripts/instalar-hooks.mjs\", \"carimbo\": \"node scripts/carimbo.mjs mostrar\" e \"release:pr\": \"node scripts/release.mjs\"")
fi
if printf '%s\n' "${missing[@]}" | grep -qx 'release-please-config.json'; then
  [[ -n "$bootstrap_sha" ]] || pendencias+=("release-please-config.json: preencher bootstrap-sha (sem commit na origin/main)")
  pendencias+=("versionamento: criar $arquivo_versao e mostrar a versão na tela (references/versionamento.md)")
  [[ "$versao" == 0.* ]] && pendencias+=("versionamento: projeto já em produção? mergear o PR que traz o versionamento com --body \"Release-As: 1.0.0\"")
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
