import React from 'react';
import { useAppSelector, useAppDispatch } from '@/core/hooks/useRedux';
import { setTheme } from '@/core/layout/layoutSlice';

/**
 * ThemeSelector Component
 * Redux-aware reusable component for theme selection
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

  if (availableThemes.length === 0) return null;

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    dispatch(setTheme(event.target.value));
  };

  const formatThemeName = (themeName: string): string => {
    return themeName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label htmlFor="theme-select" className="text-sm text-muted-foreground">
        Theme:
      </label>
      <select
        id="theme-select"
        value={currentTheme}
        onChange={handleThemeChange}
        className="px-2 py-1 text-sm bg-background border border-border rounded hover:bg-accent transition-colors cursor-pointer"
      >
        {availableThemes.map((themeName) => (
          <option key={themeName} value={themeName}>
            {formatThemeName(themeName)}
          </option>
        ))}
      </select>
    </div>
  );
};

ThemeSelector.displayName = 'ThemeSelector';
