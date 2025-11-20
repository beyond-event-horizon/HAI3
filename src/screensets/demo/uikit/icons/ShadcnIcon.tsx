import React from 'react';
import { DEMO_SCREENSET_ID } from '../../ids';


/**
 * Shadcn Icon ID
 * Uses template literal with DEMO_SCREENSET_ID for auto-updating namespace
 */
export const SHADCN_ICON_ID = `${DEMO_SCREENSET_ID}:shadcn` as const;

/**
 * Shadcn Icon
 * Local icon for Demo screenset (UI Kit Elements screen)
 * Represents shadcn.com component library
 */
export const ShadcnIcon: React.FC<{ className?: string }> = ({ className = '' }) => {
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
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
};

