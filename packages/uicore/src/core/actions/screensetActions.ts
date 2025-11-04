/**
 * Screenset Actions - Async actions that emit events
 * These actions process data and emit events (NOT direct store updates)
 * Following Flux architecture pattern
 */

import type { AppDispatch } from '@/core/store';
import { eventBus } from '../events/eventBus';
import { 
  ScreensetEvents,
  MenuEvents
} from '../events/eventTypes';
import { setCurrentScreenset as setCurrentScreensetReducer } from '@/core/layout/layoutSlice';
import { screensetRegistry } from '@/core/screensets/screensetRegistry';

/**
 * Change current screenset
 * Emits events for other domains to react to
 */
export const setCurrentScreenset = (screensetId: string) => {
  return (dispatch: AppDispatch): void => {
    // Get screenset data
    const screenset = screensetRegistry.get(screensetId);
    
    if (!screenset) {
      console.warn(`Screenset not found: ${screensetId}`);
      return;
    }

    // Update own slice (layout)
    dispatch(setCurrentScreensetReducer(screensetId));

    // Emit events for other domains (Menu, etc.)
    eventBus.emit(ScreensetEvents.Changed, { 
      screensetId 
    });

    eventBus.emit(MenuEvents.ItemsChanged, { 
      items: screensetRegistry.getMenuItems(screensetId)
    });
  };
};
