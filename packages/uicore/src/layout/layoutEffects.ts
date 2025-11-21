/**
 * Layout Effects - Side effects for Layout domain
 * Subscribes to layout events and updates layout slice
 * Implements Flux pattern: Event -> Effect -> Slice Update
 * 
 * Pattern: 1 slice = 1 effects file (co-located)
 */

import type { Store } from '@reduxjs/toolkit';
import { eventBus } from '../core/events/eventBus';
import { ThemeEvents } from '../core/events/eventTypes/themeEvents';
import { themeRegistry } from '../theme/themeRegistry';
import { setTheme } from './layoutSlice';

/**
 * Initialize layout effects
 * Call this once during app setup
 */
export function initLayoutEffects(store: Store): void {
  // When theme changes, update slice and apply theme
  eventBus.on(ThemeEvents.Changed, ({ themeName }) => {
    store.dispatch(setTheme(themeName));
    themeRegistry.apply(themeName);
  });
}
