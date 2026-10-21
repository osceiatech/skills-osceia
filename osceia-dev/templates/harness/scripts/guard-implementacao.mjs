// Trava de implementação (.agents/harness.config, seções 1 e 3).
//   node scripts/guard-implementacao.mjs claude   hook PreToolUse do Claude Code (JSON no stdin)
//   node scripts/guard-implementacao.mjs commit   hook .githooks/pre-commit (confere os arquivos staged)
// Regras:
//   - Na main (ou HEAD solto) nada é implementado nem commitado. Só pesquisa em .notebook/ (não commitável ali).
//   - Em branch, código só com: branch <tipo>/<issue>-<slug>, pesquisa da issue no .notebook/INDEX.md
//     e spec completa em .specs/features/<issue>-<slug>/ (spec.md, design.md, tasks.md).
//   - .notebook/ e .specs/ são sempre liberados em branch (são as etapas anteriores à implementação).
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { isAbsolute, join, relative } from 'node:path';

const sh = (cmd) => execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
const raiz = sh('git rev-parse --show-toplevel');
const branch = (() => {
  try {
    return sh('git symbolic-ref --short HEAD');
  } catch {
    return 'HEAD';
  }
})();
const PROTEGIDAS = ['main', 'master', 'HEAD'];
const PADRAO_BRANCH = /^(?:(feat|fix|refactor|docs|test|chore)\/)?(\d+)-[a-z0-9][a-z0-9-]*$/;
const LIVRES_EM_BRANCH = ['.notebook/', '.specs/'];
const SPEC = ['spec.md', 'design.md', 'tasks.md'];

const bloquear = (motivo) => {
  console.error(`BLOQUEADO (.agents/harness.config): ${motivo}`);
  process.exit(2);
};

const checarBranch = () => {
  const achado = PADRAO_BRANCH.exec(branch);
  if (!achado) {
    bloquear(`a branch "${branch}" não segue <tipo>/<issue>-<slug>. Fluxo: pesquisa → issue → branch → spec → implementação.`);
  }
  const issue = achado[2];
  const indice = join(raiz, '.notebook', 'INDEX.md');
  if (!existsSync(indice) || !new RegExp(`#${issue}\\b`).test(readFileSync(indice, 'utf8'))) {
    bloquear(`falta a pesquisa da issue #${issue} no .notebook/INDEX.md (linha com #${issue}).`);
  }
  const features = join(raiz, '.specs', 'features');
  const pasta = existsSync(features)
    ? readdirSync(features).find((nome) => nome.startsWith(`${issue}-`))
    : undefined;
  if (!pasta) {
    bloquear(`falta a spec em .specs/features/${issue}-<slug>/ (spec.md, design.md, tasks.md).`);
  }
  const faltando = SPEC.filter((arq) => !existsSync(join(features, pasta, arq)));
  if (faltando.length) {
    bloquear(`spec incompleta em .specs/features/${pasta}/: falta ${faltando.join(', ')}.`);
  }
};

const rel = (arquivo) => (isAbsolute(arquivo) ? relative(raiz, arquivo) : arquivo);
const dentroDoRepo = (r) => !r.startsWith('..');
const livre = (r) => LIVRES_EM_BRANCH.some((p) => r.startsWith(p));

const avaliar = (caminhos, { permitirNotebookNaMain }) => {
  const alvos = caminhos.map(rel).filter(dentroDoRepo);
  if (!alvos.length) return;
  if (PROTEGIDAS.includes(branch)) {
    const proibidos = alvos.filter((r) => !(permitirNotebookNaMain && r.startsWith('.notebook/')));
    if (proibidos.length) {
      bloquear(`nada se implementa na ${branch}. Siga: pesquisa (.notebook/) → issue → branch <tipo>/<issue>-<slug> → spec. Arquivo: ${proibidos[0]}`);
    }
    return;
  }
  if (alvos.every(livre)) return;
  checarBranch();
};

const modo = process.argv[2];
if (modo === 'claude') {
  let entrada = '';
  process.stdin.setEncoding('utf8');
  for await (const pedaco of process.stdin) entrada += pedaco;
  const dados = JSON.parse(entrada || '{}');
  const alvo = dados.tool_input?.file_path ?? dados.tool_input?.notebook_path;
  if (alvo) avaliar([alvo], { permitirNotebookNaMain: true });
} else if (modo === 'commit') {
  const staged = sh('git diff --cached --name-only').split('\n').filter(Boolean);
  avaliar(staged, { permitirNotebookNaMain: false });
} else {
  console.error('Uso: guard-implementacao.mjs claude | commit');
  process.exit(2);
}
