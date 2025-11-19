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
import '@/screensets/screensetRegistry'; // Auto-registers screensets (includes API services + mocks + i18n loaders)

// Initialize API services
const initialUseMockApi = store.getState().app.useMockApi;
apiRegistry.initialize({
  useMockApi: initialUseMockApi,
  mockDelay: 500,
});

/**
 * Render application
 * Bootstrap happens automatically when Layout mounts
 *
 * Flow:
 * 1. App renders → Layout mounts → bootstrap dispatched
 * 2. Components show skeleton loaders (translationsReady = false)
 * 3. User fetched → language set → translations loaded
 * 4. Components re-render with actual text (translationsReady = true)
 * 5. In DEV mode: HAI3Provider auto-loads DevToolsOverlay if @hai3/devtools is installed
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HAI3Provider>
      <App />
    </HAI3Provider>
  </React.StrictMode>
);
