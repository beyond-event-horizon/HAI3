/**
 * API Events
 * Events related to API configuration
 */

export enum ApiEvents {
  ApiModeChanged = 'api/apiModeChanged',
}

export interface ApiModeChangedPayload {
  useMockApi: boolean;
}

/**
 * Type map: ties each ApiEvent to its payload type
 * Uses string literal types as keys (event string values)
 * Ensures type safety when emitting/subscribing to events
 */
export interface ApiEventPayloadMap {
  'api/apiModeChanged': ApiModeChangedPayload;
}
