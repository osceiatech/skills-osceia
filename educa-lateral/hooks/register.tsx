import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Nota } from '../types'

const PANE = 'educa'
const TOOL = 'mcp__educa-lateral__explicar'
const FRACAO = 0.4
const notas = atom({ plugin: 'educa-lateral', key: 'notas' } as const, [])

const INSTRUCAO = [
  'Painel educativo: o usuário vê um painel lateral que ensina as tecnologias usadas no desenvolvimento.',
  `Sempre que escolher ou usar uma tecnologia, biblioteca, padrão ou técnica relevante, chame a ferramenta ${TOOL} antes de agir.`,
  'Escreva em português, em 2 a 4 frases curtas e didáticas: o que é, por que foi escolhida aqui e o que ela evita ou resolve.',
  'Uma nota por decisão; não repita o que já explicou. Nunca inclua dado pessoal, segredo ou conteúdo de registro nas notas.',
].join('\n')

function abrir($: EngineInterface, columns?: number) {
  return $.ui.open({ id: PANE, title: 'Aprendendo', ...(columns ? { columns } : {}) })
}

export const register: Register = on => {
  let ultimaLargura = 0
  let ajustes = 0
  let proximoId = 1

  on('session.start', async ($, e, next) => {
    await $.tool.register({
      name: 'explicar',
      isDeferred: false,
      description:
        'Mostra no painel lateral um texto curto e didático (pt-BR) que explica uma tecnologia ou decisão técnica que está sendo usada agora.',
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
    void abrir($)

    return next(e)
  })

  on('prompt.compose', async ($, e, next) => {
    const r = await next(e)

    return { ...r, sections: [...r.sections, { id: 'educa-lateral:instrucao', text: INSTRUCAO, scope: 'session' }] }
  })

  on('tool.call', { tool: TOOL }, async ($, e) => {
    const entrada = e as unknown as { titulo?: string; texto?: string; tecnologia?: string }
    const titulo = String(entrada.titulo ?? '').slice(0, 80)
    const texto = String(entrada.texto ?? '').slice(0, 600)

    if (titulo === '' || texto === '') {
      return { deny: 'educa-lateral: informe titulo e texto.' }
    }
    const nota: Nota = { id: proximoId++, titulo, texto, tecnologia: entrada.tecnologia?.slice(0, 40) }
    await update($, notas, lista => [...lista, nota].slice(-50))

    return { result: 'Nota exibida no painel lateral.' }
  })

  on('command.run', { command: 'educar' }, async ($, e) => {
    const args = String((e as unknown as { args?: string }).args ?? '').trim()

    if (args === 'limpar') {
      await update($, notas, () => [])

      return { text: 'Notas apagadas.' }
    }
    const aberto = (await $.ui.panes()).some(p => p.id === PANE)

    if (aberto) {
      await $.ui.close({ id: PANE })

      return { text: 'Painel fechado.' }
    }
    await abrir($, ultimaLargura > 0 ? Math.floor(ultimaLargura * FRACAO) : undefined)

    return { text: 'Painel aberto.' }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text } = $.ui.resolve(e)
    const lista = await read($, notas)
    const total = e.viewport?.columns ?? 0
    const alvo = Math.floor(total * FRACAO)

    // Pede ~40% da largura do terminal, uma vez por largura e com limite de tentativas.
    if (total > 0 && total !== ultimaLargura && ajustes < 3 && Math.abs(alvo - e.props.bodyColumns) > 3) {
      ultimaLargura = total
      ajustes += 1
      void abrir($, alvo)
    }
    const espaco = Math.max(1, (e.viewport?.rows ?? 24) - 4)
    const visiveis = lista.slice(-Math.max(1, Math.floor(espaco / 5)))

    return (
      <Box flexDirection="column">
        {lista.length === 0 && (
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
