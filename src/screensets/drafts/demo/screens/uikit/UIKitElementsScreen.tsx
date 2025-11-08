import React, { useState } from 'react';
import { useTranslation } from '@hai3/uicore';
import { Switch, Button, IconButton, ButtonVariant, ButtonSize, IconButtonSize, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, Skeleton, Avatar, AvatarImage, AvatarFallback } from '@hai3/uikit';
import { StarIcon } from '../../uikit/icons/StarIcon';
import { DEMO_SCREENSET_ID } from '../../demoScreenset';

/**
 * UI Kit Elements Screen ID
 */
export const UI_KIT_ELEMENTS_SCREEN_ID = 'uikit';

/**
 * UI Kit Elements Screen
 * Demo page with available UI Kit elements and styles annotations
 */
export const UIKitElementsScreen: React.FC = () => {
  const [airplaneMode, setAirplaneMode] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">
          {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.title`)}
        </h1>
        <p className="text-muted-foreground">
          {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.description`)}
        </p>
      </div>

      <div className="max-w-2xl flex flex-col gap-8">
        {/* Avatar Element Block */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">
            {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.avatar_heading`)}
          </h2>
          <div className="flex items-center justify-center p-6 border border-border rounded-lg bg-background">
            <div className="flex flex-row flex-wrap items-center gap-12">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar className="rounded-lg">
                <AvatarImage
                  src="https://github.com/evilrabbit.png"
                  alt="@evilrabbit"
                />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
              <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarImage
                    src="https://github.com/maxleiter.png"
                    alt="@maxleiter"
                  />
                  <AvatarFallback>LR</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarImage
                    src="https://github.com/evilrabbit.png"
                    alt="@evilrabbit"
                  />
                  <AvatarFallback>ER</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>

        {/* Button Element Block */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">
            {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.button_heading`)}
          </h2>
          <div className="flex flex-col gap-4 p-6 border border-border rounded-lg bg-background overflow-hidden">
            {/* First row: 6 Default sized buttons with variants */}
            <div className="flex flex-wrap items-center justify-between w-full gap-2 min-w-0">
              <Button variant={ButtonVariant.Default} className="shrink-0">
                {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.button_default`)}
              </Button>
              <Button variant={ButtonVariant.Destructive} className="shrink-0">
                {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.button_destructive`)}
              </Button>
              <Button variant={ButtonVariant.Outline} className="shrink-0">
                {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.button_outline`)}
              </Button>
              <Button variant={ButtonVariant.Secondary} className="shrink-0">
                {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.button_secondary`)}
              </Button>
              <Button variant={ButtonVariant.Ghost} className="shrink-0">
                {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.button_ghost`)}
              </Button>
              <Button variant={ButtonVariant.Link} className="shrink-0">
                {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.button_link`)}
              </Button>
            </div>

            {/* Second row: 6 buttons grouped by size (Small, Default, Large) */}
            <div className="flex flex-wrap items-center justify-between w-full gap-2 min-w-0">
              {/* Small group */}
              <div className="flex items-center gap-2 shrink-0">
                <Button variant={ButtonVariant.Outline} size={ButtonSize.Sm}>
                  {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.button_small_outlined`)}
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
                  {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.button_default_outlined`)}
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
                  {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.button_large_outlined`)}
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

        {/* Select Element Block */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">
            {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.select_heading`)}
          </h2>
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

        {/* Skeleton Element Block */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">
            {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.skeleton_heading`)}
          </h2>
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

        {/* Switch Element Block */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">
            {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.switch_heading`)}
          </h2>
          <div className="flex flex-col gap-2 p-6 border border-border rounded-lg bg-background">
            <div className="flex items-center justify-center gap-2">
              <label
                htmlFor="airplane-mode-switch"
                className="cursor-pointer select-none"
              >
                {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.airplane_mode`)}
              </label>
              <Switch
                id="airplane-mode-switch"
                checked={airplaneMode}
                onCheckedChange={setAirplaneMode}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

UIKitElementsScreen.displayName = 'UIKitElementsScreen';

