/**
 * Theme Events
 * Events related to theme changes
 */

export enum ThemeEvents {
  Changed = 'theme/changed',
}

export interface ThemeChangedPayload {
  themeName: string;
}

/**
 * Type map: ties each ThemeEvent to its payload type
 * Uses string literal types as keys (event string values)
 */
export interface ThemeEventPayloadMap {
  'theme/changed': ThemeChangedPayload;
}
