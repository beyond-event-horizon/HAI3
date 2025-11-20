## ADDED Requirements

### Requirement: Centralized screenset IDs

Screensets SHALL define all unique identifiers (screenset ID, screen IDs) in a single `ids.ts` file to enable easy duplication.

#### Scenario: Chat screenset IDs file

```typescript
// src/screensets/chat/ids.ts
/**
 * Chat Screenset IDs
 *
 * ALL unique identifiers for this screenset in one place.
 * When duplicating this screenset, ONLY change the values in this file.
 * Everything else (events, icons, API domains, translations) will auto-update via template literals.
 */

/**
 * Screenset ID
 * Used for: Redux slice name, event namespace, icon namespace, API domain, translations
 */
export const CHAT_SCREENSET_ID = 'chat';

/**
 * Screen IDs
 * Used for: Screen routing, screen-level translations
 */
export const CHAT_SCREEN_ID = 'chat';
```

**Given** a screenset with multiple IDs
**When** organizing the screenset structure
**Then** all IDs MUST be defined in a central `ids.ts` file
**And** the file SHALL document what each ID is used for
**And** duplication SHALL only require changing values in this one file

### Requirement: Enum pattern for RootState augmentation

Screensets SHALL use enum pattern with template literals for RootState augmentation to enable automatic updates when screenset ID changes.

#### Scenario: Chat screenset enum state key

```typescript
// src/screensets/chat/chatStore.ts
import { CHAT_SCREENSET_ID } from './ids';

/**
 * State key enum for type-safe module augmentation
 * Uses template literal to compute key from CHAT_SCREENSET_ID at compile time
 * When CHAT_SCREENSET_ID changes (e.g., during screenset duplication),
 * this enum value automatically updates, and so does the RootState augmentation
 */
export enum ChatStateKeys {
  State = `${CHAT_SCREENSET_ID}`
}

// Module augmentation - extends uicore RootState with chat slice
// Uses enum key so it auto-updates when CHAT_SCREENSET_ID changes
declare module '@hai3/uicore' {
  interface RootState {
    [ChatStateKeys.State]: ChatState;
  }
}
```

**Given** a screenset with ID `'chat'`
**When** augmenting RootState
**Then** the system SHALL use an enum with template literal computed from screenset ID
**And** the enum value SHALL be used as the interface property key
**And** changing `CHAT_SCREENSET_ID` SHALL automatically update the enum and augmentation

#### Scenario: Type-safe state selector

```typescript
// src/screensets/chat/chatStore.ts
/**
 * Type-safe selector for chat state
 * Works everywhere (components and effects) thanks to proper RootState typing
 */
export const selectChatState = (state: RootState): ChatState => {
  return state[ChatStateKeys.State];  // Fully type-safe, no casts!
};

// Usage in components
const chat = useAppSelector(selectChatState);

// Usage in effects
const chat = selectChatState(store.getState());
```

**Given** a screenset with enum-based state key
**When** creating a state selector
**Then** the selector SHALL use the enum key to access state
**And** NO type casting SHALL be required
**And** the selector SHALL work in both components and effects

### Requirement: Explicit RootState definition in uicore

The uicore store SHALL define RootState explicitly as an interface (not computed from store), then type store.getState() to return RootState, enabling module augmentation to work everywhere.

#### Scenario: Explicit RootState interface

```typescript
// packages/uicore/src/store.ts

// Base RootState interface - defined explicitly for module augmentation
// Screensets can extend this via module augmentation to add their slices
export interface RootState {
  app: ReturnType<typeof appReducer>;
  layout: ReturnType<typeof layoutReducer>;
  header: ReturnType<typeof headerReducer>;
  footer: ReturnType<typeof footerReducer>;
  menu: ReturnType<typeof menuReducer>;
  sidebar: ReturnType<typeof sidebarReducer>;
  screen: ReturnType<typeof screenReducer>;
  popup: ReturnType<typeof popupReducer>;
  overlay: ReturnType<typeof overlayReducer>;
}
```

