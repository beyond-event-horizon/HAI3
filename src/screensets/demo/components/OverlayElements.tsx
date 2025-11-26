import React from 'react';
import { 
  Button, 
  IconButton, 
  ButtonVariant,
  ButtonSize,
  IconButtonSize, 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent,
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@hai3/uikit';
import { useTranslation, TextLoader } from '@hai3/uicore';
import { StarIcon } from '../uikit/icons/StarIcon';
import { FormInput } from '../uikit/icons/FormInput';
import { DEMO_SCREENSET_ID } from "../ids";
import { UI_KIT_ELEMENTS_SCREEN_ID } from "../ids";

/**
 * Overlay Elements Component
 * Contains Popover and Tooltip demonstrations
 * Uses parent screen (UIKitElementsScreen) translations
 */
export const OverlayElements: React.FC = () => {
  const { t } = useTranslation();
  
  // Helper function to access parent screen's translations
  const tk = (key: string) => t(`screen.${DEMO_SCREENSET_ID}.${UI_KIT_ELEMENTS_SCREEN_ID}:${key}`);

  return (
    <>
      {/* Popover Element Block */}
      <div data-element-id="element-popover" className="flex flex-col gap-4">
        <TextLoader skeletonClassName="h-8 w-32">
          <h2 className="text-2xl font-semibold">
            {tk('popover_heading')}
          </h2>
        </TextLoader>
        <div className="flex flex-col gap-6 p-6 border border-border rounded-lg bg-background overflow-hidden">
          
          {/* Basic Popover */}
          <div className="flex flex-col gap-2">
            <TextLoader skeletonClassName="h-4 w-32" inheritColor>
              <label className="text-xs text-muted-foreground">
                {tk('popover_basic_label')}
              </label>
            </TextLoader>
            <div className="flex justify-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={ButtonVariant.Outline}>
                    <TextLoader skeletonClassName="h-4 w-24" inheritColor>
                      {tk('popover_open_button')}
                    </TextLoader>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <TextLoader skeletonClassName="h-5 w-32" inheritColor>
                        <h4 className="font-medium leading-none">
                          {tk('popover_basic_title')}
                        </h4>
                      </TextLoader>
                      <TextLoader skeletonClassName="h-4 w-full" inheritColor>
                        <p className="text-sm text-muted-foreground">
                          {tk('popover_basic_description')}
                        </p>
                      </TextLoader>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Popover with Form */}
          <div className="flex flex-col gap-2">
            <TextLoader skeletonClassName="h-4 w-32" inheritColor>
              <label className="text-xs text-muted-foreground">
                {tk('popover_form_label')}
              </label>
            </TextLoader>
            <div className="flex justify-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={ButtonVariant.Default}>
                    <TextLoader skeletonClassName="h-4 w-32" inheritColor>
                      {tk('popover_dimensions_button')}
                    </TextLoader>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <TextLoader skeletonClassName="h-5 w-24" inheritColor>
                        <h4 className="font-medium leading-none">
                          {tk('popover_dimensions_title')}
                        </h4>
                      </TextLoader>
                      <TextLoader skeletonClassName="h-4 w-full" inheritColor>
                        <p className="text-sm text-muted-foreground">
                          {tk('popover_dimensions_description')}
                        </p>
                      </TextLoader>
                    </div>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-3 items-center gap-4">
                        <TextLoader skeletonClassName="h-4 w-12" inheritColor>
                          <label htmlFor="width" className="text-sm">
                            {tk('popover_width_label')}
                          </label>
                        </TextLoader>
                        <FormInput
                          id="width"
                          defaultValue="100%"
                          className="col-span-2 h-8"
                        />
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <TextLoader skeletonClassName="h-4 w-16" inheritColor>
                          <label htmlFor="height" className="text-sm">
                            {tk('popover_height_label')}
                          </label>
                        </TextLoader>
                        <FormInput
                          id="height"
                          defaultValue="25px"
                          className="col-span-2 h-8"
                        />
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Popover with Different Positioning */}
          <div className="flex flex-col gap-2">
            <TextLoader skeletonClassName="h-4 w-40" inheritColor>
              <label className="text-xs text-muted-foreground">
                {tk('popover_positions_label')}
              </label>
            </TextLoader>
            <div className="flex justify-center gap-4 flex-wrap">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={ButtonVariant.Outline} size={ButtonSize.Sm}>
                    <TextLoader skeletonClassName="h-3.5 w-12" inheritColor>
                      {tk('popover_top')}
                    </TextLoader>
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="top">
                  <TextLoader skeletonClassName="h-4 w-32" inheritColor>
                    <p className="text-sm">
                      {tk('popover_top_content')}
                    </p>
                  </TextLoader>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={ButtonVariant.Outline} size={ButtonSize.Sm}>
                    <TextLoader skeletonClassName="h-3.5 w-16" inheritColor>
                      {tk('popover_right')}
                    </TextLoader>
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="right">
                  <TextLoader skeletonClassName="h-4 w-36" inheritColor>
                    <p className="text-sm">
                      {tk('popover_right_content')}
                    </p>
                  </TextLoader>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={ButtonVariant.Outline} size={ButtonSize.Sm}>
                    <TextLoader skeletonClassName="h-3.5 w-16" inheritColor>
                      {tk('popover_bottom')}
                    </TextLoader>
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="bottom">
                  <TextLoader skeletonClassName="h-4 w-40" inheritColor>
                    <p className="text-sm">
                      {tk('popover_bottom_content')}
                    </p>
                  </TextLoader>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={ButtonVariant.Outline} size={ButtonSize.Sm}>
                    <TextLoader skeletonClassName="h-3.5 w-12" inheritColor>
                      {tk('popover_left')}
                    </TextLoader>
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="left">
                  <TextLoader skeletonClassName="h-4 w-32" inheritColor>
                    <p className="text-sm">
                      {tk('popover_left_content')}
                    </p>
                  </TextLoader>
                </PopoverContent>
              </Popover>
            </div>
          </div>

        </div>
      </div>

      {/* Tooltip Element Block */}
      <div data-element-id="element-tooltip" className="flex flex-col gap-4">
        <TextLoader skeletonClassName="h-8 w-24">
          <h2 className="text-2xl font-semibold">
            {tk('tooltip_heading')}
          </h2>
        </TextLoader>
        <div className="flex items-center justify-center p-6 border border-border rounded-lg bg-background overflow-hidden">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={ButtonVariant.Outline}>
                  <TextLoader skeletonClassName="h-6 w-16" inheritColor>
                    {tk('tooltip_hover_me')}
                  </TextLoader>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-primary text-primary-foreground">
                <TextLoader skeletonClassName="h-3.5 w-28" inheritColor>
                  <p>{tk('tooltip_text')}</p>
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
                  <p>{tk('tooltip_icon_text')}</p>
                </TextLoader>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-sm text-muted-foreground underline cursor-help">
                  <TextLoader skeletonClassName="h-3.5 w-32" inheritColor>
                    {tk('tooltip_hover_info')}
                  </TextLoader>
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-destructive text-destructive-foreground">
                <TextLoader skeletonClassName="h-3.5 w-24" inheritColor>
                  <p>{tk('tooltip_top_text')}</p>
                </TextLoader>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-sm text-muted-foreground underline cursor-help">
                  <TextLoader skeletonClassName="h-3.5 w-24" inheritColor>
                    {tk('tooltip_different_side')}
                  </TextLoader>
                </span>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-muted text-muted-foreground">
                <TextLoader skeletonClassName="h-3.5 w-44" inheritColor>
                  <p>{tk('tooltip_right_text')}</p>
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

