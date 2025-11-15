# SSE Support Design

## Architecture Overview

### Current Problems

1. **Event-Driven Violation**:
   ```typescript
   // CURRENT: Effect calls API directly
   eventBus.on(ChatEvents.MessageSent, async ({ content }) => {
     const chatApi = apiRegistry.getService(CHAT_DOMAIN);
     for await (const chunk of chatApi.createCompletionStream(request)) {
       // Process chunk
     }
   });
   ```

2. **Mocking in Service Layer**:
   ```typescript
   // CURRENT: ChatApiService has mock streaming logic
   async *createCompletionStream(request) {
     const response = await this.createCompletion(request);
     // Manual word-by-word streaming simulation
     for (let i = 0; i < words.length; i++) {
       yield chunk;
       await delay();
     }
   }
   ```

### Proposed Architecture

#### 1. Event-Driven SSE Flow (Correct Flux Pattern)

```typescript
// Action: Emit event AND interact with API
export const sendMessage = (content: string) => {
  return (dispatch: AppDispatch, getState: () => RootState): void => {
    const state = getState();
    const threadId = state.chat.currentThreadId;

    // 1. Emit event for effects to handle UI updates
    eventBus.emit(ChatEvents.MessageSent, { content });

    // 2. Action interacts with API (NOT effect!)
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

**Key Flux Principles:**
- ✅ **Actions** emit events AND interact with APIs
- ✅ **Effects** listen to events and update Redux ONLY
- ❌ **Effects NEVER** emit events (creates circular flow)
- ❌ **Effects NEVER** call APIs (that's action's job)

#### 2. SseProtocol with Direct EventSource Wrapping

SseProtocol wraps EventSource API directly - no intermediate service layer needed (YAGNI).

#### 3. Separated Configuration Architecture

```typescript
// packages/uicore/src/api/ApiServiceConfig.ts

// Base config - ONLY what's truly shared across all protocols
export interface ApiServiceConfig {
  baseURL: string;
}

// Protocol-specific configs
export interface RestProtocolConfig {
  timeout?: number;
  headers?: Record<string, string>;
  useMockApi?: boolean;
}

export interface SseProtocolConfig {
  withCredentials?: boolean;
  reconnectAttempts?: number;
  useMockApi?: boolean;
}
```

```typescript
// packages/uicore/src/api/protocols/ApiProtocol.ts

export interface ApiProtocol {
  initialize(baseConfig: ApiServiceConfig, getMockMap: () => any): void;
  cleanup(): void;
}
```

```typescript
// packages/uicore/src/api/protocols/RestProtocol.ts

export class RestProtocol implements ApiProtocol {
  private baseConfig!: ApiServiceConfig;
  private getMockMap!: () => any;

  constructor(private config: RestProtocolConfig = {}) {}

  initialize(baseConfig: ApiServiceConfig, getMockMap: () => any): void {
    this.baseConfig = baseConfig;
    this.getMockMap = getMockMap;
  }

  async get<T>(url: string): Promise<T> {
    const fullUrl = `${this.baseConfig.baseURL}${url}`;
    const timeout = this.config.timeout || 5000;

    if (this.config.useMockApi) {
      return this.getMock<T>(url);
    }

    // Real fetch with timeout
    return fetch(fullUrl, {
      headers: this.config.headers,
      signal: AbortSignal.timeout(timeout)
    }).then(res => res.json());
  }

  async post<T>(url: string, data: any): Promise<T> {
    // Similar pattern - uses baseConfig.baseURL and this.config
  }

  cleanup(): void {
    // No cleanup needed for REST
  }
}
```

```typescript
// packages/uicore/src/api/protocols/SseProtocol.ts

export class SseProtocol implements ApiProtocol {
  private baseConfig!: ApiServiceConfig;
  private getMockMap!: () => any;
  private connections: Map<string, EventSource> = new Map();

  constructor(private config: SseProtocolConfig = {}) {}

  initialize(baseConfig: ApiServiceConfig, getMockMap: () => any): void {
    this.baseConfig = baseConfig;
    this.getMockMap = getMockMap;
  }

