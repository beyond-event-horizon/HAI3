import React from 'react';
import { Button, IconButton, ButtonVariant, IconButtonSize, Tooltip, TooltipTrigger, TooltipContent } from '@hai3/uikit';
import { useTranslation, TextLoader } from '@hai3/uicore';
import { StarIcon } from '../uikit/icons/StarIcon';
import { DEMO_SCREENSET_ID } from '../demoScreenset';
import { UI_KIT_ELEMENTS_SCREEN_ID } from '../screens/screenIds';

/**
 * Overlay Elements Component
 * Contains Tooltip demonstrations
 */
export const OverlayElements: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* Tooltip Element Block */}
      <div data-element-id="element-tooltip" className="flex flex-col gap-4">
        <TextLoader skeletonClassName="h-8 w-24">
          <h2 className="text-2xl font-semibold">
            {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.tooltip_heading`)}
          </h2>
        </TextLoader>
        <div className="flex items-center justify-center p-6 border border-border rounded-lg bg-background overflow-hidden">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={ButtonVariant.Outline}>
                  <TextLoader skeletonClassName="h-6 w-16" inheritColor>
                    {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.tooltip_hover_me`)}
                  </TextLoader>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-primary text-primary-foreground">
                <TextLoader skeletonClassName="h-3.5 w-28" inheritColor>
                  <p>{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.tooltip_text`)}</p>
                </TextLoader>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton
                  variant={ButtonVariant.Outline}
                  size={IconButtonSize.Default}
                  aria-label="Info button"
                >
                  <StarIcon />
                </IconButton>
              </TooltipTrigger>
              <TooltipContent className="bg-green-500 text-white">
                <TextLoader skeletonClassName="h-3.5 w-36" inheritColor>
                  <p>{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.tooltip_icon_text`)}</p>
                </TextLoader>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-sm text-muted-foreground underline cursor-help">
                  <TextLoader skeletonClassName="h-3.5 w-32" inheritColor>
                    {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.tooltip_hover_info`)}
                  </TextLoader>
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-destructive text-destructive-foreground">
                <TextLoader skeletonClassName="h-3.5 w-24" inheritColor>
                  <p>{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.tooltip_top_text`)}</p>
                </TextLoader>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-sm text-muted-foreground underline cursor-help">
                  <TextLoader skeletonClassName="h-3.5 w-24" inheritColor>
                    {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.tooltip_different_side`)}
                  </TextLoader>
                </span>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-muted text-muted-foreground">
                <TextLoader skeletonClassName="h-3.5 w-44" inheritColor>
                  <p>{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.tooltip_right_text`)}</p>
                </TextLoader>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </>
  );
};

OverlayElements.displayName = 'OverlayElements';

