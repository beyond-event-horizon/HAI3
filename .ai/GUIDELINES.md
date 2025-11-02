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

**Dependencies:**
- Apps: ONLY `@hai3/uicore`, `@hai3/uikit`, `react`, `react-dom`
- BAD: Apps declaring `@radix-ui/*`, `react-router-dom`, `@reduxjs/toolkit`
- GOOD: UI packages own dependencies

**Core Rules:**
- NO bridging: Domains read Redux, emit events
- Self-registering: `service.register()` at module level
- Event-driven: Actions emit -> Effects update (See EVENTS.md)

---

## Import Path Rules

**Relative vs Alias:**
- Sibling files: Relative `../sibling`
- Within package: Relative `../../../`
- Cross-branch in app: Alias `@/other/branch`
- Cross-package: `@hai3/uicore`, `@hai3/uikit`

**Examples:**
- BAD: `@/screensets/.../screens/theme`
- GOOD: `../theme/Screen`

**Index Files:**
- Create ONLY when aggregating 3+ files
- Import directly from slices: `from './menu/menuSlice'`

---

## TypeScript Rules

**STRICT:** Types for all, NEVER `any`, `type` for objects, `interface` for props

**Identifiers (AI: READ THIS):**
- NEVER hardcoded strings, use constants
- 1-3 constants -> define where used
- 4-9 constants -> consider context
- 10+ constants -> own file
- BAD: `id: 'demo'`, `variant: 'primary'`
- GOOD: `id: DEMO_SCREENSET_ID`, `variant: ButtonVariant.Primary`

**Registry Pattern (AI: READ THIS - CRITICAL):**
- Registry file NEVER modified when adding items
- Items self-register, define own constants locally
- BAD: Central constants in registry file
- GOOD: Each item exports own constant
- If adding item requires modifying registry -> pattern is WRONG

**Types Enforce Boundaries:**
- BAD: `theme: string`, `as SomeType` casts
- GOOD: `theme: ThemeName`, proper type constraints
- Type casts hide problems, fix root cause instead
- String types hide violations, proper types reveal them

**Class Member Ordering:**
Properties, Constructor, Methods (public, protected, private)

---

## Documentation

- NO emoji, use -> for arrows, BAD:/GOOD: examples
- Technical, concise, NO markdown reports (unless user asks)

---

## Self-Improvement (AI: READ THIS - CRITICAL)

**After mistake:**
1. Update GUIDELINES.md with decision rule
2. Update target .ai file
3. Create memory
4. Verify .ai edits follow AI.md

**Before creating files:**
- Check pattern, count items, verify Open/Closed
