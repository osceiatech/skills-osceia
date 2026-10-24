#!/bin/bash
# Detecta a stack do projeto no diretório atual: imprime "angular", "react" ou nada.
osceia_stack() {
  if [[ -f angular.json ]]; then echo angular
  elif [[ -f package.json ]] && command -v jq >/dev/null \
    && jq -e '(.dependencies // {}) + (.devDependencies // {}) | has("react")' package.json >/dev/null 2>&1; then echo react
  fi
}
