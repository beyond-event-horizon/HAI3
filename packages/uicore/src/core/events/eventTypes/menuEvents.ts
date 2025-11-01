/**
 * Menu Events
 * Events related to menu state changes
 */

export enum MenuEvents {
  ItemsChanged = 'menu/itemsChanged',
  Toggled = 'menu/toggled',
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
  'menu/itemsChanged': MenuItemsChangedPayload;
  'menu/toggled': void;
}
