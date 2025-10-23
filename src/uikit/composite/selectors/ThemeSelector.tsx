import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/uikit/base/_shadcn/select';
import type { ThemeName } from '@/styles/themes';
import { themes } from '@/styles/themes';

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
    return theme.charAt(0).toUpperCase() + theme.slice(1);
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
