/**
 * Layout Effects - Side effects for Layout domain
 * Subscribes to layout events and updates layout slice
 * Implements Flux pattern: Event -> Effect -> Slice Update
 * 
 * Pattern: 1 slice = 1 effects file (co-located)
 */

import { eventBus } from '../core/events/eventBus';
import { ThemeEvents } from '../core/events/eventTypes';
import { themeRegistry } from '../theme/themeRegistry';

/**
 * Initialize layout effects
 * Call this once during app setup
 */
export function initLayoutEffects(): void {
  // When theme changes, apply it via themeRegistry
  eventBus.on(ThemeEvents.Changed, ({ themeName }) => {
    themeRegistry.apply(themeName);
  });
}
