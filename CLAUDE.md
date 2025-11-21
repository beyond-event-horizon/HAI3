<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# CLAUDE.md

HAI3 is an AI-optimized UI development kit for modern SaaS applications using a three-stage workflow: drafts (AI-generated) → mockups (human-refined) → production screens.

## Commands

```bash
# Development
npm ci                    # Install (use ci, not install)
npm run dev               # Vite dev server (http://localhost:5173)
npm run build             # Build packages + app
npm run build:packages    # Build workspace packages only

# Validation (CRITICAL before commits)
npm run lint              # ESLint
npm run type-check        # TypeScript check
npm run arch:check        # Architecture tests (MUST pass)
npm run arch:deps         # Dependency rules check
npm run arch:unused       # Unused exports check

# Clean
npm run clean:artifacts   # Remove dist/
npm run clean:deps        # Remove node_modules + reinstall
npm run clean:build       # Clean + build from scratch
```

**Build Order:** uikit-contracts → uikit → uicore → app (`npm run build:packages` handles this)

## Architecture Overview

### Three-Layer Package Structure

```
App (src/) → screensets, themes, icons
    ↓
uicore (layout, Redux, events) + uikit (React components) + devtools (dev only)
    ↓
uikit-contracts (interfaces only)
```

**Key Rules:**
- **uikit-contracts**: Pure TypeScript interfaces - no implementation
- **uikit**: React components - NO dependency on uicore
- **uicore**: Layout, Redux store, event bus, registries - depends ONLY on contracts
- **devtools**: Dev panel (auto-loaded in dev, tree-shaken in prod)
- **App**: Registers uikit implementations with uicore at runtime

### Event-Driven Flux Pattern

```
Action Creator → emit Event → Effect subscribes → Updates Slice
```

**Why:** Loose coupling, traceable state changes, no complex middleware. See `.ai/GUIDELINES.md` and `.ai/targets/EVENTS.md`.

### Screenset Architecture (Vertical Slices)

Screensets are self-contained domains with screens, menu, translations, icons, Redux slices, events, and API services.

**Structure:**
```
src/screensets/
├── demo/
│   ├── ids.ts           # CRITICAL: All IDs centralized here
│   ├── screens/         # React components
│   ├── i18n/            # Translations
│   ├── uikit/           # Icons (optional)
│   └── demoScreenset.tsx
├── chat/
│   ├── ids.ts
│   ├── slices/          # Redux domains (threads, messages, composer, settings)
│   ├── events/          # Domain-specific event files
│   ├── effects/         # Domain-specific effect listeners
│   ├── actions/         # Action creators
│   ├── api/             # API services
│   └── chatScreenset.tsx
```

**Naming Conventions (Auto-enforced by ESLint):**

| Type | Format | Example |
|------|--------|---------|
| Screenset ID | camelCase | `'demo'`, `'chat'` |
| Screen IDs | camelCase | `'helloworld'`, `'profile'` |
| Redux State Keys | `${SCREENSET_ID}/domain` | `'chat/threads'`, `'chat/messages'` |
| Event Names | `${SCREENSET_ID}/${DOMAIN_ID}/event` | `'chat/threads/selected'` |
| Icon IDs | `${SCREENSET_ID}:iconName` | `'demo:world'` |
| Translation Keys | `screenset.${ID}:key` or `screen.${ID}.${SCREEN}:key` | `'screen.demo.hello:title'` |

**CRITICAL:** All IDs in `ids.ts`, use template literals for auto-updating namespaces.

**Domain-Based Organization:**
- Split screensets into logical domains (threads, messages, composer, settings)
- Each domain has its own: slice, events file, effects file
- Each event file has local `DOMAIN_ID` constant
- Each slice registers its own effects (no coordinator file)
- NO barrel exports (`index.ts`) in events/ or effects/

