/**
 * Theme Actions - Async actions that emit events
 * These actions process data and emit events (NOT direct store updates)
 * Following Flux architecture pattern
 */

import type { AppDispatch } from '@/core/store';
import { eventBus } from '../events/eventBus';
import { ThemeEvents } from '../events/eventTypes';
import { setTheme as setThemeReducer } from '@/core/layout/layoutSlice';

/**
 * Change current theme
 * Emits events for theme application
 */
export const setTheme = (themeName: string) => {
  return (dispatch: AppDispatch): void => {
    dispatch(setThemeReducer(themeName));

    // Emit event for theme application
    eventBus.emit(ThemeEvents.Changed, { 
      themeName 
    });
  };
};
