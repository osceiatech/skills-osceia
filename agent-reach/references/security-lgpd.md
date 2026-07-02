# Segurança, cookies e LGPD

## Princípio

Agent Reach amplia acesso a fontes externas, mas não elimina responsabilidade. Em contexto OSCEIA/Fóton, trate qualquer coleta autenticada ou social como operação sensível: faça o mínimo necessário, com autorização clara, e documente limites.

## Regras obrigatórias

1. **Sem senhas.** Nunca peça senha de plataforma. Se autenticação for necessária, prefira sessão local de navegador/OpenCLI ou instrução para o usuário operar manualmente.
2. **Cookies são credenciais.** Cookies podem permitir acesso completo à conta. Só use com autorização explícita, em ambiente local e com conta secundária.
3. **Conta dedicada.** Para Twitter/X, Reddit, Facebook, Instagram, Xiaohongshu, LinkedIn e similares, use conta dedicada de pesquisa, nunca conta principal pessoal, institucional ou de cliente.
4. **Somente leitura.** Não postar, comentar, curtir, seguir, enviar mensagem, alterar perfil ou interagir com terceiros.
5. **Sem bypass.** Não contornar CAPTCHA, paywall, bloqueio técnico, rate limit ou restrição explícita da plataforma.
6. **Minimização.** Colete apenas campos necessários para a pergunta. Evite armazenar nomes, handles, emails, telefones ou identificadores quando agregados bastam.
7. **Proveniência.** Mantenha URLs/fontes e data da coleta quando o resultado for usado em PRD, relatório, decisão ou issue.
8. **Descarte.** Temporários vão para `/tmp/`; não grave cookies, dumps sociais ou dados pessoais em repositórios de projeto.

## Antes de usar canal autenticado

Confirme estes pontos com o usuário quando a tarefa exigir login/cookie:

- qual plataforma será acessada;
- qual conta será usada e se é secundária;
- que tipo de dado será coletado;
- limite de quantidade/profundidade;
- finalidade da coleta.

## Red flags

Pare e peça decisão explícita se a tarefa envolver:

- coleta massiva de perfis ou comentários;
- identificação de pessoas físicas;
- enriquecimento de dados pessoais;
- comparação de indivíduos;
- scraping de grupos fechados, comunidades privadas ou conteúdo não público;
- uso de conta institucional ou cliente.

## Formulação segura no relatório

Inclua uma seção curta de limites quando usar fontes sociais:

```markdown
### Limitações da coleta
- Amostra exploratória, não representativa estatisticamente.
- Fontes consultadas: ...
- Janela/limite: ...
- Plataformas autenticadas: não usadas / usadas com autorização.
- Dados pessoais foram omitidos ou agregados.
```
