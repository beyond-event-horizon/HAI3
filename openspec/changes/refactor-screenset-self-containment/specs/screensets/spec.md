## ADDED Requirements

### Requirement: Redux slice name convention

Screensets SHALL use the screenset ID as the Redux slice name to enable self-containment.

#### Scenario: Chat screenset slice name matches ID

```typescript
// src/screensets/chat/slices/chatSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { CHAT_SCREENSET_ID } from '../chatScreenset';

export const chatSlice = createSlice({
  name: CHAT_SCREENSET_ID, // 'chat' - matches screenset ID exactly
  initialState: { /* ... */ },
  reducers: { /* ... */ },
});
```

**Given** a screenset with ID `'chat'`
**When** creating the Redux slice
**Then** the slice name MUST be `'chat'` (matching the screenset ID exactly)

#### Scenario: Enforced validation in registerSlice

```typescript
// packages/uicore/src/store/registerSlice.ts
export function registerSlice<K extends string>(
  key: K,
  reducer: Reducer,
  initEffects?: () => void
): void {
  const sliceName = (reducer as any).name;

  if (sliceName !== key) {
    throw new Error(
      `Slice name "${sliceName}" must match state key "${key}". ` +
      `Required for screenset self-containment.`
    );
  }

  // ... register slice
}
```

**Given** a screenset attempting to register a slice
**When** `registerSlice('chat', chatReducer)` is called
**Then** the system SHALL throw an error if `chatReducer.name !== 'chat'`

#### Scenario: RootState augmentation matches slice name

```typescript
// src/screensets/chat/chatStore.ts
import { ChatState } from './slices/chatSlice';

declare module '@hai3/uicore' {
  interface RootState {
    chat: ChatState; // Key 'chat' matches CHAT_SCREENSET_ID
  }
}

// Registration enforces the match
registerSlice('chat', chatReducer, initChatEffects);
```

**Given** a screenset with ID `'chat'`
**When** augmenting the RootState interface
**Then** the state key MUST be `'chat'` (matching both screenset ID and slice name)

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

Duplicating a screenset SHALL require only copying the folder and updating the screenset ID and screen IDs, with all other naming and registration automatically handled.

#### Scenario: 3-step duplication process

```bash
# Step 1: Copy folder
cp -r src/screensets/chat src/screensets/chat-copy

# Step 2: Update screenset ID constant
# src/screensets/chat-copy/chatCopyScreenset.tsx
export const CHAT_COPY_SCREENSET_ID = 'chat-copy'; // Changed from 'chat'

# Step 3: Update screen IDs
# src/screensets/chat-copy/screens/screenIds.ts
export const CHAT_COPY_SCREEN_ID = 'chat-copy-screen'; // Changed from 'chat-screen'

# That's it! Auto-discovery handles the rest.
```

**Given** an existing screenset at `src/screensets/chat`
**When** duplicating to create `src/screensets/chat-copy`
**Then** the developer SHALL only need to:
1. Copy the screenset folder
2. Change the `SCREENSET_ID` constant
3. Change screen ID constants in `screens/screenIds.ts`

**And** auto-discovery SHALL automatically:
- Import the new screenset (via glob pattern)
- Execute the registration side effect
- Make the screenset available in the UI

**And** all derived names SHALL automatically update:
- Redux slice name (via `createSlice({ name: SCREENSET_ID })`)
- RootState key (via `registerSlice(SCREENSET_ID, ...)`)
- Event namespace (via template literal `${SCREENSET_ID}/...`)
- Icon IDs (via template literal `${SCREENSET_ID}:...`)
- API domain (via `const DOMAIN = SCREENSET_ID`)
- Translation namespace (already auto-derived)

#### Scenario: Validation after duplication

```bash
# After 4-step duplication process
npm run type-check  # TypeScript validates all type constraints
npm run arch:check  # Architecture rules validate dependencies
npm run dev         # Test via Chrome DevTools MCP
```

**Given** a screenset duplicated using the 4-step process
**When** running validation commands
**Then** TypeScript MUST compile without errors
**And** architecture checks MUST pass
**And** the new screenset MUST be accessible via the UI

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
