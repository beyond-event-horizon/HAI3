# sse-streaming Specification

## Purpose

Provide Server-Sent Events (SSE) streaming capability in `@hai3/uicore` using the browser's EventSource API, aligned with HAI3's event-driven Flux architecture.

## ADDED Requirements

### Requirement: SseProtocol with Direct EventSource Wrapping

The system SHALL provide an SseProtocol class that directly wraps the browser's EventSource API (no intermediate service layer - YAGNI principle).

#### Scenario: SseProtocol wraps EventSource directly

```typescript
// packages/uicore/src/api/protocols/SseProtocol.ts

export class SseProtocol implements ApiProtocol {
  private connections: Map<string, EventSource> = new Map();

  connect(
    url: string,
    onMessage: (event: MessageEvent) => void,
    onComplete?: () => void
  ): string {
    const connectionId = generateId();
    const eventSource = new EventSource(`${this.config.baseURL}${url}`, {
      withCredentials: true
    });

    eventSource.onmessage = onMessage;
    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      this.disconnect(connectionId);
    };

    this.connections.set(connectionId, eventSource);
    return connectionId;
  }

  cleanup(): void {
    this.connections.forEach(conn => conn.close());
    this.connections.clear();
  }
}
```

**Given** SseProtocol is initialized
**When** `connect()` is called with URL and callbacks
**Then** the system SHALL:
- Create EventSource instance directly (no SseService)
- Store EventSource in connection map
- Return connection ID
- Close all connections on cleanup

### Requirement: Protocol Registry (Open/Closed Principle)

The BaseApiService SHALL use a protocol registry pattern that allows new protocols to be added without modifying the base class.

#### Scenario: Initialize service with protocol registry

```typescript
// packages/uicore/src/api/BaseApiService.ts

export abstract class BaseApiService {
  private protocols: Map<string, ApiProtocol> = new Map();

  constructor(
    protected config: ApiServiceConfig,
    ...protocols: ApiProtocol[]
  ) {
    protocols.forEach(protocol => {
      protocol.initialize(this.config, () => this.getMockMap());
      // Store by constructor name - no instanceof checks
      this.protocols.set(protocol.constructor.name, protocol);
    });
  }

  /**
   * Type-safe protocol accessor
   * Open/Closed Principle: No modification needed for new protocols
   */
  protected protocol<T extends ApiProtocol>(type: new (...args: any[]) => T): T {
    const name = type.name;
    const protocol = this.protocols.get(name);
    if (!protocol) {
      throw new Error(`Protocol ${name} not registered`);
    }
    return protocol as T;
  }

  destroy(): void {
    this.protocols.forEach(p => p.cleanup());
  }
}
```

```typescript
// Usage
export class ChatApiService extends BaseApiService {
  constructor() {
    super(
      { baseURL: '/api/chat' },
      new RestProtocol({ timeout: 5000, useMockApi: false }),
      new SseProtocol({ withCredentials: true, useMockApi: false })
    );
  }

  createCompletion(request: ChatCompletionRequest): Promise<ChatCompletion> {
    // Type-safe protocol accessor
    return this.protocol(RestProtocol).post('/completions', request);
  }

  createCompletionStream(request, onChunk): string {
    return this.protocol(SseProtocol).connect('/completions/stream', ...);
  }
}
```

**Given** a derived service extends BaseApiService
**When** constructor calls `super({ baseURL }, new RestProtocol({ timeout }), new SseProtocol({ withCredentials }))`
**Then** the system SHALL:
- Initialize each protocol instance with base config and mock map getter
- Each protocol retains its own specific configuration (timeout, withCredentials, etc.)
- Store protocols in Map by constructor name
- Make protocols accessible via `this.protocol(ProtocolClass)` method
- Return correctly typed protocol from `protocol()` method
- Throw error if requested protocol is not registered

**AND** when adding a new protocol (e.g., WebSocketProtocol)
**Then** the system SHALL NOT require modifications to BaseApiService

#### Scenario: Connect to SSE endpoint in real mode

