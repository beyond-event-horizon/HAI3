/**
 * AppRouter Component
 * Main routing container for HAI3 applications
 * Wraps Layout with react-router and synchronizes URL with Redux state
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RouterSync } from './RouterSync';
import { routeRegistry } from './routeRegistry';
import { Layout } from '@/core/layout/Layout';

/**
 * AppRouter Component
 * Sets up routing structure:
 * - Routes sync lazily from registered screensets (on first access)
 * - Provides URL structure: /:screenId
 * - Handles default route and 404s
 * - Two-way sync between URL and Redux state
 */
export const AppRouter: React.FC = () => {
  // Routes sync lazily on first access (prevents race conditions)
  const screenIds = routeRegistry.getAllScreenIds();
  const defaultScreenId = screenIds[0]; // First screen as default
  
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Dynamic route for any screen ID - Layout renders Screen component */}
        <Route 
          path="/:screenId" 
          element={
            <>
              <RouterSync />
              <Layout />
            </>
          } 
        />
        
        {/* Default route - redirect to first screen */}
        <Route 
          path="/" 
          element={
            defaultScreenId 
              ? <Navigate to={`/${defaultScreenId}`} replace />
              : <div>No screens available</div>
          } 
        />
        
        {/* 404 - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
