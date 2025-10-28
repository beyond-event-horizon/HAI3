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