**Self-Containment Pattern:**
```typescript
// ids.ts - Single source of truth
export const DEMO_SCREENSET_ID = 'demo';
export const HELLO_WORLD_SCREEN_ID = 'helloworld';

// Icon with template literal
export const WORLD_ICON_ID = `${DEMO_SCREENSET_ID}:world` as const;

// Auto-discovered screenset config
export const demoScreenset: ScreensetConfig = {
  id: DEMO_SCREENSET_ID,
  name: 'Demo Screenset',
  category: ScreensetCategory.Drafts,
  defaultScreen: HELLO_WORLD_SCREEN_ID,
  localization: screensetTranslations,
  menu: [{
    menuItem: {
      id: HELLO_WORLD_SCREEN_ID,
      label: `screen.${DEMO_SCREENSET_ID}.${HELLO_WORLD_SCREEN_ID}:title`,
      icon: WORLD_ICON_ID,
    },
    screen: () => import('./screens/helloworld/HelloWorldScreen'), // Lazy load
  }],
};

// Self-registers (no manual import needed)
screensetRegistry.register(demoScreenset);
```

**Redux Integration:**
```typescript
// Domain-specific slice
declare module '@hai3/uicore' {
  interface RootState {
    [`${CHAT_SCREENSET_ID}/threads`]: ThreadsState;
  }
}

// Register with effects
registerSlice(`${CHAT_SCREENSET_ID}/threads`, threadsReducer, initializeThreadsEffects);
```

**Event Bus Integration:**
```typescript
// events/threadsEvents.ts
const DOMAIN_ID = 'threads';

export enum ThreadsEvents {
  Selected = `${CHAT_SCREENSET_ID}/${DOMAIN_ID}/selected`,
}

declare module '@hai3/uicore' {
  interface EventPayloadMap {
    'chat/threads/selected': { threadId: string };
  }
}
```

### Registry Pattern (Self-Registration)

Registries enable Open/Closed Principle:
- **screensetRegistry**: Screensets (menu, screens, config)
- **uikitRegistry**: UI components and icons
- **themeRegistry**: Theme configs
- **apiRegistry**: API services by domain
- **routeRegistry**: Auto-syncs from screensets (lazy init)
- **i18nRegistry**: Translation loaders (lazy loading)

Services self-register at module import time.

### Import Rules

| Context | Rule | Example |
|---------|------|---------|
| Same package | Relative paths | `import { Button } from './Button'` |
| Cross-branch in app | `@/` alias | `import { Layout } from '@/core/layout'` |
| Cross-package | Workspace names | `import { Layout } from '@hai3/uicore'` |
| Package internals | **FORBIDDEN** | ❌ `import '@hai3/uikit/src/internal'` |

**Enforced by:** `npm run arch:deps`

## Key Patterns

### 1. Type-Safe Event Bus
Events typed via `EventPayloadMap`, extensible via module augmentation.

### 2. Action Naming
- **Event emitters** (use these): Imperative verbs (`selectScreenset`, `changeTheme`)
- **Direct slice updates** (avoid): "set" prefix (`setTheme`)

### 3. Lazy Initialization
Route registry builds on first access (prevents race conditions with async screenset registration).

### 4. Per-Screen Localization
- **Screenset-level**: Loaded when screenset registers
- **Screen-level**: Loaded lazily when screen mounts (only current language)
- Use `<TextLoader>` to prevent flash of untranslated content

```typescript
// Screen component
const translations = I18nRegistry.createLoader({
  [Language.English]: () => import('./i18n/en.json'),
  // ... all 36 languages
});

export const HomeScreen: React.FC = () => {
  useScreenTranslations(SCREENSET_ID, SCREEN_ID, translations);
  const { t } = useTranslation();
  return <TextLoader><h1>{t(`screen.${SCREENSET_ID}.${SCREEN_ID}:title`)}</h1></TextLoader>;
};
```

