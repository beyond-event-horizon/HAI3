import React from 'react';
import { Header } from './domains/header';
import { Footer } from './domains/footer';
import { Menu } from './domains/menu';
import { Sidebar } from './domains/sidebar';
import { Screen } from './domains/screen';
import { Popup } from './domains/popup';
import { Overlay } from './domains/overlay';

/**
 * Layout component for HAI3 UI-Core
 * Pure structural orchestrator - all configuration is managed via Redux in each domain
 * Each domain component is completely self-contained and manages its own state
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
