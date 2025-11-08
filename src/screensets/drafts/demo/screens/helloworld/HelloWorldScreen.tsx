import React from 'react';
import { navigateToScreen, useTranslation } from '@hai3/uicore';
import { Button } from '@hai3/uikit';
import { CURRENT_THEME_SCREEN_ID } from '../theme/CurrentThemeScreen';
import { DEMO_SCREENSET_ID } from '../../demoScreenset';

/**
 * Hello World Screen ID
 */
export const HELLO_WORLD_SCREEN_ID = 'helloworld';

/**
 * Hello World Screen
 * Simple welcome screen with navigation example
 */
export const HelloWorldScreen: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">
          {t(`screenset.${DEMO_SCREENSET_ID}:screens.${HELLO_WORLD_SCREEN_ID}.title`)}
        </h1>
        <p className="text-muted-foreground">
          {t(`screenset.${DEMO_SCREENSET_ID}:screens.${HELLO_WORLD_SCREEN_ID}.welcome`)}
        </p>
      </div>

      <div className="max-w-2xl p-6 border border-border rounded-lg bg-background">
        <p className="text-lg">
          {t(`screenset.${DEMO_SCREENSET_ID}:screens.${HELLO_WORLD_SCREEN_ID}.description`)}
        </p>
      </div>

      <div className="max-w-2xl">
        <div className="flex flex-col gap-4 p-6 border border-border rounded-lg bg-background">
          <h2 className="text-xl font-semibold">
            {t(`screenset.${DEMO_SCREENSET_ID}:screens.${HELLO_WORLD_SCREEN_ID}.navigation_title`)}
          </h2>
          <p className="text-muted-foreground">
            {t(`screenset.${DEMO_SCREENSET_ID}:screens.${HELLO_WORLD_SCREEN_ID}.navigation_description`)}
          </p>
          <Button onClick={() => navigateToScreen(CURRENT_THEME_SCREEN_ID)}>
            {t(`screenset.${DEMO_SCREENSET_ID}:screens.${HELLO_WORLD_SCREEN_ID}.go_to_theme`)}
          </Button>
        </div>
      </div>
    </div>
  );
};

HelloWorldScreen.displayName = 'HelloWorldScreen';