  /**
   * Connect to SSE stream - wraps EventSource API directly
   */
  connect(
    url: string,
    onMessage: (event: MessageEvent) => void,
    onComplete?: () => void
  ): string {
    if (this.config.useMockApi) {
      return this.connectMock(url, onMessage, onComplete);
    }

    const connectionId = generateId();
    const withCredentials = this.config.withCredentials ?? true;
    const eventSource = new EventSource(`${this.baseConfig.baseURL}${url}`, {
      withCredentials
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

  /**
   * Disconnect SSE stream
   */
  disconnect(connectionId: string): void {
    const connection = this.connections.get(connectionId);
    if (connection) {
      connection.close();
      this.connections.delete(connectionId);
    }
  }

  /**
   * Mock SSE stream - simulates word-by-word streaming
   */
  private connectMock(
    url: string,
    onMessage: (event: MessageEvent) => void,
    onComplete?: () => void
  ): string {
    const mockKey = `GET ${url}`;
    const mockResponse = this.getMockMap()[mockKey];

    if (!mockResponse) {
      console.warn(`No mock found for SSE stream: ${mockKey}`);
      return '';
    }

    const connectionId = generateId();
    this.simulateStream(mockResponse, onMessage, onComplete);
    return connectionId;
  }

  private async simulateStream(
    data: any,
    onMessage: (event: MessageEvent) => void,
    onComplete?: () => void
  ): Promise<void> {
    const content = data.choices[0].message.content;
    const words = content.split(' ');

    for (let i = 0; i < words.length; i++) {
      await this.delay(50 + Math.random() * 50);

      const chunk = {
        id: data.id,
        object: 'chat.completion.chunk',
        choices: [{
          delta: { content: (i === 0 ? '' : ' ') + words[i] },
          finish_reason: i === words.length - 1 ? 'stop' : null
        }]
      };

      onMessage(new MessageEvent('message', {
        data: JSON.stringify(chunk)
      }));
    }

    if (onComplete) onComplete();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Cleanup all connections
   */
  cleanup(): void {
    this.connections.forEach(conn => conn.close());
    this.connections.clear();
  }
}
```

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
      // Store by constructor name - no instanceof checks!
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

  protected getMockMap(): any {
    return {}; // Override in derived classes
  }

  destroy(): void {
    this.protocols.forEach(p => p.cleanup());
  }
}
```

#### 4. Chat API Service with Protocol Registry

```typescript
// src/api/chat/ChatApiService.ts

export class ChatApiService extends BaseApiService {
  constructor() {
    // Inject protocol instances with their specific configs - explicit and extensible
    super(
      { baseURL: '/api/chat' },
      new RestProtocol({ timeout: 5000, useMockApi: false }),
      new SseProtocol({ withCredentials: true, useMockApi: false })
    );
  }

  /**
   * Create chat completion (REST endpoint)
   */
  async createCompletion(
    request: CreateChatCompletionRequest
  ): Promise<ChatCompletion> {
    // Type-safe protocol accessor
    return this.protocol(RestProtocol).post<ChatCompletion>('/completions', request);
  }

  /**
   * Create streaming chat completion (SSE endpoint)
   * Returns connection ID for cleanup
   */
  createCompletionStream(
    request: CreateChatCompletionRequest,
    onChunk: (chunk: ChatCompletionChunk) => void,
    onComplete?: () => void
  ): string {
    // Type-safe protocol accessor
    return this.protocol(SseProtocol).connect(
      '/completions/stream',
      (event) => {
        const chunk = JSON.parse(event.data) as ChatCompletionChunk;
        onChunk(chunk);
      },
      onComplete
    );
  }

  /**
   * Disconnect active stream
   */
  disconnectStream(connectionId: string): void {
    this.protocol(SseProtocol).disconnect(connectionId);
  }
}
```

```typescript
// Example: REST-only service
export class AccountsApiService extends BaseApiService {
  constructor() {
    super(
      { baseURL: '/api/accounts' },
      new RestProtocol({ timeout: 3000 })  // Just REST - no SSE
    );
  }

  async getCurrentUser(): Promise<User> {
    return this.protocol(RestProtocol).get<User>('/user/current');
  }
}
```

```typescript
// Future: Service with multiple protocols - BaseApiService unchanged!
export class RealTimeApiService extends BaseApiService {
  constructor() {
    super(
      { baseURL: '/api/realtime' },
      new RestProtocol({ timeout: 5000 }),
      new SseProtocol({ withCredentials: true }),
      new WebSocketProtocol({ reconnectAttempts: 3 })  // ✅ No changes to BaseApiService needed!
    );
  }

  sendWebSocketMessage(data: any): void {
    this.protocol(WebSocketProtocol).send(data);
  }
}
```

### Benefits

1. **Event-Driven**: All state changes flow through event bus (actions emit, effects update Redux)
2. **SOLID Compliant**: Protocol registry follows Open/Closed Principle
3. **No BaseApiService Modifications**: Add new protocols without changing base class
4. **Type-Safe Protocol Access**: `this.protocol(RestProtocol)` provides full type safety
5. **Separation of Concerns**: Each protocol handles its own mocking strategy
6. **Industry Standard**: Uses browser's native EventSource API
7. **Reusable**: SseService can be used by any feature needing SSE
8. **Testable**: Protocols testable in isolation, mock streams work identically to real
9. **Explicit Intent**: `this.protocol(SseProtocol).connect()` makes code clear
10. **Infinitely Extensible**: WebSocket, GraphQL, gRPC protocols can be added seamlessly

### Trade-Offs

**Pros:**
- ✅ Aligns with HAI3 architecture
- ✅ Clean separation of concerns
- ✅ Reusable SSE infrastructure
- ✅ Standard browser API

**Cons:**
- ❌ More complex event flow (but proper)
- ❌ Requires additional events for streaming lifecycle
- ❌ Need to manage connection cleanup

### Migration Path

1. Create SSE service in uicore
2. Add SSE mock support to BaseApiService
3. Refactor ChatApiService to use SSE
4. Update chat effects to use event-driven flow
5. Remove hardcoded streaming simulation
6. Add cleanup on component unmount

## Open Questions

1. **Connection pooling**: Do we need to limit concurrent SSE connections?
2. **Retry logic**: Should SseService handle automatic reconnection?
3. **Progress tracking**: Do we need built-in progress events?

## References

- [MDN EventSource API](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)
- [Server-Sent Events Spec](https://html.spec.whatwg.org/multipage/server-sent-events.html)
- HAI3 Event-Driven Architecture (project.md)
