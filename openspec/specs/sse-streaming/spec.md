# sse-streaming Specification

## Purpose

This specification defines Server-Sent Events (SSE) streaming support for real-time communication in the HAI3 framework. SSE enables server-to-client streaming for use cases like AI chat completions, progress updates, and live data feeds. The implementation follows SOLID principles with plugin-based composition for mocking, protocol registry pattern for extensibility, and event-driven Flux architecture for state management.

## Requirements

### Requirement: SseProtocol with Direct EventSource Wrapping

The system SHALL provide an SseProtocol class that directly wraps the browser's EventSource API (no intermediate service layer - YAGNI principle) and integrates with the plugin system for mock mode support.

#### Scenario: SseProtocol configuration and lifecycle

```typescript
// packages/uicore/src/api/protocols/SseProtocol.ts

export interface SseProtocolConfig {
  withCredentials?: boolean;
  reconnectAttempts?: number;
}

export class SseProtocol extends ApiProtocol {
  private baseConfig!: Readonly<ApiServiceConfig>;
  private connections: Map<string, EventSource | 'mock'> = new Map();
  private readonly config: SseProtocolConfig;
  private getPlugins!: () => ReadonlyArray<ApiPlugin>;

  constructor(config: Readonly<SseProtocolConfig> = {}) {
    super();
    this.config = assign({}, config);
  }

  initialize(
    baseConfig: Readonly<ApiServiceConfig>,
    _getMockMap: () => Readonly<MockMap>,
    getPlugins: () => ReadonlyArray<ApiPlugin>
  ): void {
    this.baseConfig = baseConfig;
    this.getPlugins = getPlugins;
  }

  cleanup(): void {
    // Close all active connections (skip 'mock' entries)
    this.connections.forEach((conn) => {
      if (conn !== 'mock') {
        conn.close();
      }
    });
    this.connections.clear();
  }
}
```

**Given** SseProtocol is constructed with optional config
**When** `initialize()` is called with baseConfig, mockMap accessor, and plugin accessor
**Then** the system SHALL:
- Store base config (contains baseURL)
- Store plugin accessor function for runtime plugin queries
- Store protocol-specific config (withCredentials, reconnectAttempts)

**AND** when `cleanup()` is called
**Then** the system SHALL:
- Close all EventSource connections (skip 'mock' string entries)
- Clear the connections map

#### Scenario: Real SSE connection with plugin check

```typescript
// packages/uicore/src/api/protocols/SseProtocol.ts

connect(
  url: string,
  onMessage: (event: MessageEvent) => void,
  onComplete?: () => void
): string {
  const connectionId = this.generateId();

  // Check if MockPlugin should intercept this SSE connection
  const mockPlugin = this.getPlugins().find((p) => p instanceof MockPlugin) as MockPlugin | undefined;

  if (mockPlugin) {
    // Simulate SSE streaming with mock data
    this.simulateMockStream(connectionId, url, onMessage, onComplete);
    return connectionId;
  }

  // Real SSE connection
  const withCredentials = this.config.withCredentials ?? true;
  const fullUrl = `${this.baseConfig.baseURL}${url}`;

  const eventSource = new EventSource(fullUrl, {
    withCredentials,
  });

  eventSource.onmessage = onMessage;

  eventSource.onerror = (error) => {
    console.error('SSE error:', error);
    this.disconnect(connectionId);
  };

  // Listen for completion signal
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
    // Only close if it's a real EventSource (not 'mock')
    if (connection !== 'mock') {
      connection.close();
    }
    this.connections.delete(connectionId);
  }
}
```

**Given** SseProtocol is initialized
**When** `connect()` is called with URL and callbacks
**Then** the system SHALL:
1. Generate unique connection ID
2. Query plugins via `getPlugins()` to find MockPlugin
3. If MockPlugin exists, delegate to `simulateMockStream()` and return connection ID
4. Otherwise, create EventSource instance with full URL (`baseURL + url`)
5. Use `withCredentials` from protocol config (defaults to true)
6. Assign onmessage handler
7. Set error handler to disconnect on error
8. Listen for custom 'done' event for completion signal
9. Store EventSource in connections map
10. Return connection ID

**AND** when `disconnect()` is called
**Then** the system SHALL:
- Retrieve connection by ID
- Close EventSource only if not 'mock' string
- Remove from connections map

### Requirement: Plugin-Based Mock Mode

SSE protocol SHALL use MockPlugin composition (not embedded mock logic) to simulate streaming when mock mode is enabled.

#### Scenario: Mock SSE streaming via MockPlugin

