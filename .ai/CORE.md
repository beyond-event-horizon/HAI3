# UI Core Development Guidelines

> Rules for contributing to HAI3 UI Core (src/core)
> Read .ai/GUIDELINES.md for common rules

# Stack Specifics
- Redux Toolkit for state management
- Uses UI Kit components (see .ai/UIKIT.md)
- Uses themes (see .ai/THEMES.md)

# Structure
```
src/core/
├── layout/             # Layout domain (vertical slice)
│   ├── domains/        # header, footer, menu, sidebar, screen, popup, overlay
│   │   ├── [name]/
│   │   │   ├── Component.tsx
│   │   │   ├── domainSlice.ts
│   │   │   └── index.ts
│   ├── Layout.tsx      # Main orchestrator
│   └── layoutSlice.ts  # Layout-level state
├── coreSlice.ts        # Global state (user, tenant, loading, error)
├── store.ts            # Redux store
├── types.ts            # Shared types
└── hooks/              # Typed Redux hooks
```

# UI Core - STRICT RULES
1. NO prop drilling - config via Redux ONLY
2. Domains self-contained - own component + slice + config
3. Orchestrators accept ONLY `children` - NO domain props
4. Core domains wrap UI Kit components
5. Domains self-hide via `visible` boolean in slice

## Domain Pattern
```
domains/[name]/
├── Component.tsx    # useAppSelector(state.domainName), if (!visible) return null
├── domainSlice.ts   # export types, state interface, actions
└── index.ts         # export component, actions, reducer, types
```

## Type Location
- Domain types -> export from `domainSlice.ts`
- Global types -> `src/core/types.ts`

## Required Slice Structure
```typescript
interface DomainState {
  visible: boolean;  // REQUIRED
  // ...domain config and state
}
// REQUIRED actions: setDomainConfig, setDomainVisible
```

## Init Pattern
```typescript
useEffect(() => dispatch(setDomainConfig({ ...config, visible: true })), []);
```

## Core Files
- `coreSlice.ts` = global state (user, tenant, loading, error)
- `store.ts` = combine reducers
- `types.ts` = shared type definitions

## FORBIDDEN -> REQUIRED
```typescript
BAD:  <Layout headerLogo={x} menuItems={y} />
GOOD: <Layout>{children}</Layout>

BAD:  {showMenu && <Menu />}
GOOD: <Menu /> // self-hides

BAD:  <Menu items={x} collapsed={y} />
GOOD: <Menu /> // reads state.menu

BAD:  const [open, setOpen] = useState(false)
GOOD: dispatch(setMenuConfig({visible: true}))
```

# Enum Usage in Core
- BAD:  `theme: 'light' | 'dark'` -> GOOD: `theme: Theme` (from layoutSlice)
- BAD:  `name: 'menu'` -> GOOD: `name: LayoutDomains.Menu` (from layoutSlice)
- Domain enums -> export from `[domain]Slice.ts`

# Reference Documents
- **docs/MANIFEST.md** - Core philosophy, principles, and vision
- **docs/MODEL.md** - Domain models and glossary
- **.ai/UIKIT.md** - UI Kit component guidelines
- **.ai/THEMES.md** - Theming guidelines
