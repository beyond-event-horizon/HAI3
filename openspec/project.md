# Project Context

## Purpose

HAI3 is an AI-optimized UI development kit for modern SaaS applications. It provides a structured, multi-layered framework enabling AI systems and humans to collaborate on building complex user interfaces through a three-stage development workflow:

1. **Drafts** - AI-generated initial layouts
2. **Mockups** - Designer-refined versions
3. **Production** - Engineer-finalized, production-ready screens

The framework is built on clean architecture principles with dependency inversion, enabling teams to rapidly prototype and iterate on UI components while maintaining code quality and architectural integrity.

## Tech Stack

### Core Technologies
- **React 18** - UI framework
- **TypeScript 5** - Type safety with strict mode enabled
- **Vite 6** - Build tool and dev server
- **Redux Toolkit** - State management with Redux DevTools
- **Tailwind CSS 3** - Utility-first styling with custom theme tokens

### Component Libraries
- **shadcn/ui** - Base component library
- **Radix UI** - Headless component primitives
- **Lucide React** - Icon system

### Build & Tooling
- **tsup** - Package bundler for workspace packages
- **ESLint** - TypeScript/React linting rules
- **dependency-cruiser** - Dependency graph analysis and validation
- **knip** - Unused export detection

### Monorepo Structure
- **npm workspaces** - Package management
- Three workspace packages: `@hai3/uikit-contracts`, `@hai3/uikit`, `@hai3/uicore`

## Project Conventions

### Code Style

**File Naming:**
- React components: PascalCase (`HelloWorldScreen.tsx`)
- Utilities/services: camelCase (`apiRegistry.ts`)
- Constants/configs: camelCase (`demoScreenset.tsx`)
- Types/interfaces: PascalCase (`ScreensetConfig.ts`)
- Redux slices: camelCase + "Slice" (`menuSlice.ts`)
- Effects: camelCase + "Effects" (`menuEffects.ts`)
- Actions: camelCase + "Actions" (`menuActions.ts`)

**Import Rules (CRITICAL):**
- Same package: Relative paths (`import { Button } from './Button'`)
- Cross-branch in app: `@/` alias (`import { Layout } from '@/core/layout'`)
- Cross-package: Workspace names (`import { Layout } from '@hai3/uicore'`)
- Package internals: FORBIDDEN from app code

**Forbidden Patterns:**
- ❌ Direct slice dispatch from components
- ❌ Importing package internals
- ❌ Circular dependencies between packages
- ❌ `any` types or `as unknown as T` chains
- ❌ Central constants files (define IDs where used)
- ❌ Barrel exports hiding imports

### Architecture Patterns

#### 1. Three-Layer Package Structure with Dependency Inversion

```
App (src/)
  ↓ depends on
uicore + uikit
  ↓ depends on
uikit-contracts (pure interfaces)
```

- **uikit-contracts**: Pure TypeScript interfaces - no implementation
- **uikit**: React components implementing contracts - NO dependency on uicore
- **uicore**: Layout orchestration, Redux store, event bus, registries
- **App**: Registers uikit implementations with uicore at runtime

#### 2. Event-Driven Flux Pattern

Instead of direct dispatch, use event bus:

```typescript
Action Creator → emit Event → Effect subscribes → Updates Slice
```

All state changes must be traceable to events for debugging and loose coupling.

#### 3. Registry Pattern (Self-Registration)

Components, screensets, themes, and services self-register at module import:

- `screensetRegistry` - Menu items, screens, config
- `uikitRegistry` - UI components and icons
- `themeRegistry` - Theme configs and DOM application
- `apiRegistry` - API services by domain
- `routeRegistry` - Auto-synced routes (lazy initialization)
- `i18nRegistry` - Translation loaders with lazy loading

#### 4. Screenset Architecture (Vertical Slices)

Screensets are self-contained domains with:
- Screen components (React)
- Menu structure
- Translations (i18n)
- Icons (optional)
- Redux slices (optional)

Organized in three categories: `drafts/`, `mockups/`, `production/`

#### 5. Type-Safe Event Bus

Events are centrally typed via `EventPayloadMap`. Screensets extend types via module augmentation without modifying core code.

### Testing Strategy

**Pre-Commit Validation:**
```bash
npm run type-check    # TypeScript compilation (strict mode)
npm run lint          # ESLint with TypeScript/React rules
npm run arch:check    # Architecture tests (MUST pass before commits)
npm run arch:deps     # Dependency rule validation
npm run arch:unused   # Unused export detection
```

**Build Validation:**
- Packages MUST build in order: `uikit-contracts` → `uikit` → `uicore` → App
- Use `npm run build:packages` to handle dependency order automatically

