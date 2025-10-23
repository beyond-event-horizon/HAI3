# Styling System Migration Guide

## Overview

The HAI3 styling system has been updated to follow a modern token-based approach with complete theme support.

## What Changed

### 1. Tailwind Config (`tailwind.config.ts`)

**Added token system:**
- State colors: `error`, `warning`, `success`, `info`
- Spacing scale: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`
- Z-index scale: `dropdown`, `sticky`, `fixed`, `modal`, `popover`, `tooltip`
- Transition durations: `fast`, `base`, `slow`, `slower`

**Usage:**
```tsx
<div className="bg-error text-foreground">Error message</div>
<div className="p-md gap-lg">Layout container</div>
<div className="z-modal rounded-lg">Modal</div>
<div className="transition-colors duration-base">Animated</div>
```

### 2. Global CSS (`src/styles/globals.css`)

**Changed to `data-theme` attribute:**
- Before: `.dark` class
- After: `:root[data-theme="light"]` and `:root[data-theme="dark"]`

**Added complete token definitions:**
- State colors for both themes
- Spacing variables
- Border radius variables

**Theme switching:**
```typescript
// Set theme on document root
document.documentElement.setAttribute('data-theme', 'dark');
```

### 3. Theme Files (`src/styles/themes/`)

**New structure:**
```
themes/
├── types.ts       - Theme interface
├── light.ts       - Light theme
├── dark.ts        - Dark theme
└── index.ts       - Exports
```

**Complete Theme interface:**
- Colors (including state colors)
- Spacing scale
- Typography (font families, sizes, weights, line heights)
- Border radius scale
- Shadows
- Transitions

**Usage:**
```typescript
import { lightTheme, darkTheme, themes } from '@/styles/themes';
import type { Theme, ThemeName } from '@/styles/themes';

// Access theme values
const primaryColor = lightTheme.colors.primary;
const spacing = lightTheme.spacing.md;
```

## Token System

### Colors
- Semantic: `primary`, `secondary`, `accent`, `background`, `foreground`, `muted`, `border`
- States: `error`, `warning`, `success`, `info`

### Spacing
- Scale: `xs` (0.25rem), `sm` (0.5rem), `md` (1rem), `lg` (1.5rem), `xl` (2rem), `2xl` (3rem), `3xl` (4rem)

### Typography
- Families: `sans`, `mono`
- Sizes: `xs` to `5xl`
- Weights: `normal`, `medium`, `semibold`, `bold`

### Border Radius
- `none`, `sm`, `md`, `lg`, `xl`, `full`

### Transitions
- `fast` (150ms), `base` (200ms), `slow` (300ms), `slower` (500ms)

### Z-Index
- `dropdown` (1000), `sticky` (1020), `fixed` (1030), `modal` (1040), `popover` (1050), `tooltip` (1060)

## Migration Examples

### Before
```tsx
// Hardcoded values
<div className="p-4 rounded-md bg-blue-600 text-white">
  <button className="bg-blue-700 hover:bg-blue-800">Click</button>
</div>
```

### After
```tsx
// Token-based
<div className="p-md rounded-md bg-primary text-primary-foreground">
  <button className="bg-primary/90 hover:bg-primary transition-colors duration-base">
    Click
  </button>
</div>
```

## Styling Responsibilities

### Base Components (src/uikit/base/)
- Handle ALL visual styling
- Use theme tokens exclusively
- Support all states (hover, focus, active, disabled)
- Example: colors, typography, borders, shadows

### Composite Components (src/uikit/composite/)
- ONLY layout/positioning of base components
- Use flex, grid, gap, spacing
- NO visual styling

### Core/Screensets (src/core/, src/screensets/)
- ONLY layout of UI Kit components
- Use flex, grid, gap for positioning
- NO visual styling whatsoever

## Best Practices

1. **Never hardcode values**
   ```tsx
   // BAD
   <div className="bg-[#0066cc] p-4">
   
   // GOOD
   <div className="bg-primary p-md">
   ```

2. **Use semantic colors**
   ```tsx
   // BAD
   <div className="text-red-600">Error!</div>
   
   // GOOD
   <div className="text-error">Error!</div>
   ```

3. **Spacing consistency**
   ```tsx
   // BAD
   <div className="gap-3 p-5">
   
   // GOOD
   <div className="gap-md p-lg">
   ```

4. **Theme-aware transitions**
   ```tsx
   // GOOD
   <button className="transition-colors duration-base hover:bg-primary/90">
   ```

## Theme Switching

To implement theme switching in your application:

```typescript
// Create theme context/hook
import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return { theme, setTheme };
}

// Usage
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </button>
  );
}
```

## Reference

- **Detailed guide:** `.ai/STYLING.md`
- **Theme guidelines:** `.ai/THEMES.md`
- **UI Kit guidelines:** `.ai/UIKIT.md`