```typescript
// packages/uicore/src/api/protocols/SseProtocol.ts

private async simulateMockStream(
  connectionId: string,
  url: string,
  onMessage: (event: MessageEvent) => void,
  onComplete?: () => void
): Promise<void> {
  // Mark as mock connection
  this.connections.set(connectionId, 'mock');

  // Get mock plugin to access mock data
  const mockPlugin = this.getPlugins().find((p) => p instanceof MockPlugin) as MockPlugin;

  // Create a RequestConfig to get mock response
  const mockResponse = await mockPlugin.onRequest({
    url,
    method: 'GET',
  });

  // If no mock or passthrough, skip
  if (!(mockResponse instanceof Response)) {
    if (onComplete) onComplete();
    return;
  }

  // Parse the mock completion response
  const mockData = await mockResponse.json() as { choices: Array<{ message: { content: string } }> };
  const content = mockData.choices[0]?.message?.content || '';

  // Split content into words for streaming simulation
  const words = content.split(' ');

  // Stream word by word with delays
  for (let i = 0; i < words.length; i++) {
    // Check if connection was disconnected
    if (!this.connections.has(connectionId)) {
      return;
    }

    // Create SSE-style chunk
    const chunk = {
      id: `chatcmpl-mock-${Date.now()}-${i}`,
      object: 'chat.completion.chunk',
      created: Math.floor(Date.now() / 1000),
      model: 'gpt-3.5-turbo',
      choices: [
        {
          index: 0,
          delta: {
            content: words[i] + (i < words.length - 1 ? ' ' : ''),
          },
          finish_reason: i === words.length - 1 ? 'stop' : null,
        },
      ],
    };

    // Create MessageEvent
    const event = new MessageEvent('message', {
      data: JSON.stringify(chunk),
    });

    onMessage(event);

    // Add delay between chunks (50ms per word)
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  // Stream complete
  if (onComplete) onComplete();
  this.disconnect(connectionId);
}
```

**Given** MockPlugin is registered with service and SSE connect() is called
**When** `simulateMockStream()` executes
**Then** the system SHALL:
1. Store 'mock' string in connections map (not EventSource)
2. Query MockPlugin via `getPlugins()`
3. Call MockPlugin.onRequest() with GET request config
4. Parse Response as JSON to get mock completion data
5. Extract content from `choices[0].message.content`
6. Split content into words
7. For each word:
   - Check if connection still exists (early exit if disconnected)
   - Create ChatCompletionChunk format with delta.content
   - Set finish_reason to 'stop' on last word, null otherwise
   - Wrap in MessageEvent with JSON stringified data
   - Call onMessage callback
   - Delay 50ms before next word
8. Call onComplete callback after all words
9. Disconnect connection ID

**AND** the mock SHALL NOT create real EventSource instances

### Requirement: Protocol Registry with Plugin Support

BaseApiService SHALL use protocol registry pattern with plugin lifecycle management following Open/Closed Principle.

#### Scenario: Initialize service with protocols and plugins

```typescript
// packages/uicore/src/api/BaseApiService.ts

export abstract class BaseApiService {
  private readonly protocols: Map<string, ApiProtocol> = new Map();
  private readonly plugins: Map<new (...args: never[]) => ApiPlugin, ApiPlugin> = new Map();

  constructor(
    protected readonly config: Readonly<ApiServiceConfig>,
    ...protocols: ApiProtocol[]
  ) {
    // Initialize and register each protocol
    protocols.forEach((protocol) => {
      protocol.initialize(
        this.config,
        () => this.getMockMap(),
        () => this.getPluginsInOrder()
      );
      // Store by constructor name - no instanceof checks (Open/Closed compliance)
      this.protocols.set(protocol.constructor.name, protocol);
    });
  }

  protected protocol<T extends ApiProtocol>(type: new (...args: never[]) => T): T {
    const name = type.name;
    const protocol = this.protocols.get(name);
    if (!protocol) {
      throw new Error(`Protocol ${name} not registered`);
    }
    return protocol as T;
  }

  registerPlugin(plugin: ApiPlugin): void {
    const constructor = plugin.constructor as new (...args: never[]) => ApiPlugin;
    this.plugins.set(constructor, plugin);
    this.sortPlugins();
    plugin.initialize?.();
  }

  protected getPluginsInOrder(): ApiPlugin[] {
    return Array.from(this.plugins.values());
  }

  destroy(): void {
    this.protocols.forEach((p) => p.cleanup());
    this.protocols.clear();
    this.plugins.forEach((p) => p.destroy());
    this.plugins.clear();
  }
}
```

**Given** a derived service extends BaseApiService
**When** constructor calls `super({ baseURL }, new RestProtocol({ timeout }), new SseProtocol({ withCredentials }))`
**Then** the system SHALL:
- Initialize each protocol with: baseConfig, getMockMap accessor, getPluginsInOrder accessor
- Pass plugin accessor (NOT just mock map) to protocols for runtime queries
- Store protocols in Map by constructor name
- Make protocols accessible via type-safe `protocol()` method
- Throw error if requested protocol not registered

