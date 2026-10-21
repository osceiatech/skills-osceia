// Verifica os padrões Angular OSCEIA nos arquivos alterados da branch (AGENTS.md).
// Roda no .githooks/pre-push, junto com testes e build; não existe mais job de lint/scan no GitHub Actions.
// Uso: node scripts/verificar-padroes.mjs [sha]   (padrão: HEAD; compara com a main)
//      node scripts/verificar-padroes.mjs --all   (varre todo o src/)
// Exceções intencionais: comentário na linha, // osceia-allow-effect e // osceia-allow-any.
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
const tentar = (...args) => { try { return git(...args); } catch { return ''; } };

const todos = process.argv.includes('--all');
const sha = process.argv.slice(2).find((a) => !a.startsWith('--')) ?? 'HEAD';

function arquivosAlterados() {
  if (todos) return git('ls-files', 'src').split('\n');
  const base = ['origin/main', 'main'].map((r) => tentar('merge-base', r, sha)).find(Boolean);
  if (!base) return git('ls-files', 'src').split('\n');
  return git('diff', '--name-only', '--diff-filter=ACMR', `${base}..${sha}`).split('\n');
}

// Regras: erro bloqueia o push; aviso só informa.
const regras = [
  { nivel: 'erro', ext: '.html', re: /\*ngIf|\*ngFor|\*ngSwitch|\[ngStyle\]/, msg: 'Diretiva antiga. Use @if/@for/@switch e style binding.' },
  { nivel: 'aviso', ext: '.html', re: /\[ngClass\]="\{/, msg: 'ngClass com objeto. Prefira [class.nome]="cond".' },
  { nivel: 'erro', ext: '.ts', re: /@Input\(|@Output\(/, msg: '@Input/@Output. Use input()/output().' },
  { nivel: 'erro', ext: '.ts', re: /@NgModule\(/, msg: 'NgModule. Use apenas componentes standalone.' },
  { nivel: 'erro', ext: '.ts', re: /console\.log.*(cpf|email|token|password|senha|jwt)/i, msg: '[LGPD] Possível dado sensível em console.log.' },
  { nivel: 'aviso', ext: '.ts', re: /\beffect\(/, ignora: 'osceia-allow-effect', msg: 'effect(). Prefira computed()/toObservable; intencional: // osceia-allow-effect.' },
  { nivel: 'aviso', ext: '.ts', re: /: any\b|as any\b/, ignora: 'osceia-allow-any', msg: "Uso de 'any'. Prefira unknown; intencional: // osceia-allow-any." },
];

/** Aplica as regras ao conteúdo de um arquivo e devolve os achados `{ nivel, linha, msg }`. */
export function verificarConteudo(arquivo, conteudo) {
  const achados = [];
  for (const regra of regras.filter((r) => arquivo.endsWith(r.ext))) {
    conteudo.split('\n').forEach((linha, i) => {
      if (!regra.re.test(linha) || (regra.ignora && linha.includes(regra.ignora))) return;
      achados.push({ nivel: regra.nivel, linha: i + 1, msg: regra.msg });
    });
  }
  return achados;
}

function main() {
  const arquivos = arquivosAlterados().filter((f) => f.startsWith('src/') && existsSync(f));
  let erros = 0;
  let avisos = 0;
  for (const arquivo of arquivos) {
    for (const { nivel, linha, msg } of verificarConteudo(arquivo, readFileSync(arquivo, 'utf8'))) {
      console.error(`${nivel === 'erro' ? 'ERRO ' : 'aviso'} ${arquivo}:${linha}  ${msg}`);
      if (nivel === 'erro') erros++; else avisos++;
    }
  }
  console.error(`padrões OSCEIA: ${arquivos.length} arquivo(s), ${erros} erro(s), ${avisos} aviso(s).`);
  process.exit(erros ? 1 : 0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
