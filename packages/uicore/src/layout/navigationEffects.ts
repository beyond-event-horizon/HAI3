/**
 * Navigation Effects - Side effects for navigation events
 * Subscribes to navigation events and updates layout slice
 * Implements Flux pattern: Event -> Effect -> Slice Update
 * 
 * Pattern: 1 slice = 1 effects file (co-located with layout)
 */

import type { Store } from '@reduxjs/toolkit';
import { eventBus } from '../core/events/eventBus';
import { 
  NavigationEvents,
  ScreensetEvents
} from '../core/events/eventTypes';
import { setSelectedScreen, setCurrentScreenset } from './layoutSlice';
import { routeService } from '../core/routing/routeService';

/**
 * Initialize navigation effects
 * Call this once during app setup
 */
export function initNavigationEffects(store: Store): void {
  // When screen navigation happens, update Redux state
  eventBus.on(NavigationEvents.ScreenNavigated, ({ screenId }) => {
    // Find which screenset contains this screen
    const screensetKey = routeService.getScreensetKeyForScreen(screenId);
    
    if (screensetKey) {
      const currentScreenset = store.getState().layout.currentScreenset;
      
      // Switch screenset if needed (this will emit ScreensetChanged event)
      if (screensetKey !== currentScreenset) {
        // Emit screenset changed event (screensetActions pattern)
        eventBus.emit(ScreensetEvents.Changed, { 
          screensetId: screensetKey 
        });
        
        // Update screenset in layout slice
        store.dispatch(setCurrentScreenset(screensetKey));
      }
      
      // Update selected screen
      store.dispatch(setSelectedScreen(screenId));
    }
  });
}
