# Fix Mock API Toggle

## Why

The Mock API toggle had three critical bugs that prevented proper switching between mock and real API modes, violating HAI3's architecture principle that services should respect global API configuration and support dynamic mode switching without recreation.

## What Changes

Implement dynamic protocol configuration updates that preserve component references:

1. **Global API Configuration**: Add `getConfig()` and `setMockMode()` to apiRegistry for centralized configuration management
2. **Mutable Protocol Configs**: Change protocol configs from readonly to mutable copies that can be updated in-place
3. **Dynamic Config Updates**: Add `updateConfig()` methods to RestProtocol and SseProtocol that update configuration without destroying the protocol instance
4. **Axios Client Recreation**: When RestProtocol config changes, recreate the axios client with fresh interceptors to ensure they see new config values
5. **Service Config Propagation**: Add `updateMockMode()` to BaseApiService to propagate config changes to all registered protocols
6. **Preserve Component References**: Replace service destruction/recreation pattern with in-place config updates

## Capabilities

This change modifies one existing capability:

- **api-services**: Enhanced with dynamic mock mode configuration

## Impact

**Affected Components:**
- `packages/uicore/src/api/apiRegistry.ts` (global config management)
- `packages/uicore/src/api/BaseApiService.ts` (protocol config updates)
- `packages/uicore/src/api/protocols/RestProtocol.ts` (axios client recreation)
- `packages/uicore/src/api/protocols/SseProtocol.ts` (config mutation)
- `packages/uicore/src/api/accounts/AccountsApiService.ts` (read global config)
- `packages/uicore/src/core/actions/userActions.ts` (response validation)
- `CLAUDE.md` (Chrome MCP native tools guidance)

**Benefits:**
- ✅ Mock API toggle works reliably in both directions (ON→OFF→ON)
- ✅ All services respect global mock configuration
- ✅ Component references preserved during config changes
- ✅ No service recreation overhead when toggling modes
- ✅ Interceptors properly reflect updated configuration
- ✅ Improved developer guidance for Chrome MCP tools

## Dependencies

None. This fixes existing bugs in the api-services capability.

## Risks

- **Axios interceptor behavior**: Recreating axios clients may have subtle side effects if requests are in-flight during config changes
- **Memory leaks**: Must ensure old axios clients are properly cleaned up when recreated
- **Race conditions**: Config updates during active API calls could cause inconsistent behavior

## Testing Strategy

1. **Manual testing via Chrome MCP**:
   - Toggle Mock API ON → Verify user data loads from mocks
   - Toggle Mock API OFF → Verify error shown (no backend)
   - Toggle Mock API ON again → Verify user data loads from mocks (the critical bug)
   - Repeat multiple times to ensure reliability

2. **Console logging**: Added debug logs to track:
   - When `updateConfig()` is called
   - Config values before/after update
   - Mock mode state per request in interceptor
   - Whether mock responses are found

3. **Architecture validation**:
   - `npm run type-check`
   - `npm run lint`
   - `npm run arch:check`

## Alternative Approaches Considered

1. **Destroy and recreate services**: Rejected - breaks component references that hold service instances
2. **Object.assign() config mutation without axios recreation**: Tried first but didn't work - interceptor closures still captured old config object
3. **Global axios interceptor**: Rejected - violates protocol encapsulation and service isolation
4. **Proxy config object**: Rejected - adds complexity without clear benefit over recreation approach
