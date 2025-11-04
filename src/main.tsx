import React from 'react';
import ReactDOM from 'react-dom/client';
import { HAI3Provider, apiRegistry, store } from '@hai3/uicore';
import { App } from './App';
import '../packages/uicore/src/styles/globals.css';
import '@/uikit/uikitRegistry'; // Auto-registers UI Kit (components + icons)
import '@/themes/themeRegistry'; // Auto-registers themes
import '@/screensets/screensetRegistry'; // Auto-registers screensets
import '@/api/apiRegistry'; // Auto-registers API extensions + mocks

// Initialize API services
const initialUseMockApi = store.getState().app.useMockApi;
apiRegistry.initialize({
  useMockApi: initialUseMockApi,
  mockDelay: 500,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HAI3Provider>
      <App />
    </HAI3Provider>
  </React.StrictMode>
);
