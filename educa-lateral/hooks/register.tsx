import type { Register } from 'claude-code'

import type { Nota } from '../types'

const PANE = 'educa'
const TOOL = 'explicar'
// Largura fixa aproximando ~50% de um terminal comum; sem acesso à largura real no
// momento da abertura, ajuste este valor se o painel ficar maior/menor que o esperado.
const LARGURA_PAINEL = 60

export const register: Register = on => {
  let notas: Nota[] = []
  let painelAberto = false
  let proximoId = 1

  on('session.start', async ($, e, next) => {
    await $.tool.register({
      name: 'explicar',
      isDeferred: false,
      description:
        'Mostra no painel lateral um texto curto e didático (pt-BR) que explica uma tecnologia ou decisão técnica que está sendo usada agora. Chame esta ferramenta sempre que escolher ou usar uma tecnologia, biblioteca, padrão ou técnica relevante, antes de agir. Escreva em português, em 2 a 4 frases curtas: o que é, por que foi escolhida aqui e o que ela evita ou resolve. Uma nota por decisão; não repita o que já explicou. Nunca inclua dado pessoal, segredo ou conteúdo de registro nas notas.',
      inputSchema: {
        type: 'object',
        properties: {
          titulo: { type: 'string', description: 'Nome curto do assunto, ex.: "TanStack Query".' },
          texto: { type: 'string', description: '2 a 4 frases: o que é, por que aqui, o que resolve.' },
          tecnologia: { type: 'string', description: 'Categoria opcional, ex.: "estado de servidor".' },
        },
        required: ['titulo', 'texto'],
      },
    })
    await $.command.register({
      name: 'educar',
      description: 'Abre ou fecha o painel lateral que explica as tecnologias em uso (/educar limpar apaga as notas)',
    })

    return next(e)
  })

  on('tool.call', { tool: TOOL }, async ($, e) => {
    const entrada = e as unknown as { titulo?: string; texto?: string; tecnologia?: string }
    const titulo = String(entrada.titulo ?? '').slice(0, 80)
    const texto = String(entrada.texto ?? '').slice(0, 600)

    if (titulo === '' || texto === '') {
      return { deny: 'educa-lateral: informe titulo e texto.' }
    }
    notas = [...notas, { id: proximoId++, titulo, texto, tecnologia: entrada.tecnologia?.slice(0, 40) }].slice(-50)

    return { result: 'Nota exibida no painel lateral.' }
  })

  on('command.run', { command: 'educar' }, async ($, e) => {
    const args = String((e as unknown as { args?: string }).args ?? '').trim()

    if (args === 'limpar') {
      notas = []

      return { text: 'Notas apagadas.' }
    }
    if (painelAberto) {
      await $.ui.close({ id: PANE })
      painelAberto = false

      return { text: 'Painel fechado.' }
    }
    await $.ui.open({ id: PANE, title: 'Aprendendo', columns: LARGURA_PAINEL })
    painelAberto = true

    return { text: 'Painel aberto.' }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text } = $.ui.resolve(e)
    const espaco = Math.max(1, 24 - 4)
    const visiveis = notas.slice(-Math.max(1, Math.floor(espaco / 5)))

    return (
      <Box flexDirection="column">
        {notas.length === 0 && (
          <Text dimColor>As tecnologias escolhidas aparecerão aqui, com uma explicação curta de cada uma.</Text>
        )}
        {visiveis.map(n => (
          <Box key={`nota-${n.id}`} flexDirection="column" marginBottom={1}>
            <Text bold>{n.titulo}</Text>
            {n.tecnologia && <Text dimColor>{n.tecnologia}</Text>}
            <Text>{n.texto}</Text>
          </Box>
        ))}
      </Box>
    )
  })
}
