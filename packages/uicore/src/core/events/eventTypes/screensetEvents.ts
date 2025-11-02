/**
 * Screenset Events
 * Events related to screenset changes
 */

export enum ScreensetEvents {
  Changed = 'screenset/changed',
}

export interface ScreensetChangedPayload {
  screensetId: string;
}

/**
 * Type map: ties each ScreensetEvent to its payload type
 * Uses string literal types as keys (event string values)
 */
export interface ScreensetEventPayloadMap {
  'screenset/changed': ScreensetChangedPayload;
}
