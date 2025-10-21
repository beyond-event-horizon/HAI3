import React from 'react';

/**
 * Core Screen component
 * Main content area for rendering application screens
 * Does not wrap UI Kit components - provides the container for screenset content
 */

export interface ScreenProps {
  children?: React.ReactNode;
  className?: string;
}

export const Screen: React.FC<ScreenProps> = ({ children, className = '' }) => {
  return (
    <main className={`flex-1 overflow-auto bg-muted/30 ${className}`.trim()}>
      {children}
    </main>
  );
};

Screen.displayName = 'Screen';