### 5. Module Augmentation
Screensets extend core types without modifying core:
```typescript
declare module '@hai3/uicore' {
  interface EventPayloadMap {
    'chat/messageReceived': ChatMessagePayload;
  }
}
```

## Critical Development Rules

### Before Making Changes

1. **CRITICAL: Verify MCP connection** - If WebSocket breaks, STOP and fix it first (see `.ai/MCP_TROUBLESHOOTING.md`)
2. **CRITICAL: Use Chrome DevTools MCP native tools** - ALWAYS use appropriate tool:
   - Navigation: `navigate_page`, `wait_for`
   - Page info: `take_snapshot`, `take_screenshot`, `list_console_messages`, `list_network_requests`
   - Interaction: `click`, `fill`, `fill_form`, `hover`, `press_key`
   - Tabs: `list_pages`, `select_page`, `new_page`, `close_page`
   - **ONLY use `evaluate_script` as last resort when NO native tool works**
3. Read `.ai/GUIDELINES.md` for routing table
4. Run `npm run arch:check` (MUST pass before commits)
5. Follow event-driven flow (no direct dispatch)

### Forbidden (❌) vs Required (✅) Patterns

| ❌ Forbidden | ✅ Required |
|-------------|------------|
| `evaluate_script` for tasks with native tool | Use appropriate native MCP tool |
| Direct slice dispatch from components | Event-driven actions |
| Importing package internals | Use public package exports |
| Circular dependencies | Event bus for decoupling |
| `any` types, `as unknown as T` chains | Proper typing |
| Central constants files | Define IDs where used (or in `ids.ts`) |
| `Object.assign()`, spread for deep merge | Lodash (`assign()`, `merge()`, `cloneDeep()`) |
| Hardcoded event names/IDs | Template literals with screenset ID |
| Monolithic event/effects files | Domain-specific files |
| Barrel exports in events/effects | Direct imports |

## Working with API Services

**Framework Services** (in uicore): Core services used by framework (AccountsApiService, etc.)
**Screenset Extensions** (in screenset): Mocks and module augmentation for services used by screenset

```typescript
// Framework service (packages/uicore/src/api/services/accounts/)
export const ACCOUNTS_DOMAIN = 'accounts';
export class AccountsApiService extends BaseApiService { /* ... */ }
apiRegistry.register(ACCOUNTS_DOMAIN, AccountsApiService);

// Screenset mock (src/screensets/demo/api/accounts/mocks.ts)
export const accountsMockMap = {
  'GET /user/current': () => ({ user: mockDemoUser }),
} satisfies MockMap;

// Screenset registration (demoScreenset.tsx)
apiRegistry.registerMocks(ACCOUNTS_DOMAIN, accountsMockMap);
```

**Key Principles:** Framework services in uicore, mocks in screensets, intentional duplication for independence.

## Creating a New Screenset

1. Create directory: `mkdir -p src/screensets/my-screenset/screens/home`
2. Create `ids.ts`: `export const MY_SCREENSET_ID = 'myScreenset';`
3. Create screenset-level i18n files: `src/screensets/my-screenset/i18n/en.json`, etc.
4. Create screen with translations (must export default for lazy loading)
5. Create screenset config with localization and self-register
6. Auto-discovered via Vite glob - no manual import needed

## Redux Store Structure

```typescript
{
  // Static reducers (always present)
  app: AppState,
  layout: LayoutState,
    header, footer, menu, sidebar, screen, popup, overlay, // Nested layout domains

  // Dynamic reducers (registered by screensets)
  'chat/threads': ThreadsState,
  'chat/messages': MessagesState,
}
```

## Navigation Flow

```
User action → navigateToScreen() → emits NavigationEvents.ScreenNavigated
  → effect listens → dispatches setSelectedScreen()
    → AppRouter updates URL → Screen re-renders
```

## Theming

Themes are CSS custom properties applied to `:root`. Use Tailwind theme tokens in components: `className="bg-background text-foreground"`.

