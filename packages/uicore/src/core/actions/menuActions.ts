/**
 * Menu Actions - Async actions that emit events
 * These actions process data and emit events (NOT direct store updates)
 * Following Flux architecture pattern
 */

import { eventBus } from '../events/eventBus';
import { MenuEvents } from '../events/eventTypes';

/**
 * Toggle menu collapsed state
 * Emits event for Menu to handle
 */
export const toggleMenu = () => {
  return (): void => {
    // Emit event for menu to handle its own toggle
    eventBus.emit(MenuEvents.Toggled, {});
  };
};
