# UI Kit Development Guidelines

> Rules for contributing to HAI3 UI Kit (src/uikit)
> Read .ai/GUIDELINES.md for common rules

# Stack Specifics
- shadcn/ui for UI components
- NO Redux in UI Kit components
- Uses themes (see .ai/THEMES.md)

# Structure
```
src/uikit/
├── layout/             # Layout components
├── forms/              # Form components
├── buttons/            # Button components
├── cards/              # Card components
└── [category]/         # Other component categories
    └── [Component]/
        ├── Component.tsx
        ├── Component.types.ts
        └── index.ts
```

# UI Kit Philosophy
- UI Kit = business-logic-free reusable components
- Components are pure presentational
- NO business logic, NO API calls, NO Redux
- Accept data via props only
- Emit events via callbacks
- Reusable across all screensets

## Component Composition (AI: READ THIS)
**Hierarchy:**
- shadcn -> UI Kit Base -> UI Kit Composite
- Base components (Button) wrap shadcn from `@/uikit/_shadcn`
- Composite components (IconButton) compose from UI Kit base
- NEVER skip layers - Composite must use UI Kit base, not shadcn directly

# Component Requirements
- MUST support theming from `src/styles/themes`
- MUST be responsive
- MUST handle loading/error states (if applicable)
- MUST support accessibility (ARIA attributes, keyboard nav)
- Export component + types from index.ts

# Theming
- Use theme tokens from `src/styles/themes`
- NO hardcoded colors - use CSS variables or Tailwind theme classes
- Support light/dark mode automatically via theme context
- Use semantic color names (primary, secondary, accent, muted, border)

# Props Design
- Clear, descriptive prop names
- Use TypeScript unions for variants
- Provide sensible defaults
- Support className prop for customization
- Use `children` for composition

# Styling
- Tailwind CSS for styling
- Use `cn()` utility for conditional classes
- Keep styles scoped to component
- Follow responsive-first approach
- Use Tailwind theme configuration

# Key Patterns (AI: READ THIS)

**Enums:**
- Define in `[category]/types.ts`
- Export from component files
- ALWAYS use enums, NEVER string literals

**Component Structure:**
- Extend shadcn interface: `extends ShadcnButtonProps`
- Use `React.forwardRef` for ref forwarding
- Customize with `Omit` when needed: `Omit<ShadcnButtonProps, 'size'>`
- Export component + types + enums from index

**File Organization:**
- `types.ts` = enums
- `Component.tsx` = component implementation
- `index.ts` = public exports

# Reference Documents
- **docs/MANIFEST.md** - Core philosophy, principles, and vision
- **docs/MODEL.md** - Domain models and glossary
- **.ai/THEMES.md** - Theming guidelines