```typescript
// packages/uicore/src/api/protocols/SseProtocol.ts

export class SseProtocol implements ApiProtocol {
  private connections: Map<string, EventSource> = new Map();

  connect(
    url: string,
    onMessage: (event: MessageEvent) => void,
    onComplete?: () => void
  ): string {
    if (this.config.useMockApi) {
      return this.connectMock(url, onMessage, onComplete);
    }

    const connectionId = generateId();
    const eventSource = new EventSource(`${this.config.baseURL}${url}`, {
      withCredentials: true
    });

    eventSource.onmessage = onMessage;
    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      this.disconnect(connectionId);
    };

    eventSource.addEventListener('done', () => {
      if (onComplete) onComplete();
      this.disconnect(connectionId);
    });

    this.connections.set(connectionId, eventSource);
    return connectionId;
  }

  disconnect(connectionId: string): void {
    const connection = this.connections.get(connectionId);
    if (connection) {
      connection.close();
      this.connections.delete(connectionId);
    }
  }
}
```

**Given** SseProtocol with `useMockApi: false`
**When** a service calls `this.protocol(SseProtocol).connect(url, onMessage, onComplete)`
**Then** the system SHALL:
- Create new EventSource instance directly (no intermediate service)
- Connect to `baseURL + url` with credentials
- Assign onmessage handler
- Listen for 'done' event for completion
- Handle errors by disconnecting
- Store EventSource in connection map
- Return the connection ID

#### Scenario: Use SSE protocol in mock mode

```typescript
// Mock map in app
const chatMockMap = {
  'GET /completions/stream': {
    id: 'chatcmpl-mock-123',
    object: 'chat.completion',
    choices: [{
      message: {
        role: 'assistant',
        content: 'This is a mock response that will be streamed word by word'
      }
    }]
  }
};

apiRegistry.registerMocks(CHAT_DOMAIN, chatMockMap);
```

**Given** SseProtocol with `useMockApi: true` and registered mock data
**When** a service calls `this.protocol(SseProtocol).connect(url, onMessage, onComplete)`
**Then** the system SHALL:
- Look up mock data using `GET ${url}` key from getMockMap()
- Simulate streaming by:
  - Splitting content into words
  - Delaying 50-100ms between words
  - Calling `onMessage` for each word chunk with ChatCompletionChunk format
  - Calling `onComplete` when done
- Match real SSE event format (MessageEvent with JSON data)
- No EventSource created in mock mode (pure simulation)

### Requirement: Event-Driven SSE Integration

SSE streams SHALL integrate with the event bus following Flux architecture where actions interact with APIs and effects only update Redux.

#### Scenario: Chat completion streaming flow

