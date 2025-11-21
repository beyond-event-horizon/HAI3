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
      ┌────────┴────────┬────────────┐
      ▼                 ▼            ▼ (dev only)
┌──────────┐      ┌──────────┐  ┌──────────┐
│  uicore  │      │  uikit   │  │ devtools │
│  Layout  │      │  React   │  │  DevUI   │
│  Redux   │◄─────┤  Comps   │◄─┤  (auto)  │
│  Events  │      │          │  │          │
└────┬─────┘      └────┬─────┘  └──────────┘
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
- **devtools**: Development-only package - auto-detected by HAI3Provider in dev mode, tree-shaken in production
- **App**: Registers uikit implementations with uicore at runtime via `uikitRegistry`

**Why this matters**: uicore can define what components it needs (contracts) without knowing HOW they're implemented. Apps can swap component libraries by registering different implementations.

**DevTools**: The `@hai3/devtools` package provides a floating development panel with theme/screenset/language selectors and API mode toggle. It's automatically loaded by `HAI3Provider` in development mode and completely excluded from production builds through tree-shaking.

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
- Events (optional)
- API services (optional)

Screensets are stored in a flat structure:
```
src/screensets/
├── demo/          # Demo screenset
│   ├── ids.ts     # CRITICAL: All IDs centralized here
│   ├── screens/   # Screen components
│   ├── i18n/      # Translations
│   ├── uikit/     # Icons
│   └── demoScreenset.tsx
├── chat/          # Chat screenset
│   ├── ids.ts
│   ├── slices/    # Redux state
│   ├── events/    # Event definitions
│   ├── effects/   # Event listeners
│   ├── actions/   # Action creators
│   ├── api/       # API services
│   └── chatScreenset.tsx
└── another/       # Another screenset
```

Category information (Drafts, Mockups, Production) is tracked via the `ScreensetCategory` enum in the screenset configuration, not in folder structure.

**Screenset Self-Containment Pattern:**
```typescript
// src/screensets/demo/ids.ts - CRITICAL: Single source of truth
export const DEMO_SCREENSET_ID = 'demo';
export const HELLO_WORLD_SCREEN_ID = 'helloworld';
export const THEME_SCREEN_ID = 'theme';

// src/screensets/demo/uikit/icons/WorldIcon.tsx - Template literals for namespacing
import { DEMO_SCREENSET_ID } from '../../ids';
export const WORLD_ICON_ID = `${DEMO_SCREENSET_ID}:world` as const;

// src/screensets/demo/demoScreenset.tsx - Auto-discovered, auto-registers
import { screensetRegistry, ScreensetCategory, type ScreensetConfig } from '@hai3/uicore';
import { DEMO_SCREENSET_ID, HELLO_WORLD_SCREEN_ID } from './ids';
import { WORLD_ICON_ID } from './uikit/icons/WorldIcon';

export const demoScreenset: ScreensetConfig = {
  id: DEMO_SCREENSET_ID,
  name: 'Demo Screenset',
  category: ScreensetCategory.Drafts,
  defaultScreen: HELLO_WORLD_SCREEN_ID,
  menu: [
    {
      menuItem: {
        id: HELLO_WORLD_SCREEN_ID,
        label: `screen.${DEMO_SCREENSET_ID}.${HELLO_WORLD_SCREEN_ID}:title`,
        icon: WORLD_ICON_ID, // Auto-namespaced via template literal
      },
      screen: () => import('./screens/helloworld/HelloWorldScreen'),
    },
  ],
};

// Self-registers at module import (no manual import in registry needed)
screensetRegistry.register(demoScreenset);
```

**Redux Integration Pattern (Domain-Based Slices):**

Screensets should be split into logical domains, not one monolithic slice:

```typescript
// src/screensets/chat/slices/threadsSlice.ts - Domain-specific slice
import { CHAT_SCREENSET_ID } from '../ids';

declare module '@hai3/uicore' {
  interface RootState {
    [`${CHAT_SCREENSET_ID}/threads`]: ThreadsState;
  }
}

export const selectThreadsState = (state: RootState): ThreadsState => {
  return state[`${CHAT_SCREENSET_ID}/threads`];
};
```

