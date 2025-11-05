import React from 'react';
import { useAppSelector } from '@/core/hooks/useRedux';
import { screensetRegistry } from '@/core/screensets/screensetRegistry';

/**
 * Core Screen component
 * Main content area for rendering application screens
 * Reads layout.selectedScreen from Redux and renders component from screenset registry
 * Falls back to children if provided (for apps not using screensets)
 */

export interface ScreenProps {
  children?: React.ReactNode;
  className?: string;
}

export const Screen: React.FC<ScreenProps> = ({ children, className = '' }) => {
  const currentScreensetValue = useAppSelector((state) => state.layout.currentScreenset);
  const selectedScreen = useAppSelector((state) => state.layout.selectedScreen);

  // If children provided, use them (legacy/non-screenset apps)
  if (children) {
    return (
      <main className={`flex-1 overflow-auto bg-muted/30 ${className}`.trim()}>
        {children}
      </main>
    );
  }

  const screenset = screensetRegistry.get(currentScreensetValue);
  const screenId = selectedScreen || screenset?.defaultScreen || '';
  const screens = screensetRegistry.getScreens(currentScreensetValue);
  const ScreenComponent = screens[screenId];

  return (
    <main className={`flex-1 overflow-auto bg-muted/30 ${className}`.trim()}>
      {ScreenComponent ? (
        <ScreenComponent />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">
            {screenset ? `Screen not found: ${screenId}` : 'No screenset configured'}
          </p>
        </div>
      )}
    </main>
  );
};

Screen.displayName = 'Screen';
