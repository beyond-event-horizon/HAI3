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

# Component Requirements
- MUST support theming from `src/styles/themes`
- MUST be responsive
- MUST handle loading/error states (if applicable)
- MUST support accessibility (ARIA attributes, keyboard nav)
- Export component + types from index.ts

# Component Structure
```typescript
// Component.types.ts
export interface ComponentProps {
  // props definition
}

// Component.tsx
import React from 'react';
import { ComponentProps } from './Component.types';

export const Component: React.FC<ComponentProps> = (props) => {
  // implementation
};

// index.ts
export { Component } from './Component';
export type { ComponentProps } from './Component.types';
```

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

# Component Documentation
- Add JSDoc comments for complex components
- Document all props with descriptions
- Provide usage examples in comments
- Note any special behaviors or constraints

# Testing Considerations
- Design components to be easily testable
- Avoid side effects
- Keep logic minimal and pure
- Support test IDs via props if needed

# Examples
```typescript
// Button component example
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  onClick,
  className,
}) => {
  return (
    <button
      className={cn(
        'rounded font-medium transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};
```

# Reference Documents
- **docs/MANIFEST.md** - Core philosophy, principles, and vision
- **docs/MODEL.md** - Domain models and glossary
- **.ai/THEMES.md** - Theming guidelines
