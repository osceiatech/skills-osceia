#!/bin/bash
# Ciclo de verificação OSCEA em projeto Angular ou React:
#   1. harness e templates presentes   2. testes passando   3. padrões da skill respeitados
# Uso: verificar-ciclo.sh [--rapido] [raiz-do-projeto]
#   --rapido  pula os testes (só harness e padrões).
# Não altera arquivos nem faz commit; exit 1 se alguma etapa falhar.
set -uo pipefail
rapido=0; [[ "${1:-}" == "--rapido" ]] && { rapido=1; shift; }
dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${1:-$PWD}" || exit 1
source "$dir/lib-stack.sh"
stack=$(osceia_stack)
[[ -n "$stack" ]] || { echo "verificar-ciclo: não é projeto Angular nem React; nada a verificar."; exit 0; }

falhas=()
echo "== OSCEA: ciclo de verificação ($stack) =="

echo; echo "[1/3] Harness e templates"
if bash "$dir/bootstrap-harness.sh" --check; then :; else falhas+=("harness incompleto (rode hooks/bootstrap-harness.sh)"); fi
bash "$dir/sync-harness.sh"

echo; echo "[2/3] Testes"
if [[ $rapido -eq 1 ]]; then echo "pulado (--rapido)"
elif [[ -f package.json ]] && jq -e '.scripts.test' package.json >/dev/null 2>&1; then
  saida=$(npm test --silent -- --run 2>&1); status=$?
  echo "$saida" | tail -20
  [[ $status -eq 0 ]] || falhas+=("npm test falhou")
else falhas+=("sem script 'test' no package.json"); fi

echo; echo "[3/3] Padrões"
padroes=scripts/verificar-padroes.mjs; [[ -f $padroes ]] || padroes="$dir/../templates/harness/scripts/verificar-padroes.mjs"
if [[ -d src ]]; then node "$padroes" --all || falhas+=("padrões violados (erros acima)"); else echo "sem src/"; fi

echo
if [[ ${#falhas[@]} -eq 0 ]]; then echo "CICLO OK."; exit 0; fi
echo "CICLO COM FALHAS:"; printf '  - %s\n' "${falhas[@]}"; exit 1
