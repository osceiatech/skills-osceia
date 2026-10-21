#!/bin/bash
# Compara os arquivos de enforcement do projeto com templates/harness/ e (com --apply) atualiza.
# Só toca nos arquivos que devem ser idênticos entre projetos; harness.config, AGENTS.md e
# PULL_REQUEST_TEMPLATE.md são específicos por projeto e nunca são sobrescritos.
# Uso: sync-harness.sh [--apply] [raiz-do-projeto]
set -euo pipefail
apply=0; [[ "${1:-}" == "--apply" ]] && { apply=1; shift; }
cd "${1:-$PWD}"
tpl="$(cd "$(dirname "${BASH_SOURCE[0]}")/../templates/harness" && pwd)"
arquivos=(.githooks/pre-commit .githooks/pre-push scripts/carimbo.mjs scripts/guard-implementacao.mjs scripts/instalar-hooks.mjs scripts/verificar-padroes.mjs
  .claude/settings.json .github/workflows/ci.yml .github/git-commit-instructions.md
  .github/ISSUE_TEMPLATE/bug_report.md .github/ISSUE_TEMPLATE/feature_request.md .github/ISSUE_TEMPLATE/config.yml)
diverge=0
for f in "${arquivos[@]}"; do
  [[ -e "$f" ]] || continue
  if ! cmp -s "$tpl/$f" "$f"; then
    diverge=1; echo "diverge: $f"
    [[ $apply -eq 1 ]] && { cp "$tpl/$f" "$f"; echo "  atualizado"; }
  fi
done
[[ $diverge -eq 0 ]] && echo "enforcement em dia com os templates."
exit 0
