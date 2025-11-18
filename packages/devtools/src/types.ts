/**
 * Position coordinates for the DevTools panel
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Size dimensions for the DevTools panel
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * DevTools panel state
 */
export interface DevToolsState {
  collapsed: boolean;
  position: Position;
  size: Size;
}

/**
 * Constants for panel constraints
 */
export const PANEL_CONSTRAINTS = {
  MIN_WIDTH: 320,
  MIN_HEIGHT: 400,
  MAX_WIDTH: 600,
  MAX_HEIGHT: 800,
  DEFAULT_WIDTH: 400,
  DEFAULT_HEIGHT: 500,
} as const;

/**
 * Collapsed button size (circular)
 */
export const BUTTON_SIZE = {
  width: 48,
  height: 48,
} as const;

/**
 * LocalStorage key prefix for DevTools
 */
export const STORAGE_PREFIX = 'hai3:devtools:' as const;

/**
 * LocalStorage keys (composable with shared prefix)
 */
export const STORAGE_KEYS = {
  POSITION: `${STORAGE_PREFIX}position`,
  SIZE: `${STORAGE_PREFIX}size`,
  COLLAPSED: `${STORAGE_PREFIX}collapsed`,
  BUTTON_POSITION: `${STORAGE_PREFIX}buttonPosition`,
} as const;
