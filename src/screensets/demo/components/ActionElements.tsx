import React from 'react';
import { Button, IconButton, ButtonVariant, ButtonSize, IconButtonSize } from '@hai3/uikit';
import { useTranslation, TextLoader } from '@hai3/uicore';
import { StarIcon } from '../uikit/icons/StarIcon';
import { DEMO_SCREENSET_ID } from "../ids";
import { UI_KIT_ELEMENTS_SCREEN_ID } from "../ids";

/**
 * Action Elements Component
 * Contains Button demonstrations
 * Uses parent screen (UIKitElementsScreen) translations
 */
export const ActionElements: React.FC = () => {
  const { t } = useTranslation();
  
  // Helper function to access parent screen's translations
  const tk = (key: string) => t(`screen.${DEMO_SCREENSET_ID}.${UI_KIT_ELEMENTS_SCREEN_ID}:${key}`);

  return (
    <>
      {/* Button Element Block */}
      <div data-element-id="element-button" className="flex flex-col gap-4">
        <TextLoader skeletonClassName="h-8 w-24">
          <h2 className="text-2xl font-semibold">
            {tk('button_heading')}
          </h2>
        </TextLoader>
        <div className="flex flex-col gap-4 p-6 border border-border rounded-lg bg-background overflow-hidden">
          {/* First row: 6 Default sized buttons with variants */}
          <div className="flex flex-wrap items-center justify-between w-full gap-2 min-w-0">
            <Button variant={ButtonVariant.Default} className="shrink-0">
              <TextLoader skeletonClassName="h-6 w-16" inheritColor>
                {tk('button_default')}
              </TextLoader>
            </Button>
            <Button variant={ButtonVariant.Destructive} className="shrink-0">
              <TextLoader skeletonClassName="h-6 w-20" inheritColor>
                {tk('button_destructive')}
              </TextLoader>
            </Button>
            <Button variant={ButtonVariant.Outline} className="shrink-0">
              <TextLoader skeletonClassName="h-6 w-16" inheritColor>
                {tk('button_outline')}
              </TextLoader>
            </Button>
            <Button variant={ButtonVariant.Secondary} className="shrink-0">
              <TextLoader skeletonClassName="h-6 w-20" inheritColor>
                {tk('button_secondary')}
              </TextLoader>
            </Button>
            <Button variant={ButtonVariant.Ghost} className="shrink-0">
              <TextLoader skeletonClassName="h-6 w-16" inheritColor>
                {tk('button_ghost')}
              </TextLoader>
            </Button>
            <Button variant={ButtonVariant.Link} className="shrink-0">
              <TextLoader skeletonClassName="h-6 w-12" inheritColor>
                {tk('button_link')}
              </TextLoader>
            </Button>
          </div>

          {/* Second row: 6 buttons grouped by size (Small, Default, Large) */}
          <div className="flex flex-wrap items-center justify-between w-full gap-2 min-w-0">
            {/* Small group */}
            <div className="flex items-center gap-2 shrink-0">
              <Button variant={ButtonVariant.Outline} size={ButtonSize.Sm}>
                <TextLoader skeletonClassName="h-5 w-24" inheritColor>
                  {tk('button_small_outlined')}
                </TextLoader>
              </Button>
              <IconButton
                variant={ButtonVariant.Outline}
                size={IconButtonSize.Small}
                aria-label="Small icon button"
              >
                <StarIcon className="w-4 h-4" />
              </IconButton>
            </div>

            {/* Default group */}
            <div className="flex items-center gap-2 shrink-0">
              <Button variant={ButtonVariant.Outline} size={ButtonSize.Default}>
                <TextLoader skeletonClassName="h-6 w-28" inheritColor>
                  {tk('button_default_outlined')}
                </TextLoader>
              </Button>
              <IconButton
                variant={ButtonVariant.Outline}
                size={IconButtonSize.Default}
                aria-label="Default icon button"
              >
                <StarIcon />
              </IconButton>
            </div>

            {/* Large group */}
            <div className="flex items-center gap-2 shrink-0">
              <Button variant={ButtonVariant.Outline} size={ButtonSize.Lg}>
                <TextLoader skeletonClassName="h-6 w-32" inheritColor>
                  {tk('button_large_outlined')}
                </TextLoader>
              </Button>
              <IconButton
                variant={ButtonVariant.Outline}
                size={IconButtonSize.Large}
                aria-label="Large icon button"
              >
                <StarIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

ActionElements.displayName = 'ActionElements';

