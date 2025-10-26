# UI Kit Guidelines

> Common rules: .ai/GUIDELINES.md | Styling: .ai/targets/STYLING.md

# CRITICAL (AI: READ THIS)

**Scope:**
- Pure presentational React
- Theme utilities (applyTheme, Theme)
- NO Redux, NO business logic

**Hierarchy:** shadcn -> base -> composite
- NEVER skip layers

**Component Placement:**
- Imports `@/uikit/base/_shadcn/*` -> PUT IN `base/`
- Imports `@/uikit/base/*` -> PUT IN `composite/`

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
- Tailwind theme tokens
- Accessible (ARIA, keyboard)
- Base = ALL visual styles, Composite = ONLY layout

**Types:**
- Presentational types here (MenuItem, ButtonVariant)
- UI Core imports these (not reverse)
- Enums in `base/[category]/types.ts`
