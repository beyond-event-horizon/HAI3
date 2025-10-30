import React, { useEffect } from 'react';
import {
  useAppDispatch,
  setHeaderConfig,
  iconService,
} from '@hai3/uicore';
import { MenuIcon, CloseIcon } from '@hai3/uikit';
import '@/themes/themeRegistry'; // Auto-registers themes
import '@/screensets/screensetRegistry'; // Auto-registers screensets + icons

// Register core icons (tree-shakeable - only import what we use)
iconService.register('menu', <MenuIcon />);
iconService.register('close', <CloseIcon />);

/**
 * Main HAI3 Application Component
 * 
 * Responsibilities:
 * 1. Import registries (auto-register themes & screensets)
 * 2. Register core icons (tree-shakeable from UI Kit)
 * 3. Configure UI Core domains (Header, etc.)
 * 
 * HAI3Provider (in main.tsx) handles:
 * - Redux Provider setup
 * - AppRouter with dynamic routing
 * - RouterSync (URL ↔ Redux)
 * 
 * Framework handles everything else:
 * - Footer discovers registered themes/screensets
 * - Navigation events switch screensets automatically
 * - Routes sync lazily from registered screensets
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

  return null; // HAI3Provider renders AppRouter
};
