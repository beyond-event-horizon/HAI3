# Add SSE Support

## Problem

The current chat implementation violates HAI3 architectural principles:

1. **Breaks event-driven Flux pattern**: API calls are made directly from effects, bypassing the event bus
2. **Mocking logic in service layer**: ChatApiService contains streaming simulation logic instead of using BaseApiService's interceptor pattern
3. **Non-standard streaming**: Manual async generator implementation instead of industry-standard EventSource API for Server-Sent Events (SSE)

## Proposed Solution

Add native SSE support to `@hai3/uicore` using the browser's EventSource API with a pluggable protocol architecture:

1. **SseProtocol**: Direct EventSource API wrapper following ApiProtocol interface
2. **Protocol registry**: BaseApiService uses registry pattern (Open/Closed Principle)
3. **Event-driven integration**: SSE events flow through the event bus (actions emit, effects update Redux)
4. **Proper mock separation**: Each protocol handles its own mocking strategy
5. **Type-safe access**: `this.protocol(SseProtocol)` provides full type safety
6. **Infinitely extensible**: Future protocols (WebSocket, GraphQL) plug in without modifying BaseApiService

## Capabilities

This change introduces one new capability:

- **sse-streaming**: Server-Sent Events support with EventSource API

## Impact

**Affected Components:**
- `packages/uicore/src/sse/` (new)
- `packages/uicore/src/api/BaseApiService.ts` (modified for SSE mock support)
- `src/api/chat/ChatApiService.ts` (refactored to use SSE)
- `src/screensets/drafts/chat/effects/chatEffects.ts` (refactored for proper event flow)

**Benefits:**
- ✅ Restores event-driven Flux architecture
- ✅ Separates concerns (service logic vs mocking)
- ✅ Uses industry-standard EventSource API
- ✅ Reusable for any SSE-based feature
- ✅ Proper error handling and reconnection logic
- ✅ Type-safe event payloads

## Dependencies

None. This is a new capability that doesn't depend on other pending changes.

## Risks

- **Browser compatibility**: EventSource is widely supported but check polyfill needs for older browsers
- **Memory leaks**: Must ensure proper cleanup of EventSource connections
- **Error handling**: Need robust handling of connection failures and timeouts

## Testing Strategy

1. **Unit tests**: SSE service connection lifecycle
2. **Integration tests**: Event bus integration
3. **Manual testing**: Chat completion streaming in browser
4. **Mock API validation**: Verify mocking works correctly

## Alternative Approaches Considered

1. **Keep current async generator approach**: Rejected - not standard, mixed concerns
2. **Use fetch with ReadableStream**: Rejected - EventSource is simpler for SSE
3. **Third-party SSE library**: Rejected - browser native API is sufficient
