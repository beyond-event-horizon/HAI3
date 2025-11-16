# api-services Specification

## Purpose

Provide domain-based API service management with support for multiple protocols (REST, SSE) and dynamic mock/real mode switching following HAI3's protocol registry pattern.

## ADDED Requirements

None. This is the initial spec for the api-services capability.

## MODIFIED Requirements

### Requirement: Dynamic Mock Mode Configuration

The API registry SHALL support dynamic switching between mock and real API modes without destroying service instances or breaking component references.

#### Scenario: Global API configuration management

```typescript
// packages/uicore/src/api/apiRegistry.ts

export interface ApiServicesConfig {
  useMockApi: boolean;
  mockDelay?: number;
}

class ApiRegistry {
  private config: Readonly<ApiServicesConfig> = { useMockApi: true };

  /**
   * Get current global API configuration
   * Used by services/protocols to read useMockApi, mockDelay, etc.
   */
  getConfig(): Readonly<ApiServicesConfig> {
    return this.config;
  }

  /**
   * Set mock mode dynamically without recreating services
   * Updates config on all existing service instances
   */
  setMockMode(useMockApi: boolean): void {
    // Update config
    this.config = { ...this.config, useMockApi };

    // Update mock mode on all existing services (preserves component references)
    this.services.forEach((service) => {
      service.updateMockMode(useMockApi);
    });
  }
}
```

**Given** apiRegistry is initialized with services
**When** `setMockMode(false)` is called
**Then** the system SHALL:
- Update the global config object
- Call `updateMockMode(false)` on every registered service
- NOT destroy or recreate any service instances
- Preserve all component references to services

**AND** when services are constructed
**Then** they SHALL read initial config from `apiRegistry.getConfig()`

#### Scenario: Service-level config propagation

```typescript
// packages/uicore/src/api/BaseApiService.ts

export abstract class BaseApiService {
  private readonly protocols: Map<string, ApiProtocol> = new Map();

  /**
   * Update mock mode for all protocols
   * Allows dynamic config changes without recreating services
   */
  updateMockMode(useMockApi: boolean): void {
    this.protocols.forEach((protocol) => {
      // Check if protocol has updateConfig method (duck typing)
      if ('updateConfig' in protocol && typeof protocol.updateConfig === 'function') {
        (protocol as any).updateConfig({ useMockApi });
      }
    });
  }
}
```

**Given** a service has multiple protocols registered
**When** `updateMockMode(useMockApi)` is called
**Then** the system SHALL:
- Iterate through all registered protocols
- Check for `updateConfig` method using duck typing
- Call `updateConfig({ useMockApi })` on protocols that support it
- Skip protocols that don't implement `updateConfig`

#### Scenario: RestProtocol dynamic config update with axios recreation

```typescript
// packages/uicore/src/api/protocols/RestProtocol.ts

export class RestProtocol extends ApiProtocol {
  private config: RestProtocolConfig;
  private client!: AxiosInstance;

  constructor(config: Readonly<RestProtocolConfig> = {}) {
    super();
    // Store mutable copy of config for dynamic updates
    this.config = { ...config };
  }

  /**
   * Update protocol configuration dynamically
   * Recreates axios client with fresh interceptors
   */
  updateConfig(newConfig: Partial<RestProtocolConfig>): void {
    // Update config
    Object.assign(this.config, newConfig);

    // Recreate axios client with fresh interceptors
    // This ensures interceptors see the new config values
    this.cleanup();
    this.client = axios.create({
      baseURL: this.baseConfig.baseURL,
      timeout: this.config.timeout ?? 30000,
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
      },
    });
    this.setupInterceptors();
  }
}
```

**Given** RestProtocol is initialized with mock mode ON
**When** `updateConfig({ useMockApi: false })` is called
**Then** the system SHALL:
- Mutate the existing config object using `Object.assign`
- Call `cleanup()` to clear existing axios interceptors
- Create a new axios client instance with updated config
- Call `setupInterceptors()` to register fresh interceptors
- New interceptors SHALL see the updated config values via closure

**AND** when `updateConfig({ useMockApi: true })` is called again
**Then** the system SHALL repeat the recreation process
**AND** the axios client SHALL properly use mock responses via interceptors

**Why axios recreation is required**: Axios interceptors capture config values via closure when created. Mutating the config object alone doesn't update the closure-captured values. Recreating the client with fresh interceptors ensures they capture the new config values.

