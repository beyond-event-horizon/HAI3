/**
 * Menu Events
 * Events related to menu state changes
 */

export enum MenuEvents {
  ItemsChanged = 'uicore/menu/itemsChanged',
  Toggled = 'uicore/menu/toggled',
}

export interface MenuItemsChangedPayload {
  items: Array<{
    id: string;
    label: string;
    icon?: string;
    href?: string;
    badge?: string | number;
  }>;
}

/**
 * Type map: ties each MenuEvent to its payload type
 * Uses string literal types as keys (event string values)
 * Toggled has no payload (void)
 */
export interface MenuEventPayloadMap {
  'uicore/menu/itemsChanged': MenuItemsChangedPayload;
  'uicore/menu/toggled': void;
}
