/**
 * Navigation Effects - Side effects for Navigation domain
 * Subscribes to navigation events and updates Layout slice
 * Implements Redux-Saga/NgRx Effects pattern (see EVENTS.md)
 */

import type { Store } from '@reduxjs/toolkit';
import { eventBus } from '../events/eventBus';
import { 
  NavigationEvents,
  ScreensetEvents,
  type NavigateToScreenPayload,
  type ScreensetChangedPayload 
} from '../events/eventTypes';
import { setSelectedScreen, setCurrentScreenset } from '@/core/layout/layoutSlice';
import { routeService } from '../routing/routeService';

/**
 * Initialize navigation effects
 * Call this once during app setup
 */
export function initNavigationEffects(store: Store): void {
  // When screen navigation happens, update Redux state
  eventBus.on<NavigateToScreenPayload>(NavigationEvents.ScreenNavigated, ({ screenId }) => {
    // Find which screenset contains this screen
    const screensetKey = routeService.getScreensetKeyForScreen(screenId);
    
    if (screensetKey) {
      const currentScreenset = store.getState().layout.currentScreenset;
      
      // Switch screenset if needed (this will emit ScreensetChanged event)
      if (screensetKey !== currentScreenset) {
        // Emit screenset changed event (screensetActions pattern)
        eventBus.emit<ScreensetChangedPayload>(ScreensetEvents.Changed, { 
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
