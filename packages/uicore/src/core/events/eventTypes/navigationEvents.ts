/**
 * Navigation Events
 * Events related to screen navigation
 */

export enum NavigationEvents {
  ScreenNavigated = 'uicore/navigation/screenNavigated',
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
