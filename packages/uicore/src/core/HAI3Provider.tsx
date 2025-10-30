/**
 * HAI3Provider Component
 * Main provider component that wraps HAI3 applications
 * Includes Redux Provider and AppRouter - apps just need to register themes/screensets
 */

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { AppRouter } from './routing/AppRouter';

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
    </Provider>
  );
};
