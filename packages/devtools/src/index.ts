/**
 * HAI3 DevTools Package
 * Development tools overlay for HAI3 applications
 *
 * This package should ONLY be imported in development mode
 * Use conditional imports to ensure it's tree-shaken in production
 *
 * Translations are registered automatically when DevToolsProvider is imported
 */

export { DevToolsOverlay } from './DevToolsOverlay';
export { DevToolsProvider, useDevToolsContext } from './DevToolsProvider';
export type { Position, Size, DevToolsState } from './types';