**AND** when `registerPlugin()` is called
**Then** the system SHALL:
- Store plugin by constructor (type-safe key)
- Sort plugins by priority
- Call plugin.initialize()

**AND** when `destroy()` is called
**Then** the system SHALL:
- Cleanup all protocols
- Destroy all plugins
- Clear both maps

#### Scenario: ChatApiService with dual protocols

```typescript
// src/api/services/chat/ChatApiService.ts

export class ChatApiService extends BaseApiService {
  constructor() {
    super(
      { baseURL: '/api/chat' },
      new RestProtocol({
        timeout: 30000,
      }),
      new SseProtocol({
        withCredentials: true,
      })
    );
  }

  protected getMockMap(): MockMap {
    return apiRegistry.getMockMap(CHAT_DOMAIN);
  }

  async createCompletion(request: CreateChatCompletionRequest): Promise<CreateChatCompletionResponse> {
    return this.protocol(RestProtocol).post<CreateChatCompletionResponse, CreateChatCompletionRequest>(
      '/completions',
      request
    );
  }

  createCompletionStream(
    _request: CreateChatCompletionRequest,
    onChunk: (chunk: ChatCompletionChunk) => void,
    onComplete?: () => void
  ): string {
    return this.protocol(SseProtocol).connect(
      '/completions/stream',
      (event: MessageEvent) => {
        try {
          const chunk = JSON.parse(event.data) as ChatCompletionChunk;
          onChunk(chunk);
        } catch (error) {
          console.error('Failed to parse SSE chunk:', error);
        }
      },
      onComplete
    );
  }

  disconnectStream(connectionId: string): void {
    this.protocol(SseProtocol).disconnect(connectionId);
  }
}
```

**Given** ChatApiService is instantiated
**When** the constructor executes
**Then** the system SHALL:
- Pass baseURL config to BaseApiService
- Register RestProtocol with 30s timeout
- Register SseProtocol with withCredentials: true
- Both protocols receive getMockMap accessor
- Both protocols receive getPluginsInOrder accessor

**AND** when `createCompletionStream()` is called
**Then** the system SHALL:
- Access SseProtocol via type-safe protocol() method
- Call connect() with URL and callbacks
- Parse MessageEvent.data as JSON to ChatCompletionChunk
- Pass parsed chunk to onChunk callback
- Handle JSON parse errors gracefully
- Return connection ID for cleanup

### Requirement: Event-Driven SSE Integration with API-First Message Creation

SSE streams SHALL integrate with the event bus following Flux architecture where actions create messages via API calls first, then start streams, while effects only update Redux.

#### Scenario: Send message with API-created assistant message before streaming

```typescript
// src/screensets/drafts/chat/actions/chatActions.ts

export const sendMessage = (
  content: string,
  threadId: string,
  model: string,
  conversationMessages: Array<{ role: ChatRole; content: string }>,
  isTemporary: boolean
) => {
  return (_dispatch: AppDispatch): void => {
    const chatApi = apiRegistry.getService(CHAT_DOMAIN);

    // Create user message via API
    chatApi.createMessage({
      threadId,
      type: 'user',
      content: content.trim(),
    })
      .then((userMessage) => {
        // Emit event with API-created message
        eventBus.emit(ChatEvents.MessageCreated, { message: userMessage });
        eventBus.emit(ChatEvents.MessageSent, { content });

        // Create empty assistant message via API before streaming
        return chatApi.createMessage({
          threadId,
          type: 'assistant',
          content: '',
        });
      })
      .then((assistantMessage) => {
        // Emit MessageCreated event with API-created message
        eventBus.emit(ChatEvents.MessageCreated, { message: assistantMessage });

        // Signal streaming started
        eventBus.emit(ChatEvents.StreamingStarted, { messageId: assistantMessage.id });

        // Build messages array for completion (conversation history + new user message)
        const messages = [
          ...conversationMessages,
          {
            role: ChatRole.User,
            content: content.trim(),
          },
        ];

        // Start SSE stream
        chatApi.createCompletionStream(
          {
            model,
            messages,
            stream: true,
          },
          (chunk) => {
            const delta = chunk.choices?.[0]?.delta;
            if (delta?.content) {
              eventBus.emit(ChatEvents.StreamingContentUpdated, {
                messageId: assistantMessage.id,
                content: delta.content,
              });
            }

            if (chunk.choices?.[0]?.finish_reason === 'stop') {
              eventBus.emit(ChatEvents.StreamingCompleted, { messageId: assistantMessage.id });
            }
          },
          () => {
            eventBus.emit(ChatEvents.StreamingCompleted, { messageId: assistantMessage.id });
          }
        );
      })
      .catch((error) => {
        console.error('Failed to send message:', error);
      });
  };
};
```

