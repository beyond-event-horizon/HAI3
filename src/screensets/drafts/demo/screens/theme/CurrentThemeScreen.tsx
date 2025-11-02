import React from 'react';
import { useAppSelector } from '@hai3/uicore';

/**
 * Current Theme Screen ID
 */
export const CURRENT_THEME_SCREEN_ID = 'theme';

/**
 * Current Theme Screen
 * Displays the currently active theme
 */
export const CurrentThemeScreen: React.FC = () => {
  const theme = useAppSelector((state) => state.layout.theme);

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Current Theme</h1>
        <p className="text-muted-foreground">
          Shows the currently active theme
        </p>
      </div>

      <div className="max-w-2xl">
        <div className="flex flex-col gap-2 p-6 border border-border rounded-lg bg-background">
          <h2 className="text-xl font-semibold">Active Theme</h2>
          <p className="text-3xl font-mono text-primary">{theme || 'None'}</p>
        </div>
      </div>
    </div>
  );
};

CurrentThemeScreen.displayName = 'CurrentThemeScreen';