**Given** a Redux store with static and dynamic reducers
**When** defining RootState
**Then** RootState MUST be an explicit interface (not `extends ReturnType<typeof store.getState>`)
**And** each property type SHALL be derived from the reducer's return type

#### Scenario: Store wrapper with typed getState

```typescript
// packages/uicore/src/store.ts

const _internalStore = configureStore({
  reducer: staticReducers,
});

// Export store typed to return RootState (enables module augmentation to work everywhere)
// We create a wrapper object that delegates to the internal store but types getState correctly
export const store = {
  ..._internalStore,
  getState: (): RootState => _internalStore.getState() as RootState,
};
```

**Given** a configured Redux store
**When** exporting the store
**Then** the store SHALL be wrapped to override getState() return type
**And** getState() SHALL return RootState (enabling augmentation to work)
**And** ONE cast SHALL be allowed in the wrapper (unavoidable TypeScript limitation)

#### Scenario: Module augmentation works in effects

```typescript
// src/screensets/chat/effects/chatEffects.ts
import { store } from '@hai3/uicore';
import { selectChatState } from '../chatStore';

eventBus.on(ChatEvents.ThreadCreated, ({ thread }) => {
  const chat = selectChatState(store.getState());  // ✅ Type-safe, no casts!
  const draftThread = chat.threads.find((t) => t.isDraft);
  // ...
});
```

**Given** a Redux effect accessing state
**When** calling `store.getState()`
**Then** the return type SHALL be RootState (including augmented slices)
**And** NO unsafe casts SHALL be required in effects
**And** state selectors SHALL work identically in components and effects

### Requirement: Event namespace convention

Screensets SHALL prefix all event names with `${screensetId}/` to enable namespace isolation and prevent collisions when duplicating.

#### Scenario: Chat screenset event namespace

```typescript
// src/screensets/chat/events/chatEvents.ts
import { CHAT_SCREENSET_ID } from '../chatScreenset';

export enum ChatEvents {
  ThreadSelected = `${CHAT_SCREENSET_ID}/threadSelected`, // 'chat/threadSelected'
  ThreadCreated = `${CHAT_SCREENSET_ID}/threadCreated`,   // 'chat/threadCreated'
  MessageSent = `${CHAT_SCREENSET_ID}/messageSent`,       // 'chat/messageSent'
  // ... all events use chat/ prefix
}
```

**Given** a screenset with ID `'chat'`
**When** defining event enum values
**Then** all event string values MUST start with `'chat/'`

#### Scenario: Duplicated screenset has unique event namespace

```typescript
// src/screensets/chat-copy/events/chatCopyEvents.ts
import { CHAT_COPY_SCREENSET_ID } from '../chatCopyScreenset';

export enum ChatCopyEvents {
  ThreadSelected = `${CHAT_COPY_SCREENSET_ID}/threadSelected`, // 'chat-copy/threadSelected'
  ThreadCreated = `${CHAT_COPY_SCREENSET_ID}/threadCreated`,   // 'chat-copy/threadCreated'
  // ... no collision with chat/ events
}
```

**Given** a duplicated screenset with ID `'chat-copy'`
**When** duplicating the events enum
**Then** changing only `CHAT_COPY_SCREENSET_ID` automatically updates all event names to use `'chat-copy/'` prefix
**And** no event name collisions occur between original and duplicate

#### Scenario: EventPayloadMap augmentation follows namespace

```typescript
// src/screensets/chat/events/chatEvents.ts
declare module '@hai3/uicore' {
  interface EventPayloadMap {
    'chat/threadSelected': { threadId: string };
    'chat/threadCreated': { thread: Thread };
    // ... all keys use chat/ prefix matching enum values
  }
}
```

**Given** a screenset with ID `'chat'`
**When** augmenting EventPayloadMap
**Then** all event keys MUST match the enum values exactly (including `'chat/'` prefix)

