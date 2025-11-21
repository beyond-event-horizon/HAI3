/**
 * Theme Events
 * Events related to theme changes
 */

import { UICORE_ID } from '../../constants';

const DOMAIN_ID = 'theme';

export enum ThemeEvents {
  Changed = `${UICORE_ID}/${DOMAIN_ID}/changed`,
}

export interface ThemeChangedPayload {
  themeName: string;
}

/**
 * Type map: ties each ThemeEvent to its payload type
 * Uses string literal types as keys (event string values)
 */
export interface ThemeEventPayloadMap {
  'uicore/theme/changed': ThemeChangedPayload;
}
