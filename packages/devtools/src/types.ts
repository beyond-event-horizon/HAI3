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
 * LocalStorage keys
 */
export const STORAGE_KEYS = {
  POSITION: 'hai3:devtools:position',
  SIZE: 'hai3:devtools:size',
  COLLAPSED: 'hai3:devtools:collapsed',
  BUTTON_POSITION: 'hai3:devtools:buttonPosition',
} as const;
