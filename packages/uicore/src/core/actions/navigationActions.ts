/**
 * Navigation Actions - Async actions that emit events
 * These actions handle navigation logic and emit events
 * Following Flux architecture pattern (see EVENTS.md)
 */

import { eventBus } from '../events/eventBus';
import { NavigationEvents } from '../events/eventTypes';
import { routeRegistry } from '../routing/routeRegistry';

/**
 * Navigate to a screen by ID
 * Auto-switches to the screenset that contains this screen
 * Emits event for effects to handle state updates
 * 
 * @param screenId Screen ID to navigate to
 */
export const navigateToScreen = (screenId: string): void => {
  // Validate screen exists
  if (!routeRegistry.hasScreen(screenId)) {
    console.warn(`Navigation failed: Screen "${screenId}" not found in route registry`);
    return;
  }

  // Emit navigation event for effects to handle
  eventBus.emit(NavigationEvents.ScreenNavigated, { 
    screenId 
  });
};
