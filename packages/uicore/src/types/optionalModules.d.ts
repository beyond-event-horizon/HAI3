/**
 * Type declarations for optional peer dependencies
 *
 * These modules may not be installed, but we need TypeScript to recognize them
 * for conditional imports with error handling.
 */

/**
 * @hai3/studio - Optional development tools package
 *
 * This package is an optional peer dependency that provides a floating development panel
 * with theme/screenset/language selectors and API mode toggle.
 *
 * It's automatically loaded by HAI3Provider in development mode via dynamic import
 * with error handling, ensuring graceful degradation if not installed.
 */
declare module '@hai3/studio' {
  import type { FC } from 'react';

  /**
   * Studio overlay component - floating development panel
   * Provides theme, screenset, language, and API mode controls
   */
  export const StudioOverlay: FC;

  /**
   * Studio provider context
   */
  export const StudioProvider: FC<{ children?: React.ReactNode }>;

  /**
   * Hook to access Studio context
   */
  export function useStudioContext(): {
    toggleCollapsed: () => void;
    setPortalContainer: (container: HTMLElement | null) => void;
  };

  /**
   * Position type for Studio panel
   */
  export interface Position {
    x: number;
    y: number;
  }

  /**
   * Size type for Studio panel
   */
  export interface Size {
    width: number;
    height: number;
  }

  /**
   * Studio state interface
   */
  export interface StudioState {
    position: Position;
    size: Size;
    collapsed: boolean;
    portalContainer: HTMLElement | null;
  }
}
