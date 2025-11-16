# Add SSE Support

## Problem

The current chat implementation violates HAI3 architectural principles:

1. **Breaks event-driven Flux pattern**: API calls are made directly from effects, bypassing the event bus
2. **Mocking logic in service layer**: ChatApiService contains streaming simulation logic instead of using BaseApiService's interceptor pattern
3. **Non-standard streaming**: Manual async generator implementation instead of industry-standard EventSource API for Server-Sent Events (SSE)

## Proposed Solution

Add native SSE support to `@hai3/uicore` using the browser's EventSource API with a pluggable protocol and plugin architecture:

### Protocol Architecture
1. **SseProtocol**: Direct EventSource API wrapper following ApiProtocol interface
2. **Protocol registry**: BaseApiService uses registry pattern (Open/Closed Principle)
3. **Event-driven integration**: SSE events flow through the event bus (actions emit, effects update Redux)
4. **Type-safe access**: `this.protocol(SseProtocol)` provides full type safety
5. **Infinitely extensible**: Future protocols (WebSocket, GraphQL) plug in without modifying BaseApiService

### Plugin Architecture (Composition over Inheritance)
1. **ApiPlugin interface**: Defines lifecycle hooks (`onRequest`, `onResponse`, `onError`, `initialize`, `destroy`)
2. **MockPlugin**: Intercepts API requests and returns mock data when mock mode is enabled
3. **Plugin chain execution**: Protocols execute plugin hooks in priority order before/after actual requests
4. **Dynamic plugin management**: Plugins can be registered/unregister ed at runtime without recreating services
5. **Separation of concerns**: Mocking logic lives in MockPlugin, not in protocol classes
6. **Short-circuiting**: Plugins can return Response directly to bypass real API calls

## Capabilities

This change introduces two new capabilities:

- **sse-streaming**: Server-Sent Events support with EventSource API
- **api-plugins**: Composable plugin architecture for API request/response interception

## Impact

**New Files:**
- `packages/uicore/src/api/protocols/ApiPlugin.ts` - Plugin interface definition
- `packages/uicore/src/api/protocols/MockPlugin.ts` - Mock data interception plugin
- `packages/uicore/src/api/protocols/SseProtocol.ts` - SSE protocol implementation
- `packages/uicore/src/api/protocols/index.ts` - Protocol/plugin exports
- `packages/uicore/src/api/ApiServiceConfig.ts` - Service configuration types

**Modified Files:**
- `packages/uicore/src/api/BaseApiService.ts` - Added plugin registry and management
- `packages/uicore/src/api/protocols/ApiProtocol.ts` - Added getPlugins callback to initialize()
- `packages/uicore/src/api/protocols/RestProtocol.ts` - Removed embedded mocking, added plugin chain execution
- `packages/uicore/src/api/apiRegistry.ts` - Plugin management via setMockMode()
- `packages/uicore/src/app/appEffects.ts` - Removed premature setMockMode call
- `packages/uicore/src/index.ts` - Export plugins and protocols
- `packages/uicore/src/api/accounts/AccountsApiService.ts` - Updated constructor
- `src/api/chat/ChatApiService.ts` - Added SSE support, updated constructor

**Benefits:**
- ✅ Restores event-driven Flux architecture
- ✅ Separates concerns via composition (MockPlugin vs protocols)
- ✅ Uses industry-standard EventSource API for SSE
- ✅ Reusable plugin architecture for any protocol
- ✅ Dynamic plugin registration without service recreation
- ✅ Type-safe plugin access and execution
- ✅ Eliminates stale service references during mock mode changes
- ✅ Open/Closed Principle: extensible without modification

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
