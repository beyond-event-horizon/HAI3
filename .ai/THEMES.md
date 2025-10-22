# Themes Development Guidelines

> Rules for contributing to HAI3 Themes (src/styles/themes)
> Read .ai/GUIDELINES.md for common rules

# Theme-Specific Rules
- TypeScript for theme definitions
- Explicit types for ALL theme properties
- Follow consistent naming conventions

# Structure
```
src/styles/
├── themes/
│   ├── light.ts        # Light theme
│   ├── dark.ts         # Dark theme
│   ├── [custom].ts     # Custom themes
│   └── types.ts        # Theme type definitions
├── globals.css         # Global CSS + Tailwind directives
└── index.ts            # Theme exports
```

# Theme Philosophy
- Themes define visual appearance system-wide
- Support light/dark mode minimum
- Use semantic color naming
- Provide consistent token structure
- Enable easy theme switching

# Theme Structure
```typescript
// types.ts
export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
    error: string;
    warning: string;
    success: string;
    info: string;
  };
  spacing: {
    // spacing scale
  };
  typography: {
    // font definitions
  };
  // other tokens
}

// light.ts
export const lightTheme: Theme = {
  name: 'light',
  colors: {
    primary: '#0066cc',
    // ...
  },
  // ...
};
```

# Theme Requirements
When adding a new theme:
- Include ALL required tokens
- Follow existing theme structure
- Test with all UI Kit components
- Support both light and dark base
- Document theme purpose and use case

# Color Tokens
Use semantic names, not literal:
- `primary` - Primary brand color
- `secondary` - Secondary color
- `accent` - Accent/highlight color
- `background` - Main background
- `foreground` - Main text/content
- `muted` - Subdued elements
- `border` - Border color
- `error` - Error states
- `warning` - Warning states
- `success` - Success states
- `info` - Informational states

# CSS Variables
Themes expose CSS variables for runtime switching:
```css
:root[data-theme="light"] {
  --color-primary: #0066cc;
  --color-background: #ffffff;
  /* ... */
}

:root[data-theme="dark"] {
  --color-primary: #4da6ff;
  --color-background: #1a1a1a;
  /* ... */
}
```

# Theme Application
- Themes applied via CSS variables
- Tailwind configured to use theme tokens
- Components reference tokens, not hardcoded values
- Theme switching updates CSS variables

# Tailwind Integration
```javascript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: 'var(--color-primary)',
      secondary: 'var(--color-secondary)',
      // ...
    }
  }
}
```

# Adding New Themes
When adding a new theme:
1. Create `[name].ts` in `src/styles/themes`
2. Implement `Theme` interface completely
3. Export from `src/styles/themes/index.ts`
4. Add CSS variable definitions in `globals.css`
5. Test all components with new theme
6. Document theme characteristics

# Modifying Existing Themes
- DO NOT modify existing themes when working on screensets
- Core development can modify themes as needed
- Breaking changes require version update
- Document all changes in CHANGELOG.md

# Typography
Define font families, sizes, weights:
```typescript
typography: {
  fontFamily: {
    sans: ['Inter', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    // ...
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
}
```

# Spacing
Define consistent spacing scale:
```typescript
spacing: {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  // ...
}
```

# Border Radius
Define border radius scale:
```typescript
borderRadius: {
  none: '0',
  sm: '0.125rem',
  md: '0.25rem',
  lg: '0.5rem',
  full: '9999px',
}
```

# Shadows
Define elevation/shadow system:
```typescript
shadows: {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  // ...
}
```

# Best Practices
- Use relative units (rem, em) over pixels
- Maintain WCAG contrast ratios (4.5:1 minimum)
- Test themes with color blindness simulators
- Support high contrast mode
- Document color usage and meanings

# Testing Themes
- Visual review of all components
- Check contrast ratios
- Test theme switching
- Verify CSS variable application
- Cross-browser compatibility

# Documentation
- Document theme purpose
- Note any special use cases
- Provide color palette reference
- Include accessibility notes

# Reference Documents
- **docs/MANIFEST.md** - Core philosophy, principles, and vision
- **docs/MODEL.md** - Domain models and glossary
- **.ai/UIKIT.md** - UI Kit component guidelines
