#!/bin/bash
# SessionStart: em projeto Angular ou React OSCEA, manda o Claude invocar a skill osceia
# e informa o estado do harness (branch, arquivos faltando).
input=$(cat)
cwd=$(echo "$input" | jq -r '.cwd // empty')
cd "${cwd:-$PWD}" 2>/dev/null || exit 0
dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$dir/lib-stack.sh"
stack=$(osceia_stack)
[[ -n "$stack" ]] || exit 0
branch=$(git symbolic-ref --short HEAD 2>/dev/null || echo "?")
faltando=$(bash "$dir/bootstrap-harness.sh" --check 2>&1 | grep '^  - ' | sed 's/^  - //' | tr '\n' ' ')

msg="PROJETO OSCEA ($stack) detectado (branch: $branch). ANTES de qualquer outra ação, invoque a skill osceia (Skill tool), rode o ciclo de verificação (bash $dir/verificar-ciclo.sh) e repasse ao usuário um resumo do contexto: projeto, branch atual, regras do .agents/harness.config e próximo passo do fluxo (pesquisa → grill-me → issue → branch → spec → implementação)."
[[ "$branch" == "main" || "$branch" == "master" ]] && msg="$msg ATENÇÃO: está na $branch — nada é implementado aqui; só pesquisa em .notebook/."
[[ -n "$faltando" ]] && msg="$msg Arquivos do harness AUSENTES: $faltando — crie-os rodando bash $dir/bootstrap-harness.sh (não sobrescreve nada)."

jq -n --arg m "$msg" '{hookSpecificOutput:{hookEventName:"SessionStart",additionalContext:$m}}'
