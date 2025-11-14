# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HAI3 is an AI-optimized UI development kit for modern SaaS applications. It provides a structured, multi-layered framework enabling AI systems and humans to collaborate on building complex user interfaces through a three-stage development workflow: drafts (AI-generated) → mockups (human-refined) → production screens.

## Common Development Commands

```bash
# Development
npm ci                          # Install dependencies (use ci, not install)
npm run dev                     # Start Vite dev server (http://localhost:5173)
npm run build                   # Build packages + app for production
npm run build:packages          # Build only workspace packages
npm run generate:colors         # Generate color tokens for themes

# Code Quality
npm run lint                    # ESLint (TypeScript/React rules)
npm run type-check              # TypeScript compilation check (no emit)

# Architecture Validation
npm run arch:check              # Run architecture tests (CRITICAL before commits)
npm run arch:deps               # Check dependency rules via dependency-cruiser
npm run arch:unused             # Check for unused exports with knip
npm run arch:graph              # Generate dependency graph as SVG

# Clean/Reset
npm run clean:artifacts         # Remove dist/, .nyc_output, coverage
npm run clean:deps              # Remove node_modules and reinstall
npm run clean:build             # Clean + build from scratch
```

### Build Order (Critical)

Packages MUST build in this order due to dependencies:
1. `@hai3/uikit-contracts` (pure types, no dependencies)
2. `@hai3/uikit` (depends on contracts)
3. `@hai3/uicore` (depends on contracts)
4. App/Vite build (depends on all three)

Running `npm run build:packages` handles this automatically.

## High-Level Architecture

### Three-Layer Package Structure

HAI3 uses **dependency inversion** to achieve clean architecture:

```
┌─────────────────────────────────────────────┐
│  App (src/)                                 │
│  - Screensets, themes, icons                │
│  - Registers components/screensets/themes   │
└──────────────┬──────────────────────────────┘
               │ depends on
      ┌────────┴────────┐
      ▼                 ▼
┌──────────┐      ┌──────────┐
│  uicore  │      │  uikit   │
│  Layout  │      │  React   │
│  Redux   │      │  Comps   │
│  Events  │      │          │
└────┬─────┘      └────┬─────┘
     │                 │
     └────────┬────────┘
              ▼
     ┌────────────────┐
     │ uikit-contracts│
     │  (interfaces)  │
     └────────────────┘
```

**Key Rules:**
- **uikit-contracts**: Pure TypeScript interfaces (Theme, ButtonComponent, etc.) - no implementation
- **uikit**: React components implementing contracts - NO dependency on uicore
- **uicore**: Layout orchestration, Redux store, event bus, registries - depends ONLY on contracts
- **App**: Registers uikit implementations with uicore at runtime via `uikitRegistry`

**Why this matters**: uicore can define what components it needs (contracts) without knowing HOW they're implemented. Apps can swap component libraries by registering different implementations.

### Event-Driven Flux Pattern

HAI3 uses **event bus + Redux** instead of direct slice dispatch:

```
Action Creator → emit Event → Effect subscribes → Updates Slice
```

**Example:**
```typescript
// Action (src/actions/)
export const selectScreenset = (screensetId: string) => {
  return (_dispatch: AppDispatch): void => {
    eventBus.emit(ScreensetEvents.Changed, { screensetId });
  };
};

// Effect (packages/uicore/src/layout/layoutEffects.ts)
eventBus.on(ScreensetEvents.Changed, ({ screensetId }) => {
  store.dispatch(setCurrentScreenset(screensetId));
});
```

