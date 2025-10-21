# Programming
- TypeScript is used as the programming language
- Always provide explicit types everywhere and use as strict typing as possible
- Use explicit generics when possible
- Follow the SOLID and DRY principles

# Frameworks
- React is used as the framework
- shadcn/ui is used for UI components
- Tailwind CSS is used for styling

# Code structure
- **src/** - Source code
  - **src/uikit/** - UI Kit: reusable business-logic-free components
  - **src/core/** - UI Core: foundational layout, state management, and hooks
    - **src/core/layout/** - Layout domain (vertical slice)
      - **src/core/layout/domains/[name]/** - Layout domain folders (header, footer, menu, sidebar, screen, popup, overlay)
        - **Component.tsx** - Domain component
        - **domainSlice.ts** - Domain Redux slice
        - **index.ts** - Public API
      - **src/core/layout/Layout.tsx** - Main layout orchestrator
      - **src/core/layout/layoutSlice.ts** - Layout-level state
    - **src/core/coreSlice.ts** - Global app state (user, tenant, loading, error)
    - **src/core/store.ts** - Redux store configuration
    - **src/core/types.ts** - Shared type definitions
    - **src/core/hooks/** - Typed Redux hooks
  - **src/screensets/** - UI screensets, each is a vertical slice of the application
    - **src/screensets/[name]/screens/[screen]/** - Screenset screen folders
      - **ScreenComponent.tsx** - Screen component
      - **screenSlice.ts** - Screen Redux slice
      - **index.ts** - Public API
    - **src/screensets/[name]/data.ts** - Simulated data for the screenset
    - **src/screensets/[name]/api.ts** - API simulation layer
    - **src/screensets/[name]/store.ts** - Screenset store configuration (optional)
  - **src/styles/** - Global styles and theme configurations
    - **src/styles/themes/** - Theme definitions
    - **src/styles/globals.css** - Global CSS with Tailwind directives
  - **src/lib/** - Utility functions
  - **src/App.tsx** - Root application component
  - **src/main.tsx** - Application entry point

# UI Kit
- UI Kit is located in the src/uikit folder and is a collection of reusable business-logic-free components
- Always build UI screens using the components from UI Kit
- If there is no suitable component in UI Kit, then create a new component in UI Kit and use it

# UI Core

## STRICT RULES
1. NO prop drilling - config via Redux only
2. Domains are self-contained - own component + slice + config
3. Orchestrators accept ONLY `children` - no domain props
4. Core domains wrap UI Kit components
5. Domains self-hide via `visible` boolean in slice

## Domain Pattern
```
domains/[name]/
├── Component.tsx    # useAppSelector(state => state.domainName), if (!visible) return null
├── domainSlice.ts   # export types, state interface, actions
└── index.ts         # export component, actions, reducer, types
```

**Type Location:**
- Domain types -> export from `[domain]Slice.ts`
- Global types -> `src/core/types.ts`

## Required Slice Structure
```typescript
interface DomainState {
  visible: boolean;  // REQUIRED
  // config + state
}
// REQUIRED actions: setDomainConfig, setDomainVisible
```

## Init Pattern
```typescript
useEffect(() => dispatch(setDomainConfig({ ...config, visible: true })), []);
```

## Files
- `coreSlice.ts` = global (user, tenant, loading, error)
- `store.ts` = combine reducers
- `types.ts` = shared types

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

# UI Screensets
- Independent variants in `src/screensets/[name]`
- Develop in screenset, not global (unless specified)
- Vertical slices = components + logic + data
- Build from UI Kit + UI Core

## Screenset Pattern
```
screensets/[name]/screens/[screen]/
├── ScreenComponent.tsx
├── screenSlice.ts
└── index.ts
data.ts     # simulated data
api.ts      # API simulation layer
store.ts    # optional: combine reducers
```

## Screenset Rules
- Export slices with "Slice" suffix
- Screensets READ core state, cannot MODIFY
- No data sharing between screensets
- Can use global actions/data

# Rules

## Styles
- Support themes in `/src/styles/themes`
- Use existing styles first
- Add to ALL themes if new style needed

## Screens
- NO hardcoded screenset names
- NO `if screenset ==` in shared logic

## TypeScript
- Types for ALL variables, params, returns
- Export types with component
- `type` for objects, `interface` for props
- NEVER `any`, use `unknown`
- Use enums for string constants - NO hardcoded strings
  - Define in slice file (vertical slice approach)
  - BAD:  `theme: 'light' | 'dark'` -> GOOD: `theme: Theme` (from layoutSlice)
  - BAD:  `name: 'menu'` -> GOOD: `name: LayoutDomains.Menu` (from layoutSlice)
  - Domain enums -> export from `[domain]Slice.ts`

# Draft Screenset (`src/screensets/drafts`)
- Mockups = wireframes, not pixel-perfect
- Stickers: GREEN=behavior, YELLOW=hints, ORANGE=add functionality
- Multiple mockups = different states
- New screen request = generate 5 different versions

# Documentation
- NO emoji in public documentation files (*.md)
- Use ASCII characters only (no Unicode symbols like → ✓ ✗)
- Use ASCII alternatives: -> for arrows, BAD:/GOOD: for indicators
- Use clear, professional language
- Keep documentation focused and technical

## Reference Documents for AI
- **docs/MANIFEST.md** - Core philosophy, principles, and vision
- **docs/MODEL.md** - Domain models and glossary