### Requirement: Icon ID namespace convention

Screensets SHALL prefix all icon IDs with `${screensetId}:` to prevent ID collisions when duplicating.

#### Scenario: Chat screenset icon ID namespace

```typescript
// src/screensets/chat/uikit/icons/MessageSquareIcon.tsx
import { CHAT_SCREENSET_ID } from '../../chatScreenset';

export const MESSAGE_SQUARE_ICON_ID = `${CHAT_SCREENSET_ID}:message-square`;
// → 'chat:message-square'

export const MessageSquareIcon: React.FC = () => {
  return <svg>{/* ... */}</svg>;
};
```

**Given** a screenset with ID `'chat'`
**When** defining icon IDs
**Then** the icon ID MUST be `'chat:message-square'` (prefixed with screenset ID)

#### Scenario: Icon registration uses namespaced ID

```typescript
// src/screensets/chat/chatScreenset.tsx
import { MESSAGE_SQUARE_ICON_ID, MessageSquareIcon } from './uikit/icons/MessageSquareIcon';

uikitRegistry.registerIcons({
  [MESSAGE_SQUARE_ICON_ID]: <MessageSquareIcon />,
  // 'chat:message-square': <MessageSquareIcon />
});
```

**Given** a screenset registering icons
**When** calling `uikitRegistry.registerIcons()`
**Then** the icon key MUST use the namespaced ID format

#### Scenario: Duplicated screenset has unique icon IDs

```typescript
// src/screensets/chat-copy/uikit/icons/MessageSquareIcon.tsx
import { CHAT_COPY_SCREENSET_ID } from '../../chatCopyScreenset';

export const MESSAGE_SQUARE_ICON_ID = `${CHAT_COPY_SCREENSET_ID}:message-square`;
// → 'chat-copy:message-square' (no collision with 'chat:message-square')
```

**Given** a duplicated screenset with ID `'chat-copy'`
**When** duplicating icon definitions
**Then** changing only `CHAT_COPY_SCREENSET_ID` automatically updates icon IDs to use `'chat-copy:'` prefix
**And** no icon ID collisions occur between original and duplicate

### Requirement: API domain convention

Screensets with screenset-specific API services SHALL use the screenset ID as the API domain identifier.

#### Scenario: Chat screenset API domain

```typescript
// src/screensets/chat/api/ChatApiService.ts
import { CHAT_SCREENSET_ID } from '../chatScreenset';

export const CHAT_DOMAIN = CHAT_SCREENSET_ID; // 'chat'

export class ChatApiService extends BaseApiService {
  // ... service implementation
}

// Auto-register at module import
apiRegistry.register(CHAT_DOMAIN, ChatApiService);
```

**Given** a screenset with ID `'chat'` and a screenset-specific API service
**When** defining the API domain constant
**Then** the domain MUST equal the screenset ID (`'chat'`)

#### Scenario: Duplicated screenset has unique API domain

```typescript
// src/screensets/chat-copy/api/ChatCopyApiService.ts
import { CHAT_COPY_SCREENSET_ID } from '../chatCopyScreenset';

export const CHAT_COPY_DOMAIN = CHAT_COPY_SCREENSET_ID; // 'chat-copy'

export class ChatCopyApiService extends BaseApiService {
  // ... service implementation (can be identical to ChatApiService)
}

// Auto-register at module import
apiRegistry.register(CHAT_COPY_DOMAIN, ChatCopyApiService);
```

**Given** a duplicated screenset with ID `'chat-copy'`
**When** duplicating the API service
**Then** changing only `CHAT_COPY_SCREENSET_ID` automatically updates the API domain to `'chat-copy'`
**And** no API domain collisions occur

#### Scenario: Framework services use descriptive domains

