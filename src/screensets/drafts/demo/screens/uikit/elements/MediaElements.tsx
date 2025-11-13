import React, { useState } from 'react';
import { Slider, SliderTrack, SliderRange, SliderThumb } from '@hai3/uikit';
import { useTranslation, TextLoader } from '@hai3/uicore';
import { StarIcon } from '../../../uikit/icons/StarIcon';
import { DEMO_SCREENSET_ID } from '../../../demoScreenset';
import { UI_KIT_ELEMENTS_SCREEN_ID } from '../UIKitElementsScreen';

/**
 * Media Elements Component
 * Contains Slider demonstrations
 */
export const MediaElements: React.FC = () => {
  const { t } = useTranslation();
  const [sliderValue, setSliderValue] = useState([50]);
  const [customSliderValue, setCustomSliderValue] = useState([50]);

  return (
    <>
      {/* Slider Element Block */}
      <div data-element-id="element-slider" className="flex flex-col gap-4">
        <TextLoader skeletonClassName="h-8 w-24">
          <h2 className="text-2xl font-semibold">
            {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.slider_heading`)}
          </h2>
        </TextLoader>
        <div className="flex items-center justify-center p-6 border border-border rounded-lg bg-background overflow-hidden">
          <div className="flex flex-col gap-8 w-full max-w-md">
            <div className="flex flex-col gap-2">
              <TextLoader skeletonClassName="h-5 w-20" inheritColor>
                <label className="text-sm font-medium">
                  {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.slider_volume_label`)}
                </label>
              </TextLoader>
              <Slider
                value={sliderValue}
                onValueChange={setSliderValue}
                max={100}
                step={1}
                className="w-full"
              >
                <SliderTrack>
                  <SliderRange />
                </SliderTrack>
                <SliderThumb />
              </Slider>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>{sliderValue[0]}</span>
                <span>100</span>
              </div>
            </div>
            
            {/* Customized slider */}
            <div className="flex flex-col gap-2">
              <Slider
                value={customSliderValue}
                onValueChange={setCustomSliderValue}
                max={100}
                step={1}
                className="w-full"
              >
                <SliderTrack className="bg-destructive/20">
                  <SliderRange className="bg-destructive" />
                </SliderTrack>
                <SliderThumb className="border-muted-foreground flex items-center justify-center bg-transparent p-0">
                  <StarIcon className="w-4 h-4 fill-muted-foreground text-muted-foreground stroke-muted-foreground" />
                </SliderThumb>
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

MediaElements.displayName = 'MediaElements';

