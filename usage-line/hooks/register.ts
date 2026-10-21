import type { EngineInterface, Register, SessionRateLimit, SessionUsage, TurnUsage } from 'claude-code'

const SEP = ' │ '
const TICK_MS = 15_000

type Seen = {
  ttlMs: number
  lastUsage?: TurnUsage
  lastResponseAt?: number
  measured?: Pick<SessionUsage, 'context' | 'rateLimits' | 'cost'>
}

const seen: Seen = { ttlMs: 5 * 60_000 }

export const register: Register = (on, options) => {
  seen.ttlMs = options.cacheTtl === '1h' ? 60 * 60_000 : 5 * 60_000

  on('session.start', async ($, e, next) => {
    const started = await next(e)
    await paint($)
    $.clock.every(TICK_MS, () => void paint($))

    return started
  })

  on('session.measure', async ($, e, next) => {
    seen.measured = { context: e.context, rateLimits: e.rateLimits, cost: e.cost }
    await paint($)

    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    if (e.agentId === undefined && e.usage !== undefined) {
      seen.lastUsage = e.usage
      seen.lastResponseAt = await $.clock.now()
      await paint($)
    }

    return next(e)
  })
}

async function paint($: EngineInterface) {
  const now = await $.clock.now()
  const [model, branch] = await Promise.all([$.session.model(), gitBranch($)])
  const usage = seen.measured ?? (await $.session.usage())

  const parts = [
    branch === undefined ? prettyModel(model) : `${prettyModel(model)} ⎇ ${branch}`,
    context(usage.context),
    ...usage.rateLimits.map(l => limit(l, now)),
    usage.cost === undefined ? undefined : `$${usage.cost.usd.toFixed(2)}`,
    cache(seen.lastUsage, seen.lastResponseAt, now, seen.ttlMs),
  ]

  $.ui.status(parts.filter(p => p !== undefined).join(SEP))
}

async function gitBranch($: EngineInterface) {
  try {
    const { exitCode, stdout } = await $.process.run(['git', 'branch', '--show-current'], {
      timeoutMs: 3000,
    })
    const name = stdout.trim()

    return exitCode === 0 && name !== '' ? name : undefined
  } catch {
    return undefined
  }
}

// claude-opus-5-5[1m] -> Opus 5.5 (1M)
const prettyModel = (id: string) => {
  const wide = id.includes('[1m]') ? ' (1M)' : ''
  const words = id.replace(/\[1m\]$/, '').replace(/^claude-/, '').replace(/-\d{8}$/, '').split('-')
  const family = words.filter(w => !/^\d+$/.test(w))
  const version = words.filter(w => /^\d+$/.test(w)).join('.')
  const name = family.map(w => w[0]?.toUpperCase() + w.slice(1)).join(' ')

  return `${name}${version === '' ? '' : ` ${version}`}${wide}`
}

const BAR_CELLS = 8

const bar = (percent: number) => {
  const filled = Math.round((Math.min(100, Math.max(0, percent)) / 100) * BAR_CELLS)

  return '▰'.repeat(filled) + '▱'.repeat(BAR_CELLS - filled)
}

const metric = (label: string, percent: number | undefined) =>
  percent === undefined ? `${label} ${bar(0)} –` : `${label} ${bar(percent)} ${Math.round(percent)}%`

const context = (c: SessionUsage['context']) => metric('ctx', c.percent)

const duration = (ms: number) => {
  const m = Math.max(0, Math.round(ms / 60_000))
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h${String(m % 60).padStart(2, '0')}`

  return `${Math.floor(h / 24)}d${h % 24}h`
}

const LIMIT_LABEL: Record<string, string> = { five_hour: '5h', seven_day: '7d', spend_limit: '$lim' }

const limit = (l: SessionRateLimit, now: number) => {
  const reset = l.resetsAt === undefined ? '' : ` ${duration(Date.parse(l.resetsAt) - now)}`

  return `${metric(LIMIT_LABEL[l.kind] ?? l.kind, l.percentUsed)}${reset}`
}

const cache = (u: TurnUsage | undefined, at: number | undefined, now: number, ttlMs: number) => {
  if (u === undefined || at === undefined) return undefined
  const input = u.input_tokens + u.cache_read_input_tokens + u.cache_creation_input_tokens
  const hit = input === 0 ? 0 : Math.round((u.cache_read_input_tokens / input) * 100)
  const left = at + ttlMs - now

  return left > 0 ? `⚡${hit}% ${duration(left)}` : `❄${hit}%`
}
