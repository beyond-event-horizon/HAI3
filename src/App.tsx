import React, { useEffect } from 'react';
import {
  Layout,
  useAppDispatch,
  setHeaderConfig,
} from '@hai3/uicore';
import '@/themes/themeRegistry'; // Auto-registers themes
import '@/screensets/screensetRegistry'; // Auto-registers screensets + icons

/**
 * Main HAI3 Application Component
 * 
 * Responsibilities:
 * 1. Import registries (auto-register themes & screensets)
 * 2. Configure UI Core domains (Header)
 * 
 * Framework handles everything else:
 * - Footer discovers registered themes/screensets and sets initial values
 * - Footer watches theme changes → applies theme
 * - Footer watches screenset changes → updates Menu
 * - Screen watches menu.selectedScreen → renders component
 */

export const App: React.FC = () => {
  const dispatch = useAppDispatch();

  // Configure header
  useEffect(() => {
    dispatch(
      setHeaderConfig({
        logo: 'HAI3',
      })
    );
  }, [dispatch]);

  return <Layout />;
};
