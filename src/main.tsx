import React from 'react';
import ReactDOM from 'react-dom/client';
import { HAI3Provider } from '@hai3/uicore';
import { App } from './App';
import '../packages/uicore/src/styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HAI3Provider>
      <App />
    </HAI3Provider>
  </React.StrictMode>
);
