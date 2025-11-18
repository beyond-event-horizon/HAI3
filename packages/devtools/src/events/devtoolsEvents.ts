import type { Position, Size } from '../types';

/**
 * DevTools UI Event Payloads
 * These events track changes to DevTools UI state (position, size, visibility)
 */

export interface PositionChangedPayload {
  position: Position;
}

export interface SizeChangedPayload {
  size: Size;
}

export interface ButtonPositionChangedPayload {
  position: Position;
}

/**
 * DevTools Event Names
 * Namespace: devtools/
 */
export const DevToolsEvents = {
  PositionChanged: 'devtools/positionChanged',
  SizeChanged: 'devtools/sizeChanged',
  ButtonPositionChanged: 'devtools/buttonPositionChanged',
} as const;

/**
 * Module Augmentation
 * Extend EventPayloadMap from @hai3/uicore for type safety
 */
declare module '@hai3/uicore' {
  interface EventPayloadMap {
    'devtools/positionChanged': PositionChangedPayload;
    'devtools/sizeChanged': SizeChangedPayload;
    'devtools/buttonPositionChanged': ButtonPositionChangedPayload;
  }
}
