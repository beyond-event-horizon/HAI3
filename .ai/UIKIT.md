# UI Kit Development Guidelines

> Read .ai/GUIDELINES.md for common rules

# CRITICAL RULES (AI: READ THIS)

**Folders:**
- `base/` = wrap shadcn from `@/uikit/base/_shadcn`, export with HAI3 API
- `composite/` = compose from `@/uikit/base/[category]`
- `base/_shadcn/` = shadcn components (DO NOT MODIFY)

**Hierarchy:**
- shadcn -> base -> composite
- NEVER skip layers - composite imports from base, NOT shadcn

**Decision Rule (AI: READ THIS):**
- Creating new component? Check imports:
  - Imports from `@/uikit/base/_shadcn/*` -> PUT IN `base/`
  - Imports from `@/uikit/base/*` -> PUT IN `composite/`
  - Example: Button imports shadcn -> `base/buttons/Button.tsx`
  - Example: ThemeToggle imports Button -> `composite/buttons/ThemeToggle.tsx`

**Component Rules:**
- NO Redux, NO business logic, NO API calls
- Pure presentational only
- Props: data in, React event handlers out
- MUST use enums for variants (NEVER string unions)
- MUST support theming via Tailwind theme tokens
- MUST be accessible (ARIA, keyboard nav)
- Styling: base handles ALL visual styles, composite ONLY layout (see .ai/STYLING.md)

**TypeScript:**
- Base: `extends ShadcnButtonProps` (full compatibility)
- Composite: `Omit<BaseProps, 'prop'>` when customizing
- Use `React.forwardRef` for ref forwarding
- Enums in `base/[category]/types.ts` (see GUIDELINES.md)
- Export: component + types + enums

**Files:**
- `base/[category]/types.ts` = enums
- `base/[category]/Component.tsx` = implementation
- `composite/[category]/Component.tsx` = composition
- `uikit/index.ts` = public exports
