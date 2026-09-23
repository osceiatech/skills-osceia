# Segurança, LGPD e modo somente leitura

## Regra fundamental

`read_only` é uma política operacional, não uma propriedade automática do navegador. Uma navegação pode alterar estado por `GET`, JavaScript, autosave, beacon, WebSocket ou evento de mudança.

## Antes da sessão

- Obtenha autorização e delimite ambiente, módulos, período e responsáveis.
- Prefira homologação ou cópia sanitizada. Produção é exceção justificada.
- Crie perfil de navegador exclusivo; não reutilize o perfil pessoal.
- Usuário autentica manualmente. Não solicite, leia, exporte ou registre credenciais.
- Defina allowlist de host, origem e caminhos.
- Defina orçamento de páginas, concorrência e taxa de acesso.

## Bloqueio de mutações

Bloqueie por padrão requisições `POST`, `PUT`, `PATCH` e `DELETE`. Trate também como perigosos:

- rotas contendo `salvar`, `excluir`, `remover`, `cancelar`, `aprovar`, `encerrar`, `gerar`, `emitir`, `enviar`, `assinar`, `baixar`, `logout`;
- botões e links com ações equivalentes;
- formulários com autosave;
- downloads em massa;
- endpoints GraphQL sem inspeção da operação;
- WebSockets e beacons capazes de persistir ações.

O bloqueio de método não basta: sistemas legados podem mutar por `GET`. Revise semanticamente os destinos antes de navegar.

## Dados proibidos nas evidências

- valores de inputs, selects ou textareas;
- conteúdo de células e registros;
- CPF, CNPJ, RG, e-mail, telefone, endereço e matrícula;
- nomes de pessoas, usuários ou organizações obtidos da sessão;
- cookies, tokens, headers, local/session storage;
- payloads e respostas completas de APIs;
- HTML integral, `innerText` integral ou dumps de DOM;
- screenshots contendo dados reais, salvo autorização específica e armazenamento controlado.

## Dados estruturais permitidos

- caminho normalizado sem query sensível;
- menu e rótulos genéricos;
- nome técnico, id, tag e tipo dos controles;
- obrigatoriedade, habilitação e quantidade de opções;
- nomes das colunas sem células;
- método e caminho do formulário, sem payload;
- status HTTP, duração, retry e classe de erro;
- presença de componentes, nunca seu conteúdo operacional.

## Incidente de privacidade

Se uma evidência capturar PII ou segredo:

1. interrompa a coleta;
2. não copie o valor para relatórios ou conversa;
3. remova o artefato inseguro do workspace e do histórico versionado, se aplicável;
4. corrija o extrator para coletar somente metadados;
5. gere novamente a evidência;
6. execute `validate_evidence.py`;
7. registre apenas que houve captura indevida e que foi saneada, sem reproduzir o dado.

## Gate humano obrigatório

Solicite decisão humana antes de:

- qualquer ação que possa persistir estado;
- abrir registro real para inferir fluxo;
- testar exceção contratual ou financeira;
- baixar documento com dados pessoais;
- ampliar o escopo ou ultrapassar limites;
- usar técnica de evasão, proxy ou fingerprinting.

## Verificação final

- Nenhum método mutante alcançou o servidor.
- Nenhuma rota semanticamente perigosa foi acionada.
- Evidências passaram no validador.
- Logs e relatórios não contêm dados reais.
- Limitações da política read-only foram explicitadas.
