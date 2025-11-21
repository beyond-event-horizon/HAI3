/**
 * Screenset Events
 * Events related to screenset changes
 */

export enum ScreensetEvents {
  Changed = 'uicore/screenset/changed',
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
