# UI Core Guidelines

## AI WORKFLOW (REQUIRED)
1) Summarize 3–6 rules from this file before proposing changes.
2) STOP if you import from `@hai3/uikit`, use raw HTML controls, or dispatch slices directly.

## SCOPE
- All code under `packages/uicore/**`
- UI Core owns domains, routing, providers, registry access, and shared actions/events
- Screensets may define their own state and events, but UI Core must not depend on screenset internals

## CRITICAL RULES
- Raw HTML controls (`<button>`, `<input>`, `<select>`) are FORBIDDEN — use UI Kit components via `uikitRegistry`
- UI Core must not import from `@hai3/uikit` directly — all components/icons must come from `uikitRegistry`
- UI Core follows event-driven architecture — no direct slice dispatch, no prop drilling, no callback-based state mutation
- App must be wrapped in `<HAI3Provider>` (Redux Provider + Router + registries)
- Domains are vertical slices: each owns its slice, effects, and actions; cross-domain communication only through events

## FILE LOCATION RULES
- Domain slices & effects: `packages/uicore/src/domains/<domain>/{slice.ts,effects.ts}`
- Domain actions: `packages/uicore/src/actions/<namespace>Actions.ts`
- Domain events: `packages/uicore/src/events/<namespace>Events.ts`
- Bootstrap & providers: `packages/uicore/src/app/{HAI3Provider.tsx,store.ts,initEffects.ts}`
- UI Kit registry accessors: `packages/uicore/src/registry/uikitRegistry.ts`
- Screenset-driven routing (no hardcoded routes): `packages/uicore/src/routing/**`

## STOP CONDITIONS
- Importing from `@hai3/uikit` inside UI Core
- Writing `<button>`, `<input>`, `<select>` or other raw HTML form controls
- Directly dispatching slice actions from UI components
- Hardcoding routes or importing screenset internals into UI Core

## PRE-DIFF CHECKLIST
- [ ] All UI components/icons retrieved through `uikitRegistry`
- [ ] No direct slice dispatch or prop drilling
- [ ] `<HAI3Provider>` is still the root wrapper
- [ ] Routing is generated from screenset registry, not hardcoded
- [ ] No imports from screenset-private modules