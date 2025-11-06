import React, { useState } from 'react';
import { Switch, Button, IconButton, ButtonVariant, ButtonSize, IconButtonSize, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, Skeleton, Avatar, AvatarImage, AvatarFallback } from '@hai3/uikit';

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

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">UI Kit Elements</h1>
        <p className="text-muted-foreground">
          Demo page with available UI Kit elements and styles annotations
        </p>
      </div>

      <div className="max-w-2xl flex flex-col gap-8">
        {/* Avatar Element Block */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Avatar</h2>
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
          <h2 className="text-2xl font-semibold">Button</h2>
          <div className="flex flex-col gap-4 p-6 border border-border rounded-lg bg-background overflow-hidden">
            {/* First row: 6 Default sized buttons with variants */}
            <div className="flex flex-wrap items-center justify-between w-full gap-2 min-w-0">
              <Button variant={ButtonVariant.Default} className="shrink-0">Default</Button>
              <Button variant={ButtonVariant.Destructive} className="shrink-0">Destructive</Button>
              <Button variant={ButtonVariant.Outline} className="shrink-0">Outline</Button>
              <Button variant={ButtonVariant.Secondary} className="shrink-0">Secondary</Button>
              <Button variant={ButtonVariant.Ghost} className="shrink-0">Ghost</Button>
              <Button variant={ButtonVariant.Link} className="shrink-0">Link</Button>
            </div>

            {/* Second row: 6 buttons grouped by size (Small, Default, Large) */}
            <div className="flex flex-wrap items-center justify-between w-full gap-2 min-w-0">
              {/* Small group */}
              <div className="flex items-center gap-2 shrink-0">
                <Button variant={ButtonVariant.Outline} size={ButtonSize.Sm}>Small Outlined</Button>
                <IconButton
                  variant={ButtonVariant.Outline}
                  size={IconButtonSize.Small}
                  aria-label="Small icon button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </IconButton>
              </div>

              {/* Default group */}
              <div className="flex items-center gap-2 shrink-0">
                <Button variant={ButtonVariant.Outline} size={ButtonSize.Default}>Default Outlined</Button>
                <IconButton
                  variant={ButtonVariant.Outline}
                  size={IconButtonSize.Default}
                  aria-label="Default icon button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </IconButton>
              </div>

              {/* Large group */}
              <div className="flex items-center gap-2 shrink-0">
                <Button variant={ButtonVariant.Outline} size={ButtonSize.Lg}>Large Outlined</Button>
                <IconButton
                  variant={ButtonVariant.Outline}
                  size={IconButtonSize.Large}
                  aria-label="Large icon button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </IconButton>
              </div>
            </div>
          </div>
        </div>

        {/* Select Element Block */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Select</h2>
          <div className="flex items-center justify-center p-6 border border-border rounded-lg bg-background overflow-hidden">
            <Select>
              <SelectTrigger className="w-[280px] max-w-full">
                <SelectValue placeholder="Select a timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>North America</SelectLabel>
                  <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                  <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                  <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                  <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                  <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
                  <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Europe & Africa</SelectLabel>
                  <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                  <SelectItem value="cet">Central European Time (CET)</SelectItem>
                  <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
                  <SelectItem value="west">
                    Western European Summer Time (WEST)
                  </SelectItem>
                  <SelectItem value="cat">Central Africa Time (CAT)</SelectItem>
                  <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Asia</SelectLabel>
                  <SelectItem value="msk">Moscow Time (MSK)</SelectItem>
                  <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                  <SelectItem value="cst_china">China Standard Time (CST)</SelectItem>
                  <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
                  <SelectItem value="kst">Korea Standard Time (KST)</SelectItem>
                  <SelectItem value="ist_indonesia">
                    Indonesia Central Standard Time (WITA)
                  </SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Australia & Pacific</SelectLabel>
                  <SelectItem value="awst">
                    Australian Western Standard Time (AWST)
                  </SelectItem>
                  <SelectItem value="acst">
                    Australian Central Standard Time (ACST)
                  </SelectItem>
                  <SelectItem value="aest">
                    Australian Eastern Standard Time (AEST)
                  </SelectItem>
                  <SelectItem value="nzst">New Zealand Standard Time (NZST)</SelectItem>
                  <SelectItem value="fjt">Fiji Time (FJT)</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>South America</SelectLabel>
                  <SelectItem value="art">Argentina Time (ART)</SelectItem>
                  <SelectItem value="bot">Bolivia Time (BOT)</SelectItem>
                  <SelectItem value="brt">Brasilia Time (BRT)</SelectItem>
                  <SelectItem value="clt">Chile Standard Time (CLT)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Skeleton Element Block */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Skeleton</h2>
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
          <h2 className="text-2xl font-semibold">Switch</h2>
          <div className="flex flex-col gap-2 p-6 border border-border rounded-lg bg-background">
            <div className="flex items-center justify-center gap-2">
              <label
                htmlFor="airplane-mode-switch"
                className="cursor-pointer select-none"
              >
                Airplane Mode
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

