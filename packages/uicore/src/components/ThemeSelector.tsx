import React from 'react';
import { SimpleSelect, type SimpleSelectOption } from '@/uikit';
import { useAppSelector, useAppDispatch } from '@/core/hooks/useRedux';
import { setTheme } from '@/core/layout/layoutSlice';

/**
 * ThemeSelector Component
 * Redux-aware reusable component for theme selection
 * Uses SimpleSelect composite component from UI Kit
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

  const handleThemeChange = (themeName: string): void => {
    dispatch(setTheme(themeName));
  };

  const formatThemeName = (themeName: string): string => {
    return themeName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const options: SimpleSelectOption[] = availableThemes.map((themeName) => ({
    value: themeName,
    label: formatThemeName(themeName),
  }));

  return (
    <SimpleSelect
      options={options}
      value={currentTheme}
      onChange={handleThemeChange}
      label="Theme"
      className={className}
    />
  );
};

ThemeSelector.displayName = 'ThemeSelector';