**Multiple domains per screenset:**
- `chat/threads` - Thread list and selection
- `chat/messages` - Messages in current thread
- `chat/composer` - Input composition (text, files)
- `chat/settings` - Model and context selection

**Event Bus Integration Pattern (Domain-Based Events):**

Events are split into domain-specific files for clear boundaries:

```
src/screensets/chat/events/
├── threadsEvents.ts    # Thread domain events
├── messagesEvents.ts   # Messages domain events
├── composerEvents.ts   # Composer domain events
├── settingsEvents.ts   # Settings domain events
└── dataEvents.ts       # Data loading coordination
```

Each event file uses domain constant pattern:

```typescript
// src/screensets/chat/events/threadsEvents.ts
import { CHAT_SCREENSET_ID } from '../ids';

const DOMAIN_ID = 'threads'; // Local domain constant

export enum ThreadsEvents {
  Selected = `${CHAT_SCREENSET_ID}/${DOMAIN_ID}/selected`,
  Created = `${CHAT_SCREENSET_ID}/${DOMAIN_ID}/created`,
  Deleted = `${CHAT_SCREENSET_ID}/${DOMAIN_ID}/deleted`,
}

declare module '@hai3/uicore' {
  interface EventPayloadMap {
    'chat/threads/selected': { threadId: string };
    'chat/threads/created': { thread: Thread };
    'chat/threads/deleted': { threadId: string };
  }
}
```

**Effects are also domain-specific:**

```
src/screensets/chat/effects/
├── threadsEffects.ts    # Listens to ThreadsEvents
├── messagesEffects.ts   # Listens to MessagesEvents
├── composerEffects.ts   # Listens to ComposerEvents
└── settingsEffects.ts   # Listens to SettingsEvents
```

Each slice registers its own effects (no coordinator):

```typescript
// src/screensets/chat/chatScreenset.tsx
import { initializeThreadsEffects } from './effects/threadsEffects';
import { initializeMessagesEffects } from './effects/messagesEffects';

registerSlice(`${CHAT_SCREENSET_ID}/threads`, threadsReducer, (dispatch) => {
  initializeThreadsEffects(dispatch);
});
registerSlice(`${CHAT_SCREENSET_ID}/messages`, messagesReducer, (dispatch) => {
  initializeMessagesEffects(dispatch);
});
```

**Key Conventions:**
- Each screenset is completely independent (vertical slice)
- All IDs centralized in `ids.ts` at screenset root (single source of truth)
- **Domain hierarchy:** `${SCREENSET_ID}/domain` for state slices, `${SCREENSET_ID}/${DOMAIN_ID}/event` for events
- Screensets split into logical domains (threads, messages, composer, settings, etc.)
- Multiple focused slices per screenset, not one monolithic slice
- Events split into domain-specific files (threadsEvents.ts, messagesEvents.ts, etc.)
- Each event file has local `DOMAIN_ID` constant for namespace consistency
- Effects split into domain-specific files (threadsEffects.ts, messagesEffects.ts, etc.)
- Each slice registers its own effects (no coordinator file)
- NO barrel exports (index.ts) in events/ or effects/ folders
- Screensets auto-discovered via Vite glob pattern in `screensetRegistry.tsx`
- Screensets extend Redux store dynamically via `registerSlice()` for each domain
- Translation keys use format: `'screenset.demo:key'` or `'screen.demo.hello:key'`

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

### 4. Per-Screen Localization with Lazy Loading

HAI3 uses a two-level translation system for optimal performance:

**Screenset-Level Translations** (loaded when screenset registers):
```typescript
// src/screensets/demo/demoScreenset.tsx
import { I18nRegistry, Language } from '@hai3/uicore';

const screensetTranslations = I18nRegistry.createLoader({
  [Language.English]: () => import('./i18n/en.json'),
  [Language.Spanish]: () => import('./i18n/es.json'),
  // ... all 36 languages (TypeScript enforces completeness)
});

export const demoScreenset: ScreensetConfig = {
  id: DEMO_SCREENSET_ID,
  localization: screensetTranslations, // TranslationLoader function
  // ...
};
```

