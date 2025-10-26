# Screensets Guidelines

> Common rules: .ai/GUIDELINES.md | Styling: .ai/targets/STYLING.md

# CRITICAL (AI: READ THIS)

**Rules:**
- ISOLATED - no data sharing between screensets
- READ core state, CANNOT MODIFY core
- NO hardcoded screenset names in shared code
- NO `if screenset ==` conditionals
- Build from UI Kit + UI Core

**Structure (AI: READ THIS):**
- Registry: only imports screensets, NOT individual screens
- Screenset file: self-contained config + screens + icons
- Pattern prevents merge conflicts when multiple devs work on different screensets
- BAD: screensetRegistry.tsx imports all screens
- GOOD: screensetRegistry.tsx imports demoScreenset only

**Registry (AI: READ THIS):**
- Self-registers on import: `screensetService.register(config)`
- App imports: `import '@/screensets/screensetRegistry'`
- NO registration in App.tsx
- Define + register at module level

**IDs Pattern (AI: READ THIS):**
- Screenset ID: const in screenset file (e.g., DEMO_SCREENSET_ID)
- Screen IDs: const in screen files (e.g., HELLO_WORLD_SCREEN_ID)
- Icon IDs: const in icon files (e.g., WORLD_ICON_ID)
- Prevents circular imports, follows vertical slice
- See GUIDELINES.md for details

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
