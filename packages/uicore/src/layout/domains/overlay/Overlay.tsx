import React from 'react';

/**
 * Overlay Component (Placeholder)
 * Reserved for future backdrop/overlay functionality
 * Currently not rendered or used anywhere
 */
export const Overlay: React.FC = () => {
  // TODO: Implement overlay functionality when needed
  // Will require:
  // - Overlay actions (emit events, not direct dispatch)
  // - Overlay effects (listen to events, update slice)
  // - Render in Layout component
  return null;
};

Overlay.displayName = 'Overlay';