```typescript
// packages/uicore/src/api/services/accounts/AccountsApiService.ts
// NOT owned by a screenset - framework-level service

export const ACCOUNTS_DOMAIN = 'accounts'; // Descriptive name, not derived from screenset ID

export class AccountsApiService extends BaseApiService {
  // ... service implementation
}

// Auto-register at module import
apiRegistry.register(ACCOUNTS_DOMAIN, AccountsApiService);
```

**Given** a framework-level API service (not owned by a specific screenset)
**When** defining the API domain
**Then** the domain MAY use a descriptive name (not required to match any screenset ID)
**Note**: This provides flexibility for shared services used by multiple screensets

### Requirement: Auto-discovery of screensets

Screensets SHALL be automatically discovered and imported via Vite glob patterns, eliminating the need for manual registration.

#### Scenario: Screenset registry auto-discovery

```typescript
// src/screensets/screensetRegistry.tsx

/**
 * Auto-discover and import all screensets
 * Pattern: ./*/*[Ss]creenset.tsx matches files like:
 * - ./chat/chatScreenset.tsx
 * - ./demo/demoScreenset.tsx
 * - ./chat-copy/ChatScreenset.tsx (both cases work)
 *
 * Eager loading ensures side effects (screensetRegistry.register() calls)
 * execute before app renders
 */
const screensetModules = import.meta.glob('./*/*[Ss]creenset.tsx', { eager: true });

// That's it! No manual imports needed.
```

**Given** screensets in `src/screensets/` directory
**When** the screensetRegistry module loads
**Then** Vite SHALL automatically import all files matching `./*/*[Ss]creenset.tsx`
**And** eager loading SHALL execute each file's side effects immediately
**And** each screenset SHALL self-register via `screensetRegistry.register()` call

#### Scenario: Screenset file naming convention

```bash
# ✅ WILL be discovered:
src/screensets/chat/chatScreenset.tsx
src/screensets/demo/demoScreenset.tsx
src/screensets/chat-copy/ChatScreenset.tsx      # PascalCase also works
src/screensets/billing/billingScreenset.tsx

# ❌ WILL NOT be discovered:
src/screensets/chat/index.tsx                   # Wrong filename
src/screensets/chat/config.tsx                  # Wrong filename
src/screensets/chat/chat.screenset.tsx          # Wrong pattern
src/screensets/chat/screens/chatScreenset.tsx   # Too deep (3 levels)
```

**Given** files in the screensets directory
**When** Vite processes the glob pattern `./*/*[Ss]creenset.tsx`
**Then** only files ending with `Screenset.tsx` or `screenset.tsx` at exactly 2 directory levels SHALL be imported
**And** files not matching the pattern SHALL be ignored

#### Scenario: Disabled screenset handling

```bash
# Temporarily disable a screenset without deleting it:
mv src/screensets/chat/chatScreenset.tsx src/screensets/chat/chatScreenset.tsx.disabled

# Or move out of directory:
mv src/screensets/chat src/screensets/.archived/chat
```

**Given** a screenset that should not be loaded
**When** the screenset file is renamed to not match `*[Ss]creenset.tsx`
**Or** the screenset folder is moved outside `src/screensets/`
**Then** the glob pattern SHALL NOT match the file
**And** the screenset SHALL NOT be imported or registered

### Requirement: Screenset duplication procedure

Duplicating a screenset SHALL require only copying the folder and updating the IDs in a single `ids.ts` file, with all other naming and registration automatically handled.

#### Scenario: 2-step duplication process

```bash
# Step 1: Copy folder
cp -r src/screensets/chat src/screensets/chat-copy

# Step 2: Update ALL IDs in one file
# src/screensets/chat-copy/ids.ts
export const CHAT_COPY_SCREENSET_ID = 'chat-copy'; // Changed from 'chat'
export const CHAT_COPY_SCREEN_ID = 'chat-copy';     // Changed from 'chat'

# That's it! Auto-discovery handles the rest.
```

