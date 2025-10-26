import React from 'react';
import { iconService } from '@hai3/uicore';
import { DemoIconId } from './IconId';

/**
 * World/Globe Icon
 * Local icon for Demo screenset
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
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
};

// Self-register icon (runs on import)
iconService.register(DemoIconId.World, <WorldIcon />);
