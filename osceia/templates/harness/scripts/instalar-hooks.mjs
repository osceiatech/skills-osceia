// Liga os hooks versionados em .githooks/ (ex.: pre-push que bloqueia push na main).
// Roda no `npm install`; fora de um repositório git (ex.: pacote baixado) não faz nada.
import { execSync } from 'node:child_process';

try {
  execSync('git rev-parse --git-dir', { stdio: 'ignore' });
  execSync('git config core.hooksPath .githooks', { stdio: 'ignore' });
} catch {
  // Sem git: nada a ligar.
}
