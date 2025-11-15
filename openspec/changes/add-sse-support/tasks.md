# Tasks for add-sse-support

## Ordered Work Items

### 1. Create Protocol Interface and RestProtocol

**Goal**: Extract REST logic into protocol implementation

**Files**:
- `packages/uicore/src/api/protocols/ApiProtocol.ts` (new)
- `packages/uicore/src/api/protocols/RestProtocol.ts` (new)
- `packages/uicore/src/api/protocols/index.ts` (new)

**Validation**:
- [ ] `ApiProtocol` interface defines `initialize()` and `cleanup()`
- [ ] `RestProtocol` implements `ApiProtocol`
- [ ] `RestProtocol` has `get()`, `post()`, `put()`, `delete()` methods
- [ ] REST mock interceptor logic moved from BaseApiService to RestProtocol
- [ ] TypeScript compiles without errors

**Dependencies**: None

---

### 2. Create SseProtocol with Direct EventSource Wrapping

**Goal**: Implement SseProtocol that wraps EventSource API directly (no intermediate service - YAGNI)

**Files**:
- `packages/uicore/src/api/protocols/SseProtocol.ts` (new)

**Validation**:
- [ ] `SseProtocol` implements `ApiProtocol`
- [ ] `connect()` creates EventSource directly (no SseService)
- [ ] `disconnect()` closes EventSource and removes from connection map
- [ ] `connectMock()` simulates streaming with delays
- [ ] Mock mode matches real SSE event format (MessageEvent with JSON)
- [ ] `cleanup()` closes all EventSource connections
- [ ] Connection map stores `Map<string, EventSource>`
- [ ] TypeScript compiles without errors

**Dependencies**: Task 1

---

### 3. Refactor BaseApiService to Use Protocol Registry (Open/Closed)

**Goal**: Implement protocol registry pattern following Open/Closed Principle

**Files**:
- `packages/uicore/src/api/BaseApiService.ts` (modified)
- `packages/uicore/src/index.ts` (modified - export protocols)

**Validation**:
- [ ] BaseApiService constructor accepts `...protocols: ApiProtocol[]` (varargs)
- [ ] Protocols stored in `Map<string, ApiProtocol>` by constructor name
- [ ] No `instanceof` checks in BaseApiService (Open/Closed compliance)
- [ ] `protocol<T>(type: new (...args: any[]) => T): T` method added
- [ ] Protocol accessor returns correctly typed protocol
- [ ] Throws error if requested protocol not registered
- [ ] `destroy()` method calls `cleanup()` on all protocols via `forEach`
- [ ] REST methods removed from BaseApiService (now accessed via `this.protocol(RestProtocol)`)
- [ ] Existing services (AccountsApiService) updated to:
  - Pass `new RestProtocol()` to super constructor
  - Use `this.protocol(RestProtocol).get()`, `this.protocol(RestProtocol).post()`, etc.
- [ ] Protocols exported from uicore: `import { RestProtocol, SseProtocol, ApiProtocol } from '@hai3/uicore'`
- [ ] Adding new protocol (e.g., WebSocketProtocol) requires ZERO changes to BaseApiService
- [ ] Build succeeds (`npm run build:packages`)
- [ ] TypeScript compiles without errors

**Dependencies**: Tasks 1, 2

---

### 4. Add SSE Events to ChatEvents

**Goal**: Define streaming lifecycle events with type-safe payloads

**Files**:
- `src/screensets/drafts/chat/events/chatEvents.ts` (modified)

**Validation**:
- [ ] `StreamingStarted` event added to enum with `{ messageId: string }` payload
- [ ] `StreamingContentUpdated` event payload includes `{ messageId: string; content: string }`
- [ ] `StreamingCompleted` event payload includes `{ messageId: string }` (optional, for future cleanup)
- [ ] Event payloads registered in EventPayloadMap
- [ ] TypeScript enforces payload types
- [ ] No type errors

**Dependencies**: None (can be done in parallel with tasks 1-3)

---

### 5. Refactor ChatApiService to Use Protocol Registry

**Goal**: Update ChatApiService to use protocol registry accessor

**Files**:
- `src/api/chat/ChatApiService.ts` (modified)

**Validation**:
- [ ] Constructor passes `new RestProtocol(), new SseProtocol()` to super
- [ ] `createCompletion()` uses `this.protocol(RestProtocol).post()` for non-streaming
- [ ] Remove async generator `createCompletionStream` if exists
- [ ] Add `createCompletionStream()` using `this.protocol(SseProtocol).connect()`
- [ ] Add `disconnectStream()` method using `this.protocol(SseProtocol).disconnect()`
- [ ] TypeScript correctly infers protocol types from `this.protocol()` calls
- [ ] TypeScript compiles without errors
- [ ] Mock API still works (both REST and SSE mocks)

