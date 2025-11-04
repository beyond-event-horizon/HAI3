# Screensets Guidelines

> Common: .ai/GUIDELINES.md | Data Flow: EVENTS.md | Styling: STYLING.md

## CRITICAL (AI: READ THIS FIRST)

**NEVER manual styling:**
- FORBIDDEN: `<div className="border rounded bg-card">`
- REQUIRED: Use `@hai3/uikit` components
- Detect: grep for `className=".*border.*rounded` in screensets

**Data Flow (AI: READ THIS - CRITICAL):**
- ONLY allowed: Event-driven via `@hai3/uicore` actions (See EVENTS.md)
- FORBIDDEN: `import { setTheme } from '@/layout/layoutSlice'`
- REQUIRED: `import { setTheme } from '@hai3/uicore'`
- Pattern: Component -> Action -> Event -> Effect -> Slice
- READ: `useAppSelector((state) => state.app.user)`
- MODIFY: `dispatch(setTheme('dark'))` from imported action
- NEVER: Direct slice imports, prop drilling, manual state sync

**Rules:**
- MUST: Isolated screensets
- NEVER: Hardcoded screenset names in shared code
- NEVER: `if screenset ==` conditionals

**Structure:**
- Registry: only imports screensets, NOT individual screens
- Screenset file: self-contained config + screens + icons
- BAD: screensetRegistry.tsx imports all screens
- GOOD: screensetRegistry.tsx imports demoScreenset only

**Icon Registration (AI: READ THIS):**
- REQUIRED: Self-register icons in screenset file
- REQUIRED: Export string constants for icon IDs
- Pattern: `export const WORLD_ICON_ID = 'world' as const;`
- Pattern: `uikitRegistry.registerIcons({ [WORLD_ICON_ID]: <WorldIcon /> })`
- UiKitIcon enum is for CORE framework icons only
- Screenset icons use exported constants, NOT enum, NOT inline strings
- Icons used by Menu domain need registry lookup
- BAD: `registerIcon('world', ...)` (hardcoded string)
- BAD: Central icon registry file
- GOOD: Icons registered in screenset.tsx with exported constants

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
