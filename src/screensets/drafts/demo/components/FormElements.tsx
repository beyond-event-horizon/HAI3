import React, { useState } from 'react';
import { Switch, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@hai3/uikit';
import { useTranslation, TextLoader } from '@hai3/uicore';
import { DEMO_SCREENSET_ID } from '../demoScreenset';
import { UI_KIT_ELEMENTS_SCREEN_ID } from '../screens/screenIds';

/**
 * Form Elements Component
 * Contains Select and Switch demonstrations
 */
export const FormElements: React.FC = () => {
  const { t } = useTranslation();
  const [airplaneMode, setAirplaneMode] = useState(false);

  return (
    <>
      {/* Select Element Block */}
      <div data-element-id="element-select" className="flex flex-col gap-4">
        <TextLoader skeletonClassName="h-8 w-24">
          <h2 className="text-2xl font-semibold">
            {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.select_heading`)}
          </h2>
        </TextLoader>
        <div className="flex items-center justify-center p-6 border border-border rounded-lg bg-background overflow-hidden">
          <Select>
            <SelectTrigger className="w-[280px] max-w-full">
              <SelectValue placeholder={t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.select_placeholder`)} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.select_group_north_america`)}</SelectLabel>
                <SelectItem value="est">{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.timezone_est`)}</SelectItem>
                <SelectItem value="cst">{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.timezone_cst`)}</SelectItem>
                <SelectItem value="mst">{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.timezone_mst`)}</SelectItem>
                <SelectItem value="pst">{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.timezone_pst`)}</SelectItem>
                <SelectItem value="akst">{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.timezone_akst`)}</SelectItem>
                <SelectItem value="hst">{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.timezone_hst`)}</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.select_group_europe_africa`)}</SelectLabel>
                <SelectItem value="gmt">{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.timezone_gmt`)}</SelectItem>
                <SelectItem value="cet">{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.timezone_cet`)}</SelectItem>
                <SelectItem value="eet">{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.timezone_eet`)}</SelectItem>
                <SelectItem value="west">{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.timezone_west`)}</SelectItem>
                <SelectItem value="cat">{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.timezone_cat`)}</SelectItem>
                <SelectItem value="eat">{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.timezone_eat`)}</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.select_group_asia`)}</SelectLabel>
                <SelectItem value="msk">{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.timezone_msk`)}</SelectItem>
                <SelectItem value="ist">{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.timezone_ist`)}</SelectItem>
                <SelectItem value="cst_china">{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.timezone_cst_china`)}</SelectItem>
                <SelectItem value="jst">{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.timezone_jst`)}</SelectItem>
                <SelectItem value="kst">{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.timezone_kst`)}</SelectItem>
                <SelectItem value="ist_indonesia">{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.timezone_wita`)}</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.select_group_australia_pacific`)}</SelectLabel>
                <SelectItem value="awst">{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.timezone_awst`)}</SelectItem>
                <SelectItem value="acst">{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.timezone_acst`)}</SelectItem>
                <SelectItem value="aest">{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.timezone_aest`)}</SelectItem>
                <SelectItem value="nzst">{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.timezone_nzst`)}</SelectItem>
                <SelectItem value="fjt">{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.timezone_fjt`)}</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.select_group_south_america`)}</SelectLabel>
                <SelectItem value="art">{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.timezone_art`)}</SelectItem>
                <SelectItem value="bot">{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.timezone_bot`)}</SelectItem>
                <SelectItem value="brt">{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.timezone_brt`)}</SelectItem>
                <SelectItem value="clt">{t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.timezone_clt`)}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Switch Element Block */}
      <div data-element-id="element-switch" className="flex flex-col gap-4">
        <TextLoader skeletonClassName="h-8 w-24">
          <h2 className="text-2xl font-semibold">
            {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.switch_heading`)}
          </h2>
        </TextLoader>
        <div className="flex flex-col gap-2 p-6 border border-border rounded-lg bg-background">
          <div className="flex items-center justify-center gap-2">
            <TextLoader skeletonClassName="h-5 w-32" inheritColor>
              <label
                htmlFor="airplane-mode-switch"
                className="cursor-pointer select-none"
              >
                {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.airplane_mode`)}
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

