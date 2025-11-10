/**
 * Navigation Actions - Pure functions that emit events
 * Actions cannot access store state - move checks to effects
 * Following Flux architecture pattern (see EVENTS.md)
 */

import { eventBus } from '../events/eventBus';
import { NavigationEvents, ScreensetEvents } from '../events/eventTypes';
import { routeRegistry } from '../routing/routeRegistry';

/**
 * Navigate to a screen by ID
 * Auto-switches to the screenset that contains this screen
 * Emits events for effects to handle state updates
 * Actions are pure functions - effects check if screenset changed
 * 
 * @param screenId Screen ID to navigate to
 */
export const navigateToScreen = (screenId: string): void => {
  // Validate screen exists
  if (!routeRegistry.hasScreen(screenId)) {
    console.warn(`Navigation failed: Screen "${screenId}" not found in route registry`);
    return;
  }

  // Find which screenset contains this screen
  const screensetKey = routeRegistry.getScreensetKeyForScreen(screenId);
  
  if (screensetKey) {
    // Emit screenset change event - effect will check if it actually changed
    // Actions are pure functions and cannot access store state
    eventBus.emit(ScreensetEvents.Changed, { 
      screensetId: screensetKey 
    });
  }

  // Emit navigation event for effects to handle
  eventBus.emit(NavigationEvents.ScreenNavigated, { 
    screenId 
  });
};
