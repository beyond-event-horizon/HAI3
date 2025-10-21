import React from 'react';
import { Footer as UIKitFooter } from '@/uikit';
import { useAppSelector } from '@/core/hooks/useRedux';

/**
 * Core Footer component
 * Wraps UI Kit Footer and manages its own configuration via Redux
 */

export interface FooterProps {
  // All configuration is managed via Redux
}

export const Footer: React.FC<FooterProps> = () => {
  const { copyright, links, visible } = useAppSelector((state) => state.footer);

  if (!visible) return null;

  return <UIKitFooter copyright={copyright || undefined} links={links} />;
};

Footer.displayName = 'Footer';
