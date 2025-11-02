import React from 'react';
import ReactDOM from 'react-dom/client';
import { HAI3Provider, iconService, apiServices, store, ACCOUNTS_DOMAIN } from '@hai3/uicore';
import { MenuIcon, CloseIcon } from '@hai3/uikit';
import { App } from './App';
import '../packages/uicore/src/styles/globals.css';
import '@/themes/themeRegistry'; // Auto-registers themes
import '@/screensets/screensetRegistry'; // Auto-registers screensets
import '@/api'; // API extensions (module augmentation)
import { accountsMockMap } from '@/api';

// Register core icons (tree-shakeable)
iconService.register('menu', <MenuIcon />);
iconService.register('close', <CloseIcon />);

// Register mock data for services
apiServices.registerMocks(ACCOUNTS_DOMAIN, accountsMockMap);

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
