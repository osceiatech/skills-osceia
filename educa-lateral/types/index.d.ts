export type Nota = { id: number; titulo: string; texto: string; tecnologia?: string }

declare module 'claude-code' {
  interface PluginState {
    'educa-lateral': { notas: Nota[] }
  }
}
