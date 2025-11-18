/**
 * Type declarations for optional peer dependencies
 *
 * These modules may not be installed, but we need TypeScript to recognize them
 * for conditional imports with error handling.
 */

/**
 * @hai3/devtools - Optional development tools package
 *
 * This package is an optional peer dependency that provides a floating development panel
 * with theme/screenset/language selectors and API mode toggle.
 *
 * It's automatically loaded by HAI3Provider in development mode via dynamic import
 * with error handling, ensuring graceful degradation if not installed.
 */
declare module '@hai3/devtools' {
  import type { FC } from 'react';

  /**
   * DevTools overlay component - floating development panel
   * Provides theme, screenset, language, and API mode controls
   */
  export const DevToolsOverlay: FC;

  /**
   * DevTools provider context
   */
  export const DevToolsProvider: FC<{ children?: React.ReactNode }>;

  /**
   * Hook to access DevTools context
   */
  export function useDevToolsContext(): {
    toggleCollapsed: () => void;
    setPortalContainer: (container: HTMLElement | null) => void;
  };

  /**
   * Position type for DevTools panel
   */
  export interface Position {
    x: number;
    y: number;
  }

  /**
   * Size type for DevTools panel
   */
  export interface Size {
    width: number;
    height: number;
  }

  /**
   * DevTools state interface
   */
  export interface DevToolsState {
    position: Position;
    size: Size;
    collapsed: boolean;
    portalContainer: HTMLElement | null;
  }
}
