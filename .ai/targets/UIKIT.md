# UI Kit Guidelines

> Common rules: .ai/GUIDELINES.md | Styling: .ai/targets/STYLING.md

# CRITICAL (AI: READ THIS)

**Scope:**
- Pure presentational React
- Theme utilities (applyTheme, Theme)
- NO Redux, NO business logic

**Hierarchy:** shadcn -> base -> composite
- NEVER skip layers

**shadcn Components (AI: READ THIS - CRITICAL):**
- NEVER modify files in `base/_shadcn/`
- Keep pristine for upstream updates
- Apply customizations in `base/` wrappers only
- BAD: Modify `_shadcn/select.tsx` styling
- GOOD: Add styling to `base/selectors/Select.tsx` wrapper

**Component Placement:**
- Imports `@/uikit/base/_shadcn/*` -> PUT IN `base/`
- Imports `@/uikit/base/*` -> PUT IN `composite/`

**Composite Pattern (AI: READ THIS):**
- Combine base components into reusable patterns
- Common: SimpleSelect, CascadingSelect, IconButton
- Generic, no app-specific logic
- BAD: Composite has Redux, theme registry, screenset logic
- GOOD: Composite takes value/onChange props, formats display
- If UI Core duplicates composite logic -> extract to UI Kit composite

**CRITICAL - Layer Skipping (AI: READ THIS):**
- BAD: Composite imports from `_shadcn/dropdown-menu`
- GOOD: Create `base/dropdowns/DropdownMenu` (wraps shadcn), composite imports base
- BAD: Any component importing from shadcn AND base
- GOOD: base wraps shadcn, composite uses base only
- Rule: If you need shadcn in composite, create base wrapper FIRST

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
