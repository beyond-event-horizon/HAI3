/**
 * Menu Effects - Side effects for Menu domain
 * Subscribes to menu events and updates menu slice
 * Implements Flux pattern: Event -> Effect -> Slice Update
 * 
 * Pattern: 1 slice = 1 effects file (co-located)
 */

import type { Store } from '@reduxjs/toolkit';
import { eventBus } from '../../../core/events/eventBus';
import { MenuEvents } from '../../../core/events/eventTypes';
import { setMenuItems, setMenuCollapsed } from './menuSlice';

/**
 * Initialize menu effects
 * Call this once during app setup
 */
export function initMenuEffects(store: Store): void {
  // When menu items change, update menu slice
  eventBus.on(MenuEvents.ItemsChanged, ({ items }) => {
    store.dispatch(setMenuItems(items));
  });

  // When menu toggle is triggered, toggle collapsed state
  eventBus.on(MenuEvents.Toggled, () => {
    const currentCollapsed = store.getState().menu.collapsed;
    store.dispatch(setMenuCollapsed(!currentCollapsed));
  });
}