## Testing Checklist

```bash
npm run type-check    # 1. TypeScript
npm run lint          # 2. ESLint
npm run arch:check    # 3. Architecture (CRITICAL)
npm run arch:deps     # 4. Dependency rules
npm run dev           # 5. Test in browser + console
```

## Automated Enforcement

### ESLint Rules
1. **screenset-ids-location**: IDs must be in `ids.ts`
2. **screenset-template-literals**: Events/icons/domains use template literals
3. **screenset-state-key-pattern**: RootState uses enum pattern

### Dependency Cruiser
1. **no-internal-imports**: Prevents app importing package internals
2. **no-circular**: Detects circular dependencies
3. **no-cross-screenset-imports**: Maintains vertical slice independence

### Runtime Validation
1. **Slice Name Validation**: Reducer `.name` must match state key
2. **Auto-Discovery**: Vite glob pattern auto-discovers screensets

**Benefits:** 96% reduction in duplication effort, zero manual renaming, type safety, early error detection.

## Common Pitfalls

1. **Package internals**: Use public exports only
2. **Direct dispatch**: Use event-driven actions
3. **Circular deps**: Use event bus for decoupling
4. **Registry modification**: Self-register instead
5. **Translation registration**: Use `i18nRegistry.registerLoader()`
6. **Naming violations**: Follow template literal pattern for events/icons/IDs
7. **Hardcoded state keys**: Use screenset ID constant
8. **Monolithic events/effects**: Split into domain-specific files with `DOMAIN_ID` constant
9. **MCP testing**: NEVER skip Chrome DevTools MCP testing, STOP if WebSocket closes

## AI Development Workflow

1. Reference `.ai/GUIDELINES.md` for routing table
2. Read target file for area (e.g., `.ai/targets/SCREENSETS.md`)
3. Follow event-driven patterns
4. Use registries for extensibility
5. Validate with `npm run arch:check`
6. **CRITICAL: Test via Chrome DevTools MCP immediately** (see `.ai/MCP_TROUBLESHOOTING.md`)
7. Keep screensets as vertical slices

## Documentation

- **README.md**: Project overview
- **QUICK_START.md**: Developer guide
- **docs/MANIFEST.md**: Philosophy
- **docs/ROADMAP.md**: Milestones
- **docs/MODEL.md**: Domain glossary
- **.ai/GUIDELINES.md**: AI routing table
- **.ai/targets/*.md**: Area-specific rules
- **.ai/MCP_TROUBLESHOOTING.md**: Chrome MCP troubleshooting

## Tech Stack

React 18, TypeScript 5, Vite 6, Redux Toolkit, Lodash, Tailwind CSS 3, shadcn/ui + Radix UI, tsup

## Monorepo Structure

```
HAI3/
├── packages/          # uikit-contracts, uikit, uicore, devtools
├── src/               # App code
│   ├── screensets/    # Vertical slices
│   ├── themes/        # Theme registry
│   └── App.tsx
├── .ai/               # AI guidelines
└── docs/              # Documentation
```

## File Naming

- Components: PascalCase (`HelloWorldScreen.tsx`)
- Utils/services: camelCase (`apiRegistry.ts`)
- Slices/effects/actions: camelCase + suffix (`menuSlice.ts`, `menuEffects.ts`)

## Initialization Sequence

```typescript
// main.tsx - ORDER MATTERS
import '@/uikit/uikitRegistry';        // 1. Register UI Kit
import '@/screensets/screensetRegistry'; // 2. Register screensets
import '@/themes/themeRegistry';        // 3. Register themes

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HAI3Provider><App /></HAI3Provider>
  </StrictMode>
);
```

## Support

- **Issues**: GitHub
- **Discussions**: Discord
- **Contributing**: See CONTRIBUTING.md
- **License**: Apache 2.0
- Always follow `.ai/targets/AI.md` when modifying `.ai/` documents
