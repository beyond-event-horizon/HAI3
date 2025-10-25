import React from 'react';
import { Footer as UIKitFooter, ThemeSelector } from '@/uikit';
import { useAppSelector, useAppDispatch } from '@/core/hooks/useRedux';
import { setTheme } from '@/core/layout/layoutSlice';
import type { ThemeName } from '@/styles/themeRegistry';

/**
 * Core Footer component
 * Wraps UI Kit Footer and manages its own configuration via Redux
 */

export interface FooterProps {
  // All configuration is managed via Redux
}

export const Footer: React.FC<FooterProps> = () => {
  const dispatch = useAppDispatch();
  const { copyright, links, visible } = useAppSelector((state) => state.footer);
  const { theme } = useAppSelector((state) => state.layout);

  if (!visible) return null;

  const handleThemeChange = (newTheme: ThemeName): void => {
    dispatch(setTheme(newTheme));
  };

  return (
    <UIKitFooter copyright={copyright || undefined} links={links}>
      <ThemeSelector currentTheme={theme} onThemeChange={handleThemeChange} className="w-32" />
    </UIKitFooter>
  );
};

Footer.displayName = 'Footer';
