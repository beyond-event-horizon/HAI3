# Screensets Guidelines

> Common: .ai/GUIDELINES.md | Styling: STYLING.md

## CRITICAL (AI: READ THIS FIRST)

**NEVER manual styling:**
- FORBIDDEN: `<div className="border rounded bg-card">`
- REQUIRED: Use `@hai3/uikit` components
- Detect: grep for `className=".*border.*rounded` in screensets

**NEVER slice actions:**
- FORBIDDEN: `import { setTheme } from '@/layout/layoutSlice'`
- REQUIRED: `import { setTheme } from '@hai3/uicore'`

**Rules:**
- MUST: Isolated screensets
- MUST: READ via `useAppSelector`, MODIFY via actions
- NEVER: Hardcoded screenset names in shared code
- NEVER: `if screenset ==` conditionals

**Structure:**
- Registry: only imports screensets, NOT individual screens
- Screenset file: self-contained config + screens + icons
- BAD: screensetRegistry.tsx imports all screens
- GOOD: screensetRegistry.tsx imports demoScreenset only

**Registry:** See GUIDELINES.md Self-Registering Registries

**IDs:** See GUIDELINES.md Identifiers section

**Navigation:**
- Menu items in screenset config
- MenuItem type from `@hai3/uicore`

**UI Kit Decision Tree:**
1. Check `@hai3/uikit` -> Use it
2. Check shadcn catalog -> `npx shadcn add [component]` -> move to uikit
3. Need composite? Check `@hai3/uikit` composite/ -> create if missing
4. Local uikit -> ONLY screenset-specific composites
5. Manual styling -> FORBIDDEN

**Themes:** See THEMES.md

**Building:**
- Global UI Kit + local uikit + logic + state
- Styling: ONLY layout

**Data:**
- Mock + setTimeout simulation
- Handle loading/error
