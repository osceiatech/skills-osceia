#!/usr/bin/env node
// Abre ou atualiza o PR de release com o login do `gh` de quem roda (versionamento: skill osceia, references/versionamento.md).
//
//   npm run release:pr               # abre/atualiza "chore: release X.Y.Z"
//   npm run release:pr -- --dry-run  # só mostra a versão e o changelog, sem criar nada
//
// Roda depois de cada merge na main (bloco de entrega do .agents/harness.config, §3 passo 6).
// A tag vX.Y.Z e o GitHub Release saem no workflow .github/workflows/release-please.yml, ao mergear o PR de release.
// Regra de numeração: .github/git-commit-instructions.md.
import { execFileSync, spawnSync } from 'node:child_process';

const VERSAO_RELEASE_PLEASE = '17.3.0';

function falhar(mensagem) {
  console.error(`release:pr: ${mensagem}`);
  process.exit(1);
}

function repositorio() {
  let url;
  try {
    url = execFileSync('git', ['remote', 'get-url', 'origin'], { encoding: 'utf8' }).trim();
  } catch {
    falhar('não achei o remoto "origin" do git.');
  }
  const achado = /github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?$/.exec(url);
  if (!achado) falhar(`o remoto "origin" não é do GitHub: ${url}`);
  return `${achado[1]}/${achado[2]}`;
}

function token() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    const valor = execFileSync('gh', ['auth', 'token'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    if (valor) return valor;
  } catch {
    // cai na mensagem abaixo
  }
  return falhar('sem token do GitHub. Instale o gh e rode "gh auth login" (ou defina GITHUB_TOKEN).');
}

const repo = repositorio();
const extras = process.argv.slice(2);
const simulacao = extras.includes('--dry-run');

console.log(`release:pr: ${simulacao ? 'simulando' : 'abrindo/atualizando'} o PR de release de ${repo} (release-please ${VERSAO_RELEASE_PLEASE})...`);

const resultado = spawnSync(
  'npx',
  [
    // --loglevel=warn: sem isso o npm 11 imprime a linha de comando inteira ("npm notice run ..."), com o token.
    '--loglevel=warn',
    '-y',
    `release-please@${VERSAO_RELEASE_PLEASE}`,
    'release-pr',
    `--token=${token()}`,
    `--repo-url=${repo}`,
    '--config-file=release-please-config.json',
    '--manifest-file=.release-please-manifest.json',
    '--target-branch=main',
    ...extras,
  ],
  { stdio: 'inherit' },
);

if (resultado.error) falhar(`não consegui rodar o npx: ${resultado.error.message}`);
if (resultado.status !== 0) falhar(`o release-please terminou com erro (código ${resultado.status}).`);
console.log(simulacao ? 'release:pr: simulação concluída, nada foi criado.' : 'release:pr: pronto. Confira o PR "chore: release ..." no GitHub e mergeie quando quiser lançar.');
