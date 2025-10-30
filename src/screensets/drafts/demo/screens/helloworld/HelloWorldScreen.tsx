import React from 'react';
import { navigateToScreen } from '@hai3/uicore';
import { Button } from '@hai3/uikit';
import { CURRENT_THEME_SCREEN_ID } from '../theme/CurrentThemeScreen';

/**
 * Hello World Screen ID
 * Well-known constant defined where it belongs
 */
export const HELLO_WORLD_SCREEN_ID = 'helloworld';

/**
 * Hello World Screen
 * Simple welcome screen with navigation example
 */
export const HelloWorldScreen: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Hello World</h1>
        <p className="text-muted-foreground">
          Welcome to HAI3 Demo Screenset
        </p>
      </div>

      <div className="max-w-2xl p-6 border border-border rounded-lg bg-background">
        <p className="text-lg">
          This is a simple demo screen showing the HAI3 framework in action.
          Navigate through the menu to explore different features.
        </p>
      </div>

      <div className="max-w-2xl">
        <div className="flex flex-col gap-4 p-6 border border-border rounded-lg bg-background">
          <h2 className="text-xl font-semibold">Navigation Example</h2>
          <p className="text-muted-foreground">
            Click the button below to navigate to the Theme screen programmatically.
          </p>
          <Button onClick={() => navigateToScreen(CURRENT_THEME_SCREEN_ID)}>
            Go to Theme Screen
          </Button>
        </div>
      </div>
    </div>
  );
};

HelloWorldScreen.displayName = 'HelloWorldScreen';