**Screen-Level Translations** (loaded lazily when screen mounts):
```typescript
// src/screensets/demo/screens/helloworld/HelloWorldScreen.tsx
import { useScreenTranslations, I18nRegistry, Language, TextLoader } from '@hai3/uicore';

const translations = I18nRegistry.createLoader({
  [Language.English]: () => import('./i18n/en.json'),
  [Language.Spanish]: () => import('./i18n/es.json'),
  // ... all 36 languages (TypeScript enforces completeness)
});

export const HelloWorldScreen: React.FC = () => {
  // Register and load translations for this screen (loads current language only)
  useScreenTranslations(DEMO_SCREENSET_ID, HELLO_WORLD_SCREEN_ID, translations);

  const { t } = useTranslation();

  return (
    <TextLoader skeletonClassName="h-10 w-64">
      <h1>{t(`screen.${DEMO_SCREENSET_ID}.${HELLO_WORLD_SCREEN_ID}:title`)}</h1>
    </TextLoader>
  );
};
```

**Translation Key Format**: `'namespace:path.to.key'`
- Screenset: `screenset.demo:name`
- Screen: `screen.demo.helloworld:title`

**Why this matters:**
- Only screenset-level and default screen translations load on initial page load
- Each screen's translations load on-demand when navigating to that screen
- Only the current language is downloaded (browser network shows 1 file, not 36)
- Vite dev server logs may show all 36 files, but this is HMR dependency tracking, not actual downloads
- Dramatically reduces initial bundle size for applications with many screens

**TextLoader Component:**
Wrap translated text with `<TextLoader>` to show skeleton loaders during lazy translation loading. This prevents flash of untranslated content (FOUC) when navigating to screens for the first time.

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

1. **CRITICAL: Verify MCP connection** - If MCP WebSocket is broken, STOP and fix it first. NEVER skip testing with MCP.
2. **CRITICAL: Use Chrome DevTools MCP native tools for EVERYTHING** - ALWAYS use the appropriate native MCP tool for every browser interaction:
   - Navigation: `mcp__chrome-devtools__navigate_page`, `mcp__chrome-devtools__wait_for`
   - Page info: `mcp__chrome-devtools__take_snapshot`, `mcp__chrome-devtools__take_screenshot`, `mcp__chrome-devtools__list_console_messages`, `mcp__chrome-devtools__list_network_requests`
   - Interaction: `mcp__chrome-devtools__click`, `mcp__chrome-devtools__fill`, `mcp__chrome-devtools__fill_form`, `mcp__chrome-devtools__hover`, `mcp__chrome-devtools__press_key`
   - Tabs/Pages: `mcp__chrome-devtools__list_pages`, `mcp__chrome-devtools__select_page`, `mcp__chrome-devtools__new_page`, `mcp__chrome-devtools__close_page`
   - Advanced: `mcp__chrome-devtools__emulate`, `mcp__chrome-devtools__resize_page`, `mcp__chrome-devtools__handle_dialog`
   - **ONLY use `mcp__chrome-devtools__evaluate_script` as an absolute last resort when NO native tool can accomplish the task**
3. **Read `.ai/GUIDELINES.md`** - Contains routing table for which rules apply to each area
4. **Run `npm run arch:check`** - MUST pass before committing
5. **Check dependency rules** - `npm run arch:deps` enforces package isolation
6. **Follow event-driven flow** - Do NOT dispatch slice actions directly from components/actions

### Forbidden Patterns

