/**
 * HAI3Provider Component
 * Main provider component that wraps HAI3 applications
 * Includes Redux Provider and AppRouter - apps just need to register themes/screensets
 */

import React, { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { AppRouter } from './routing/AppRouter';

/**
 * Check if we're in development mode
 * Works in both Vite and non-Vite environments
 */
const isDevelopment =
  (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') ||
  (typeof import.meta !== 'undefined' && (import.meta as { env?: { DEV?: boolean } }).env?.DEV);

/**
 * Lazy load DevTools only in development mode and only if installed
 * Falls back to null component if @hai3/devtools is not available
 *
 * Note: DevTools is an optional peer dependency loaded via dynamic import
 * The .catch() ensures graceful degradation if the package is not installed
 * Type declaration in types/optionalModules.d.ts allows TypeScript to recognize the module
 */
const DevToolsOverlay = isDevelopment
  ? lazy(() =>
      import('@hai3/devtools')
        .then(module => ({ default: module.DevToolsOverlay }))
        .catch(() => {
          // DevTools not installed - gracefully degrade
          console.debug('[HAI3] DevTools package not found. Install @hai3/devtools for development tools.');
          return { default: () => null };
        })
    )
  : null;

export interface HAI3ProviderProps {
  children?: React.ReactNode;
}

/**
 * HAI3Provider - Main wrapper for HAI3 applications
 * 
 * Includes:
 * - Redux Provider with UI Core store
 * - AppRouter with dynamic routing
 * 
 * Apps only need to:
 * 1. Import theme/screenset registries (auto-register)
 * 2. Register core icons in App component
 * 3. Configure domains in App component
 * 
 * @example
 * ```tsx
 * // main.tsx
 * ReactDOM.render(
 *   <HAI3Provider>
 *     <App />
 *   </HAI3Provider>,
 *   root
 * );
 * 
 * // App.tsx
 * import '@/themes/themeRegistry';
 * import '@/screensets/screensetRegistry';
 * 
 * export const App = () => {
 *   // Register icons, configure domains
 *   return null; // HAI3Provider renders AppRouter
 * };
 * ```
 */
export const HAI3Provider: React.FC<HAI3ProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      {children}
      <AppRouter />

      {/* Auto-inject DevTools in development mode if package is installed */}
      {DevToolsOverlay && (
        <Suspense fallback={null}>
          <DevToolsOverlay />
        </Suspense>
      )}
    </Provider>
  );
};
