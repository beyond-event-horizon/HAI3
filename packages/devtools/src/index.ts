/**
 * HAI3 DevTools Package
 * Development tools overlay for HAI3 applications
 *
 * This package should ONLY be imported in development mode
 * Use conditional imports to ensure it's tree-shaken in production
 */

// Register DevTools translations on module import
import './i18n';

export { DevToolsOverlay } from './DevToolsOverlay';
export { DevToolsProvider, useDevToolsContext } from './DevToolsProvider';
export type { Position, Size, DevToolsState } from './types';
