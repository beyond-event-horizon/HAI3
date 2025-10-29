import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
  ButtonVariant,
} from '@/uikit';
import { ChevronDown } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/core/hooks/useRedux';
import { setTheme } from '../core/actions';

/**
 * ThemeSelector Component
 * Redux-aware component for theme selection using DropdownMenu
 * Can be used in Footer, Header, Sidebar, or anywhere else
 */

export interface ThemeSelectorProps {
  availableThemes: string[];
  className?: string;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
  availableThemes,
  className = '',
}) => {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state) => state.layout.theme);

  const formatThemeName = (themeName: string): string => {
    return themeName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

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
