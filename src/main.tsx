/// <reference types="vite/client" />
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  HAI3Provider,
  apiRegistry,
  store,
} from '@hai3/uicore';
import '@hai3/uikit/styles'; // Tailwind CSS
import { App } from './App';
import '@/uikit/uikitRegistry'; // Auto-registers UI Kit (components + icons)
import '@/themes/themeRegistry'; // Auto-registers themes
import '@/screensets/screensetRegistry'; // Auto-registers screensets (includes i18n loaders)
import '@/api/apiRegistry'; // Auto-registers API extensions + mocks

// Initialize API services
const initialUseMockApi = store.getState().app.useMockApi;
apiRegistry.initialize({
  useMockApi: initialUseMockApi,
  mockDelay: 500,
});

/**
 * Render application with conditional DevTools in development
 * Bootstrap happens automatically when Layout mounts
 *
 * Flow:
 * 1. App renders → Layout mounts → bootstrap dispatched
 * 2. Components show skeleton loaders (translationsReady = false)
 * 3. User fetched → language set → translations loaded
 * 4. Components re-render with actual text (translationsReady = true)
 * 5. In DEV mode: DevToolsOverlay loads conditionally (tree-shaken in production)
 */
(async () => {
  let DevToolsOverlay: React.ComponentType | null = null;

  // Conditionally load DevTools in development mode only
  if (import.meta.env.DEV) {
    const devtools = await import('@hai3/devtools');
    DevToolsOverlay = devtools.DevToolsOverlay;
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <HAI3Provider>
        <App />
        {DevToolsOverlay && <DevToolsOverlay />}
      </HAI3Provider>
    </React.StrictMode>
  );
})();
