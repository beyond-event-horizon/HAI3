import React from 'react';
import { Footer as UIKitFooter } from '@/uikit';
import { useAppSelector } from '@/core/hooks/useRedux';
import { ThemeSelector } from '@/core/components/ThemeSelector';

/**
 * Core Footer component
 * Wraps UI Kit Footer and manages its own configuration via Redux
 * Includes ThemeSelector as built-in children (with themes from footer config)
 */

export interface FooterProps {
  // All configuration is managed via Redux
}

export const Footer: React.FC<FooterProps> = () => {
  const { copyright, links, availableThemes, visible } = useAppSelector((state) => state.footer);

  if (!visible) return null;

  return (
    <UIKitFooter copyright={copyright || undefined} links={links}>
      <ThemeSelector availableThemes={availableThemes} />
    </UIKitFooter>
  );
};

Footer.displayName = 'Footer';
