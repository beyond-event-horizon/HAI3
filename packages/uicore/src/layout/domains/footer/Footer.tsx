import React, { useEffect } from 'react';
import { Footer as UIKitFooter } from '@/uikit';
import { useAppSelector, useAppDispatch } from '@/core/hooks/useRedux';
import { ThemeSelector } from '@/core/components/ThemeSelector';
import { ScreensetSelector } from '@/core/components/ScreensetSelector';
import { setCurrentScreenset, setTheme } from '@/core/layout/layoutSlice';
import { setMenuConfig } from '@/core/layout/domains/menu';
import { screensetService } from '@/core/screensets/screensetService';
import { themeService } from '@/core/theme/themeService';
import { setFooterConfig } from './footerSlice';
import { buildScreensetOptions } from './footerHelpers';

/**
 * Core Footer component (dev tool, not for production)
 * Wraps UI Kit Footer and manages its own configuration via Redux
 * Includes ThemeSelector and ScreensetSelector as built-in children
 * 
 * IMPORTANT: Footer orchestrates screensets AND themes
 * - Discovers registered themes/screensets at runtime from services
 * - Sets initial theme (first registered) and screenset (first in first category)
 * - Builds screenset options internally
 * - Watches screenset changes → updates Menu with new items
 * - Menu handles default screen selection when items change
 * - Watches theme changes → applies theme
 */

export interface FooterProps {
  // All configuration is managed via Redux
}

export const Footer: React.FC<FooterProps> = () => {
  const dispatch = useAppDispatch();
  const { 
    availableThemes, 
    screensetOptions,
    visible 
  } = useAppSelector((state) => state.footer);
  const currentScreenset = useAppSelector((state) => state.layout.currentScreenset);
  const theme = useAppSelector((state) => state.layout.theme);

  // Dev-only footer content (not configurable)
  const copyright = '© 2025 HAI3 Framework';
  const links = [
    { label: 'Documentation', href: '#docs' },
    { label: 'GitHub', href: '#github' },
  ];

  // Build screenset options and theme list on mount, set initial values
  useEffect(() => {
    const options = buildScreensetOptions();
    const themes = themeService.getThemeNames();
    
    // Set initial theme if not set
    if (!theme && themes.length > 0) {
      dispatch(setTheme(themes[0]));
    }
    
    // Set initial screenset if not set
    if (!currentScreenset && options.length > 0 && options[0].screensets.length > 0) {
      const firstCategory = options[0].category;
      const firstScreenset = options[0].screensets[0].id;
      dispatch(setCurrentScreenset(`${firstCategory}:${firstScreenset}`));
    }
    
    dispatch(setFooterConfig({ 
      screensetOptions: options,
      availableThemes: themes,
    }));
  }, [dispatch, theme, currentScreenset]);

  // Watch screenset changes and update Menu (Footer owns screenset knowledge)
  useEffect(() => {
    const screenset = screensetService.get(currentScreenset);
    if (!screenset) return;

    // Update menu items (Menu handles clicks and default selection)
    dispatch(
      setMenuConfig({
        items: screenset.menuItems, // Icons are now string identifiers (serializable)
      })
    );
  }, [currentScreenset, dispatch]);

  // Watch theme changes and apply theme (Footer owns theme orchestration)
  useEffect(() => {
    if (theme) {
      themeService.apply(theme);
    }
  }, [theme]);

  if (!visible) return null;

  return (
    <UIKitFooter copyright={copyright || undefined} links={links}>
      <div className="flex items-center gap-4">
        {screensetOptions.length > 0 && (
          <ScreensetSelector
            options={screensetOptions}
            currentValue={currentScreenset}
            onChange={(value: string) => dispatch(setCurrentScreenset(value))}
          />
        )}
        <ThemeSelector availableThemes={availableThemes} />
      </div>
    </UIKitFooter>
  );
};

Footer.displayName = 'Footer';
