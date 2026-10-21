// Carimbo de verificação: prova de que testes e build passaram no commit exato que vai para o PR.
// O carimbo é a ref `refs/verificacoes/<sha>` no remoto, criada pelo hook .githooks/pre-push
// só depois de `npm test` e `npm run build` passarem. Commit novo = sha novo = novo push = novos testes.
//   node scripts/carimbo.mjs gerar <sha> <remoto>     cria a ref no remoto (chamado pelo pre-push)
//   node scripts/carimbo.mjs mostrar [remoto]         confere se o HEAD tem carimbo (npm run carimbo)
//   node scripts/carimbo.mjs conferir <sha> [remoto]  usado no ci.yml
import { execFileSync } from 'node:child_process';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const refDe = (sha) => `refs/verificacoes/${sha}`;
const temCarimbo = (remoto, sha) => {
  const saida = git('ls-remote', remoto, refDe(sha));
  return saida.split(/\s+/)[0] === sha;
};

const [comando, arg1, arg2] = process.argv.slice(2);

try {
  if (comando === 'gerar') {
    git('push', '--no-verify', arg2, `${arg1}:${refDe(arg1)}`);
    console.log(`Carimbo gravado no remoto: ${refDe(arg1)}`);
  } else if (comando === 'mostrar') {
    const sha = git('rev-parse', 'HEAD');
    if (!temCarimbo(arg1 ?? 'origin', sha)) {
      console.error(`Sem carimbo para ${sha.slice(0, 7)}: faça o push da branch (o hook roda testes e build).`);
      process.exit(1);
    }
    console.log(`Carimbo ok para ${sha.slice(0, 7)}: ${refDe(sha)}`);
  } else if (comando === 'conferir') {
    if (!temCarimbo(arg2 ?? 'origin', arg1)) {
      console.error(`Sem carimbo para o commit ${arg1.slice(0, 7)} do PR. Rode o push da branch pelo hook (.githooks/pre-push), que roda testes e build. Commit novo exige novo push.`);
      process.exit(1);
    }
    console.log('Carimbo válido.');
  } else {
    console.error('Uso: carimbo.mjs gerar <sha> <remoto> | mostrar [remoto] | conferir <sha> [remoto]');
    process.exit(2);
  }
} catch (erro) {
  console.error(erro.stderr?.toString() || erro.message);
  process.exit(1);
}
