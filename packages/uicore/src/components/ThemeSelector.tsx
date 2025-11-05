import React from 'react';
import { useAppSelector, useAppDispatch } from '@/core/hooks/useRedux';
import { uikitRegistry } from '../uikit/uikitRegistry';
import { UiKitComponent, ButtonVariant } from '@hai3/uikit-contracts';
import { ChevronDown } from 'lucide-react';
import { setTheme } from '../core/actions';
import { themeRegistry } from '@/core/theme/themeRegistry';

/**
 * ThemeSelector Component
 * Redux-aware component for theme selection using DropdownMenu
 * Can be used in Footer, Header, Sidebar, or anywhere else
 */

export interface ThemeSelectorProps {
  className?: string;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  className = '',
}) => {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state) => state.layout.theme);

  const DropdownMenu = uikitRegistry.getComponent(UiKitComponent.DropdownMenu);
  const DropdownMenuTrigger = uikitRegistry.getComponent(UiKitComponent.DropdownMenuTrigger);
  const DropdownMenuContent = uikitRegistry.getComponent(UiKitComponent.DropdownMenuContent);
  const DropdownMenuItem = uikitRegistry.getComponent(UiKitComponent.DropdownMenuItem);
  const Button = uikitRegistry.getComponent(UiKitComponent.Button);

  const formatThemeName = (themeName: string): string => {
    return themeName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get themes directly from registry
  const availableThemes = themeRegistry.getThemeNames();

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <label className="text-sm text-muted-foreground whitespace-nowrap">
        Theme:
      </label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={ButtonVariant.Outline}
            className="inline-flex items-center justify-between min-w-40"
          >
            <span>{formatThemeName(currentTheme)}</span>
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {availableThemes.map((themeName) => (
            <DropdownMenuItem
              key={themeName}
              onClick={() => dispatch(setTheme(themeName))}
            >
              {formatThemeName(themeName)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

ThemeSelector.displayName = 'ThemeSelector';
