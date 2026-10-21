import { expect, test } from 'claude-code/testing'

test('one row carries every metric', async ($, on) => {
  const lines: (string | undefined)[] = []

  on('clock.now', () => ({ value: 1_000_000 }))
  on('clock.every', () => ({ value: { cancel: () => {} } }))
  on('session.model', () => ({ value: 'claude-opus-5-5' }))
  on('process.run', () => ({
    value: { exitCode: 0, stdout: 'main\n', stderr: '', isStdoutTruncated: false, isStderrTruncated: false },
  }))
  on('session.usage', () => ({
    value: { startedAt: 0, context: { window: 200_000 }, rateLimits: [] },
  }))
  on('ui.status', (_, e) => (lines.push(e.text), { value: undefined }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('session.measure', (_, e) => ({ changed: e.changed }))
  on('turn.complete', (_, e) => ({ text: e.answer }))

  await $.session.start({ cwd: '/home/me/proj', surface: 'terminal', isInteractive: true })
  await $.session.measure({
    context: { window: 200_000, tokens: 84_000, percent: 42 },
    rateLimits: [{ kind: 'five_hour', percentUsed: 23 }, { kind: 'seven_day', percentUsed: 61.5 }],
    cost: { usd: 1.234 },
    changed: ['context', 'rateLimits', 'cost'],
  })
  await $.turn.complete({
    answer: 'ok', durationMs: 10, isAborted: false, turnId: 't1', reason: 'answer',
    usage: { model: 'claude-opus-5-5', input_tokens: 100, output_tokens: 50, cache_read_input_tokens: 900, cache_creation_input_tokens: 0 },
  })

  expect(lines.at(-1)).toBe(
    'Opus 5.5 ⎇ main │ ctx ▰▰▰▱▱▱▱▱ 42% │ 5h ▰▰▱▱▱▱▱▱ 23% │ 7d ▰▰▰▰▰▱▱▱ 62% │ $1.23 │ ⚡90% 5m',
  )
})