**Dependencies**: Tasks 3, 4

---

### 6. Refactor Chat Actions and Effects for Proper Flux Pattern

**Goal**: Move API interaction to actions, effects only update Redux

**Files**:
- `src/screensets/drafts/chat/actions/chatActions.ts` (modified - add API call)
- `src/screensets/drafts/chat/effects/chatEffects.ts` (modified - remove API calls)

**Validation**:
- [ ] Action `sendMessage()` emits `MessageSent` event
- [ ] Action `sendMessage()` calls ChatApiService to start SSE stream
- [ ] Action `sendMessage()` emits `StreamingStarted` event
- [ ] API callbacks emit `StreamingContentUpdated` for each chunk
- [ ] API callbacks emit `StreamingCompleted` when done
- [ ] Effect 1: `MessageSent` → add user message, clear input, update thread
- [ ] Effect 2: `StreamingStarted` → add empty assistant message, set streaming flag
- [ ] Effect 3: `StreamingContentUpdated` → update message content
- [ ] Effect 4: `StreamingCompleted` → set streaming flag to false
- [ ] Effects NEVER emit events (Flux violation)
- [ ] Effects NEVER call APIs (Flux violation)
- [ ] TypeScript compiles without errors

**Dependencies**: Tasks 4, 5

---

### 7. Add Connection Cleanup to ChatScreen

**Goal**: Prevent memory leaks by cleaning up SSE on unmount

**Files**:
- `src/screensets/drafts/chat/screens/chat/ChatScreen.tsx` (modified)

**Validation**:
- [ ] useEffect cleanup disconnects active stream
- [ ] No console warnings about unclosed connections
- [ ] No memory leaks when navigating away

**Dependencies**: Task 6

---

### 8. Remove Hardcoded Mock Streaming

**Goal**: Delete old simulation code from ChatApiService

**Files**:
- `src/api/chat/ChatApiService.ts` (modified)

**Validation**:
- [ ] No async generator streaming code remains
- [ ] No word-splitting simulation in service
- [ ] All mocking handled by SseProtocol
- [ ] TypeScript compiles without errors

**Dependencies**: Task 7

---

### 9. Run Architecture Validation

**Goal**: Ensure changes follow HAI3 architecture rules

**Commands**:
```bash
npm run type-check
npm run lint
npm run arch:check
npm run arch:deps
```

**Validation**:
- [ ] No TypeScript errors
- [ ] No lint errors
- [ ] Architecture tests pass
- [ ] Dependency rules validated

**Dependencies**: Task 8

---

### 10. Manual Testing - Real Streaming

**Goal**: Verify SSE works end-to-end in browser

**Steps**:
1. Start dev server: `npm run dev`
2. Navigate to `/chat`
3. Send a test message
4. Observe streaming response

**Validation**:
- [ ] Message streams word-by-word
- [ ] No console errors
- [ ] Streaming completes successfully
- [ ] Connection is cleaned up
- [ ] Can send multiple messages

**Dependencies**: Task 9

---

### 11. Manual Testing - Mock API

**Goal**: Verify mock streaming works identically to real

**Steps**:
1. Ensure Mock API toggle is ON
2. Navigate to `/chat`
3. Send a test message
4. Observe mock streaming response

**Validation**:
- [ ] Mock response streams word-by-word
- [ ] Timing matches expected delays (50-100ms)
- [ ] Format matches real SSE chunks
- [ ] No console errors
- [ ] Connection cleanup works

**Dependencies**: Task 10

---

## Parallelizable Work

- Tasks 1-2 (Protocol architecture) can run in parallel with Task 4 (chat events)
- Task 3 (BaseApiService refactor) depends on 1-2
- Task 9 (validation) can overlap with Task 10-11 (manual testing)

## Estimated Effort

- Tasks 1-2: 3-4 hours (Protocol architecture - no separate SSE service)
- Task 3: 1-2 hours (BaseApiService refactor + existing service updates)
- Tasks 4-6: 2-3 hours (Chat refactoring)
- Tasks 7-8: 30 minutes (Cleanup)
- Tasks 9-11: 1 hour (Validation and testing)

**Total**: ~8-11 hours

## Success Criteria

✅ All architecture validations pass
✅ Protocol registry pattern following Open/Closed Principle
✅ SseProtocol wraps EventSource API directly (no intermediate service - YAGNI)
✅ Chat streaming works in both real and mock modes
✅ No memory leaks or unclosed connections
✅ Event-driven Flux pattern enforced (actions call APIs, effects update Redux only)
✅ Each protocol handles its own mocking strategy
✅ BaseApiService extensible for future protocols (WebSocket, GraphQL) without modification
