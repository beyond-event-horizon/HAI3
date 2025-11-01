# UI Kit Guidelines

> Common rules: .ai/GUIDELINES.md | Styling: .ai/targets/STYLING.md

## CRITICAL (AI: READ THIS FIRST)

**Scope:**
- Pure presentational React
- Theme utilities
- NO Redux, NO business logic

**shadcn:**
- ALWAYS use shadcn first
- ALL base components are shadcn
- Update: `npx shadcn add [component]`
- Enums in same file as component
- Mark customizations: `// HAI3 customization: ...`

**Hierarchy:** base -> composite
- Base = shadcn ONLY
- Composite = combinations of base
- NO custom base components
- Placement: shadcn -> `base/`, combinations -> `composite/`

**Composite Pattern:**
- BAD: Composite has Redux, theme registry, screenset logic
- GOOD: Composite takes value/onChange props only

**Icons:**
- Location: `icons/` directory
- Tree-shakeable: exported, NOT self-registered
- Props: className only

**Rules:**
- Pure presentational, props in/events out
- Enums for variants, NEVER string unions
- Styling per STYLING.md
- Export types with component, enums in same file
- BEFORE deleting: grep UI Core for imports
