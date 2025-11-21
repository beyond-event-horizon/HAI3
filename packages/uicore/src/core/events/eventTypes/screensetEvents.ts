/**
 * Screenset Events
 * Events related to screenset changes
 */

import { UICORE_ID } from '../../constants';

const DOMAIN_ID = 'screenset';

export enum ScreensetEvents {
  Changed = `${UICORE_ID}/${DOMAIN_ID}/changed`,
}

export interface ScreensetChangedPayload {
  screensetId: string;
}

/**
 * Type map: ties each ScreensetEvent to its payload type
 * Uses string literal types as keys (event string values)
 */
export interface ScreensetEventPayloadMap {
  'uicore/screenset/changed': ScreensetChangedPayload;
}
