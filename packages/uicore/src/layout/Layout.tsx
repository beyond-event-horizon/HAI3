import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { Header } from './domains/header/Header';
import { Footer } from './domains/footer/Footer';
import { Menu } from './domains/menu/Menu';
import { Sidebar } from './domains/sidebar/Sidebar';
import { Screen } from './domains/screen/Screen';
import { Popup } from './domains/popup/Popup';
import { Overlay } from './domains/overlay/Overlay';
import { bootstrapApp } from '../core/actions/appActions';

/**
 * Layout component for HAI3 UI-Core
 * Pure structural orchestrator - all configuration is managed via Redux in each domain
 * Each domain component is completely self-contained and manages its own state
 * 
 * Note: Theme application should be done at app level where themes are defined
 */

export interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();

  // Bootstrap application on mount
  // Fetches user and initializes language
  // Components render with skeletons until data arrives
  useEffect(() => {
    dispatch(bootstrapApp());
  }, [dispatch]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* Top row: Menu + Header + Content + Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Menu - full height on left */}
        <Menu />

        {/* Right side: Header + Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <Header />

          {/* Main content area */}
          <div className="flex flex-1 overflow-hidden">
            {/* Main content */}
            <Screen>{children}</Screen>

            {/* Sidebar */}
            <Sidebar />
          </div>
        </div>
      </div>

      {/* Footer - full width */}
      <Footer />

      {/* Popups */}
      <Popup />

      {/* Overlay */}
      <Overlay />
    </div>
  );
};

Layout.displayName = 'Layout';
