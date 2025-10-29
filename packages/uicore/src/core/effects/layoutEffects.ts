/**
 * Layout Effects - Side effects for Layout domain
 * Subscribes to events and updates Layout slice
 * Implements Redux-Saga/NgRx Effects pattern
 */

import type { Store } from '@reduxjs/toolkit';
import { eventBus } from '../events/eventBus';
import { ThemeEvents, type ThemeChangedPayload } from '../events/eventTypes';
import { themeService } from '@/core/theme/themeService';

/**
 * Initialize layout effects
 * Call this once during app setup
 */
export function initLayoutEffects(store: Store): void {
  // When theme changes, apply it via themeService
  eventBus.on<ThemeChangedPayload>(ThemeEvents.Changed, ({ themeName }) => {
    themeService.apply(themeName);
  });
}
