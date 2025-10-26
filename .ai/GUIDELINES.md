# HAI3 AI Guidelines

## Routing (AI: READ THIS FIRST)

**ALWAYS read the target guideline BEFORE making changes:**

- `packages/uicore` -> .ai/targets/UICORE.md
- `packages/uikit` -> .ai/targets/UIKIT.md
- `src/themes` -> .ai/targets/THEMES.md
- `src/screensets` -> .ai/targets/SCREENSETS.md
- `.ai/*.md` files -> .ai/targets/AI.md
- Styling questions -> .ai/targets/STYLING.md

---

## HAI3 Architecture (AI: READ THIS)

**Stack:** React 18 + TypeScript + Tailwind CSS + Vite + Redux Toolkit

**Monorepo:**
- `packages/uicore` -> Redux domains + state + orchestration
- `packages/uikit` -> Pure React + theme utilities
- `src/` -> App logic + themes + screensets

### NO BRIDGING IN APP
- App NEVER bridges between domains
- BAD: App reads menu.selectedScreen -> looks up component -> passes to Screen
- GOOD: Screen reads menu.selectedScreen -> looks up component internally
- BAD: App watches theme -> calls applyTheme
- GOOD: Footer watches theme -> applies internally

### SELF-REGISTERING REGISTRIES
- Registries self-register on import, NOT registered by App
- BAD: App calls screensetService.register() in useEffect
- GOOD: screensetRegistry.tsx calls screensetService.register() at module level
- BAD: App calls themeService.register() with themes object
- GOOD: themeRegistry.ts registers each theme on import

### DOMAIN ORCHESTRATION
- Domain with UI controls orchestrates related features
- Orchestration = providing DATA to other domains, NOT controlling their BEHAVIOR
- See UICORE.md for domain orchestration rules

### THIN CONTRACTS
- Domains know minimal information about each other
- Menu knows: items (MenuItem[]), selectedScreen (string) - NO screensets
- Screen knows: children (ReactNode) - NO screensets, looks up from registry
- Footer knows: screensets + themes - orchestrates both

### APP RESPONSIBILITIES (ONLY)
1. Import self-registering registries
2. Configure domain initial state
3. Render Layout
- NO watching state, NO bridging, NO registration

---

## Common TypeScript Rules

**STRICT:**
- Types for ALL variables, params, returns
- NEVER `any`, use `unknown`
- `type` for objects, `interface` for props
- Export types with component

**Enums & Types (AI: READ THIS - CRITICAL):**
- ALWAYS use enums for identifiers, NEVER hardcoded strings
- Enums: in slice file when slice owns values
- Types: `keyof typeof` when source exists elsewhere
- BAD: `icon: 'world'` GOOD: `icon: DemoIconId.World`
- BAD: `theme: 'light'` GOOD: `theme: ThemeName.Light`
- Prefer types over duplicate enums (DRY)

**Types Enforce Boundaries (AI: READ THIS):**
- Use types/enums to reveal architectural violations
- BAD: `theme: string` with value 'light' (hides UI Core knowing app value)
- GOOD: `theme: ThemeName` (forces import, reveals bad dependency)
- If framework knows app values -> type import will fail -> boundary violation visible
- Rule: String types hide coupling, proper types reveal it

---

## Documentation Rules

- NO emoji, ASCII only
- Use -> for arrows, BAD:/GOOD: for examples
- Technical, concise language
- NO markdown reports without user request
- .ai/ documentation is exception

---

## Self-Improvement

- Mistake made? Check if guidelines caused it
- Add decision rule to prevent future mistakes
- Verify .ai edits follow .ai/targets/AI.md
- Examples OK if they prevent mistakes
