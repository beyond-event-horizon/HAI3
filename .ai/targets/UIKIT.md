# UI Kit Guidelines

> Common rules: .ai/GUIDELINES.md | Styling: .ai/targets/STYLING.md

# CRITICAL (AI: READ THIS)

**Scope:**
- Pure presentational React
- Theme utilities (applyTheme, Theme)
- NO Redux, NO business logic

**Hierarchy:** base -> composite
- Base = shadcn components (flat structure) + layout components
- Composite = combinations of base

**shadcn Components (AI: READ THIS - CRITICAL):**
- shadcn files at base root: `base/button.tsx`, `base/select.tsx`, `base/dropdown-menu.tsx`
- Enums in same file as component (ButtonVariant in button.tsx)
- You own this code - modify as needed
- Mark customizations with comments: `// HAI3 customization: ...`
- When updating shadcn: `npx shadcn add` works out of the box ✅
- Manual merge required for existing customizations

**Component Placement:**
- shadcn component -> PUT IN `base/` (flat, at root)
- HAI3 layout component -> PUT IN `base/layout/`
- Combines base components -> PUT IN `composite/`

**Composite Pattern (AI: READ THIS):**
- Combine base components into reusable patterns
- Common: SimpleSelect, CascadingSelect, IconButton
- Generic, no app-specific logic
- BAD: Composite has Redux, theme registry, screenset logic
- GOOD: Composite takes value/onChange props, formats display
- If UI Core duplicates composite logic -> extract to UI Kit composite

**Component Rules:**
- Pure presentational only
- Props in, events out
- Enums for variants (NEVER string unions)
- Tailwind theme tokens, styling per STYLING.md
- Accessible (ARIA, keyboard)

**Types:**
- Presentational types exported with component
- MenuItem, ButtonVariant, etc.
- UI Core imports these (not reverse)
- Enums defined in component file, not separate files
