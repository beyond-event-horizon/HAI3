/**
 * Event Type Map - Unified type safety for all events
 * Combines all namespace event maps into single type
 * Provides compile-time safety: event type <-> payload mismatch caught at build time
 * 
 * EXTENSIBLE: Screensets can add their own events via module augmentation
 */

import type { ApiEventPayloadMap } from './apiEvents';
import type { UserEventPayloadMap } from './userEvents';
import type { MenuEventPayloadMap } from './menuEvents';
import type { ThemeEventPayloadMap } from './themeEvents';
import type { NavigationEventPayloadMap } from './navigationEvents';
import type { ScreensetEventPayloadMap } from './screensetEvents';

/**
 * Global event-to-payload type map
 * TypeScript ensures emit/on calls use correct payload for each event
 * 
 * Core Usage:
 * - eventBus.emit(UserEvents.UserFetched, { user }) -> Correct payload
 * - eventBus.emit(UserEvents.UserFetched, { wrong }) -> Type error
 * 
 * Screenset Extension (module augmentation):
 * ```typescript
 * // In your screenset code
 * declare module '@hai3/uicore' {
 *   interface EventPayloadMap {
 *     'myScreenset/dataLoaded': { data: MyData[] };
 *     'myScreenset/actionPerformed': { action: string };
 *   }
 * }
 * 
 * // Now type-safe in your screenset
 * eventBus.emit('myScreenset/dataLoaded', { data: [...] }); // OK
 * eventBus.emit('myScreenset/dataLoaded', { wrong: true }); // Type error
 * ```
 */
export interface EventPayloadMap extends
  ApiEventPayloadMap,
  UserEventPayloadMap,
  MenuEventPayloadMap,
  ThemeEventPayloadMap,
  NavigationEventPayloadMap,
  ScreensetEventPayloadMap {
  // Extensible - screensets add via module augmentation
}