**Manual Testing:**
- All changes must be visually verified in browser via `npm run dev`
- Exercise all changed flows and check console for errors
- Use Chrome MCP integration for automated visual testing (see `.ai/MCP_TROUBLESHOOTING.md`)

### Git Workflow

**Branches:**
- `main` - Production-ready code (use for PRs)
- Feature branches: `feature/*`, `fix/*`, `refactor/*`

**Commit Guidelines:**
- Run `npm run arch:check` before committing
- Ensure TypeScript compilation passes
- Visual verification required for UI changes
- Follow semantic commit messages

**Critical Rules:**
- Never commit with failing architecture checks
- Never skip type-check validation
- Keep commits focused on single concerns

## Domain Context

### Initialization Sequence

Order matters for registry population:

1. Register UI Kit components (`@/uikit/uikitRegistry`)
2. Register screensets (`@/screensets/screensetRegistry`)
3. Register themes (`@/themes/themeRegistry`)
4. Render React root with `HAI3Provider`

### Redux Store Structure

```typescript
{
  // Static reducers
  app: AppState,
  layout: LayoutState,
    header: HeaderState,
    footer: FooterState,
    menu: MenuState,
    sidebar: SidebarState,
    screen: ScreenState,
    popup: PopupState,
    overlay: OverlayState,

  // Dynamic reducers (screenset-registered)
  [screensetSlice]: ScreensetState
}
```

### Navigation Flow

```
User action
  → navigateToScreen(screenId)
    → emits NavigationEvents.ScreenNavigated
      → navigationEffects listens
        → dispatches setSelectedScreen(screenId)
          → AppRouter updates URL
            → Screen component re-renders
```

### Translation System

- Format: `'namespace:path.to.key'`
- Example: `t('screenset.demo:screens.hello.title')`
- Lazy loading per language
- Screensets register loaders: `i18nRegistry.registerLoader('screenset.demo', loader)`

### Action Naming Convention

- **Event emitters**: Imperative verbs (`selectScreenset`, `changeTheme`, `navigateToScreen`)
- **Direct slice updates**: "set" prefix (`setTheme`, `setCurrentScreenset`)

Actions emit events. Effects listen and update slices. Never dispatch slice actions directly from components.

## Important Constraints

### Package Isolation

- `uikit` MUST NOT depend on `uicore`
- Only `uikit-contracts` can be imported by both `uikit` and `uicore`
- App code MUST NOT import package internals (`@hai3/uikit/src/*` is forbidden)
- Enforced by `dependency-cruiser` rules

### Build Order

Packages have strict build dependencies:
1. `@hai3/uikit-contracts` (no dependencies)
2. `@hai3/uikit` (depends on contracts)
3. `@hai3/uicore` (depends on contracts)
4. App/Vite build (depends on all three)

Breaking this order causes TypeScript compilation errors.

### Event-Driven Constraints

- Components MUST NOT dispatch slice actions directly
- All state changes MUST go through event bus
- Effects are the ONLY consumers of events that update Redux state
- This ensures traceability and loose coupling

### Module Augmentation Required

When adding new events, API services, or extending core types, screensets MUST use TypeScript module augmentation:

```typescript
declare module '@hai3/uicore' {
  interface EventPayloadMap {
    'custom/event': CustomPayload;
  }
}
```

### Chrome MCP Constraint (CRITICAL)

**NEVER kill MCP processes during development:**
- ❌ `pkill -f chrome-devtools-mcp` permanently breaks MCP tools
- ✅ Ask user to restart MCP through Claude Code, or start new conversation
- See `.ai/MCP_TROUBLESHOOTING.md` for recovery procedures

## External Dependencies

### API Services (Domain-Based)

API services use registry pattern:

```typescript
export const DOMAIN_NAME = 'domainName';
export class DomainApiService extends BaseApiService { }
apiRegistry.register(DOMAIN_NAME, DomainApiService);
```

**Mock vs Real Mode:**
- Services can toggle between mock and real implementations
- Controlled via `ApiEvents.ModeChanged` event
- Mock data in `src/api/<domain>/mocks.ts`

### Theme System

Themes are CSS custom properties applied to `:root`:
- Registered via `themeRegistry.register(id, theme)`
- Changed via `changeTheme(id)` action
- Tokens used in Tailwind classes: `bg-background`, `text-foreground`, `text-primary`

### Translation (i18n)

- Lazy-loaded per language
- Namespaced by screenset
- Registered via `i18nRegistry.registerLoader(namespace, loader)`
- Translation files: `./translations/${language}.json`

### Development Server

- Vite dev server runs on `http://localhost:5173`
- Hot module replacement enabled
- Chrome MCP integration available for automated browser testing
