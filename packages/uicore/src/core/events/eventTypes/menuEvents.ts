/**
 * Menu Events
 * Events related to menu state changes
 */

import { UICORE_ID } from '../../constants';

const DOMAIN_ID = 'menu';

export enum MenuEvents {
  ItemsChanged = `${UICORE_ID}/${DOMAIN_ID}/itemsChanged`,
  Toggled = `${UICORE_ID}/${DOMAIN_ID}/toggled`,
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
