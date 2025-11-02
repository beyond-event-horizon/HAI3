/**
 * Layout Effects - Side effects for Layout domain
 * Subscribes to layout events and updates layout slice
 * Implements Flux pattern: Event -> Effect -> Slice Update
 * 
 * Pattern: 1 slice = 1 effects file (co-located)
 */

import type { Store } from '@reduxjs/toolkit';
import { eventBus } from '../core/events/eventBus';
import { ThemeEvents } from '../core/events/eventTypes';
import { themeService } from '../theme/themeService';

/**
 * Initialize layout effects
 * Call this once during app setup
 */
export function initLayoutEffects(store: Store): void {
  // When theme changes, apply it via themeService
  eventBus.on(ThemeEvents.Changed, ({ themeName }) => {
    themeService.apply(themeName);
  });
}