**Why this matters:**
- Loose coupling between domains (menu doesn't know about layout slice)
- All state changes traced to events (easier debugging)
- Effects can trigger multiple side effects without complex middleware

**AI Guideline Reference**: Read `.ai/GUIDELINES.md` routing table and follow the event-driven rules in `.ai/targets/EVENTS.md`.

### Screenset Architecture (Vertical Slices)

A **screenset** is a self-contained domain with:
- Screen components (React)
- Menu structure
- Translations (i18n)
- Icons (optional)
- Redux slices (optional)

Screensets live in three categories:
```
src/screensets/
├── drafts/        # AI-generated initial layouts
├── mockups/       # Designer-refined versions
└── production/    # Engineer-finalized, production-ready
```

**Screenset Registration Pattern:**
```typescript
// src/screensets/drafts/demo/demoScreenset.tsx
export const DEMO_SCREENSET_ID = 'demo';

export const demoScreenset: ScreensetConfig = {
  id: DEMO_SCREENSET_ID,
  name: 'Demo Screenset',
  defaultScreen: HELLO_WORLD_SCREEN_ID,
  getMenuItems: () => [ /* menu items */ ],
  getScreens: () => ({ 'hello-world': HelloWorldScreen }),
};

// Self-registers at module import
screensetRegistry.register(demoScreenset);
```

**Key Conventions:**
- Each screenset is completely independent (vertical slice)
- Define IDs where they're used (no central constants file to prevent circular imports)
- Screensets can extend Redux store dynamically via `registerSlice()`
- Translation keys use format: `'screenset.demo:screens.hello.title'`

### Registry Pattern (Self-Registration)

HAI3 uses **registries** extensively to enable the Open/Closed Principle:

- **screensetRegistry**: Registers screensets (menu items, screens, config)
- **uikitRegistry**: Registers UI components and icons
- **themeRegistry**: Registers theme configs and applies them to DOM
- **apiRegistry**: Registers API services by domain (accounts, billing, etc.)
- **routeRegistry**: Auto-syncs routes from registered screensets (lazy initialization)
- **i18nRegistry**: Registers translation loaders with lazy loading per language

**Self-Registration Pattern:**
```typescript
// Service defines and registers itself
export const ACCOUNTS_DOMAIN = 'accounts';

export class AccountsApiService extends BaseApiService { /* ... */ }

// Registers at module import time
apiRegistry.register(ACCOUNTS_DOMAIN, AccountsApiService);
```

**Why this matters:**
- No central configuration files that grow unbounded
- New features self-register without modifying core
- Prevents circular dependencies

### Import Rules (CRITICAL)

| Case | Rule | Example |
|------|------|---------|
| **Inside same package** | Relative paths | `import { Button } from './Button'` |
| **Cross-branch in app** | `@/` alias | `import { Layout } from '@/core/layout'` |
| **Cross-package** | Workspace names | `import { Layout } from '@hai3/uicore'` |
| **Package internals** | FORBIDDEN from app | ❌ `import { foo } from '@hai3/uikit/src/internal'` |

**Dependency Cruiser enforces these rules** - run `npm run arch:deps` to validate.

## Key Architectural Patterns

### 1. Type-Safe Event Bus

```typescript
// Events are centrally typed via EventPayloadMap
interface EventPayloadMap {
  'screenset/changed': ScreensetChangedPayload;
  'menu/itemsChanged': MenuItemsChangedPayload;
  'theme/changed': ThemeChangedPayload;
}

// Screensets can extend via module augmentation
declare module '@hai3/uicore' {
  interface EventPayloadMap {
    'chat/messageReceived': { message: string };
  }
}
```

**Usage:**
```typescript
eventBus.emit('screenset/changed', { screensetId: 'demo' }); // Payload required, type-checked
eventBus.on('screenset/changed', (payload) => { /* payload.screensetId inferred */ });
```

### 2. Action Naming Convention

- **Event emitters** (use these): Imperative verbs (`selectScreenset`, `changeTheme`, `navigateToScreen`)
- **Direct slice updates** (avoid in app code): "set" prefix (`setTheme`, `setCurrentScreenset`)

Actions in `src/actions/` or screenset action files emit events. Effects listen and update slices.

### 3. Lazy Initialization (Route Registry)

Routes are built lazily on first access to prevent race conditions:

```typescript
class RouteRegistry {
  private synced: boolean = false;

  private ensureSynced(): void {
    if (!this.synced) {
      this.syncFromScreensets(); // Reads screensetRegistry
      this.synced = true;
    }
  }

  getAllScreenIds(): string[] {
    this.ensureSynced();
    return [...this.routes.keys()];
  }
}
```

**Why**: Screensets register themselves asynchronously; route registry waits until first use.

### 4. Translation Key Format

HAI3 uses namespaced i18n keys with lazy loading:

```typescript
i18nRegistry.registerLoader('screenset.demo', async (language) => {
  return (await import(`./translations/${language}.json`)).default;
});

// Usage
t('screenset.demo:screens.hello.title') // Returns translated string
```

Format: `'namespace:path.to.key'`

### 5. Module Augmentation for Extensibility

Screensets extend core types without modifying core code:

```typescript
// In screenset code
declare module '@hai3/uicore' {
  interface EventPayloadMap {
    'chat/messageReceived': ChatMessagePayload;
  }

  interface ApiServicesMap {
    [CHAT_DOMAIN]: ChatApiService;
  }
}
```

## Critical Development Rules

### Before Making Changes

1. **Read `.ai/GUIDELINES.md`** - Contains routing table for which rules apply to each area
2. **Run `npm run arch:check`** - MUST pass before committing
3. **Check dependency rules** - `npm run arch:deps` enforces package isolation
4. **Follow event-driven flow** - Do NOT dispatch slice actions directly from components/actions

### Forbidden Patterns

- ❌ Direct slice dispatch from components: `dispatch(setMenuItems([]))`
- ❌ Importing package internals: `import '@hai3/uikit/src/internal'`
- ❌ Circular dependencies between packages
- ❌ `any` types or `as unknown as T` chains
- ❌ Central constants files (define IDs where used)
- ❌ Barrel exports hiding imports (only use index.ts when aggregating 3+ exports)

### Required Patterns

- ✅ Event-driven actions: `navigateToScreen()` emits event → effect updates slice
- ✅ Self-registration: Services/screensets register themselves at module import
- ✅ Type-safe events: Use `EventPayloadMap` for all event types
- ✅ Vertical slices: Keep screensets independent
- ✅ Registry pattern: Open for extension, closed for modification

## Redux Store Structure

```typescript
{
  // Static reducers (always present)
  app: AppState,
  layout: LayoutState,
    // Nested layout domains
    header: HeaderState,
    footer: FooterState,
    menu: MenuState,
    sidebar: SidebarState,
    screen: ScreenState,
    popup: PopupState,
    overlay: OverlayState,

  // Dynamic reducers (registered by screensets)
  chat: ChatState,      // if chat screenset registers 'chat' slice
  dashboard: DashState, // if dashboard screenset registers slice
}
```

**Adding a slice dynamically:**
```typescript
// In screenset initialization
registerSlice('chat', chatReducer, initChatEffects);
```

## Navigation and Routing Flow

```
User clicks menu item
  → navigateToScreen(screenId) dispatched
    → emits NavigationEvents.ScreenNavigated
      → navigationEffects listens
        → dispatches setSelectedScreen(screenId)
          → AppRouter updates URL via RouterSync
            → Screen component re-renders
```

**Key Components:**
- `AppRouter`: Maps routes to screen components using routeRegistry
- `RouterSync`: Synchronizes Redux state with URL hash
- `routeRegistry`: Auto-builds routes from screensetRegistry

## Theming System

Themes are CSS custom properties applied to `:root`:

```typescript
// src/themes/dark.ts
export const darkTheme: Theme = {
  name: 'Dark',
  tokens: {
    background: '#0a0a0a',
    foreground: '#ededed',
    primary: '#3b82f6',
    // ... all theme tokens
  }
};

// Registration
themeRegistry.register('dark', darkTheme);
```

**Changing themes:**
```typescript
changeTheme('dark'); // Emits ThemeEvents.Changed → layoutEffects applies theme
```

**In components:** Use Tailwind theme tokens:
```tsx
<div className="bg-background text-foreground">
  <h1 className="text-primary">Title</h1>
</div>
```

## Working with API Services

API services use domain-based organization:

```typescript
// Define domain
export const ACCOUNTS_DOMAIN = 'accounts';

// Create service
export class AccountsApiService extends BaseApiService {
  async getUsers(): Promise<User[]> { /* ... */ }
}

// Register (happens at module import)
apiRegistry.register(ACCOUNTS_DOMAIN, AccountsApiService);

// Usage in components
const accountsApi = apiRegistry.getService(ACCOUNTS_DOMAIN);
const users = await accountsApi.getUsers();
```

**Mock vs Real API:**
- Services can switch between mock and real implementations
- Toggle via `ApiEvents.ModeChanged` event
- Mock data defined in `src/api/<domain>/mocks.ts`

## Creating a New Screenset

1. **Create directory structure:**
   ```bash
   mkdir -p src/screensets/drafts/my-screenset/screens/home
   ```

2. **Create screen component:**
   ```typescript
   // src/screensets/drafts/my-screenset/screens/home/HomeScreen.tsx
   export const HOME_SCREEN_ID = 'my-screenset-home';

   export const HomeScreen: React.FC = () => {
     return <div>Home Screen</div>;
   };
   ```

3. **Create screenset config:**
   ```typescript
   // src/screensets/drafts/my-screenset/myScreenset.tsx
   import { screensetRegistry, type ScreensetConfig } from '@hai3/uicore';
   import { HomeScreen, HOME_SCREEN_ID } from './screens/home/HomeScreen';

   export const MY_SCREENSET_ID = 'my-screenset';

   export const myScreenset: ScreensetConfig = {
     id: MY_SCREENSET_ID,
     name: 'My Screenset',
     category: 'drafts',
     defaultScreen: HOME_SCREEN_ID,
     getMenuItems: () => [
       { id: HOME_SCREEN_ID, label: 'Home', screenId: HOME_SCREEN_ID },
     ],
     getScreens: () => ({
       [HOME_SCREEN_ID]: HomeScreen,
     }),
   };

   screensetRegistry.register(myScreenset);
   ```

4. **Import in screenset registry:**
   ```typescript
   // src/screensets/screensetRegistry.tsx
   import './drafts/my-screenset/myScreenset';
   ```

5. **Run app and switch screenset via UI selector**

## Initialization Sequence (Critical)

```typescript
// main.tsx
import '@/uikit/uikitRegistry';        // 1. Register UI Kit components first
import '@/screensets/screensetRegistry'; // 2. Register screensets
import '@/themes/themeRegistry';        // 3. Register themes

// Then render
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HAI3Provider>  {/* Redux Provider + AppRouter */}
      <App />       {/* Layout + current screen */}
    </HAI3Provider>
  </StrictMode>
);
```

**Order matters**: Registries must populate before provider renders.

## Testing Changes

Before committing:

```bash
# 1. Check TypeScript compilation
npm run type-check

# 2. Run linter
npm run lint

# 3. CRITICAL - Run architecture checks
npm run arch:check

# 4. Check dependency rules
npm run arch:deps

# 5. Test in browser
npm run dev
# Exercise all changed flows, check console for errors
```

## AI Development Workflow

When working with AI (Claude, GPT, etc.):

1. **Always reference `.ai/GUIDELINES.md`** for the routing table
2. **Read the target file** for the area you're working on (e.g., `.ai/targets/SCREENSETS.md`)
3. **Follow event-driven patterns** - emit events, don't dispatch directly
4. **Use registries for extensibility** - never modify registry root files
5. **Validate with `npm run arch:check`** before finalizing code
6. **Test changes immediately via Chrome MCP** - never skip visual verification (see `.ai/MCP_TROUBLESHOOTING.md`)
7. **Keep screensets as vertical slices** - no cross-screenset dependencies

## Common Pitfalls

1. **Importing package internals from app code**
   - ❌ `import { Foo } from '@hai3/uikit/src/components/Foo'`
   - ✅ `import { Foo } from '@hai3/uikit'`

2. **Direct slice dispatch instead of events**
   - ❌ `dispatch(setMenuItems([]))`
   - ✅ `navigateToScreen(screenId)` which emits event → effect updates slice

3. **Creating circular dependencies**
   - Run `npm run arch:deps` to detect
   - Use event bus to decouple domains

4. **Modifying registry root files**
   - ❌ Adding new screenset cases to switch statement in registry
   - ✅ Self-register via `screensetRegistry.register(config)`

5. **Forgetting to register translations**
   - Each screenset should register its i18n namespace with `i18nRegistry.registerLoader()`

6. **Killing MCP processes during development**
   - ❌ `pkill -f chrome-devtools-mcp` (permanently breaks MCP tools for the session)
   - ✅ Ask user to restart MCP through Claude Code, or start new conversation
   - See `.ai/MCP_TROUBLESHOOTING.md` for recovery procedures

## Documentation References

- **README.md**: Project overview, getting started, mission
- **QUICK_START.md**: Developer quick start guide
- **docs/MANIFEST.md**: Core philosophy and values
- **docs/ROADMAP.md**: Planned milestones
- **docs/MODEL.md**: Domain glossary
- **.ai/GUIDELINES.md**: AI routing table and workflow
- **.ai/targets/*.md**: Area-specific rules (EVENTS, SCREENSETS, UICORE, etc.)
- **.ai/MCP_TROUBLESHOOTING.md**: **CRITICAL** - Chrome MCP connection management and recovery procedures

## Technology Stack

- **React 18**: UI framework
- **TypeScript 5**: Type safety with strict mode
- **Vite 6**: Build tool and dev server
- **Redux Toolkit**: State management
- **Tailwind CSS 3**: Utility-first styling
- **shadcn/ui + Radix UI**: Component library foundation
- **tsup**: Package bundler for workspace packages

## Monorepo Structure

```
HAI3/
├── packages/                    # Workspace packages
│   ├── uikit-contracts/         # Pure type definitions
│   ├── uikit/                   # React component library
│   └── uicore/                  # Core layout/state/events
├── src/                         # Application code
│   ├── screensets/              # Screenset variants
│   │   ├── drafts/              # AI-generated
│   │   ├── mockups/             # Human-refined
│   │   └── production/          # Production-ready
│   ├── themes/                  # Theme definitions + registry
│   ├── api/                     # API service definitions
│   └── App.tsx                  # Root component
├── .ai/                         # AI guidelines and targets
├── docs/                        # Documentation
└── scripts/                     # Build/dev scripts
```

## File Naming Conventions

- **React components**: PascalCase (`HelloWorldScreen.tsx`)
- **Utilities/services**: camelCase (`apiRegistry.ts`)
- **Constants/configs**: camelCase (`demoScreenset.tsx`)
- **Types/interfaces**: PascalCase, suffix with type if generic (`ScreensetConfig.ts`)
- **Slices**: camelCase + "Slice" (`menuSlice.ts`)
- **Effects**: camelCase + "Effects" (`menuEffects.ts`)
- **Actions**: camelCase + "Actions" (`menuActions.ts`)

## Support and Contribution

- **Issues**: Report bugs and request features on GitHub
- **Discussions**: Architecture questions on Discord
- **Contributing**: See CONTRIBUTING.md for guidelines
- **License**: Apache License 2.0
