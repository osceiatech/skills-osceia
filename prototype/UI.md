# UI Prototype

Generate **several radically different UI variations** on a single route, switchable from a floating bottom bar. The user flips between variants in the browser, picks one (or steals bits from each), then throws the rest away.

If the question is about logic/state rather than what something looks like — wrong branch. Use [LOGIC.md](LOGIC.md).

## When this is the right shape

- "What should this page look like?"
- "I want to see a few options for this dashboard before committing."
- "Try a different layout for the settings screen."
- Any time the user would otherwise spend a day picking between three vague mockups in their head.

## Read the design direction before drawing variants

Write a one-line **Design Read** before generating code:

> "Reading this as: [surface] for [audience], where [primary job] matters most; the visual language should feel [qualities] while preserving [existing identity/constraints]."

Infer it from the actual brief, surrounding product, brand assets, real content, and existing design system. Ask one focused question only when two materially different readings remain plausible. Accessibility, public-service, regulated, trust-first, child-safety, and low-bandwidth constraints override aesthetic novelty.

Set three conversational dials to make the variants intentionally different:

- **Variance (1-10):** conventional/symmetrical → experimental/asymmetrical.
- **Motion (1-10):** static feedback → choreographed storytelling.
- **Density (1-10):** spacious/editorial → information-dense/operational.

Do not persist these as universal defaults. Choose values from the current audience and job, and state them with the Design Read. For trust-first/public-service surfaces, start restrained (roughly variance 3-4, motion 1-3) unless the brief clearly supports more expression. Density follows the task rather than the industry label.

For an existing surface, declare the redesign mode:

- **Preserve:** keep brand, information architecture, terminology, component system, and interaction contracts; explore hierarchy and composition within them.
- **Overhaul:** permit a new visual direction, but preserve routes, data contracts, legal copy, accessibility, and user expectations unless the user explicitly expands scope.

These are decision aids, not a substitute for taste or user feedback. Avoid category shortcuts such as "education means childish," "nonprofit means sentimental," or "technology means dark gradients."

## Two sub-shapes — strongly prefer sub-shape A

A UI prototype is much easier to judge when it's **butting up against the rest of the app** — real header, real sidebar, real data, real density. A throwaway route on its own is a vacuum: every variant looks fine in isolation. Default to sub-shape A whenever there's a plausible existing page to host the variants. Only reach for sub-shape B if the prototype genuinely has no nearby home.

### Sub-shape A — adjustment to an existing page (preferred)

The route already exists. Variants are rendered **on the same route**, gated by a `?variant=` URL search param. The existing data fetching, params, and auth all stay — only the rendering swaps. This is the default; pick it unless there's a specific reason not to.

If the prototype is for something that doesn't yet have a page but *would naturally live inside one* (a new section of the dashboard, a new card on the settings screen, a new step in an existing flow) — that's still sub-shape A. Mount the variants inside the host page.

### Sub-shape B — a new page (last resort)

Only use this when the thing being prototyped genuinely has no existing page to live inside — e.g. an entirely new top-level surface, or a flow that can't be embedded anywhere sensible.

Create a **throwaway route** following whatever routing convention the project already uses — don't invent a new top-level structure. Name it so it's obviously a prototype (e.g. include the word `prototype` in the path or filename). Same `?variant=` pattern.

Before committing to sub-shape B, sanity-check: is there really no existing page this could be embedded in? An empty route hides design problems that a populated one would expose.

In both sub-shapes the floating bottom bar is identical.

## Process

### 1. State the question and pick N

Default to **3 variants**. More than 5 stops being radically different and starts being noise — cap there.

Write down the plan in one line, in the prototype's location or a top-of-file comment:

> "Three variants of the settings page, switchable via `?variant=`, on the existing `/settings` route."

This works whether the user is here to push back or not.

### 2. Generate radically different variants

Draft each variant. Hold each one to:

- The page's purpose and the data it has access to.
- The project's component library / styling system (TailwindCSS, shadcn, MUI, plain CSS, whatever).
- A clear exported component name, e.g. `VariantA`, `VariantB`, `VariantC`.
- The Design Read, redesign mode, accessibility constraints, and real brand/content assets.

Variants must be **structurally different** — different layout, different information hierarchy, different primary affordance, not just different colours. Three slightly-tweaked card grids isn't a UI prototype, it's wallpaper. If two drafts come out too similar, redo one with explicit "do not use a card grid" guidance.

