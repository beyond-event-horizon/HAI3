/**
 * Menu Actions - Pure functions that emit events
 * Actions cannot access store state
 * Following Flux architecture pattern (see EVENTS.md)
 */

import { eventBus } from '../events/eventBus';
import { MenuEvents } from '../events/eventTypes';

/**
 * Toggle menu collapsed state
 * Pure function that emits event - effect handles the actual toggle
 */
export const toggleMenu = (): void => {
  // Emit event for menu effect to handle the toggle (no payload for void events)
  eventBus.emit(MenuEvents.Toggled);
};