```typescript
// src/screensets/drafts/chat/effects/chatEffects.ts

// Effect 1: Listen to MessageCreated - Update Redux ONLY
eventBus.on(ChatEvents.MessageCreated, ({ message }) => {
  // Effect ONLY updates Redux - message object comes from action/API
  dispatch(addMessage(message));
});

// Effect 2: Listen to MessageSent - Update Redux ONLY
eventBus.on(ChatEvents.MessageSent, ({ content }) => {
  const state = store.getState() as RootState;
  const currentThreadId = state.chat.currentThreadId;

  // Clear input
  dispatch(setInputValue(''));

  // Update thread preview with the new message
  dispatch(updateThread({
    threadId: currentThreadId,
    updates: {
      preview: content.trim().substring(0, 100),
      timestamp: new Date().toISOString(),
    }
  }));
});

// Effect 3: Listen to StreamingStarted - Update Redux ONLY
eventBus.on(ChatEvents.StreamingStarted, ({ messageId: _messageId }) => {
  // Effect ONLY sets streaming flag - message is created via API and MessageCreated event
  dispatch(setIsStreaming(true));
});

// Effect 4: Listen to StreamingContentUpdated - Update Redux ONLY
eventBus.on(ChatEvents.StreamingContentUpdated, ({ messageId, content }) => {
  // Append new content to existing message
  const state = store.getState() as RootState;
  const message = state.chat.messages.find(m => m.id === messageId);

  if (message) {
    const newContent = message.content + content;
    dispatch(updateMessage({ messageId, updates: { content: newContent } }));
  }
});

// Effect 5: Listen to StreamingCompleted - Update Redux ONLY
eventBus.on(ChatEvents.StreamingCompleted, ({ messageId: _messageId }) => {
  dispatch(setIsStreaming(false));
});
```

**Given** a user sends a chat message in an existing thread
**When** the sendMessage action executes
**Then** the system SHALL:
1. Call API to create user message (not effect)
2. Emit `MessageCreated` event with API response
3. Emit `MessageSent` event with content
4. Call API to create empty assistant message (not effect)
5. Emit `MessageCreated` event with API response
6. Emit `StreamingStarted` event with assistant message ID
7. Start SSE stream via `createCompletionStream()`
8. For each chunk callback:
   - Extract delta.content if present
   - Emit `StreamingContentUpdated` event
   - Check finish_reason for 'stop' and emit `StreamingCompleted`
9. Emit `StreamingCompleted` in onComplete callback

**AND** effects SHALL:
- `MessageCreated`: Add API-created message to Redux
- `MessageSent`: Clear input, update thread preview in Redux
- `StreamingStarted`: Set isStreaming flag in Redux
- `StreamingContentUpdated`: Append content to message in Redux
- `StreamingCompleted`: Clear isStreaming flag in Redux

**AND** effects SHALL NEVER:
- Emit events (Flux violation)
- Call APIs directly (Flux violation)
- Create messages (action/API responsibility)

### Requirement: Type-Safe SSE Events

SSE-related events SHALL be type-safe via EventPayloadMap module augmentation.

#### Scenario: Chat events module augmentation

```typescript
// src/screensets/drafts/chat/events/chatEvents.ts

export enum ChatEvents {
  MessageSent = 'chat/messageSent',
  MessageCreated = 'chat/messageCreated',
  StreamingStarted = 'chat/streamingStarted',
  StreamingContentUpdated = 'chat/streamingContentUpdated',
  StreamingCompleted = 'chat/streamingCompleted',
}

declare module '@hai3/uicore' {
  interface EventPayloadMap {
    'chat/messageSent': { content: string };
    'chat/messageCreated': { message: Message };
    'chat/streamingStarted': { messageId: string };
    'chat/streamingContentUpdated': { messageId: string; content: string };
    'chat/streamingCompleted': { messageId: string };
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

SSE connections SHALL be properly cleaned up to prevent memory leaks during service destruction.

#### Scenario: Service destroy cleanup

```typescript
// packages/uicore/src/api/BaseApiService.ts

destroy(): void {
  // Cleanup protocols (Map.forEach is acceptable for Map iteration)
  this.protocols.forEach((p) => p.cleanup());
  this.protocols.clear();

  // Cleanup plugins (Map.forEach is acceptable for Map iteration)
  this.plugins.forEach((p) => p.destroy());
  this.plugins.clear();
}
```

**Given** BaseApiService with active SSE connections
**When** `destroy()` is called
**Then** the system SHALL:
- Call cleanup() on all protocols (closes EventSource connections)
- Clear protocols map
- Call destroy() on all plugins
- Clear plugins map
- Prevent memory leaks from unclosed connections