**Given** an existing screenset at `src/screensets/chat`
**When** duplicating to create `src/screensets/chat-copy`
**Then** the developer SHALL only need to:
1. Copy the screenset folder
2. Change ALL ID values in `ids.ts` (screenset ID + screen IDs)

**And** auto-discovery SHALL automatically:
- Import the new screenset (via glob pattern)
- Execute the registration side effect
- Make the screenset available in the UI

**And** all derived names SHALL automatically update via template literals and enums:
- Redux slice name (via `createSlice({ name: CHAT_COPY_SCREENSET_ID })`)
- RootState key (via enum `ChatCopyStateKeys.State = \`${CHAT_COPY_SCREENSET_ID}\``)
- Event namespace (via enum `ChatCopyEvents.ThreadSelected = \`${CHAT_COPY_SCREENSET_ID}/threadSelected\``)
- Icon IDs (via template literal `\`${CHAT_COPY_SCREENSET_ID}:message-square\``)
- API domain (via `const CHAT_COPY_DOMAIN = CHAT_COPY_SCREENSET_ID`)
- Translation namespaces (via template literals in config)

#### Scenario: Validation after duplication

```bash
# After 2-step duplication process
npm run type-check  # TypeScript validates all type constraints
npm run arch:check  # Architecture rules validate dependencies
npm run dev         # Test via Chrome DevTools MCP
```

**Given** a screenset duplicated using the 2-step process
**When** running validation commands
**Then** TypeScript MUST compile without errors
**And** architecture checks MUST pass
**And** the new screenset MUST be accessible via the UI
**And** NO manual fixes SHALL be required (everything auto-updates from ids.ts)

### Requirement: Automated enforcement via linting

Screenset conventions SHALL be enforced via ESLint and dependency-cruiser rules to catch violations during development.

#### Scenario: ESLint catches slice name mismatch

```typescript
// src/screensets/chat/slices/chatSlice.ts
export const CHAT_SCREENSET_ID = 'chat';

export const chatSlice = createSlice({
  name: 'chat-messages', // ❌ ESLint error: must match CHAT_SCREENSET_ID
  // ...
});

// Expected:
export const chatSlice = createSlice({
  name: CHAT_SCREENSET_ID, // ✅ Correct
  // ...
});
```

**Given** a screenset with ID `'chat'`
**When** creating a slice with mismatched name
**Then** ESLint SHALL report an error: `screenset-slice-name-matches-id`
**And** the error SHALL suggest using the screenset ID constant

#### Scenario: ESLint catches hardcoded event namespace

```typescript
// src/screensets/chat/events/chatEvents.ts
export const CHAT_SCREENSET_ID = 'chat';

export enum ChatEvents {
  ThreadSelected = 'chat/threadSelected', // ❌ ESLint error: use template literal
  // ...
}

// Expected:
export enum ChatEvents {
  ThreadSelected = `${CHAT_SCREENSET_ID}/threadSelected`, // ✅ Correct
  // ...
}
```

**Given** an event enum in a screenset
**When** using a hardcoded string instead of template literal
**Then** ESLint SHALL report an error: `screenset-event-namespace`
**And** the error SHALL suggest using template literal with screenset ID

#### Scenario: Dependency-cruiser catches cross-screenset import

```typescript
// src/screensets/chat/components/ThreadList.tsx
import { DemoComponent } from '../../demo/components/DemoComponent'; // ❌ Error

// Expected:
// Each screenset is isolated - use uicore to share functionality
```

**Given** a screenset trying to import from another screenset
**When** dependency-cruiser analyzes imports
**Then** it SHALL report an error: `no-cross-screenset-imports`
**And** the error SHALL explain vertical slice isolation principle

#### Scenario: Dependency-cruiser catches direct package import

```typescript
// src/screensets/chat/chatScreenset.tsx
import { createSlice } from '../../../packages/uicore/src/store'; // ❌ Error

// Expected:
import { createSlice } from '@hai3/uicore'; // ✅ Correct - workspace name
```

