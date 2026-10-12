import { describe, expect, test } from 'claude-code/testing'

const VIEWPORT = { columns: 100, rows: 30, isFullscreen: true } as const

describe('osceia-chat', () => {
  test('resposta do assistente ganha marcador e texto recuado', async $ => {
    const ui = await $.ui.mount({
      plugin: 'osceia-chat',
      surface: 'terminal',
      component: 'AssistantMessage',
      props: { text: 'Olá, **mundo**', isFirstOfReply: true },
      viewport: VIEWPORT,
    })

    expect(await ui.find({ type: 'Text', text: '●' })).toBeDefined()
    expect(await ui.find({ type: 'Markdown', text: /Olá/ })).toBeDefined()
    await ui.unmount()
  })

  test('bloco seguinte da mesma resposta não repete o marcador', async $ => {
    const ui = await $.ui.mount({
      plugin: 'osceia-chat',
      surface: 'terminal',
      component: 'AssistantMessage',
      props: { text: 'continua', isFirstOfReply: false },
      viewport: VIEWPORT,
    })

    expect(await ui.find({ type: 'Text', text: '●' })).toBeUndefined()
    await ui.unmount()
  })

  test('mensagem da pessoa aparece em bloco com o texto digitado', async $ => {
    const ui = await $.ui.mount({
      plugin: 'osceia-chat',
      surface: 'terminal',
      component: 'UserMessage',
      props: { text: 'crie o painel', origin: { kind: 'composer' }, isExpanded: true },
      viewport: VIEWPORT,
    })

    expect(await ui.find({ type: 'Text', text: 'crie o painel' })).toBeDefined()
    await ui.unmount()
  })

  const BAND = {
    hasSurvey: false,
    isWorking: false,
    maxRows: 10,
    bodyColumns: 90,
    scroll: { offset: 0, bodyRows: 10 },
    view: {},
  } as const

  test('faixa mostra a marca e mantém a faixa de outro plugin abaixo', async ($, on) => {
    on('ui.render', { component: 'AbovePrompt' }, ($$, e) => {
      const { Text } = $$.ui.resolve(e)

      return <Text>faixa-de-baixo</Text>
    })
    const ui = await $.ui.mount({
      plugin: 'osceia-chat',
      surface: 'terminal',
      component: 'AbovePrompt',
      props: BAND,
      viewport: VIEWPORT,
    })

    expect(await ui.find({ type: 'Text', text: /OSCEIA/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: 'faixa-de-baixo' })).toBeDefined()
    await ui.unmount()
  })

  test('cede o lugar enquanto um questionário ocupa a faixa', async ($, on) => {
    on('ui.render', { component: 'AbovePrompt' }, ($$, e) => {
      const { Text } = $$.ui.resolve(e)

      return <Text>faixa-de-baixo</Text>
    })
    const ui = await $.ui.mount({
      plugin: 'osceia-chat',
      surface: 'terminal',
      component: 'AbovePrompt',
      props: { ...BAND, hasSurvey: true },
      viewport: VIEWPORT,
    })

    expect(await ui.find({ type: 'Text', text: /OSCEIA/ })).toBeUndefined()
    expect(await ui.find({ type: 'Text', text: 'faixa-de-baixo' })).toBeDefined()
    await ui.unmount()
  })
})
