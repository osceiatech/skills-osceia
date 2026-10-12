# osceia-chat

Mod do Claude Code com o tema **OSCEIA Chat** e a marca da OSCEIA no terminal.

- **Tema:** azul-marinho `#101840`, verde `#00CA6A` e dourado `#FBC26E`, as cores do site. Escolha em `/theme`.
- **Chat com respiro:** linha em branco entre as mensagens, texto recuado sob o marcador `●` e a mensagem da pessoa em bloco sombreado.
- **Marca:** faixa ` OSCEIA ▪ chat` acima do prompt (a faixa de outro plugin, como a do Zen mode, fica logo abaixo), entrada `OSCEIA` na linha de status e um aviso ao abrir a sessão.
- **`/osceia-marca`:** mostra ou oculta a faixa.

O mascote do Claude Code é recolorido, mas a imagem em si não pode ser trocada por um mod.

## Instalar

```bash
/plugin marketplace add osceiatech/skills-osceia
/plugin install osceia-chat --marketplace osceiatech/skills-osceia
```

## Aviso da organização na abertura (opcional)

A mensagem de abertura é uma configuração, não de plugin. Para ter uma, ponha em `~/.claude/settings.json`
(ou no `.claude/settings.json` do projeto):

```json
{ "companyAnnouncements": ["OSCEIA · bem-vindo ao ambiente de desenvolvimento"] }
```

## Verificar

```bash
claude plugin validate .
claude plugin test .
```
