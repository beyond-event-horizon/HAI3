import React from 'react';
import { navigateToScreen, useTranslation, uikitRegistry, UiKitComponent, TextLoader } from '@hai3/uicore';
import { Card, CardContent } from '@hai3/uikit';
import { HELLO_WORLD_SCREEN_ID, CURRENT_THEME_SCREEN_ID } from '../screenIds';
import { DEMO_SCREENSET_ID } from '../../demoScreenset';

/**
 * Hello World Screen
 * Simple welcome screen with navigation example
 * Uses TextLoader for automatic translation loading states
 */
export const HelloWorldScreen: React.FC = () => {
  const { t } = useTranslation();
  const Button = uikitRegistry.getComponent(UiKitComponent.Button);
  
  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-col gap-4">
        <TextLoader skeletonClassName="h-10 w-64">
          <h1 className="text-4xl font-bold">
            {t(`screenset.${DEMO_SCREENSET_ID}:screens.${HELLO_WORLD_SCREEN_ID}.title`)}
          </h1>
        </TextLoader>
        <TextLoader skeletonClassName="h-6 w-96">
          <p className="text-muted-foreground">
            {t(`screenset.${DEMO_SCREENSET_ID}:screens.${HELLO_WORLD_SCREEN_ID}.welcome`)}
          </p>
        </TextLoader>
      </div>

      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <TextLoader skeletonClassName="h-6 w-full">
            <p className="text-lg">
              {t(`screenset.${DEMO_SCREENSET_ID}:screens.${HELLO_WORLD_SCREEN_ID}.description`)}
            </p>
          </TextLoader>
        </CardContent>
      </Card>

      <Card className="max-w-2xl">
        <CardContent className="flex flex-col gap-4 pt-6">
          <TextLoader skeletonClassName="h-8 w-48">
            <h2 className="text-xl font-semibold">
              {t(`screenset.${DEMO_SCREENSET_ID}:screens.${HELLO_WORLD_SCREEN_ID}.navigation_title`)}
            </h2>
          </TextLoader>
          <TextLoader skeletonClassName="h-5 w-full">
            <p className="text-muted-foreground">
              {t(`screenset.${DEMO_SCREENSET_ID}:screens.${HELLO_WORLD_SCREEN_ID}.navigation_description`)}
            </p>
          </TextLoader>
          <Button onClick={() => navigateToScreen(CURRENT_THEME_SCREEN_ID)}>
            <TextLoader skeletonClassName="h-5 w-32" inheritColor>
              {t(`screenset.${DEMO_SCREENSET_ID}:screens.${HELLO_WORLD_SCREEN_ID}.go_to_theme`)}
            </TextLoader>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

HelloWorldScreen.displayName = 'HelloWorldScreen';

// Default export for lazy loading
export default HelloWorldScreen;
