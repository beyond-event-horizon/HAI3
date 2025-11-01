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
- API integration -> .ai/targets/API.md

---

## HAI3 Architecture (AI: READ THIS)

**Monorepo:** `packages/uicore`, `packages/uikit`, `src/`

**Dependencies (AI: READ THIS):**
- Apps: ONLY `@hai3/uicore`, `@hai3/uikit`, `react`, `react-dom`
- BAD: Apps declaring `@radix-ui/*`, `react-router-dom`, `@reduxjs/toolkit`
- GOOD: UI packages own dependencies

**Core Rules:**
- NO bridging: Domains read Redux, emit events
- Self-registering: `service.register()` at module level
- Event-driven: Actions emit -> Effects update (See EVENTS.md)
- App: Import registries, register icons, render

---

## Import Path Rules (AI: READ THIS - CRITICAL)

**Relative vs Alias:**
- Sibling files: Relative `../sibling`
- Within package: Relative `../../../`
- Cross-branch in app: Alias `@/other/branch`
- Cross-package: `@hai3/uicore`, `@hai3/uikit`

**Examples:**
- BAD: `@/screensets/.../screens/theme`
- GOOD: `../theme/Screen`

**Index Files (AI: READ THIS):**
- Create ONLY when aggregating 3+ files
- BAD: `domain/index.ts` for 1-2 files
- GOOD: `actions/index.ts` for 6+ files
- BAD: `app/index.ts` re-exported by parent
- Import directly from slices: `from './menu/menuSlice'`

---

## TypeScript Rules

**STRICT:** Types for all, NEVER `any`, `type` for objects, `interface` for props

**Identifiers (AI: READ THIS):**
- NEVER hardcoded strings, use constants/enums
- IDs with many entries -> own file
- Screen IDs 3-5 -> define in screen file, export
- BAD: `id: 'demo'`, `variant: 'primary'`
- GOOD: `id: DEMO_SCREENSET_ID`, `variant: ButtonVariant.Primary`

**Types Enforce Boundaries:**
- BAD: `theme: string`
- GOOD: `theme: ThemeName`
- String types hide violations, proper types reveal them

**Class Member Ordering (AI: READ THIS):**
- Properties: public, protected, private
- Constructor
- Methods: public, protected, private

---

## Documentation

- NO emoji, use -> for arrows, BAD:/GOOD: examples
- Technical, concise, NO markdown reports (unless user asks)

---

## Self-Improvement

- Mistake -> add decision rule to prevent recurrence
- Verify .ai edits follow AI.md (under 100 lines, decision rules only)
