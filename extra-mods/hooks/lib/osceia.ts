// OSCEIA skills and mods catalog (marketplace osceiatech/skills-osceia): data only.
// Generated from the marketplace's marketplace.json. Installing is a command the panel
// copies for the person to run; this module never runs anything.

export type OsceiaItem = { name: string; group: string; text: string }

export const OSCEIA_MARKETPLACE = 'osceiatech/skills-osceia'
export const OSCEIA_MARKETPLACE_ID = 'skills-osceia'

export const addMarketplaceCommand = (): string => `claude plugin marketplace add ${OSCEIA_MARKETPLACE}`

export const installCommand = (name: string): string =>
  `claude plugin install ${name}@${OSCEIA_MARKETPLACE_ID} --scope user`

export const OSCEIA_ITEMS: readonly OsceiaItem[] = [
  {
    "name": "angular-oscea",
    "group": "Desenvolvimento OSCEIA",
    "text": "Padrões e diretrizes para desenvolvimento Angular na OSCEA."
  },
  {
    "name": "authenticated-web-system-reverse-engineering",
    "group": "Desenvolvimento OSCEIA",
    "text": "Orquestra engenharia reversa funcional e estrutural de sistemas web autenticados com navegação…"
  },
  {
    "name": "feature-doc-generator",
    "group": "Desenvolvimento OSCEIA",
    "text": "Gera documentação técnica descritiva (um \"espelho\" do código, sem sugestões) de uma feature."
  },
  {
    "name": "gh-issue-dor-dod",
    "group": "Desenvolvimento OSCEIA",
    "text": "Cria e gerencia issues no GitHub via CLI gh, aplicando checklists de Definition of Ready."
  },
  {
    "name": "markitdown-local",
    "group": "Desenvolvimento OSCEIA",
    "text": "Convert trusted local documents to Markdown with a version-pinned Microsoft MarkItDown runtime."
  },
  {
    "name": "md-to-pdf",
    "group": "Desenvolvimento OSCEIA",
    "text": "Converte arquivos Markdown em PDF com suporte a formatação profissional."
  },
  {
    "name": "osceia-design",
    "group": "Desenvolvimento OSCEIA",
    "text": "Guia de design integrado para projetos OSCEIA (UI/Angular, documentos, processos)."
  },
  {
    "name": "technical-design-doc-creator",
    "group": "Desenvolvimento OSCEIA",
    "text": "Cria Technical Design Documents (TDD) completos com seções obrigatórias e opcionais através de…"
  },
  {
    "name": "codenavi",
    "group": "Fluxo de engenharia",
    "text": "Your pathfinder for navigating unknown codebases."
  },
  {
    "name": "council",
    "group": "Fluxo de engenharia",
    "text": "Conselho de decisão anti-sycophancy."
  },
  {
    "name": "cyclomatic-complexity",
    "group": "Fluxo de engenharia",
    "text": "Analisa, calcula e refatora complexidade ciclomática em projetos Angular/TypeScript."
  },
  {
    "name": "design-an-interface",
    "group": "Fluxo de engenharia",
    "text": "Generate multiple radically different interface designs for a module using parallel sub-agents."
  },
  {
    "name": "diagnose",
    "group": "Fluxo de engenharia",
    "text": "Disciplined diagnosis loop for hard bugs and performance regressions."
  },
  {
    "name": "git-guardrails",
    "group": "Fluxo de engenharia",
    "text": "Set up Claude Code hooks to block dangerous git commands."
  },
  {
    "name": "grill-me",
    "group": "Fluxo de engenharia",
    "text": "Interview the user relentlessly about a plan or design until reaching shared understanding."
  },
  {
    "name": "grill-with-docs",
    "group": "Fluxo de engenharia",
    "text": "Grilling session that challenges your plan against the existing domain model, sharpens terminology."
  },
  {
    "name": "handoff",
    "group": "Fluxo de engenharia",
    "text": "Compact the current conversation into a handoff document for another agent to pick up."
  },
  {
    "name": "improve-codebase-architecture",
    "group": "Fluxo de engenharia",
    "text": "Find deepening opportunities in a codebase, informed by the domain language in CONTEXT.md and…"
  },
  {
    "name": "migrate-to-shoehorn",
    "group": "Fluxo de engenharia",
    "text": "Migrate test files from `as` type assertions to @total-typescript/shoehorn."
  },
  {
    "name": "prototype",
    "group": "Fluxo de engenharia",
    "text": "Build a throwaway prototype to flesh out a design before committing to it."
  },
  {
    "name": "qa",
    "group": "Fluxo de engenharia",
    "text": "Interactive QA session where user reports bugs or issues conversationally."
  },
  {
    "name": "request-refactor-plan",
    "group": "Fluxo de engenharia",
    "text": "Create a detailed refactor plan with tiny commits via user interview."
  },
  {
    "name": "review",
    "group": "Fluxo de engenharia",
    "text": "Review the changes since a fixed point (commit, branch, tag, or merge-base) along two axes."
  },
  {
    "name": "scaffold-exercises",
    "group": "Fluxo de engenharia",
    "text": "Create exercise directory structures with sections, problems, solutions."
  },
  {
    "name": "setup-matt-pocock-skills",
    "group": "Fluxo de engenharia",
    "text": "Sets up an `## Agent skills` block in AGENTS.md/CLAUDE.md and `docs/agents/` so the engineering…"
  },
  {
    "name": "setup-pre-commit",
    "group": "Fluxo de engenharia",
    "text": "Set up Husky pre-commit hooks with lint-staged."
  },
  {
    "name": "tdd",
    "group": "Fluxo de engenharia",
    "text": "Test-driven development with red-green-refactor loop."
  },
  {
    "name": "tlc-spec-driven",
    "group": "Fluxo de engenharia",
    "text": "Project and feature planning with 4 adaptive phases - Specify, Design, Tasks, Execute."
  },
  {
    "name": "to-issues",
    "group": "Fluxo de engenharia",
    "text": "Break a plan, spec, or PRD into independently-grabbable issues on the project issue tracker…"
  },
  {
    "name": "to-prd",
    "group": "Fluxo de engenharia",
    "text": "Turn the current conversation context into a PRD and publish it to the project issue tracker."
  },
  {
    "name": "triage",
    "group": "Fluxo de engenharia",
    "text": "Triage issues through a state machine driven by triage roles."
  },
  {
    "name": "ubiquitous-language",
    "group": "Fluxo de engenharia",
    "text": "Extract a DDD-style ubiquitous language glossary from the current conversation."
  },
  {
    "name": "zoom-out",
    "group": "Fluxo de engenharia",
    "text": "Tell the agent to zoom out and give broader context or a higher-level perspective."
  },
  {
    "name": "caveman",
    "group": "Escrita e ensino",
    "text": "Ultra-compressed communication mode."
  },
  {
    "name": "edit-article",
    "group": "Escrita e ensino",
    "text": "Edit and improve articles by restructuring sections, improving clarity, and tightening prose."
  },
  {
    "name": "teach",
    "group": "Escrita e ensino",
    "text": "Teach the user a new skill or concept, within this workspace."
  },
  {
    "name": "writing-beats",
    "group": "Escrita e ensino",
    "text": "Shape an article as a journey of beats, choose-your-own-adventure style."
  },
  {
    "name": "writing-fragments",
    "group": "Escrita e ensino",
    "text": "Grilling session that mines the user for fragments — heterogeneous nuggets of writing."
  },
  {
    "name": "writing-shape",
    "group": "Escrita e ensino",
    "text": "Take a markdown file of raw material and shape it into an article through a conversational…"
  },
  {
    "name": "find-skills",
    "group": "Criar e achar skills",
    "text": "Helps users discover and install agent skills when they ask questions like \"how do I do X\"."
  },
  {
    "name": "write-a-skill",
    "group": "Criar e achar skills",
    "text": "Create new agent skills with proper structure, progressive disclosure, and bundled resources."
  },
  {
    "name": "defuddle",
    "group": "Outros",
    "text": "Extract clean markdown content from web pages using Defuddle CLI."
  },
  {
    "name": "educa-lateral",
    "group": "Mods do Claude Code",
    "text": "Mod do Claude Code: painel lateral (~40% do terminal) que explica, em textos curtos."
  },
  {
    "name": "osceia-chat",
    "group": "Mods do Claude Code",
    "text": "Tema OSCEIA (azul-marinho, verde e dourado do site)."
  }
]
