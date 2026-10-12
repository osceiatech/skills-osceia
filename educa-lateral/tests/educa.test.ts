import { describe, expect, test } from 'claude-code/testing'

const TOOL = 'mcp__educa-lateral__explicar'
const VIEWPORT = { columns: 100, rows: 30, isFullscreen: true } as const
// bodyColumns já no alvo de 40%: o painel não pede reabertura (ui.open) ao ser desenhado.
const PROPS = {
  title: 'Aprendendo',
  isFocused: false,
  bodyColumns: 40,
  placement: 'dock',
  scroll: { offset: 0, bodyRows: 20 },
  view: {},
} as const

describe('educa-lateral', () => {
  test('painel vazio mostra o aviso', async $ => {
    const ui = await $.ui.mount({
      plugin: 'educa-lateral',
      surface: 'terminal',
      component: 'Pane',
      requestId: 'educa',
      props: PROPS,
      viewport: VIEWPORT,
    })

    expect(await ui.find({ type: 'Text', text: /aparecerão aqui/ })).toBeDefined()
    await ui.unmount()
  })

  test('uma nota chamada pela IA aparece no painel', async $ => {
    const ran = await $.tool.call({
      tool: TOOL,
      titulo: 'TanStack Query',
      texto: 'Guarda e atualiza no navegador o que veio do servidor.',
      tecnologia: 'estado de servidor',
    } as never)

    expect(JSON.stringify(ran)).not.toMatch(/deny/)

    const ui = await $.ui.mount({
      plugin: 'educa-lateral',
      surface: 'terminal',
      component: 'Pane',
      requestId: 'educa',
      props: PROPS,
      viewport: VIEWPORT,
    })

    expect(await ui.find({ type: 'Text', text: 'TanStack Query' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /atualiza no navegador/ })).toBeDefined()
    await ui.unmount()
  })

  test('nota sem título ou sem texto é recusada', async $ => {
    const ran = await $.tool.call({ tool: TOOL, titulo: '', texto: 'x' } as never)

    expect(JSON.stringify(ran)).toMatch(/educa-lateral: informe titulo e texto/)
  })
})
