/**
 * Screenset Actions - Async actions that emit events
 * These actions process data and emit events (NOT direct store updates)
 * Following Flux architecture pattern
 */

import type { AppDispatch } from '../../store';
import { eventBus } from '../events/eventBus';
import { 
  ScreensetEvents,
  MenuEvents
} from '../events/eventTypes';
import { screensetRegistry } from '../../screensets/screensetRegistry';

/**
 * Select/change current screenset
 * Action (imperative name) - emits events only, effects update slices
 * Follows Flux: Action → Event → Effect → Slice
 */
export const selectScreenset = (screensetId: string) => {
  return (_dispatch: AppDispatch): void => {
    const screenset = screensetRegistry.get(screensetId);
    
    if (!screenset) {
      console.warn(`Screenset not found: ${screensetId}`);
      return;
    }

    // Emit events - effects will update slices
    eventBus.emit(ScreensetEvents.Changed, { 
      screensetId 
    });

    eventBus.emit(MenuEvents.ItemsChanged, { 
      items: screensetRegistry.getMenuItems(screensetId)
    });
  };
};
