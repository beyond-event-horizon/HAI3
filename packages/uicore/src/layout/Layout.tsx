import React from 'react';
import { Header } from './domains/header/Header';
import { Footer } from './domains/footer/Footer';
import { Menu } from './domains/menu/Menu';
import { Sidebar } from './domains/sidebar/Sidebar';
import { Screen } from './domains/screen/Screen';
import { Popup } from './domains/popup/Popup';
import { Overlay } from './domains/overlay/Overlay';

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

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* Header */}
      <Header />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Menu */}
        <Menu />

        {/* Main content */}
        <Screen>{children}</Screen>

        {/* Sidebar */}
        <Sidebar />
      </div>

      {/* Footer */}
      <Footer />

      {/* Popups */}
      <Popup />

      {/* Overlay */}
      <Overlay />
    </div>
  );
};

Layout.displayName = 'Layout';
