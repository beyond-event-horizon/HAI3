import React from 'react';
import { iconService } from '@hai3/uicore';

/**
 * World Icon ID
 * Well-known constant defined where it belongs
 */
export const WORLD_ICON_ID = 'world';

/**
 * World Icon
 * Local icon for Demo screenset (hello world screen)
 */
const WorldIcon: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
};

// Self-register icon (runs on import)
iconService.register(WORLD_ICON_ID, <WorldIcon />);
