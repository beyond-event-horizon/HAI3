/**
 * API Events
 * Events related to API configuration
 */

import { UICORE_ID } from '../../constants';

const DOMAIN_ID = 'api';

export enum ApiEvents {
  ModeChanged = `${UICORE_ID}/${DOMAIN_ID}/modeChanged`,
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
  'uicore/api/modeChanged': ApiModeChangedPayload;
}