- ❌ Using `mcp__chrome-devtools__evaluate_script` for ANY task that has a dedicated native MCP tool (navigation, clicking, typing, snapshots, screenshots, console logs, etc.)
- ❌ Direct slice dispatch from components: `dispatch(setMenuItems([]))`
- ❌ Importing package internals: `import '@hai3/uikit/src/internal'`
- ❌ Circular dependencies between packages
- ❌ `any` types or `as unknown as T` chains
- ❌ Central constants files (define IDs where used)
- ❌ Barrel exports hiding imports (only use index.ts when aggregating 3+ exports)
- ❌ Native methods when lodash equivalent exists: `Object.assign()`, spread operator for deep object merging, native array methods

### Required Patterns

- ✅ **ALWAYS choose the appropriate native Chrome DevTools MCP tool**:
  - Get page structure: `mcp__chrome-devtools__take_snapshot()` NOT `evaluate_script('document.body.innerHTML')`
  - Click elements: `mcp__chrome-devtools__click(uid)` using UIDs from snapshot NOT `evaluate_script('element.click()')`
  - Fill inputs: `mcp__chrome-devtools__fill(uid, value)` NOT `evaluate_script('input.value = ...')`
  - Navigate: `mcp__chrome-devtools__navigate_page(type, url)` NOT `evaluate_script('window.location.href = ...')`
  - Console logs: `mcp__chrome-devtools__list_console_messages()` NOT `evaluate_script('console.log')`
  - Screenshots: `mcp__chrome-devtools__take_screenshot()` NOT any script-based solution
- ✅ Use lodash for all object/array operations: `assign()` instead of `Object.assign()`, `merge()` for deep merging, `cloneDeep()` for cloning
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

HAI3 uses a vertical slice architecture for API services with a clear separation:

**Framework Services (in uicore package):**
- Service class definitions stay in `packages/uicore/src/api/services/` (e.g., AccountsApiService)
- These are core services used by the framework itself (Layout, Header, etc.)
- Registration happens automatically when the service module loads

**Screenset Extensions (in screenset folders):**
- Mocks and module augmentation live in `src/screensets/<screenset>/api/`
- Each screenset owns the extensions for services it uses
- Enables complete vertical slice independence

**Example - Framework Service with Screenset Extensions:**

```typescript
// packages/uicore/src/api/services/accounts/AccountsApiService.ts
// Service definition stays in uicore (framework level)
export const ACCOUNTS_DOMAIN = 'accounts';

export class AccountsApiService extends BaseApiService {
  async getCurrentUser(): Promise<GetCurrentUserResponse> { /* ... */ }
}

// Auto-registers at module import
apiRegistry.register(ACCOUNTS_DOMAIN, AccountsApiService);
```

```typescript
// src/screensets/demo/api/accounts/extra.ts
// Module augmentation owned by demo screenset
declare module '@hai3/uicore' {
  interface UserExtra {
    department: string;
  }
}
```

```typescript
// src/screensets/demo/api/accounts/mocks.ts
// Mock data owned by demo screenset
export const accountsMockMap = {
  'GET /user/current': () => ({ user: mockDemoUser }),
} satisfies MockMap;
```

```typescript
// src/screensets/demo/demoScreenset.tsx
// Screenset registers mocks for framework services it uses
import './api/accounts/extra';
import { accountsMockMap } from './api/accounts/mocks';

apiRegistry.registerMocks(ACCOUNTS_DOMAIN, accountsMockMap);
```

**Example - Screenset-Specific Service:**

```typescript
// src/screensets/chat/api/ChatApiService.ts
// Service definition owned by chat screenset
export const CHAT_DOMAIN = 'chat';

export class ChatApiService extends BaseApiService {
  async getThreads(): Promise<Thread[]> { /* ... */ }
}

// Auto-registers at module import
apiRegistry.register(CHAT_DOMAIN, ChatApiService);
```

```typescript
// src/screensets/chat/api/mocks.ts
// Mock data owned by chat screenset
export const chatMockMap = {
  'GET /threads': () => ({ threads: mockThreads }),
} satisfies MockMap;
```

```typescript
// src/screensets/chat/chatScreenset.tsx
// Screenset registers its own service mocks
import './api/ChatApiService';
import { chatMockMap } from './api/mocks';

apiRegistry.registerMocks(CHAT_DOMAIN, chatMockMap);
```