```typescript
// src/screensets/drafts/chat/actions/chatActions.ts

// Action: Emit event AND interact with API
export const sendMessage = (content: string) => {
  return (dispatch: AppDispatch, getState: () => RootState): void => {
    const state = getState();
    const threadId = state.chat.currentThreadId;

    // 1. Emit event for effects to handle
    eventBus.emit(ChatEvents.MessageSent, { content });

    // 2. Action interacts with API
    const chatApi = apiRegistry.getService(CHAT_DOMAIN);
    const messageId = `msg-${Date.now()}`;

    // Emit streaming started
    eventBus.emit(ChatEvents.StreamingStarted, { messageId });

    // Start SSE stream - callbacks emit events
    chatApi.createCompletionStream(
      { model: state.chat.currentModel, messages: buildMessages(threadId, content) },
      (chunk) => {
        // API callback emits event for each chunk
        eventBus.emit(ChatEvents.StreamingContentUpdated, {
          messageId,
          content: chunk.choices[0].delta.content
        });

        if (chunk.choices[0].finish_reason === 'stop') {
          eventBus.emit(ChatEvents.StreamingCompleted, { messageId });
        }
      }
    );
  };
};

// src/screensets/drafts/chat/effects/chatEffects.ts

// Effect 1: Listen to MessageSent - Update Redux ONLY
eventBus.on(ChatEvents.MessageSent, ({ content }) => {
  const state = store.getState();
  const threadId = state.chat.currentThreadId;

  // Add user message
  dispatch(addMessage({
    id: `msg-${Date.now()}`,
    threadId,
    type: 'user',
    content,
    timestamp: new Date()
  }));

  // Clear input
  dispatch(setInputValue(''));

  // Update thread preview
  dispatch(updateThread({ threadId, updates: { preview: content } }));
});

// Effect 2: Listen to StreamingStarted - Update Redux ONLY
eventBus.on(ChatEvents.StreamingStarted, ({ messageId }) => {
  const state = store.getState();

  // Create empty assistant message
  dispatch(addMessage({
    id: messageId,
    threadId: state.chat.currentThreadId,
    type: 'assistant',
    content: '',
    timestamp: new Date()
  }));

  dispatch(setIsStreaming(true));
});

// Effect 3: Listen to StreamingContentUpdated - Update Redux ONLY
eventBus.on(ChatEvents.StreamingContentUpdated, ({ messageId, content }) => {
  dispatch(updateMessage({ messageId, updates: { content } }));
});

// Effect 4: Listen to StreamingCompleted - Update Redux ONLY
eventBus.on(ChatEvents.StreamingCompleted, () => {
  dispatch(setIsStreaming(false));
});
```

**Given** a user sends a chat message
**When** the action executes
**Then** the system SHALL:
1. Action emits `MessageSent` event
2. Effect 1 adds user message, clears input, updates thread preview in Redux
3. Action emits `StreamingStarted` event
4. Effect 2 creates empty assistant message in Redux
5. Action starts SSE stream via API service
6. API callback emits `StreamingContentUpdated` for each chunk
7. Effect 3 updates message content in Redux
8. API callback emits `StreamingCompleted` when done
9. Effect 4 sets streaming flag to false in Redux

**AND** effects SHALL NEVER emit events or call APIs (Flux violation)
**AND** actions SHALL emit events AND interact with APIs

### Requirement: Type-Safe SSE Events

SSE-related events SHALL be type-safe via EventPayloadMap module augmentation.

#### Scenario: Chat events module augmentation

```typescript
// src/screensets/drafts/chat/events/chatEvents.ts

export enum ChatEvents {
  MessageSent = 'chat/messageSent',
  StreamingStarted = 'chat/streamingStarted',
  StreamingContentUpdated = 'chat/streamingContentUpdated',
  StreamingCompleted = 'chat/streamingCompleted',
}

declare module '@hai3/uicore' {
  interface EventPayloadMap {
    'chat/messageSent': { content: string };
    'chat/streamingStarted': {
      messageId: string;
    };
    'chat/streamingContentUpdated': {
      messageId: string;
      content: string;
    };
    'chat/streamingCompleted': {
      messageId: string;
    };
  }
}
```

**Given** chat events that include SSE streaming
**When** events are emitted or subscribed to
**Then** TypeScript SHALL:
- Require correct payload types
- Provide autocomplete for payload properties
- Error on missing or incorrect payload fields

### Requirement: Connection Cleanup

SSE connections SHALL be properly cleaned up to prevent memory leaks.

#### Scenario: Cleanup on component unmount

```typescript
// src/screensets/drafts/chat/screens/chat/ChatScreen.tsx

useEffect(() => {
  return () => {
    // Cleanup active streams on unmount
    const connectionId = getStreamingConnectionId();
    if (connectionId) {
      const chatApi = apiRegistry.getService(CHAT_DOMAIN);
      chatApi.disconnectStream(connectionId);
    }
  };
}, []);
```

**Given** an active SSE stream when component unmounts
**When** the cleanup function executes
**Then** the system SHALL:
- Get the active connection ID from state
- Call `disconnectStream` on the API service
- Prevent memory leaks from unclosed EventSource

## MODIFIED Requirements

None. This is a new capability.

## REMOVED Requirements

None. This adds new functionality without removing existing features.
