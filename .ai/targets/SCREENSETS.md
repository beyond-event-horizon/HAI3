# Screensets Guidelines

> Common rules: .ai/GUIDELINES.md | Styling: .ai/targets/STYLING.md

# CRITICAL (AI: READ THIS)

**Rules:**
- ISOLATED - no data sharing between screensets
- READ core state via `useAppSelector`
- MODIFY core via actions from `@/core/actions` (event-driven)
- BAD: `import { setTheme } from '@/core/layout/layoutSlice'`
- GOOD: `import { setTheme } from '@hai3/uicore'` (re-exported from @/core/actions)
- NO hardcoded screenset names in shared code
- NO `if screenset ==` conditionals
- Build from UI Kit + UI Core

**Structure (AI: READ THIS):**
- Registry: only imports screensets, NOT individual screens
- Screenset file: self-contained config + screens + icons
- BAD: screensetRegistry.tsx imports all screens
- GOOD: screensetRegistry.tsx imports demoScreenset only

**Registry:** See GUIDELINES.md Self-Registering Registries

**IDs:** See GUIDELINES.md Identifiers section

**Navigation:**
- Menu items in screenset config
- MenuItem type from `@hai3/uicore`

**UI Kit:**
- Use existing `@hai3/uikit`
- CAN create LOCAL in `screensets/[name]/uikit/` (composites only)
- NEVER promote without request

**Themes:** See THEMES.md

**Building:**
- Global UI Kit + local uikit + logic + state
- Styling: ONLY layout

**Data:**
- Mock + setTimeout simulation
- Handle loading/error
