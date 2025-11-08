import React from 'react';
import { navigateToScreen, useTranslation, uikitRegistry, UiKitComponent } from '@hai3/uicore';
import { Skeleton, Card, CardContent } from '@hai3/uikit';
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
  const { t, translationsReady } = useTranslation();
  const Button = uikitRegistry.getComponent(UiKitComponent.Button);
  
  // Show skeleton loaders while translations loading
  if (!translationsReady) {
    return (
      <div className="flex flex-col gap-8 p-8">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>

        <Card className="max-w-2xl">
          <CardContent className="pt-6">
            <Skeleton className="h-6 w-full" />
          </CardContent>
        </Card>

        <Card className="max-w-2xl">
          <CardContent className="flex flex-col gap-4 pt-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
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

      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <p className="text-lg">
            {t(`screenset.${DEMO_SCREENSET_ID}:screens.${HELLO_WORLD_SCREEN_ID}.description`)}
          </p>
        </CardContent>
      </Card>

      <Card className="max-w-2xl">
        <CardContent className="flex flex-col gap-4 pt-6">
          <h2 className="text-xl font-semibold">
            {t(`screenset.${DEMO_SCREENSET_ID}:screens.${HELLO_WORLD_SCREEN_ID}.navigation_title`)}
          </h2>
          <p className="text-muted-foreground">
            {t(`screenset.${DEMO_SCREENSET_ID}:screens.${HELLO_WORLD_SCREEN_ID}.navigation_description`)}
          </p>
          <Button onClick={() => navigateToScreen(CURRENT_THEME_SCREEN_ID)}>
            {t(`screenset.${DEMO_SCREENSET_ID}:screens.${HELLO_WORLD_SCREEN_ID}.go_to_theme`)}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

HelloWorldScreen.displayName = 'HelloWorldScreen';
