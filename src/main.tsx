import React from 'react';
import ReactDOM from 'react-dom/client';
import { HAI3Provider, apiServices, store } from '@hai3/uicore';
import { App } from './App';
import '../packages/uicore/src/styles/globals.css';
import '@/themes/themeRegistry'; // Auto-registers themes
import '@/screensets/screensetRegistry'; // Auto-registers screensets
import '@/icons/iconsRegistry'; // Auto-registers core icons
import '@/api/apiRegistry'; // Auto-registers API extensions + mocks

// Initialize API services
const initialUseMockApi = store.getState().app.useMockApi;
apiServices.initialize({
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
