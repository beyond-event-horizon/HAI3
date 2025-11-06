import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../hooks/useRedux';
import { ThemeSelector } from '../../../components/ThemeSelector';
import { ScreensetSelector } from '../../../components/ScreensetSelector';
import { ApiModeToggle } from '../../../components/ApiModeToggle';
import { setCurrentScreenset, setTheme } from '../../../core/actions';
import { themeRegistry } from '../../../theme/themeRegistry';
import { setFooterConfig } from './footerSlice';
import { buildScreensetOptions } from './footerHelpers';
import { uikitRegistry } from '../../../uikit/uikitRegistry';
import { UiKitComponent, ButtonVariant } from '@hai3/uikit-contracts';

/**
 * Core Footer component (dev tool, not for production)
 * Wraps UI Kit Footer and manages its own configuration via Redux
 * Includes ThemeSelector and ScreensetSelector as built-in children
 * 
 * IMPORTANT: Footer reports screenset AND theme changes
 * - Discovers registered themes/screensets at runtime from services
 * - Sets initial theme (first registered) and screenset (first in first category)
 * - Dispatches actions that emit events (event-driven architecture)
 * - Effects handle side effects (menu updates, theme application)
 * - Footer has NO knowledge of Menu or other domains
 */

export interface FooterProps {
  // All configuration is managed via Redux
}

export const Footer: React.FC<FooterProps> = () => {
  const dispatch = useAppDispatch();
  const { visible, screensetOptions } = useAppSelector((state) => state.footer);
  const theme = useAppSelector((state) => state.layout.theme);
  const currentScreenset = useAppSelector((state) => state.layout.currentScreenset);

  // Dev-only footer content (not configurable)
  const copyright = ' 2025 HAI3 Framework';
  const links = [
    { label: 'Documentation', href: '#docs' },
    { label: 'GitHub', href: '#github' },
  ];

  // Build screenset options and theme list on mount, set initial values
  useEffect(() => {
    const options = buildScreensetOptions();
    const themes = themeRegistry.getThemeNames();
    
    if (!theme && themes.length > 0) {
      dispatch(setTheme(themes[0]));
    }

    if (!currentScreenset && options.length > 0 && options[0].screensets.length > 0) {
      const firstCategory = options[0].category;
      const firstScreenset = options[0].screensets[0].id;
      dispatch(setCurrentScreenset(`${firstCategory}:${firstScreenset}`));
    }
    
    dispatch(setFooterConfig({ 
      screensetOptions: options,
    }));
  }, [dispatch, theme, currentScreenset]);

  // No side effects here - actions emit events, effects handle them

  if (!visible) return null;

  const Button = uikitRegistry.getComponent(UiKitComponent.Button);

  return (
    <footer className="flex items-center justify-between px-6 py-3 bg-background border-t border-border h-12 w-full text-sm text-muted-foreground">
      <div className="flex items-center gap-4">
        {copyright && <span>{copyright}</span>}
        {links && (
          <nav className="flex gap-4">
            {links.map((link) => (
              <Button
                key={link.href}
                variant={ButtonVariant.Link}
                asChild
              >
                <a href={link.href}>{link.label}</a>
              </Button>
            ))}
          </nav>
        )}
      </div>
      <div className="flex items-center gap-4">
        <ApiModeToggle />
        {screensetOptions.length > 0 && (
          <ScreensetSelector
            options={screensetOptions}
            currentValue={currentScreenset}
            onChange={(value: string) => dispatch(setCurrentScreenset(value))}
          />
        )}
        <ThemeSelector />
      </div>
    </footer>
  );
};

Footer.displayName = 'Footer';
