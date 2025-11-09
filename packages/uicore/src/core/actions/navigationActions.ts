/**
 * Navigation Actions - Async actions that emit events
 * These actions handle navigation logic and emit events
 * Following Flux architecture pattern (see EVENTS.md)
 */

import type { AppDispatch, RootState } from '../../store';
import { eventBus } from '../events/eventBus';
import { NavigationEvents, ScreensetEvents } from '../events/eventTypes';
import { routeRegistry } from '../routing/routeRegistry';

/**
 * Navigate to a screen by ID
 * Auto-switches to the screenset that contains this screen
 * Emits events for effects to handle state updates
 * 
 * @param screenId Screen ID to navigate to
 */
export const navigateToScreen = (screenId: string) => {
  return (_dispatch: AppDispatch, getState: () => RootState): void => {
    // Validate screen exists
    if (!routeRegistry.hasScreen(screenId)) {
      console.warn(`Navigation failed: Screen "${screenId}" not found in route registry`);
      return;
    }

    // Find which screenset contains this screen
    const screensetKey = routeRegistry.getScreensetKeyForScreen(screenId);
    
    if (screensetKey) {
      const currentScreenset = getState().layout.currentScreenset;
      
      // Emit screenset change event if switching screensets
      // Actions emit events, effects update slices
      if (screensetKey !== currentScreenset) {
        eventBus.emit(ScreensetEvents.Changed, { 
          screensetId: screensetKey 
        });
      }
    }

    // Emit navigation event for effects to handle
    eventBus.emit(NavigationEvents.ScreenNavigated, { 
      screenId 
    });
  };
};
