import React from 'react';
import ReactDOM from 'react-dom/client';
import { HAI3Provider, apiRegistry, store, i18nRegistry, Language } from '@hai3/uicore';
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

// Preload common languages and render after they're loaded
// Language changes now follow Flux: changeLanguage() -> Event -> Effect -> Store
// TODO: Get user's preferred language from account service after auth
i18nRegistry.preloadLanguages([Language.English, Language.Arabic]).then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <HAI3Provider>
        <App />
      </HAI3Provider>
    </React.StrictMode>
  );
});
