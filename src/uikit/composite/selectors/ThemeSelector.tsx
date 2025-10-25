import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/uikit/base/_shadcn/select';
import type { ThemeName } from '@/styles/themeRegistry';
import { themes } from '@/styles/themeRegistry';

/**
 * ThemeSelector component for HAI3 UI-Core
 * Dropdown selector for switching between available themes
 * Composite component - uses shadcn Select primitives
 */

export interface ThemeSelectorProps {
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
  className?: string;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onThemeChange,
  className,
}) => {
  const themeNames = Object.keys(themes) as ThemeName[];
  
  const getThemeLabel = (theme: ThemeName): string => {
    return theme
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Select value={currentTheme} onValueChange={onThemeChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select theme" />
      </SelectTrigger>
      <SelectContent>
        {themeNames.map((theme) => (
          <SelectItem key={theme} value={theme}>
            {getThemeLabel(theme)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

ThemeSelector.displayName = 'ThemeSelector';
