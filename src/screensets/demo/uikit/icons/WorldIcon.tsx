import React from 'react';
import { DEMO_SCREENSET_ID } from '../../ids';

/**
 * World Icon ID
 * Uses template literal with DEMO_SCREENSET_ID for auto-updating namespace
 */
export const WORLD_ICON_ID = `${DEMO_SCREENSET_ID}:world` as const;

/**
 * World Icon
 * Local icon for Demo screenset (hello world screen)
 */
export const WorldIcon: React.FC<{ className?: string }> = ({ className = '' }) => {
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
