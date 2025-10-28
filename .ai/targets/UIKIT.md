# UI Kit Guidelines

> Common rules: .ai/GUIDELINES.md | Styling: .ai/targets/STYLING.md

# CRITICAL (AI: READ THIS)

**Scope:**
- Pure presentational React
- Theme utilities (applyTheme, Theme)
- NO Redux, NO business logic

**Hierarchy:** base (shadcn only) -> composite
- Base = shadcn components ONLY (flat)
- Composite = combinations of base
- NO custom base components (always use shadcn first)

**shadcn (AI: READ THIS - CRITICAL):**
- ALL base components are shadcn
- Enums in same file as component
- Mark customizations: `// HAI3 customization: ...`
- Update: `npx shadcn add [component]`

**Rule (AI: READ THIS - CRITICAL):**
- ALWAYS use shadcn first, only create custom if shadcn lacks it
- Navigation -> NavigationMenu, Sidebar -> Sheet, Modal -> Dialog
- BEFORE deleting: grep UI Core for imports
- Placement: shadcn -> `base/`, combinations -> `composite/`

**Composite Pattern (AI: READ THIS):**
- BAD: Composite has Redux, theme registry, screenset logic
- GOOD: Composite takes value/onChange props only
- If UI Core duplicates UI logic -> extract to composite

**Icons (AI: READ THIS):**
- Location: `icons/` directory
- Tree-shakeable: exported, NOT self-registered
- App imports and registers: `iconService.register('id', <Icon />)`
- Props: className only

**Rules:**
- Pure presentational, props in/events out
- Enums for variants (NEVER string unions)
- Styling per STYLING.md
- Export types with component, enums in same file
