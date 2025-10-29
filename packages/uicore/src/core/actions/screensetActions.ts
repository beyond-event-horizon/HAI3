/**
 * Screenset Actions - Async actions that emit events
 * These actions process data and emit events (NOT direct store updates)
 * Following Flux architecture pattern
 */

import type { AppDispatch } from '@/core/store';
import { eventBus } from '../events/eventBus';
import { 
  ScreensetEvents,
  MenuEvents,
  type ScreensetChangedPayload,
  type MenuItemsChangedPayload 
} from '../events/eventTypes';
import { setCurrentScreenset as setCurrentScreensetReducer } from '@/core/layout/layoutSlice';
import { screensetService } from '@/core/screensets/screensetService';

/**
 * Change current screenset
 * Emits events for other domains to react to
 */
export const setCurrentScreenset = (screensetId: string) => {
  return (dispatch: AppDispatch): void => {
    // Get screenset data
    const screenset = screensetService.get(screensetId);
    
    if (!screenset) {
      console.warn(`Screenset not found: ${screensetId}`);
      return;
    }

    // Update own slice (layout)
    dispatch(setCurrentScreensetReducer(screensetId));

    // Emit events for other domains (Menu, etc.)
    eventBus.emit<ScreensetChangedPayload>(ScreensetEvents.Changed, { 
      screensetId 
    });

    eventBus.emit<MenuItemsChangedPayload>(MenuEvents.ItemsChanged, { 
      items: screenset.menuItems 
    });
  };
};
