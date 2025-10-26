import React from 'react';
import { useAppSelector } from '@hai3/uicore';

/**
 * Hello World Screen
 * Displays current theme and menu state
 */
export const HelloWorldScreen: React.FC = () => {
  const theme = useAppSelector((state) => state.layout.theme);
  const menuCollapsed = useAppSelector((state) => state.menu.collapsed);

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Hello World</h1>
        <p className="text-muted-foreground">
          Welcome to HAI3 Demo Screenset
        </p>
      </div>

      <div className="flex flex-col gap-6 max-w-2xl">
        <div className="flex flex-col gap-2 p-6 border border-border rounded-lg bg-background">
          <h2 className="text-xl font-semibold">Current Theme</h2>
          <p className="text-2xl font-mono text-primary">{theme}</p>
        </div>

        <div className="flex flex-col gap-2 p-6 border border-border rounded-lg bg-background">
          <h2 className="text-xl font-semibold">Menu State</h2>
          <p className="text-2xl font-mono text-primary">
            {menuCollapsed ? 'Collapsed' : 'Expanded'}
          </p>
        </div>
      </div>
    </div>
  );
};

HelloWorldScreen.displayName = 'HelloWorldScreen';
