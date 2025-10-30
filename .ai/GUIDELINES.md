# HAI3 AI Guidelines

## Routing (AI: READ THIS FIRST)

**ALWAYS read the target guideline BEFORE making changes:**

- `packages/uicore` -> .ai/targets/UICORE.md (includes routing)
- `packages/uikit` -> .ai/targets/UIKIT.md
- `src/themes` -> .ai/targets/THEMES.md
- `src/screensets` -> .ai/targets/SCREENSETS.md
- `.ai/*.md` files -> .ai/targets/AI.md
- Styling questions -> .ai/targets/STYLING.md
- Event-driven architecture -> .ai/targets/EVENTS.md

---

## HAI3 Architecture (AI: READ THIS)

**Monorepo:** `packages/uicore` (Redux domains), `packages/uikit` (React components), `src/` (app + themes + screensets)

**Dependencies (AI: READ THIS):**
- Apps: ONLY `@hai3/uicore`, `@hai3/uikit`, `react`, `react-dom`
- BAD: Apps declaring `@radix-ui/*`, `react-router-dom`, `@reduxjs/toolkit`
- GOOD: UI packages own dependencies (transitive via npm workspaces)

### NO BRIDGING IN APP
- BAD: App bridges domains (reads state -> passes props between domains)
- GOOD: Domains read own Redux state, actions emit events, effects update state

### SELF-REGISTERING REGISTRIES
- BAD: App calls service.register() in useEffect
- GOOD: Registry file calls service.register() at module level

### EVENT-DRIVEN
- Actions emit events -> Effects subscribe -> Update slices (See EVENTS.md)

### APP RESPONSIBILITIES
1. Import registries (auto-register) 2. Register icons 3. Configure domains 4. Render
- NO watching state, NO bridging

---

## Import Path Rules (AI: READ THIS - CRITICAL)

**Relative vs Alias:**
- Sibling files (same parent): Relative (`../sibling`)
- Within package: Relative OK even `../../../`
- Cross-branch in app: Alias (`@/other/branch`)
- Cross-package: `@hai3/uicore`, `@hai3/uikit`

**BAD:**
- App: `@/screensets/.../screens/theme` (siblings via alias)
- App: `@/App` (same dir via alias)

**GOOD:**
- App siblings: `../theme/Screen`
- Package: `../../../core/actions`
- Cross-branch: `@/core/services/thing`

---

## TypeScript Rules

**STRICT:** Types for all, NEVER `any`, `type` for objects, `interface` for props

**Identifiers (AI: READ THIS):**
- NEVER hardcoded strings, use constants/enums
- IDs in own file, enums in slice files
- BAD: `id: 'demo'` GOOD: `id: DEMO_SCREENSET_ID`
- BAD: `variant: 'primary'` GOOD: `variant: ButtonVariant.Primary`

**Types Enforce Boundaries:**
- BAD: `theme: string` (hides coupling) GOOD: `theme: ThemeName` (reveals dependency)
- String types hide violations, proper types reveal them

---

## Documentation

- NO emoji, use -> for arrows, BAD:/GOOD: examples
- Technical, concise, NO markdown reports (unless user asks)

---

## Self-Improvement

- Mistake -> add decision rule to prevent recurrence
- Verify .ai edits follow AI.md (under 100 lines, decision rules only)
