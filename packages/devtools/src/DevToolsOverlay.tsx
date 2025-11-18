import React from 'react';
import { DevToolsProvider, useDevToolsContext } from './DevToolsProvider';
import { DevToolsPanel } from './DevToolsPanel';
import { useKeyboardShortcut } from './hooks/useKeyboardShortcut';
import { CollapsedButton } from './CollapsedButton';

const DevToolsContent: React.FC = () => {
  const { collapsed, toggleCollapsed } = useDevToolsContext();

  // Register keyboard shortcut (Shift + `) - toggles between collapsed button and expanded panel
  useKeyboardShortcut(toggleCollapsed);

  if (collapsed) {
    return <CollapsedButton toggleCollapsed={toggleCollapsed} />;
  }

  return <DevToolsPanel />;
};

export const DevToolsOverlay: React.FC = () => {
  return (
    <DevToolsProvider>
      <DevToolsContent />
    </DevToolsProvider>
  );
};

DevToolsOverlay.displayName = 'DevToolsOverlay';
