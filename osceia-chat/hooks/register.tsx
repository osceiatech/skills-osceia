import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

// As cores da marca, as do site da OSCEIA; fixas, para a marca não mudar com o tema escolhido.
const MARINHO = '#101840'
const VERDE = '#00CA6A'
const DOURADO = '#FBC26E'

const isMarcaVisivel = atom({ plugin: 'osceia-chat', key: 'isMarcaVisivel' } as const, true)

// Respiro no chat: uma linha em branco entre as mensagens, o texto recuado sob o marcador e a
// mensagem da pessoa em bloco sombreado, como o Codex. Só desenho: a conversa guardada não muda.
export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'osceia-marca',
      description: 'Mostra ou oculta a faixa da marca OSCEIA acima do prompt',
    })
    $.ui.status('OSCEIA')
    $.ui.toast('OSCEIA Chat ativo · /osceia-marca oculta a faixa')

    return next(e)
  })

  on('command.run', { command: 'osceia-marca' }, async $ => {
    const isVisivel = await update($, isMarcaVisivel, atual => !atual)

    return { text: isVisivel ? 'Faixa OSCEIA visível.' : 'Faixa OSCEIA oculta.' }
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const abaixo = await next(e)

    if (e.props.hasSurvey || !(await read($, isMarcaVisivel))) {
      return abaixo
    }
    const { Box, Text } = $.ui.resolve(e)

    return (
      <Box flexDirection="column">
        <Box>
          <Text backgroundColor={MARINHO} color={VERDE} bold>
            {' OSCEIA '}
          </Text>
          <Text color={DOURADO}> ▪ </Text>
          <Text dimColor>chat</Text>
        </Box>
        {abaixo}
      </Box>
    )
  })

  on('ui.render', { component: 'AssistantMessage' }, async ($, e) => {
    const { Box, Text, Markdown } = $.ui.resolve(e)
    const { text, isFirstOfReply } = e.props

    return (
      <Box flexDirection="row" marginTop={isFirstOfReply ? 1 : 0} marginBottom={1} paddingRight={2}>
        <Box width={3}>
          <Text color="claude">{isFirstOfReply ? '●' : ' '}</Text>
        </Box>
        <Box flexGrow={1}>
          <Markdown text={text} />
        </Box>
      </Box>
    )
  })

  on('ui.render', { component: 'UserMessage' }, async ($, e, next) => {
    // Notificações e mensagens de outros agentes ficam como o Claude Code as desenha.
    if (e.props.origin.kind !== 'composer' || !e.props.isExpanded) {
      return next(e)
    }
    const { Box, Text } = $.ui.resolve(e)

    return (
      <Box marginTop={1} marginBottom={1} paddingX={2} paddingY={1} backgroundColor="userMessageBackground">
        <Text color="text">{e.props.text}</Text>
      </Box>
    )
  })

  on('ui.render', { component: 'ToolUse' }, async ($, e, next) => {
    const drawn = await next(e)
    const { Box } = $.ui.resolve(e)

    return (
      <Box marginTop={1} paddingLeft={3}>
        {drawn}
      </Box>
    )
  })
}
