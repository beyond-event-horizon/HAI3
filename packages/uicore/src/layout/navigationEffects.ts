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

/**
 * Initialize navigation effects
 * Call this once during app setup
 */
export function initNavigationEffects(store: Store): void {
  // Listen to screenset changes and update slice
  // Check if screenset actually changed before updating (action is pure function)
  // Note: The action that emits ScreensetEvents.Changed should also emit MenuEvents.ItemsChanged
  eventBus.on(ScreensetEvents.Changed, ({ screensetId }) => {
    const currentScreenset = store.getState().layout.currentScreenset;
    
    // Only update if screenset actually changed
    if (currentScreenset !== screensetId) {
      store.dispatch(setCurrentScreenset(screensetId));
    }
  });
  
  // Listen to screen navigation and update slice
  // Note: Action handles screenset switching logic and emits both events
  eventBus.on(NavigationEvents.ScreenNavigated, ({ screenId }) => {
    store.dispatch(setSelectedScreen(screenId));
  });
}
