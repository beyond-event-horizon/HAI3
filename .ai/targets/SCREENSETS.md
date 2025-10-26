# Screensets Guidelines

> Common rules: .ai/GUIDELINES.md | Styling: .ai/targets/STYLING.md

# CRITICAL (AI: READ THIS)

**Rules:**
- ISOLATED - no data sharing between screensets
- READ core state, CANNOT MODIFY core
- NO hardcoded screenset names in shared code
- NO `if screenset ==` conditionals
- Build from UI Kit + UI Core

**Registry (AI: READ THIS):**
- Self-registers on import: `screensetService.register(config)`
- App imports: `import '@/screensets/screensetRegistry'`
- NO registration in App.tsx
- Define + register at module level

**Navigation:**
- Menu items in screenset config
- MenuItem type from `@hai3/uikit`
- Footer orchestrates: currentScreenset -> Menu
- Screen renders: selectedScreen -> component

**UI Kit:**
- Use existing `@hai3/uikit` components
- CANNOT modify existing
- CAN create LOCAL in `screensets/[name]/uikit/` (composites only)
- KEEP local - NEVER promote without request

**Themes:**
- CAN add new (see THEMES.md)
- CANNOT modify existing
- NO hardcoded colors

**Building:**
- Global UI Kit + local uikit + logic + state
- Styling: ONLY layout

**Data:**
- Mock + setTimeout simulation
- Handle loading/error
