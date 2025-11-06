import React from 'react';

/**
 * Main HAI3 Application Component
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
 * - Menu displays logo and handles expand/collapse
 */

export const App: React.FC = () => {
  return null; // HAI3Provider renders AppRouter
};