**Usage in Components:**

```typescript
const accountsApi = apiRegistry.getService(ACCOUNTS_DOMAIN);
const user = await accountsApi.getCurrentUser();
```

**Mock vs Real API:**
- Services can switch between mock and real implementations
- Toggle via DevTools or `ApiEvents.ModeChanged` event
- Mock data defined in `src/screensets/<screenset>/api/mocks.ts`

**Key Principles:**
- **Service class** location: Framework services in uicore, screenset services in screensets
- **Mocks and extensions** location: Always in the screenset that uses them
- **Intentional duplication**: If multiple screensets need the same service, duplicate it
- **Complete independence**: Each screenset is self-contained with all its API code

## Creating a New Screenset

**IMPORTANT:** All screens MUST be lazy-loaded using dynamic imports for optimal performance and code-splitting.

### Screenset Naming Conventions

All screenset identifiers MUST follow these conventions for self-containment:

1. **Screenset ID**: camelCase, single word preferred (e.g., `'demo'`, `'chat'`, `'chatCopy'`)
2. **Screen IDs**: camelCase (e.g., `'helloworld'`, `'theme'`, `'profile'`)
3. **Redux State Keys**: Domain-based: `${SCREENSET_ID}/domain` format (e.g., `'chat/threads'`, `'chat/messages'`)
4. **Event Names**: Domain hierarchy: `${SCREENSET_ID}/${DOMAIN_ID}/event` format (e.g., `'chat/threads/selected'`, `'chat/messages/sent'`)
5. **Icon IDs**: `${SCREENSET_ID}:iconName` format (e.g., `'demo:world'`)
6. **API Domains**: `${SCREENSET_ID}:serviceName` format (e.g., `'chat:api'`)
7. **Translation Keys**: `screenset.${SCREENSET_ID}:path` or `screen.${SCREENSET_ID}.${SCREEN_ID}:path`

**CRITICAL:** All IDs must be centralized in `ids.ts` and use template literals for auto-updating namespaces.

### Steps to Create a Screenset

1. **Create directory structure:**
   ```bash
   mkdir -p src/screensets/my-screenset/screens/home
   ```

2. **Create centralized IDs file:**
   ```typescript
   // src/screensets/my-screenset/ids.ts
   export const MY_SCREENSET_ID = 'myScreenset'; // camelCase, single word preferred
   export const HOME_SCREEN_ID = 'home';
   ```

3. **Create screenset-level translation files:**
   ```bash
   mkdir -p src/screensets/my-screenset/i18n
   # Create en.json, es.json, etc. for all 36 languages
   ```

4. **Create screen component with translations:**
   ```typescript
   // src/screensets/my-screenset/screens/home/HomeScreen.tsx
   import React from 'react';
   import { useScreenTranslations, useTranslation, I18nRegistry, Language } from '@hai3/uicore';
   import { MY_SCREENSET_ID, HOME_SCREEN_ID } from '../../ids';

   // Create screen-level translation files in ./i18n/en.json, ./i18n/es.json, etc.
   const translations = I18nRegistry.createLoader({
     [Language.English]: () => import('./i18n/en.json'),
     [Language.Spanish]: () => import('./i18n/es.json'),
     // ... all 36 languages
   });

   export const HomeScreen: React.FC = () => {
     // Register screen translations (loads current language immediately)
     useScreenTranslations(MY_SCREENSET_ID, HOME_SCREEN_ID, translations);

     const { t } = useTranslation();

     return (
       <div>
         <h1>{t(`screen.${MY_SCREENSET_ID}.${HOME_SCREEN_ID}:title`)}</h1>
       </div>
     );
   };

   HomeScreen.displayName = 'HomeScreen';

   // Default export required for lazy loading
   export default HomeScreen;
   ```

