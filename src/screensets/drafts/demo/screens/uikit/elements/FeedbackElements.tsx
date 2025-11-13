import React, { useState } from 'react';
import { Progress, Skeleton, Spinner } from '@hai3/uikit';
import { useTranslation, TextLoader } from '@hai3/uicore';
import { LoaderIcon } from '../../../uikit/icons/LoaderIcon';
import { DEMO_SCREENSET_ID } from '../../../demoScreenset';
import { UI_KIT_ELEMENTS_SCREEN_ID } from '../UIKitElementsScreen';

/**
 * Feedback Elements Component
 * Contains Progress, Spinner, and Skeleton demonstrations
 */
export const FeedbackElements: React.FC = () => {
  const { t } = useTranslation();
  const [progressValue, setProgressValue] = useState(33);

  return (
    <>
      {/* Progress Element Block */}
      <div data-element-id="element-progress" className="flex flex-col gap-4">
        <TextLoader skeletonClassName="h-8 w-24">
          <h2 className="text-2xl font-semibold">
            {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.progress_heading`)}
          </h2>
        </TextLoader>
        <div className="flex items-center justify-center p-6 border border-border rounded-lg bg-background overflow-hidden">
          <div className="flex flex-col gap-6 w-full max-w-md">
            <div className="flex flex-col gap-2">
              <TextLoader skeletonClassName="h-5 w-32" inheritColor>
                <label className="text-sm font-medium">
                  {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.progress_primary_label`)}
                </label>
              </TextLoader>
              <Progress value={progressValue} className="bg-primary/20" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{progressValue}%</span>
                <TextLoader skeletonClassName="h-3.5 w-14" inheritColor>
                  <button
                    onClick={() => setProgressValue((prev) => Math.min(100, prev + 10))}
                    className="text-primary hover:underline"
                  >
                    {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.progress_increase`)}
                  </button>
                </TextLoader>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <TextLoader skeletonClassName="h-4 w-36" inheritColor>
                <label className="text-sm font-medium">
                  {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.progress_destructive_label`)}
                </label>
              </TextLoader>
              <Progress 
                value={progressValue} 
                className="bg-destructive/20 [&>div]:bg-destructive" 
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{progressValue}%</span>
                <TextLoader skeletonClassName="h-3.5 w-14" inheritColor>
                  <button
                    onClick={() => setProgressValue((prev) => Math.max(0, prev - 10))}
                    className="text-destructive hover:underline"
                  >
                    {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.progress_decrease`)}
                  </button>
                </TextLoader>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spinner Element Block */}
      <div data-element-id="element-spinner" className="flex flex-col gap-4">
        <TextLoader skeletonClassName="h-8 w-24">
          <h2 className="text-2xl font-semibold">
            {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.spinner_heading`)}
          </h2>
        </TextLoader>
        <div className="flex items-center justify-center p-6 border border-border rounded-lg bg-background overflow-hidden">
          <div className="flex flex-wrap items-center justify-center gap-8">
            {/* Different sizes */}
            <Spinner size="size-4" className="text-primary" />
            <Spinner size="size-6" className="text-primary" />
            <Spinner size="size-8" className="text-primary" />
            <Spinner size="size-12" className="text-primary" />
            
            {/* Different colors */}
            <Spinner icon={LoaderIcon} size="size-6" className="text-primary" />
            <Spinner icon={LoaderIcon} size="size-6" className="text-destructive" />
            <Spinner icon={LoaderIcon} size="size-6" className="text-muted-foreground" />

            {/* Different colors */}
            <Spinner size="size-6" className="text-green-500" />
            <Spinner size="size-6" className="text-purple-500" />
            <Spinner size="size-6" className="text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Skeleton Element Block */}
      <div data-element-id="element-skeleton" className="flex flex-col gap-4">
        <TextLoader skeletonClassName="h-8 w-24">
          <h2 className="text-2xl font-semibold">
            {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.skeleton_heading`)}
          </h2>
        </TextLoader>
        <div className="flex items-center justify-center p-6 border border-border rounded-lg bg-background overflow-hidden">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

FeedbackElements.displayName = 'FeedbackElements';

