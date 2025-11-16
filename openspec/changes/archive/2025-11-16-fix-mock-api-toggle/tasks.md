# Tasks for fix-mock-api-toggle

## Ordered Work Items

### 1. Add Global API Configuration to apiRegistry

**Goal**: Centralize API configuration management in apiRegistry

**Files**:
- `packages/uicore/src/api/apiRegistry.ts` (modified)

**Validation**:
- [x] Add `config: Readonly<ApiServicesConfig>` property with default `{ useMockApi: true }`
- [x] Add `getConfig(): Readonly<ApiServicesConfig>` method
- [x] Add `setMockMode(useMockApi: boolean): void` method
- [x] `setMockMode()` updates config object
- [x] `setMockMode()` calls `updateMockMode()` on all registered services
- [x] TypeScript compiles without errors

**Dependencies**: None

**Status**: ✅ Completed

---

### 2. Make Protocol Configs Mutable

**Goal**: Allow protocols to update configuration without recreation

**Files**:
- `packages/uicore/src/api/protocols/RestProtocol.ts` (modified)
- `packages/uicore/src/api/protocols/SseProtocol.ts` (modified)

**Validation**:
- [x] Remove `readonly` from RestProtocol config property
- [x] Remove `readonly` from SseProtocol config property
- [x] Constructor creates mutable copy: `this.config = { ...config }`
- [x] TypeScript compiles without errors

**Dependencies**: None

**Status**: ✅ Completed

---

### 3. Add updateConfig() to RestProtocol

**Goal**: Support dynamic config updates with axios client recreation

**Files**:
- `packages/uicore/src/api/protocols/RestProtocol.ts` (modified)

**Validation**:
- [x] Add `updateConfig(newConfig: Partial<RestProtocolConfig>): void` method
- [x] Method uses `Object.assign(this.config, newConfig)` to mutate config
- [x] Method calls `this.cleanup()` to clear old interceptors
- [x] Method recreates axios client with new config values
- [x] Method calls `this.setupInterceptors()` with fresh closures
- [x] Debug logging added to track config updates and interceptor behavior
- [x] TypeScript compiles without errors

**Dependencies**: Task 2

**Status**: ✅ Completed

---

### 4. Add updateConfig() to SseProtocol

**Goal**: Support dynamic config updates for SSE protocol

**Files**:
- `packages/uicore/src/api/protocols/SseProtocol.ts` (modified)

**Validation**:
- [x] Add `updateConfig(newConfig: Partial<SseProtocolConfig>): void` method
- [x] Method uses `Object.assign(this.config, newConfig)` to mutate config
- [x] No EventSource recreation needed (checked on next connect)
- [x] TypeScript compiles without errors

**Dependencies**: Task 2

**Status**: ✅ Completed

---

### 5. Add updateMockMode() to BaseApiService

**Goal**: Propagate mock mode changes to all registered protocols

**Files**:
- `packages/uicore/src/api/BaseApiService.ts` (modified)

**Validation**:
- [x] Add `updateMockMode(useMockApi: boolean): void` method
- [x] Method iterates through all registered protocols
- [x] Method uses duck typing to check for `updateConfig` method
- [x] Method calls `protocol.updateConfig({ useMockApi })` if available
- [x] TypeScript compiles without errors

**Dependencies**: Tasks 3, 4

**Status**: ✅ Completed

---

### 6. Update AccountsApiService to Read Global Config

**Goal**: Fix bug #1 - user data loading broken with mock mode ON

**Files**:
- `packages/uicore/src/api/accounts/AccountsApiService.ts` (modified)

**Validation**:
- [x] Constructor reads config from `apiRegistry.getConfig()`
- [x] Pass `useMockApi: config.useMockApi` to RestProtocol
- [x] Pass `mockDelay: config.mockDelay` to RestProtocol
- [x] Remove hardcoded mock values
- [x] TypeScript compiles without errors

**Dependencies**: Task 1

**Status**: ✅ Completed

---

### 7. Add Response Validation to userActions

**Goal**: Prevent undefined access errors when API returns invalid data

**Files**:
- `packages/uicore/src/core/actions/userActions.ts` (modified)

**Validation**:
- [x] Add null check: `if (!response || !response.user)`
- [x] Throw descriptive error: `'Invalid response: user data missing'`
- [x] Prevents undefined access crashes
- [x] TypeScript compiles without errors

**Dependencies**: None

**Status**: ✅ Completed

---

### 8. Update CLAUDE.md with Chrome MCP Native Tools Guidance

**Goal**: Document best practices for using Chrome MCP native tools

**Files**:
- `CLAUDE.md` (modified)

**Validation**:
- [x] Add CRITICAL rule #2: Use Chrome MCP native tools for EVERYTHING
- [x] List all available native tools by category (navigation, info, interaction, visual, tabs)
- [x] Add forbidden patterns (using `chrome_execute_script` for standard interactions)
- [x] Add required patterns with examples
- [x] Update "Before Making Changes" section
- [x] Documentation is clear and actionable

**Dependencies**: None

**Status**: ✅ Completed

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
- [x] No TypeScript errors
- [x] No lint errors
- [x] Architecture tests pass
- [x] Dependency rules validated

**Dependencies**: Tasks 1-7

**Status**: ✅ Completed

---

### 10. Manual Testing - Mock Mode ON Initially