5. **Create screenset config with localization:**
   ```typescript
   // src/screensets/my-screenset/myScreenset.tsx
   import { screensetRegistry, ScreensetCategory, type ScreensetConfig, I18nRegistry, Language } from '@hai3/uicore';
   import { MY_SCREENSET_ID, HOME_SCREEN_ID } from './ids';

   // Screenset-level translations
   const screensetTranslations = I18nRegistry.createLoader({
     [Language.English]: () => import('./i18n/en.json'),
     [Language.Spanish]: () => import('./i18n/es.json'),
     // ... all 36 languages
   });

   export const myScreenset: ScreensetConfig = {
     id: MY_SCREENSET_ID,
     name: 'My Screenset',
     category: ScreensetCategory.Drafts,
     defaultScreen: HOME_SCREEN_ID,
     localization: screensetTranslations,
     menu: [
       {
         menuItem: {
           id: HOME_SCREEN_ID,
           label: `screen.${MY_SCREENSET_ID}.${HOME_SCREEN_ID}:title`,
           icon: `${MY_SCREENSET_ID}:home`, // Template literal for namespacing
         },
         screen: () => import('./screens/home/HomeScreen'), // Lazy loader
       },
     ],
   };

   screensetRegistry.register(myScreenset);
   ```

6. **Auto-discovery:** The screenset is automatically discovered via Vite glob imports in `screensetRegistry.tsx`. No manual import needed!

7. **Run app and switch screenset via UI selector**

**Key Points:**
- All IDs centralized in `ids.ts` at screenset root
- Use template literals for events, icons, API domains: `${SCREENSET_ID}/event`
- Redux state keys use enum pattern for type-safe auto-updating
- Screensets auto-discovered via glob pattern - no manual registration needed
- Screen components must export default for lazy loading
- ESLint enforces naming conventions automatically

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

## Automated Enforcement

HAI3 uses automated tools to enforce architectural conventions and prevent common mistakes:

### ESLint Rules for Screensets

Custom ESLint rules automatically enforce screenset naming conventions:

1. **Centralized IDs Rule**: Ensures all screenset/screen IDs are defined in `ids.ts`
   - **Rule**: `@hai3/screenset-ids-location`
   - **Error**: "Screenset/screen ID constants must be defined in ids.ts"
   - **Why**: Prevents scattered IDs across files, ensures single source of truth

2. **Template Literal Enforcement**: Ensures events, icons, and API domains use template literals
   - **Rule**: `@hai3/screenset-template-literals`
   - **Error**: "Event names must use template literals with screenset ID"
   - **Why**: Ensures auto-updating namespaces when screenset ID changes

3. **Enum Pattern for State Keys**: Ensures RootState augmentation uses enum pattern
   - **Rule**: `@hai3/screenset-state-key-pattern`
   - **Error**: "RootState augmentation must use enum pattern with template literal"
   - **Why**: Ensures type-safe, auto-updating state keys

### Dependency Cruiser Rules

Dependency-cruiser enforces package isolation and prevents circular dependencies:

1. **Package Isolation**: Prevents app code from importing package internals
   - **Rule**: `no-internal-imports`
   - **Example**: ❌ `import '@hai3/uikit/src/internal'`

2. **Circular Dependency Detection**: Prevents circular imports
   - **Rule**: `no-circular`
   - **Command**: `npm run arch:deps`

3. **Cross-Screenset Dependencies**: Prevents screensets from importing each other
   - **Rule**: `no-cross-screenset-imports`
   - **Why**: Maintains vertical slice independence

### Runtime Validation

Additional validations happen at runtime:

1. **Slice Name Validation**: `registerSlice()` validates that reducer `.name` matches state key
   - **Error**: "Screenset convention violation: Slice name 'X' must match state key 'Y'"
   - **Fix**: Use `Object.defineProperty(reducer, 'name', { value: SCREENSET_ID })`

2. **Auto-Discovery**: Screensets automatically discovered via Vite glob pattern
   - **Pattern**: `import.meta.glob('./*/[a-z]*Screenset.tsx', { eager: true })`
   - **Why**: Eliminates manual registration, prevents forgetting to import

### Benefits

