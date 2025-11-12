/**
 * Screenset Actions - Async actions that emit events
 * These actions process data and emit events (NOT direct store updates)
 * Following Flux architecture pattern
 */

import type { AppDispatch } from '../../store';
import { eventBus } from '../events/eventBus';
import { 
  ScreensetEvents,
  MenuEvents,
  NavigationEvents
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

    // Emit screenset change event
    eventBus.emit(ScreensetEvents.Changed, { 
      screensetId 
    });

    // Emit menu items change event
    eventBus.emit(MenuEvents.ItemsChanged, { 
      items: screensetRegistry.getMenuItems(screensetId)
    });

    // Navigate to default screen of the new screenset
    if (screenset.defaultScreen) {
      eventBus.emit(NavigationEvents.ScreenNavigated, { 
        screenId: screenset.defaultScreen 
      });
    }
  };
};
