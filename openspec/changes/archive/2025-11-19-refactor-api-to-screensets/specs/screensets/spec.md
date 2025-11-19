## ADDED Requirements

### Requirement: Screenset-owned API services

Screensets SHALL own and manage their API services within their screenset directory structure, enabling complete vertical slice isolation.

#### Scenario: Chat screenset with dedicated API service

```typescript
// src/screensets/chat/api/ChatApiService.ts
import { BaseApiService, RestProtocol, SseProtocol, apiRegistry } from '@hai3/uicore';

export const CHAT_DOMAIN = 'chat' as const;

export class ChatApiService extends BaseApiService {
  constructor() {
    super(
      { baseURL: '/api/chat' },
      new RestProtocol({ timeout: 30000 }),
      new SseProtocol({ withCredentials: true })
    );
  }

  protected getMockMap(): MockMap {
    return apiRegistry.getMockMap(CHAT_DOMAIN);
  }

  async createThread(request: CreateThreadRequest): Promise<CreateThreadResponse> {
    return this.protocol(RestProtocol).post('/threads', request);
  }
}

// Self-register
apiRegistry.register(CHAT_DOMAIN, ChatApiService);

// Type augmentation
declare module '@hai3/uicore' {
  interface ApiServicesMap {
    [CHAT_DOMAIN]: ChatApiService;
  }
}
```

**Given** a chat screenset requiring thread management API
**When** the screenset is developed
**Then** the system SHALL:
- Store API service in `src/screensets/chat/api/ChatApiService.ts`
- Store TypeScript types in `src/screensets/chat/api/api.ts`
- Store mock data in `src/screensets/chat/api/mocks.ts`
- Self-register the service using `apiRegistry.register()`
- Augment `ApiServicesMap` for type safety

#### Scenario: Multiple screensets needing similar API functionality

```
src/screensets/
├── chat/
│   └── api/
│       ├── ChatApiService.ts    # Full implementation
│       ├── api.ts                # Types
│       └── mocks.ts              # Mock data
└── chat-copy/
    └── api/
        ├── ChatApiService.ts    # Duplicate implementation (intentional)
        ├── api.ts                # Duplicate types (intentional)
        └── mocks.ts              # Duplicate mocks (intentional)
```

**Given** two screensets (`chat` and `chat-copy`) requiring similar API functionality
**When** developers need API services for each screenset
**Then** the system SHALL:
- Allow intentional duplication of API service code
- Enable each screenset to evolve its API independently
- Maintain separate API service files in each screenset's `api/` directory
- Allow modifications to one screenset's API without affecting the other

#### Scenario: Screenset imports API service for self-registration

```typescript
// src/screensets/chat/chatScreenset.tsx
import './api/ChatApiService';  // Triggers self-registration via module import
import './slices/chatSlice';

export const chatScreenset: ScreensetConfig = {
  id: CHAT_SCREENSET_ID,
  name: 'Chat',
  // ... rest of config
};

screensetRegistry.register(chatScreenset);
```

**Given** a screenset with API services
**When** the screenset root file is imported
**Then** the system SHALL:
- Import the API service file to trigger self-registration
- Register the service with `apiRegistry` before screenset config is processed
- Make the service available via `apiRegistry.getService(DOMAIN)`

### Requirement: API service directory structure

Screensets SHALL organize API-related code in a dedicated `api/` subdirectory with consistent file naming.

#### Scenario: Standard API directory structure

```
src/screensets/<screenset>/
├── api/
│   ├── <Service>ApiService.ts    # Service class + self-registration
│   ├── api.ts                     # TypeScript types and interfaces
│   └── mocks.ts                   # Mock data for development/testing
├── actions/
├── events/
├── screens/
├── slices/
└── <screenset>Screenset.tsx
```

**Given** a screenset requiring API communication
**When** organizing the screenset's file structure
**Then** the system SHALL:
- Create an `api/` subdirectory within the screenset directory
- Place service implementation in `<Service>ApiService.ts`
- Place TypeScript types in `api.ts`
- Place mock data in `mocks.ts`
- Follow consistent naming pattern across all screensets

### Requirement: API service usage in actions

Screenset actions SHALL access API services through `apiRegistry.getService()` and import types from local `api/` directory.

#### Scenario: Chat action calling API service

