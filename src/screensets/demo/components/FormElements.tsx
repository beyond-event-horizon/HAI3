import React, { useState } from 'react';
import { Switch, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@hai3/uikit';
import { useTranslation, TextLoader } from '@hai3/uicore';
import { DEMO_SCREENSET_ID } from '../demoScreenset';
import { UI_KIT_ELEMENTS_SCREEN_ID } from '../screens/screenIds';

/**
 * Form Elements Component
 * Contains Select and Switch demonstrations
 * Uses parent screen (UIKitElementsScreen) translations
 */
export const FormElements: React.FC = () => {
  const { t } = useTranslation();
  
  // Helper function to access parent screen's translations
  const tk = (key: string) => t(`screen.${DEMO_SCREENSET_ID}.${UI_KIT_ELEMENTS_SCREEN_ID}:${key}`);
  
  const [airplaneMode, setAirplaneMode] = useState(false);

  return (
    <>
      {/* Select Element Block */}
      <div data-element-id="element-select" className="flex flex-col gap-4">
        <TextLoader skeletonClassName="h-8 w-24">
          <h2 className="text-2xl font-semibold">
            {tk('select_heading')}
          </h2>
        </TextLoader>
        <div className="flex items-center justify-center p-6 border border-border rounded-lg bg-background overflow-hidden">
          <Select>
            <SelectTrigger className="w-[280px] max-w-full">
              <SelectValue placeholder={tk('select_placeholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{tk('select_group_north_america')}</SelectLabel>
                <SelectItem value="est">{tk('timezone_est')}</SelectItem>
                <SelectItem value="cst">{tk('timezone_cst')}</SelectItem>
                <SelectItem value="mst">{tk('timezone_mst')}</SelectItem>
                <SelectItem value="pst">{tk('timezone_pst')}</SelectItem>
                <SelectItem value="akst">{tk('timezone_akst')}</SelectItem>
                <SelectItem value="hst">{tk('timezone_hst')}</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>{tk('select_group_europe_africa')}</SelectLabel>
                <SelectItem value="gmt">{tk('timezone_gmt')}</SelectItem>
                <SelectItem value="cet">{tk('timezone_cet')}</SelectItem>
                <SelectItem value="eet">{tk('timezone_eet')}</SelectItem>
                <SelectItem value="west">{tk('timezone_west')}</SelectItem>
                <SelectItem value="cat">{tk('timezone_cat')}</SelectItem>
                <SelectItem value="eat">{tk('timezone_eat')}</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>{tk('select_group_asia')}</SelectLabel>
                <SelectItem value="msk">{tk('timezone_msk')}</SelectItem>
                <SelectItem value="ist">{tk('timezone_ist')}</SelectItem>
                <SelectItem value="cst_china">{tk('timezone_cst_china')}</SelectItem>
                <SelectItem value="jst">{tk('timezone_jst')}</SelectItem>
                <SelectItem value="kst">{tk('timezone_kst')}</SelectItem>
                <SelectItem value="ist_indonesia">{tk('timezone_wita')}</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>{tk('select_group_australia_pacific')}</SelectLabel>
                <SelectItem value="awst">{tk('timezone_awst')}</SelectItem>
                <SelectItem value="acst">{tk('timezone_acst')}</SelectItem>
                <SelectItem value="aest">{tk('timezone_aest')}</SelectItem>
                <SelectItem value="nzst">{tk('timezone_nzst')}</SelectItem>
                <SelectItem value="fjt">{tk('timezone_fjt')}</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>{tk('select_group_south_america')}</SelectLabel>
                <SelectItem value="art">{tk('timezone_art')}</SelectItem>
                <SelectItem value="bot">{tk('timezone_bot')}</SelectItem>
                <SelectItem value="brt">{tk('timezone_brt')}</SelectItem>
                <SelectItem value="clt">{tk('timezone_clt')}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Switch Element Block */}
      <div data-element-id="element-switch" className="flex flex-col gap-4">
        <TextLoader skeletonClassName="h-8 w-24">
          <h2 className="text-2xl font-semibold">
            {tk('switch_heading')}
          </h2>
        </TextLoader>
        <div className="flex flex-col gap-2 p-6 border border-border rounded-lg bg-background">
          <div className="flex items-center justify-center gap-2">
            <TextLoader skeletonClassName="h-5 w-32" inheritColor>
              <label
                htmlFor="airplane-mode-switch"
                className="cursor-pointer select-none"
              >
                {tk('airplane_mode')}
              </label>
            </TextLoader>
            <Switch
              id="airplane-mode-switch"
              checked={airplaneMode}
              onCheckedChange={setAirplaneMode}
            />
          </div>
        </div>
      </div>
    </>
  );
};

FormElements.displayName = 'FormElements';

