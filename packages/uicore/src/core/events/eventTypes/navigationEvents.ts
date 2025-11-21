/**
 * Navigation Events
 * Events related to screen navigation
 */

import { UICORE_ID } from '../../constants';

const DOMAIN_ID = 'navigation';

export enum NavigationEvents {
  ScreenNavigated = `${UICORE_ID}/${DOMAIN_ID}/screenNavigated`,
}

export interface NavigateToScreenPayload {
  screenId: string;
}

/**
 * Type map: ties each NavigationEvent to its payload type
 * Uses string literal types as keys (event string values)
 */
export interface NavigationEventPayloadMap {
  'uicore/navigation/screenNavigated': NavigateToScreenPayload;
}
