export type Marca = { isMarcaVisivel: boolean }

declare module 'claude-code' {
  interface PluginState {
    'osceia-chat': { isMarcaVisivel: boolean }
  }
}
