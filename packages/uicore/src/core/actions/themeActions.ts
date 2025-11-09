/**
 * Theme Actions - Async actions that emit events
 * These actions process data and emit events (NOT direct store updates)
 * Following Flux architecture pattern
 */

import type { AppDispatch } from '../../store';
import { eventBus } from '../events/eventBus';
import { ThemeEvents } from '../events/eventTypes';

/**
 * Change current theme
 * Action (imperative name) - emits events only, effects update slices
 * Follows Flux: Action → Event → Effect → Slice
 */
export const changeTheme = (themeName: string) => {
  return (_dispatch: AppDispatch): void => {
    // Emit event - effect will update slice and apply theme
    eventBus.emit(ThemeEvents.Changed, { 
      themeName 
    });
  };
};
