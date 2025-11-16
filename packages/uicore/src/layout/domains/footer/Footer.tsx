import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../hooks/useRedux';
import { ThemeSelector } from '../../../components/ThemeSelector';
import { ScreensetSelector } from '../../../components/ScreensetSelector';
import { ApiModeToggle } from '../../../components/ApiModeToggle';
import { LanguageSelector } from '../../../components/LanguageSelector';
import { changeTheme, selectScreenset } from '../../../core/actions';
import { themeRegistry } from '../../../theme/themeRegistry';
import { buildScreensetOptions } from './footerHelpers';
import { uikitRegistry } from '../../../uikit/uikitRegistry';
import { UiKitComponent, ButtonVariant } from '@hai3/uikit-contracts';
import type { ScreensetOption } from './footerSlice';

/**
 * Core Footer component (dev tool, not for production)
 */

export const Footer: React.FC = () => {
  const dispatch = useAppDispatch();
  const visible = useAppSelector((state) => state.footer.visible);
  const theme = useAppSelector((state) => state.layout.theme);
  const currentScreenset = useAppSelector((state) => state.layout.currentScreenset);
  
  // Screenset options in local state - no need for Redux (purely UI)
  const [screensetOptions, setScreensetOptions] = useState<ScreensetOption[]>([]);

  // Dev-only footer content (not configurable)
  const copyright = '© 2025 HAI3 Framework';
  const links = [
    { label: 'Documentation', href: '#docs' },
    { label: 'GitHub', href: '#github' },
  ];

  // Build screenset options and theme list on mount
  useEffect(() => {
    const options = buildScreensetOptions();
    const themes = themeRegistry.getThemeNames();

    // Update local state
    setScreensetOptions(options);

    // Set initial theme if not set
    if (!theme && themes.length > 0) {
      dispatch(changeTheme(themes[0]));
    }

    // DO NOT set initial screenset here - AppRouter handles "/" route redirect
    // Setting screenset here causes race condition with URL-based navigation (RouterSync)
  }, [theme, dispatch]); // Run when theme or dispatch changes (dispatch is stable)

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
        <LanguageSelector />
        {screensetOptions.length > 0 && (
          <ScreensetSelector
            options={screensetOptions}
            currentValue={currentScreenset}
            onChange={(value: string) => dispatch(selectScreenset(value))}
          />
        )}
        <ThemeSelector />
      </div>
    </footer>
  );
};

Footer.displayName = 'Footer';