```typescript
// src/screensets/chat/actions/chatActions.ts
import { eventBus, apiRegistry, type AppDispatch } from '@hai3/uicore';
import { ChatEvents } from '../events/chatEvents';
import { CHAT_DOMAIN } from '../api/ChatApiService';
import { ChatRole } from '../api/api'; // Local import

export const createThread = (isTemporary: boolean, title: string) => {
  return (_dispatch: AppDispatch): void => {
    const chatApi = apiRegistry.getService(CHAT_DOMAIN);

    chatApi.createThread({ title, isTemporary })
      .then((thread) => {
        eventBus.emit(ChatEvents.ThreadCreated, { thread });
      })
      .catch((error) => {
        console.error('Failed to create thread:', error);
      });
  };
};
```

**Given** a screenset action needing to call an API
**When** implementing the action
**Then** the system SHALL:
- Import domain constant from local `../api/<Service>ApiService`
- Import types from local `../api/api`
- Retrieve service via `apiRegistry.getService(DOMAIN)`
- Call service methods with proper typing
- Emit events based on API responses

### Requirement: Screenset duplication includes API services

When duplicating a screenset, the duplication process SHALL include the screenset's API services directory and update all related imports and domain constants.

#### Scenario: Duplicating chat screenset to chat-copy

```bash
# Using duplicate-screenset command
/duplicate-screenset chat chat-copy
```

**Given** a source screenset `chat` with API services in `api/` directory
**When** duplicating to create `chat-copy` screenset
**Then** the system SHALL:
- Copy entire `api/` directory from `src/screensets/chat/api/` to `src/screensets/chat-copy/api/`
- Update domain constant (e.g., `CHAT_DOMAIN` → `CHAT_COPY_DOMAIN`)
- Update `ApiServicesMap` augmentation to use new domain constant
- Update `apiRegistry.register()` call to use new domain constant
- Update action files to import from new screenset's `api/` directory
- Preserve all API service methods, types, and mocks

#### Scenario: DUPLICATE_SCREENSET workflow execution

**Given** the `.ai/workflows/DUPLICATE_SCREENSET.md` workflow
**When** executing screenset duplication
**Then** the workflow SHALL:
- Include `api/` directory in the list of directories to copy
- Update API service file references in the checklist
- Verify domain constant uniqueness
- Ensure API service self-registration uses new domain

### Requirement: No centralized API directory

The application SHALL NOT maintain a centralized `src/api/` directory for API services.

#### Scenario: Attempting to create centralized API service

**Given** a developer attempting to create an API service
**When** they try to create `src/api/services/newdomain/`
**Then** the architecture validation SHALL:
- Fail with guidance to create service in screenset `api/` directory
- Prevent merging code that violates screenset ownership
- Direct developers to `SCREENSETS.md` guidelines

#### Scenario: Migration from centralized to screenset-owned

**Given** a legacy centralized API service in `src/api/services/chat/`
**When** migrating to screenset-owned pattern
**Then** the system SHALL:
- Copy service files to `src/screensets/chat/api/`
- Update all imports to reference local `api/` directory
- Delete centralized `src/api/` directory
- Verify no remaining imports from `@/api/services/`

## MODIFIED Requirements

### Requirement: Screenset directory structure

Screensets SHALL follow a standard directory structure including API services, actions, events, screens, slices, and translations.

#### Scenario: Complete screenset structure

```
src/screensets/<screenset>/
├── api/                           # NEW - API services (self-contained)
│   ├── <Service>ApiService.ts    # Service class + self-registration
│   ├── api.ts                     # TypeScript types/interfaces
│   └── mocks.ts                   # Mock data
├── actions/
│   └── <screenset>Actions.ts
├── events/
│   └── <screenset>Events.ts
├── i18n/                          # Screenset-level translations
│   ├── en.json
│   ├── es.json
│   └── ... (36 languages)
├── screens/
│   ├── screenIds.ts
│   └── <screen>/
│       ├── <Screen>.tsx
│       └── i18n/                  # Screen-level translations
│           └── ... (36 languages)
├── slices/
│   └── <screenset>Slice.ts
├── effects/
│   └── <screenset>Effects.ts
├── uikit/                         # Optional screenset-specific components
│   └── components/
└── <screenset>Screenset.tsx       # Config + registrations
```

**Given** a new or existing screenset
**When** organizing the screenset files
**Then** the system SHALL:
- Include `api/` directory for screenset-owned API services
- Maintain all other standard directories (actions, events, screens, slices, i18n)
- Import API service in screenset root for self-registration
- Follow consistent structure across all screensets