- **96% Reduction in Duplication Effort**: From ~50 manual steps to 2 steps (copy + update ids.ts)
- **Zero Manual Renaming**: Template literals auto-update all namespaced identifiers
- **Type Safety**: Enum pattern ensures Redux state keys stay in sync
- **Early Error Detection**: ESLint catches convention violations during development
- **Consistent Architecture**: Automated enforcement prevents architectural drift

## AI Development Workflow

When working with AI (Claude, GPT, etc.):

1. **Always reference `.ai/GUIDELINES.md`** for the routing table
2. **Read the target file** for the area you're working on (e.g., `.ai/targets/SCREENSETS.md`)
3. **Follow event-driven patterns** - emit events, don't dispatch directly
4. **Use registries for extensibility** - never modify registry root files
5. **Validate with `npm run arch:check`** before finalizing code
6. **CRITICAL: Test changes immediately via Chrome DevTools MCP** - If MCP connection breaks (WebSocket closed), STOP all development and fix connection first. NEVER continue without testing. (see `.ai/MCP_TROUBLESHOOTING.md`)
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

6. **Violating screenset naming conventions**
   - ❌ Hardcoded event names: `eventBus.emit('chat/messageReceived', ...)`
   - ✅ Template literals: `eventBus.emit(ChatEvents.MessageReceived, ...)` where enum uses `${SCREENSET_ID}/messageReceived`
   - ❌ Hardcoded icon IDs: `icon: 'chat-icon'`
   - ✅ Template literals: `icon: MESSAGE_ICON_ID` where `const MESSAGE_ICON_ID = \`${SCREENSET_ID}:message\``
   - ❌ IDs scattered across files
   - ✅ All IDs in centralized `ids.ts`
   - ❌ Slice name doesn't match state key: `name: 'reducer'` but registered as `'chat'`
   - ✅ Use `Object.defineProperty(reducer, 'name', { value: SCREENSET_ID })` after slice creation

7. **Hardcoding state keys instead of using screenset ID constant**
   - ❌ Hardcoded state keys: `interface RootState { 'chat': ChatState }`
   - ✅ Use screenset ID constant: `interface RootState { [SCREENSET_ID]: ChatState }`
   - ✅ Use enums only for multiple keys: `enum Keys { Main = \`${SCREENSET_ID}\`, Cache = \`${SCREENSET_ID}_cache\` }`
   - This ensures state keys auto-update when screenset ID changes

8. **Using monolithic event/effects files instead of domain-specific**
   - ❌ Single `chatEvents.ts` with all events
   - ✅ Domain-specific files: `threadsEvents.ts`, `messagesEvents.ts`, `composerEvents.ts`, `settingsEvents.ts`
   - ❌ Coordinator `chatEffects.ts` file initializing all domains
   - ✅ Each slice registers its own effects: `registerSlice('chat/threads', threadsReducer, initializeThreadsEffects)`
   - ❌ Barrel export `index.ts` in events/ or effects/ folders
   - ✅ Direct imports from specific domain files
   - ❌ Missing `DOMAIN_ID` constant in event files
   - ✅ Each event file has local `const DOMAIN_ID = 'domain';` and uses it in template literals

9. **CRITICAL: Skipping Chrome DevTools MCP testing or killing MCP processes**
   - ❌ Continuing development when MCP WebSocket is closed
   - ❌ `pkill -f chrome-devtools-mcp` (permanently breaks MCP tools for the session)
   - ❌ Making multiple code changes without testing each one
   - ✅ STOP immediately when "WebSocket is not open: readyState 3 (CLOSED)" appears
   - ✅ Fix MCP connection before any further development
   - ✅ Test every single code change via Chrome DevTools MCP before proceeding
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
- **Lodash**: Utility library for object/array operations (preferred over native methods)
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
│   │   ├── demo/                # Demo screenset (category: Drafts)
│   │   ├── chat/                # Chat screenset (category: Mockups)
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
- Always read thoroughly and follow ".ai/targets/AI.md" when modifying any document in ".ai" folder