Give each variant a short thesis and dial values. Vary structure before decoration: one may optimize scanning, another narrative flow, another task completion. Do not force every option to be maximally novel. At least one should be a restrained, highly usable baseline.

Do not introduce a new framework, component library, icon family, font dependency, animation library, generated image, stock asset, CDN, or third-party logo merely to make a variant look finished. Reuse the project stack and approved assets. If an external dependency or asset would materially change the decision, present it as an explicit optional experiment and obtain approval before adding it. Never fabricate customers, partners, testimonials, or institutional endorsements.

### 3. Wire them together

Create a single switcher component on the route:

```tsx
// pseudo-code — adapt to the project's framework
const variant = searchParams.get('variant') ?? 'A';
return (
  <>
    {variant === 'A' && <VariantA {...data} />}
    {variant === 'B' && <VariantB {...data} />}
    {variant === 'C' && <VariantC {...data} />}
    <PrototypeSwitcher variants={['A','B','C']} current={variant} />
  </>
);
```

For sub-shape A (existing page): keep all the existing data fetching above the switcher; only the rendered subtree changes per variant.

For sub-shape B (new page): the throwaway route under `/prototype/<name>` mounts the same switcher.

### 4. Build the floating switcher

A small fixed-position bar at the bottom-centre of the screen with three pieces:

- **Left arrow** — cycles to the previous variant (wraps around).
- **Variant label** — shows the current variant key and, if the variant exports a name, that name too. e.g. `B — Sidebar layout`.
- **Right arrow** — cycles forward (wraps around).

Behaviour:

- Clicking an arrow updates the URL search param (use the framework's router — `router.replace` on Next, `navigate` on React Router, etc) so the variant is shareable and reload-stable.
- Keyboard: `←` and `→` arrow keys also cycle. Don't intercept arrow keys when an `<input>`, `<textarea>`, or `[contenteditable]` is focused.
- Visually distinct from the page (e.g. high-contrast pill, subtle shadow) so it's obviously not part of the design being evaluated.
- Hidden in production builds — gate on `process.env.NODE_ENV !== 'production'` or an equivalent check, so a stray prototype merge can't ship the bar to users.

Put the switcher in a single shared component so both sub-shapes can reuse it. Locate it wherever shared UI lives in the project.

### 5. Hand it over

Surface the URL (and the `?variant=` keys). The user will flip through whenever they get to it. The interesting feedback is usually **"I want the header from B with the sidebar from C"** — that's the actual design they want.

### 6. Capture the answer and clean up

Once a variant has won, write down which one and why (commit message, ADR, issue, or a `NOTES.md` next to the prototype if running AFK and the user hasn't responded yet). Capture the approved Design Read, dial values, constraints, and specific elements selected/rejected. If the project already has `DESIGN.md`, propose the corresponding update; do not silently turn a one-off preference into a permanent project rule. Then:

- **Sub-shape A** — delete the losing variants and the switcher; fold the winner into the existing page.
- **Sub-shape B** — promote the winning variant to a real route, delete the throwaway route and the switcher.

Don't leave variant components or the switcher lying around. They rot fast and confuse the next reader.

## Anti-patterns

- **Variants that differ only in colour or copy.** That's a tweak, not a prototype. Real variants disagree about structure.
- **Sharing too much code between variants.** A shared `<Header>` is fine; a shared `<Layout>` defeats the point. Each variant should be free to throw out the layout.
- **Wiring variants to real mutations.** Read-only prototypes are fine. If a variant needs to mutate, point it at a stub — the question is "what should this look like", not "does the backend work".
- **Promoting the prototype directly to production.** The variant code was written under prototype constraints (no tests, minimal error handling). Rewrite it properly when you fold it in.
- **Treating a style checklist as learned taste.** Dials and heuristics are hypotheses. The user's comparison and reasons are the evidence worth preserving.
- **Replacing one monoculture with another.** Avoid generic AI defaults, but do not blindly replace them with a fixed set of fashionable fonts, asymmetric heroes, bento grids, or motion effects.

## Influences

The Design Read and dial concepts were adapted selectively from [Taste Skill](https://github.com/Leonxlnx/taste-skill) (MIT). This workflow intentionally excludes its framework defaults, hard aesthetic bans, mandatory imagery, and bundle installation. The local source of truth remains this file and the user's approved project decisions.
