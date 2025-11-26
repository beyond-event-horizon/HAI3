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

**Build Order:** uikit-contracts → uikit → uicore → studio → cli → app (`npm run build:packages` handles this)

## Architecture Overview

### Three-Layer Package Structure

```
App (src/) → screensets, themes, icons
    ↓
uicore (layout, Redux, events) + uikit (React components) + studio (dev only)
    ↓
uikit-contracts (interfaces only)
```

**Key Rules:**
- **uikit-contracts**: Pure TypeScript interfaces - no implementation
- **uikit**: React components - NO dependency on uicore
- **uicore**: Layout, Redux store, event bus, registries - depends ONLY on contracts
- **studio**: Dev panel (auto-loaded in dev, tree-shaken in prod)
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
const SLICE_KEY = `${CHAT_SCREENSET_ID}/threads` as const;

export const threadsSlice = createSlice({
  name: SLICE_KEY,
  initialState,
  reducers: { /* ... */ }
});

// Export slice object (not just reducer)
export default threadsSlice;

// Module augmentation
declare module '@hai3/uicore' {
  interface RootState {
    [SLICE_KEY]: ThreadsState;
  }
}

// Register with effects - slice.name is used automatically
registerSlice(threadsSlice, initializeThreadsEffects);
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

1. **CRITICAL: Read `.ai/GUIDELINES.md` FIRST** - Route to correct target file before ANY modification. For `.ai/` files, MUST read `.ai/targets/AI.md` first.
2. **CRITICAL: Verify MCP connection** - If WebSocket breaks, STOP and fix it first (see `.ai/MCP_TROUBLESHOOTING.md`)
3. **CRITICAL: Use Chrome Studio MCP native tools** - ALWAYS use appropriate tool:
   - Navigation: `navigate_page`, `wait_for`
   - Page info: `take_snapshot`, `take_screenshot`, `list_console_messages`, `list_network_requests`
   - Interaction: `click`, `fill`, `fill_form`, `hover`, `press_key`
   - Tabs: `list_pages`, `select_page`, `new_page`, `close_page`
   - **ONLY use `evaluate_script` as last resort when NO native tool works**
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

## HAI3 CLI

The CLI provides project scaffolding and screenset management tools.

### Installation
```bash
npm install -g @hai3/cli  # Global installation
```

### Commands
```bash
# Create new project
hai3 create <project-name>              # Interactive project creation
hai3 create my-app --uikit=hai3 --studio  # Non-interactive

# Update CLI and packages (auto-detects alpha/stable channel)
hai3 update                             # Inside project: updates CLI + packages
                                        # Outside: updates CLI only
hai3 update --alpha                     # Force update to alpha channel
hai3 update --stable                    # Force update to stable channel

# Screenset management
hai3 screenset create <name>            # Create new screenset
hai3 screenset create billing --category=production
hai3 screenset copy <source> <target>   # Copy with ID transformation
hai3 screenset copy chat chatCopy --category=mockups
```

### Programmatic API (for AI agents)
```typescript
import { executeCommand, commands } from '@hai3/cli';

const result = await executeCommand(
  commands.screensetCreate,
  { name: 'billing', category: 'drafts' },
  { interactive: false }
);

if (result.success) {
  console.log('Created:', result.data.files);
}
```

## Creating a New Screenset

### Option 1: Using CLI (Recommended)
```bash
hai3 screenset create myScreenset
```

### Option 2: Manual Creation
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
9. **MCP testing**: NEVER skip Chrome Studio MCP testing, STOP if WebSocket closes

## AI Development Workflow

1. Reference `.ai/GUIDELINES.md` for routing table
2. Read target file for area (e.g., `.ai/targets/SCREENSETS.md`)
3. Follow event-driven patterns
4. Use registries for extensibility
5. Validate with `npm run arch:check`
6. **CRITICAL: Test via Chrome Studio MCP immediately** (see `.ai/MCP_TROUBLESHOOTING.md`)
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
├── packages/          # uikit-contracts, uikit, uicore, studio, cli
├── src/               # App code
│   ├── screensets/    # Vertical slices
│   ├── themes/        # Theme registry
│   └── App.tsx
├── .ai/               # AI guidelines
└── docs/              # Documentation
```

## Package Publishing

HAI3 packages are published to NPM under the `@hai3` scope. All packages are currently in **alpha** (`0.1.0-alpha.0`).

### Published Packages

| Package | Version | Description |
|---------|---------|-------------|
| `@hai3/cli` | 0.1.0-alpha.0 | CLI tool for project scaffolding |
| `@hai3/uikit-contracts` | 0.1.0-alpha.0 | TypeScript interface definitions |
| `@hai3/uikit` | 0.1.0-alpha.0 | React component library |
| `@hai3/uicore` | 0.1.0-alpha.0 | Core framework (layout, Redux, events) |
| `@hai3/studio` | 0.1.0-alpha.0 | Development overlay (optional) |

### Alpha Publishing Workflow

**Prerequisites:**
- NPM account with access to `@hai3` organization
- Logged in via `npm login`

**Steps:**

1. **Build all packages:**
   ```bash
   npm run build:packages
   ```

2. **Run validation:**
   ```bash
   npm run type-check
   npm run lint
   npm run arch:check  # MUST pass
   ```

3. **Bump versions** (edit package.json or use npm version):
   ```bash
   # Example: Update all packages to 0.1.0-alpha.1
   npm version prerelease --preid=alpha --workspaces
   ```

4. **Publish each package with alpha tag:**
   ```bash
   # Publish order matters (dependencies first)
   cd packages/uikit-contracts && npm publish --tag alpha
   cd ../uikit && npm publish --tag alpha
   cd ../uicore && npm publish --tag alpha
   cd ../studio && npm publish --tag alpha
   cd ../cli && npm publish --tag alpha
   ```

**Important:**
- Use `--tag alpha` to prevent tagging as `latest`
- Users install alpha with: `npm install @hai3/uikit@alpha`
- Version all packages together for consistency

### Future Publishing (Post-Alpha)

After 1.0.0 release, automated workflow with Changesets or Lerna:
1. Developer creates PR with changeset file
2. CI creates Release PR with version bumps + changelog
3. Maintainer merges Release PR
4. CI publishes to NPM automatically

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
