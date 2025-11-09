import React, { useState } from 'react';
import { Switch, Button, IconButton, ButtonVariant, ButtonSize, IconButtonSize, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, Skeleton, Avatar, AvatarImage, AvatarFallback, Spinner, Slider, SliderTrack, SliderRange, SliderThumb, Tooltip, TooltipTrigger, TooltipContent, Badge, Progress } from '@hai3/uikit';
import { StarIcon } from '../../uikit/icons/StarIcon';
import { LoaderIcon } from '../../uikit/icons/LoaderIcon';
import { BadgeCheckIcon } from '../../uikit/icons/BadgeCheckIcon';

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
  const [sliderValue, setSliderValue] = useState([50]);
  const [customSliderValue, setCustomSliderValue] = useState([50]);
  const [progressValue, setProgressValue] = useState(33);

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

        {/* Badge Element Block */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Badge</h2>
          <div className="flex items-center justify-center p-6 border border-border rounded-lg bg-background overflow-hidden">
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="flex w-full flex-wrap gap-2 justify-center">
                <Badge>Badge</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
              <div className="flex w-full flex-wrap gap-2 justify-center">
                <Badge
                  variant="secondary"
                  className="bg-blue-500 text-white dark:bg-blue-600"
                >
                  <BadgeCheckIcon className="w-3 h-3" />
                  Verified
                </Badge>
                <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
                  8
                </Badge>
                <Badge
                  className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums bg-green-500 text-white"
                >
                  99
                </Badge>
                <Badge
                  className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
                  variant="destructive"
                >
                  99
                </Badge>
                <Badge
                  className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
                  variant="outline"
                >
                  20+
                </Badge>
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
                  <StarIcon className="w-4 h-4" />
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
                  <StarIcon />
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
                  <StarIcon />
                </IconButton>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Element Block */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Progress</h2>
          <div className="flex items-center justify-center p-6 border border-border rounded-lg bg-background overflow-hidden">
            <div className="flex flex-col gap-6 w-full max-w-md">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Primary Progress</label>
                <Progress value={progressValue} className="bg-primary/20" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{progressValue}%</span>
                  <button
                    onClick={() => setProgressValue((prev) => Math.min(100, prev + 10))}
                    className="text-primary hover:underline"
                  >
                    Increase
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Destructive Progress</label>
                <Progress 
                  value={progressValue} 
                  className="bg-destructive/20 [&>div]:bg-destructive" 
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{progressValue}%</span>
                  <button
                    onClick={() => setProgressValue((prev) => Math.max(0, prev - 10))}
                    className="text-destructive hover:underline"
                  >
                    Decrease
                  </button>
                </div>
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

        {/* Slider Element Block */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Slider</h2>
          <div className="flex items-center justify-center p-6 border border-border rounded-lg bg-background overflow-hidden">
            <div className="flex flex-col gap-8 w-full max-w-md">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Volume</label>
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

        {/* Spinner Element Block */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Spinner</h2>
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

        {/* Tooltip Element Block */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Tooltip</h2>
          <div className="flex items-center justify-center p-6 border border-border rounded-lg bg-background overflow-hidden">
            <div className="flex flex-wrap items-center justify-center gap-8">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={ButtonVariant.Outline}>Hover me</Button>
                </TooltipTrigger>
                <TooltipContent className="bg-primary text-primary-foreground">
                  <p>This is a tooltip</p>
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
                  <p>Icon button with tooltip</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-sm text-muted-foreground underline cursor-help">
                    Hover for more info
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-destructive text-destructive-foreground">
                  <p>Tooltip on top</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-sm text-muted-foreground underline cursor-help">
                    Different side
                  </span>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-muted text-muted-foreground">
                  <p>Tooltip on the right side</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

UIKitElementsScreen.displayName = 'UIKitElementsScreen';

