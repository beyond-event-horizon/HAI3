/**
 * Event Types - Event names organized by domain
 * Following vertical slice approach - enums grouped by domain
 */

/**
 * Screenset Events
 */
export enum ScreensetEvents {
  Changed = 'screenset/changed',
}

/**
 * Menu Events
 */
export enum MenuEvents {
  ItemsChanged = 'menu/itemsChanged',
  Toggled = 'menu/toggled',
}

/**
 * Theme Events
 */
export enum ThemeEvents {
  Changed = 'theme/changed',
}

/**
 * Navigation Events
 */
export enum NavigationEvents {
  ScreenNavigated = 'navigation/screenNavigated',
}

/**
 * Event Payload Types
 */

export interface ScreensetChangedPayload {
  screensetId: string;
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

export interface ThemeChangedPayload {
  themeName: string;
}

export interface NavigateToScreenPayload {
  screenId: string;
}