**Goal**: Verify user data loads correctly with mock mode enabled

**Steps**:
1. Ensure Mock API toggle is ON
2. Navigate to User Profile screen
3. Click Refresh button
4. Observe mock data loads successfully

**Validation**:
- [x] Mock user data displayed
- [x] No console errors
- [x] New mock data on each refresh

**Dependencies**: Task 9

**Status**: ✅ Completed

---

### 11. Manual Testing - Toggle OFF Then ON

**Goal**: Verify bug #3 is fixed - toggle works multiple times

**Steps**:
1. Start with Mock API toggle ON
2. Click Refresh to verify mocks work
3. Toggle Mock API OFF
4. Click Refresh (expect error - no backend)
5. Toggle Mock API ON again
6. Click Retry button
7. Verify mock data loads (THIS WAS THE BUG)

**Validation**:
- [x] Mock data loads after toggling OFF→ON
- [x] No "Invalid response: user data missing" error
- [x] Can repeat toggle cycle multiple times
- [x] Config updates propagate correctly
- [x] Interceptors use updated config

**Dependencies**: Task 10

**Status**: ✅ Completed - Required additional fix for error state clearing

---

### 12. Fix Error State Not Clearing on Success

**Goal**: Clear error state when API call succeeds after previous failure

**Files**:
- `packages/uicore/src/app/appEffects.ts` (modified)

**Validation**:
- [x] Add `setError(null)` to UserFetched event handler
- [x] Error state clears when retry succeeds
- [x] TypeScript compiles without errors
- [x] Manual testing confirms error clears on successful retry

**Dependencies**: Task 11 (discovered during testing)

**Status**: ✅ Completed

---

### 13. Remove Debug Logging

**Goal**: Clean up console.log statements added for debugging

**Files**:
- `packages/uicore/src/api/protocols/RestProtocol.ts` (modified)

**Validation**:
- [x] Remove console.log from `updateConfig()`
- [x] Remove console.log from `get()` method
- [x] Remove console.log from request interceptor
- [x] Remove console.log from response interceptor
- [x] TypeScript compiles without errors
- [x] `npm run build:packages` succeeds

**Dependencies**: Task 12 (after testing confirms fix works)

**Status**: ✅ Completed

---

## Parallelizable Work

- Tasks 1-2 (global config + mutable configs) can run in parallel
- Tasks 6-8 (service updates + documentation) can run in parallel with tasks 3-5
- Task 9 (validation) must run after all code changes

## Estimated Effort

- Tasks 1-2: 30 minutes (config infrastructure)
- Tasks 3-5: 1-2 hours (protocol update methods + axios recreation)
- Tasks 6-7: 30 minutes (service fixes)
- Task 8: 30 minutes (documentation)
- Task 9: 15 minutes (validation)
- Tasks 10-11: 30 minutes (manual testing)
- Task 12: 15 minutes (cleanup)

**Total**: ~4-5 hours

## Success Criteria

✅ All architecture validations pass
✅ Mock API toggle works reliably in both directions (ON→OFF→ON)
✅ All services respect global mock configuration
✅ Component references preserved during config changes
✅ Axios interceptors reflect updated configuration after toggle
✅ Manual testing confirms bug #3 is fixed
✅ Error state clears on successful retry
✅ Debug logging removed

## Current Status

**Implementation**: ✅ Complete (all code changes done)
**Testing**: ✅ Fully verified via Chrome MCP testing
**Documentation**: ✅ Complete

**Key Achievements**:
1. Changed from service destruction/recreation to in-place config updates with axios client recreation, preserving component references while ensuring interceptors see new config values
2. Fixed error state persistence bug - errors now clear on successful retries

**Final Testing Results**:
- ✅ Protocol config updates correctly propagate to all services
- ✅ Axios interceptors properly reflect updated configuration
- ✅ Mock responses found and returned correctly after toggle OFF→ON
- ✅ Validation passes with correct data structure `{ user: {...} }`
- ✅ Error state clears when UserFetched event succeeds
- ✅ Complete toggle cycle works: OFF → Refresh (error) → ON → Retry (success)

**Root Cause Analysis**:
The bug had TWO separate causes that both needed fixing:

1. **Protocol Configuration Bug**: Config objects were readonly and axios interceptors captured old values in closures. Fixed by making configs mutable and recreating axios client with fresh interceptors when config changes.

2. **UI State Bug**: When `UserFetched` event succeeded, `appEffects.ts` only set the user and cleared loading state, but never cleared the error from previous failed requests. Fixed by adding `setError(null)` to the success handler.

**Files Modified**:
- `packages/uicore/src/api/apiRegistry.ts` - Global config management
- `packages/uicore/src/api/BaseApiService.ts` - Protocol config propagation
- `packages/uicore/src/api/protocols/RestProtocol.ts` - Dynamic config updates + axios recreation
- `packages/uicore/src/api/protocols/SseProtocol.ts` - Dynamic config updates
- `packages/uicore/src/api/accounts/AccountsApiService.ts` - Read global config
- `packages/uicore/src/core/actions/userActions.ts` - Response validation
- `packages/uicore/src/app/appEffects.ts` - Clear error on success
- `CLAUDE.md` - Chrome MCP tools documentation

**Status**: ✅ READY FOR ARCHIVE