**Given** a screenset importing from packages directory
**When** dependency-cruiser analyzes imports
**Then** it SHALL report an error: `screensets-use-workspace-packages`
**And** the error SHALL suggest using the @hai3/* workspace name

#### Scenario: CI pipeline enforces conventions

```yaml
# .github/workflows/ci.yml
- name: Lint
  run: npm run lint

- name: Architecture Check
  run: npm run arch:deps
```

**Given** a pull request with screenset changes
**When** CI pipeline runs
**Then** ESLint custom rules SHALL be executed
**And** dependency-cruiser rules SHALL be executed
**And** the build SHALL fail if any error-level violations are found
**And** warnings SHALL be reported but not block the build

## MODIFIED Requirements

### Requirement: Declarative localization configuration in menu

Screensets SHALL specify screen localization paths declaratively in the menu config alongside screen loaders, with translation namespaces automatically derived from screenset and screen IDs.

#### Scenario: Demo screenset with 4 screens

```typescript
// src/screensets/demo/demoScreenset.tsx

import { type ScreensetConfig, I18nRegistry, Language } from '@hai3/uicore';

export const DEMO_SCREENSET_ID = 'demo';

const screensetTranslations = I18nRegistry.createLoader({
  [Language.English]: () => import('./i18n/en.json'),
  [Language.Spanish]: () => import('./i18n/es.json'),
  // ... all 36 languages
});

export const demoScreenset: ScreensetConfig = {
  id: DEMO_SCREENSET_ID,
  name: 'Demo',
  defaultScreen: HELLO_WORLD_SCREEN_ID,
  localization: screensetTranslations, // TranslationLoader function
  menu: [
    {
      menuItem: { id: HELLO_WORLD_SCREEN_ID, label: '...', icon: '...' },
      screen: () => import('./screens/helloworld/HelloWorldScreen'),
      // Translation namespace auto-derived: `screen.${DEMO_SCREENSET_ID}.${HELLO_WORLD_SCREEN_ID}`
    },
    // ... more screens
  ],
};
```

**Given** a screenset with 4 screens and shared content
**When** the screenset is registered with screensetRegistry
**Then** the system SHALL:
- Register screenset-level namespace as `screenset.${DEMO_SCREENSET_ID}` → `'screenset.demo'`
- Automatically derive screen namespaces as `screen.${DEMO_SCREENSET_ID}.${SCREEN_ID}` for each menu item
- Load translations using the provided TranslationLoader functions

**Changed**: Translation namespaces are now explicitly derived from screenset ID and screen IDs, making duplication automatic

#### Scenario: Chat screenset with shared models/contexts

```typescript
// src/screensets/chat/chatScreenset.tsx

import { type ScreensetConfig, I18nRegistry, Language } from '@hai3/uicore';

export const CHAT_SCREENSET_ID = 'chat';

const screensetTranslations = I18nRegistry.createLoader({
  [Language.English]: () => import('./i18n/en.json'),
  // ... all 36 languages
});

export const chatScreenset: ScreensetConfig = {
  id: CHAT_SCREENSET_ID,
  name: 'Chat',
  defaultScreen: CHAT_SCREEN_ID,
  localization: screensetTranslations,
  menu: [
    {
      menuItem: { id: CHAT_SCREEN_ID, label: '...', icon: '...' },
      screen: () => import('./screens/chat/ChatScreen'),
      // Translation namespace auto-derived: `screen.${CHAT_SCREENSET_ID}.${CHAT_SCREEN_ID}`
      // → 'screen.chat.chat'
    },
  ],
};
```

**Given** a chat screenset with shared models/contexts and one screen
**When** the screenset is registered
**Then** the system SHALL:
- Register screenset-level namespace as `'screenset.chat'`
- Automatically derive screen-level namespace as `'screen.chat.chat'`
- Keep shared and screen translations separate

**Changed**: Explicitly documented that namespace derivation uses screenset ID
