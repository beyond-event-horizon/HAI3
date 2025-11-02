import React, { useEffect } from 'react';
import { useAppDispatch, setHeaderConfig } from '@hai3/uicore';

/**
 * Main HAI3 Application Component
 * 
 * Responsibilities:
 * 1. Configure UI Core domains (Header, Footer, etc.)
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
