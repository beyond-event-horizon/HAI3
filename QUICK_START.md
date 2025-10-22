# HAI3 UI-Core Quick Start Guide

> **TARGET AUDIENCE:** Humans  
> **PURPOSE:** Quick start guide for developers

This guide will help you get started with HAI3 UI-Core development.

## Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open browser**
   Navigate to `http://localhost:5173`

## Project Structure Overview

```
src/
├── core/               # Core UI implementation
│   ├── layout/         # CoreLayout component
│   ├── store/          # Redux store (global state)
│   └── hooks/          # Typed Redux hooks
├── uikit/              # Reusable UI components
│   └── layout/         # Layout components (Header, Footer, Menu, etc.)
├── screensets/         # Application screens
│   └── drafts/         # Draft screens for development
├── styles/             # Global styles and themes
└── lib/                # Utility functions
```

## Creating Your First Screen

1. **Create a new screen file**
   ```bash
   # Create in src/screensets/drafts/
   touch src/screensets/drafts/MyScreen.tsx
   ```

2. **Write your screen component**
   ```typescript
   import React from 'react';

   export const MyScreen: React.FC = () => {
     return (
       <div className="p-6">
         <h1 className="text-2xl font-bold">My Screen</h1>
         <p>Content goes here</p>
       </div>
     );
   };
   ```

3. **Use it in App.tsx**
   ```typescript
   import { MyScreen } from '@/screensets/drafts/MyScreen';

   // In your CoreLayout children
   <MyScreen />
   ```

## Using Layout Components

### Header
```typescript
<Header 
  logo={<Logo />}
  actions={<UserMenu />}
/>
```

### Menu
```typescript
const menuItems: MenuItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: <HomeIcon />,
  },
];

<Menu items={menuItems} collapsed={false} />
```

### Sidebar
```typescript
<Sidebar 
  position="left"
  title="Sidebar Title"
  collapsed={false}
>
  <div>Sidebar content</div>
</Sidebar>
```

### Popup
```typescript
const [open, setOpen] = useState(false);

<Popup
  open={open}
  onClose={() => setOpen(false)}
  title="My Popup"
>
  <div>Popup content</div>
</Popup>
```

## Using Redux State

### Read state
```typescript
import { useAppSelector } from '@/core/hooks/useRedux';

const MyComponent = () => {
  const layout = useAppSelector(state => state.layout);
  const user = useAppSelector(state => state.core.user);
  
  return <div>Menu collapsed: {layout.menuCollapsed}</div>;
};
```

### Dispatch actions
```typescript
import { useAppDispatch } from '@/core/hooks/useRedux';
import { toggleMenu, setUser } from '@/core/store';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  
  const handleToggle = () => {
    dispatch(toggleMenu());
  };
  
  return <button onClick={handleToggle}>Toggle Menu</button>;
};
```

## Styling with Tailwind

HAI3 uses Tailwind CSS with custom theme tokens:

```typescript
<div className="bg-background text-foreground">
  <h1 className="text-2xl font-bold text-primary">Title</h1>
  <p className="text-muted-foreground">Description</p>
</div>
```

### Available Theme Colors
- `background` - Main background
- `foreground` - Main text color
- `primary` - Primary brand color
- `secondary` - Secondary color
- `accent` - Accent color
- `muted` - Muted color
- `border` - Border color

## Adding a New UIKit Component

1. **Create component file**
   ```bash
   touch src/uikit/Button.tsx
   ```

2. **Implement component**
   ```typescript
   import React from 'react';
   import { cn } from '@/lib/utils';

   export interface ButtonProps {
     children: React.ReactNode;
     onClick?: () => void;
     variant?: 'primary' | 'secondary';
     className?: string;
   }

   export const Button: React.FC<ButtonProps> = ({
     children,
     onClick,
     variant = 'primary',
     className,
   }) => {
     return (
       <button
         onClick={onClick}
         className={cn(
           'px-4 py-2 rounded font-medium transition-colors',
           variant === 'primary' && 'bg-primary text-primary-foreground',
           variant === 'secondary' && 'bg-secondary text-secondary-foreground',
           className
         )}
       >
         {children}
       </button>
     );
   };
   ```

3. **Export from uikit**
   ```typescript
   // src/uikit/index.ts
   export { Button, type ButtonProps } from './Button';
   ```

## Creating a Screenset

Screensets are vertical slices of your application. Each screenset follows the vertical slice pattern with screens.

1. **Create screenset directory structure**
   ```bash
   mkdir -p src/screensets/my-screenset/screens/home
   mkdir -p src/screensets/my-screenset/screens/settings
   ```

2. **Create screen components and slices**
   ```bash
   # Home screen
   touch src/screensets/my-screenset/screens/home/HomeScreen.tsx
   touch src/screensets/my-screenset/screens/home/homeSlice.ts
   touch src/screensets/my-screenset/screens/home/index.ts
   
   # Settings screen
   touch src/screensets/my-screenset/screens/settings/SettingsScreen.tsx
   touch src/screensets/my-screenset/screens/settings/settingsSlice.ts
   touch src/screensets/my-screenset/screens/settings/index.ts
   ```

3. **Create supporting files**
   ```bash
   touch src/screensets/my-screenset/data.ts      # Simulated data
   touch src/screensets/my-screenset/api.ts       # API simulation
   touch src/screensets/my-screenset/store.ts     # Store configuration (optional)
   touch src/screensets/my-screenset/index.ts     # Public exports
   ```

### Example Screenset Structure:
```
my-screenset/
├── screens/              # Vertical slices (component + Redux slice)
│   ├── home/
│   │   ├── HomeScreen.tsx        # Screen component
│   │   ├── homeSlice.ts          # Redux slice
│   │   └── index.ts              # Exports component, actions, reducer
│   └── settings/
│       ├── SettingsScreen.tsx
│       ├── settingsSlice.ts
│       └── index.ts
├── data.ts               # Simulated data for the screenset
├── api.ts                # API simulation layer
├── store.ts              # Store configuration (optional)
└── index.ts              # Public exports
```

## Development Best Practices

1. **Always use TypeScript types**
   - No `any` types
   - Explicit function return types
   - Proper generics

2. **Use UIKit components**
   - Don't create custom components inline
   - Extract reusable logic to UIKit

3. **Follow Redux patterns**
   - Actions for all state changes
   - Selectors for computed state
   - Keep state normalized

4. **Keep screensets isolated**
   - No cross-screenset dependencies
   - Use global state for shared data

5. **Use Tailwind utilities**
   - Avoid custom CSS when possible
   - Use theme tokens for colors
   - Follow spacing conventions

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # Check TypeScript types

# Clean
rm -rf node_modules     # Remove dependencies
npm install             # Reinstall dependencies
```

## Next Steps

- Read [AI Guidelines](./.ai/GUIDELINES.md) for AI coding rules and patterns
- Review [MANIFEST.md](./docs/MANIFEST.md) for project philosophy
- Explore the existing components in `src/uikit/layout/`
- Build your first screen in `src/screensets/drafts/`

## Getting Help

- Check documentation in `/docs`
- Review existing components for patterns
- Refer to TypeScript types for API details