#### Scenario: SseProtocol dynamic config update

```typescript
// packages/uicore/src/api/protocols/SseProtocol.ts

export class SseProtocol extends ApiProtocol {
  private config: SseProtocolConfig;

  constructor(config: Readonly<SseProtocolConfig> = {}) {
    super();
    // Store mutable copy of config for dynamic updates
    this.config = { ...config };
  }

  /**
   * Update protocol configuration dynamically
   */
  updateConfig(newConfig: Partial<SseProtocolConfig>): void {
    // Mutate existing object instead of creating new one
    // This ensures any references see the updated values
    Object.assign(this.config, newConfig);
  }
}
```

**Given** SseProtocol is initialized
**When** `updateConfig({ useMockApi })` is called
**Then** the system SHALL:
- Mutate the existing config object using `Object.assign`
- NOT recreate EventSource instances (checked on next connect)
- Next `connect()` call SHALL use the updated config

#### Scenario: Services read global config at construction

```typescript
// packages/uicore/src/api/accounts/AccountsApiService.ts

export class AccountsApiService extends BaseApiService {
  constructor() {
    const config = apiRegistry.getConfig();
    super(
      { baseURL: '/api/accounts' },
      new RestProtocol({
        timeout: 30000,
        useMockApi: config.useMockApi,
        mockDelay: config.mockDelay,
      })
    );
  }
}
```

**Given** apiRegistry has global config `{ useMockApi: true, mockDelay: 500 }`
**When** AccountsApiService is constructed
**Then** the system SHALL:
- Read config from `apiRegistry.getConfig()`
- Pass `useMockApi` and `mockDelay` to RestProtocol constructor
- NOT hardcode mock mode values
- Respect the global configuration

#### Scenario: Toggle mock mode multiple times

```typescript
// User flow in browser
// 1. Mock mode ON initially - user data loads from mocks ✓
// 2. Toggle mock mode OFF - user data shows error (no backend) ✓
// 3. Toggle mock mode ON again - user data loads from mocks ✓ (BUG FIXED)
```

**Given** Mock API toggle is initially ON and user data loads successfully
**When** user toggles Mock API OFF
**Then** the system SHALL:
- Update `apiRegistry.config.useMockApi = false`
- Call `updateMockMode(false)` on all services
- RestProtocol SHALL recreate axios client with `useMockApi: false`
- Next API call SHALL attempt real backend request
- Show error if backend unavailable

**AND** when user toggles Mock API ON again
**Then** the system SHALL:
- Update `apiRegistry.config.useMockApi = true`
- Call `updateMockMode(true)` on all services
- RestProtocol SHALL recreate axios client with `useMockApi: true`
- Next API call SHALL use mock interceptor
- Mock response SHALL be returned successfully

**AND** this toggle sequence SHALL work reliably any number of times
**AND** component references to services SHALL remain valid throughout

### Requirement: Response Validation

API actions SHALL validate service responses before accessing nested properties to prevent undefined access errors.

#### Scenario: Validate user data response

```typescript
// packages/uicore/src/core/actions/userActions.ts

accountsService.getCurrentUser()
  .then(response => {
    // Validate response structure
    if (!response || !response.user) {
      throw new Error('Invalid response: user data missing');
    }

    eventBus.emit(UserEvents.UserFetched, {
      user: response.user,
    });

    if (response.user.language) {
      changeLanguage(response.user.language);
    }
  })
```

**Given** an API call to get current user
**When** the response is received
**Then** the system SHALL:
- Check if response exists and is not null
- Check if response.user exists before accessing properties
- Throw descriptive error if validation fails
- Prevent undefined access crashes
- Emit event only if response is valid

## REMOVED Requirements

None. This change adds capabilities without removing existing functionality.

## Non-Functional Requirements

### Performance
- Config updates SHALL complete in < 10ms
- Axios client recreation SHALL not block the UI thread
- Service references SHALL remain valid (no broken references)

### Memory
- Old axios clients SHALL be properly cleaned up (no memory leaks)
- Interceptors SHALL be cleared before client recreation

### Reliability
- Toggle sequence SHALL work reliably 100+ times without degradation
- No race conditions during config updates
- API calls in-flight during config change behavior is undefined (edge case)

### Developer Experience
- TypeScript SHALL provide type safety for config objects
- Console logging during development helps debug config updates
- Clear error messages when validation fails
