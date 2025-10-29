/**
 * Menu Effects - Side effects for Menu domain
 * Subscribes to events and updates Menu slice
 * Implements Redux-Saga/NgRx Effects pattern
 */

import type { Store } from '@reduxjs/toolkit';
import { eventBus } from '../events/eventBus';
import { MenuEvents, type MenuItemsChangedPayload } from '../events/eventTypes';
import { setMenuItems, setMenuCollapsed } from '@/core/layout/domains/menu/menuSlice';

/**
 * Initialize menu effects
 * Call this once during app setup
 */
export function initMenuEffects(store: Store): void {
  // When menu items change, update menu slice
  eventBus.on<MenuItemsChangedPayload>(MenuEvents.ItemsChanged, ({ items }) => {
    store.dispatch(setMenuItems(items));
  });

  // When menu toggle is triggered, toggle collapsed state
  eventBus.on(MenuEvents.Toggled, () => {
    const currentCollapsed = store.getState().menu.collapsed;
    store.dispatch(setMenuCollapsed(!currentCollapsed));
  });
}
