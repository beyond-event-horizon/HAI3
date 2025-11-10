import React from 'react';
import { useAppSelector, useTranslation, TextLoader } from '@hai3/uicore';
import { DEMO_SCREENSET_ID } from '../../demoScreenset';

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
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-col gap-4">
        <TextLoader skeletonClassName="h-10 w-48">
          <h1 className="text-4xl font-bold">
            {t(`screenset.${DEMO_SCREENSET_ID}:screens.${CURRENT_THEME_SCREEN_ID}.title`)}
          </h1>
        </TextLoader>
        <TextLoader skeletonClassName="h-6 w-full">
          <p className="text-muted-foreground">
            {t(`screenset.${DEMO_SCREENSET_ID}:screens.${CURRENT_THEME_SCREEN_ID}.description`)}
          </p>
        </TextLoader>
      </div>

      <div className="max-w-2xl">
        <div className="flex flex-col gap-2 p-6 border border-border rounded-lg bg-background">
          <TextLoader skeletonClassName="h-7 w-32">
            <h2 className="text-xl font-semibold">
              {t(`screenset.${DEMO_SCREENSET_ID}:screens.${CURRENT_THEME_SCREEN_ID}.current_theme_label`)}
            </h2>
          </TextLoader>
          <p className="text-3xl font-mono text-primary">{theme || 'None'}</p>
        </div>
      </div>
    </div>
  );
};

CurrentThemeScreen.displayName = 'CurrentThemeScreen';
