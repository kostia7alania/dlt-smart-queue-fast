# ADR-001: UI Kit Strategy Across Next.js and Nuxt Pet Projects

**Status:** Accepted
**Date:** 2026-07-07
**Deciders:** Kostia (owner); researched and drafted by Claude

## Context

Pet SaaS projects run on both Next.js (this repo) and Nuxt. The day job is adopting
Nuxt UI. Question: adopt a ready-made UI kit, find a Next.js analog, and keep one
design language across all projects — future-proofed for a possible PWA, desktop,
and mobile apps.

Facts verified 2026-07-07:

- **Nuxt UI v4**: the Nuxt team's official library — 125+ components on
  **Reka UI** (headless primitives) + **Tailwind CSS v4** + Tailwind Variants,
  CSS-first theming, works in plain Vue too. Mature (1000+ tests, thousands of
  production apps).
- **shadcn/ui**: de-facto React standard. Since **July 2026 Base UI is its default
  primitive layer** (built by the ex-Radix + MUI + Floating UI people; Radix slowed
  after the WorkOS acquisition). It is not an npm dependency but a CLI that copies
  component source into your repo, plus a **registry ecosystem** for distributing
  components/tokens/design systems, plus an **MCP server** so AI agents consume
  registries directly.
- **shadcn-vue**: mature port of the same design system for Vue/Nuxt, built on
  **Reka UI** (same primitives as Nuxt UI) and Tailwind v4.
- **Ark UI + Park UI**: the only true single-codebase cross-framework system
  (Zag.js state machines; React/Vue/Solid/Svelte parity), but Park UI styles via
  Panda CSS (not Tailwind), Vue coverage is thinner, and ecosystem momentum is far
  smaller than shadcn's.
- **Native path**: **React Native Reusables** brings the shadcn design language to
  React Native via NativeWind; Tamagui/gluestack are the universal-library
  alternatives. Vue has no comparably mature native story.

## Decision

1. **Yes to a ready-made kit** — hand-rolling components past MVP size wastes time
   and loses accessibility for free (both Reka and Base UI ship focus/ARIA/keyboard
   behavior).
2. **At work, Nuxt UI is a sound choice** — official, mature, and it shares
   primitives (Reka) and Tailwind v4 with everything below; no need to fight it.
3. **Pet projects standardize on the shadcn design system**:
   - Next.js apps → **shadcn/ui** (Base UI primitives, the 2026 default);
   - Nuxt apps → **shadcn-vue** (Reka primitives) — same component names, same
     look, same Tailwind classes;
   - one shared **Tailwind v4 token theme** (colors/radius/typography as a CSS
     `@theme` file in a tiny shared package or copied per repo) is the actual
     "единый дизайн" carrier.
4. **Future-proofing**: when the component set stabilizes, publish it as a private
   **shadcn registry** (works for both React and Vue collections) and expose it via
   the shadcn MCP server so AI agents scaffold UI from our own design system.
5. **This repo (dtl-parser)**: keep the current hand-rolled Tailwind UI for now
   (constitution: MVP minimalism); adopt shadcn/ui as part of the next
   UI-heavy feature rather than as a retrofit.

## Options Considered

### Option A: shadcn/ui + shadcn-vue + shared Tailwind tokens (chosen)

| Dimension | Assessment |
|-----------|------------|
| Complexity | Low-Med (CLI copies code; you own it) |
| Cross-stack design unity | High (same names/classes/tokens; primitives differ but look identical) |
| AI-friendliness | Highest — AI models and tools (v0, agents via MCP) are heavily trained on shadcn |
| Future PWA/desktop/mobile | PWA/Tauri/Capacitor: same web code. Real native: React Native Reusables speaks the same design language |
| Risk | Two ports to keep in sync — mitigated by shared tokens and shadcn's registry model |

### Option B: Ark UI + Park UI (one true cross-framework system)

Pros: literally one component behavior for React and Vue.
Cons: Panda CSS instead of Tailwind (against our stack and the job's), thinner Vue
styling coverage, much smaller ecosystem and AI familiarity. Rejected as
puck-chasing the elegant-but-minor player.

### Option C: Nuxt UI everywhere it can go + ad-hoc React kit + shared tokens

Pros: maximum job alignment. Cons: Nuxt UI is Vue-only, so React side still needs a
different kit and the design drifts; token sharing alone carries less unity than
shared component design. Rejected for pet projects; fine at work.

## Where the Puck Is Heading (our bet)

1. **AI-first distribution wins**: components as code-in-your-repo + registries +
   MCP (shadcn model) beats npm-installed black boxes; design systems become
   something agents pull from, not humans copy-paste.
2. **Headless consolidation**: React → Base UI, Vue → Reka UI. Both are
   Radix-lineage; kits on top of them are the safe substrate.
3. **Tailwind v4 CSS-first tokens are the lingua franca** — a single `@theme` file
   is the cheapest cross-framework design contract.
4. **Desktop/mobile arrive as webview first** (Tauri 2 / Capacitor — zero UI-kit
   impact), and only go truly native via React Native — where only the shadcn
   lineage has a credible bridge (React Native Reusables).

## Consequences

- Easier: one design language across Next/Nuxt pet projects; AI agents generate
  consistent UI; native path exists without a redesign.
- Harder: shadcn-vue and shadcn/ui are separate ports — occasional API drift;
  we own component code (updates are re-pulls, not `npm update`).
- Revisit if: Park UI ships first-class Vue + Tailwind, or the job standardizes
  tokens we must inherit, or a native app becomes real (then evaluate Expo +
  React Native Reusables vs Capacitor seriously).

## Action Items

1. [ ] Start a shared Tailwind v4 `@theme` token file when the second pet project
   needs it (not before).
2. [ ] Adopt shadcn/ui in dtl-parser with the next UI-heavy feature (new spec).
3. [ ] Evaluate publishing a private shadcn registry once >1 project consumes the
   same components.
