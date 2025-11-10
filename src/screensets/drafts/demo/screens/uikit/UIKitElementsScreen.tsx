import React, { useState } from 'react';
import { Switch, Button, IconButton, ButtonVariant, ButtonSize, IconButtonSize, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, Skeleton, Avatar, AvatarImage, AvatarFallback, Spinner, Slider, SliderTrack, SliderRange, SliderThumb, Tooltip, TooltipTrigger, TooltipContent, Badge, Progress, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@hai3/uikit';
import { StarIcon } from '../../uikit/icons/StarIcon';
import { LoaderIcon } from '../../uikit/icons/LoaderIcon';
import { BadgeCheckIcon } from '../../uikit/icons/BadgeCheckIcon';

import { useTranslation, TextLoader } from '@hai3/uicore';
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
  const [sliderValue, setSliderValue] = useState([50]);
  const [customSliderValue, setCustomSliderValue] = useState([50]);
  const [progressValue, setProgressValue] = useState(33);
  const { t } = useTranslation();


  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-col gap-4">
        <TextLoader skeletonClassName="h-10 w-48">
          <h1 className="text-4xl font-bold">
            {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.title`)}
          </h1>
        </TextLoader>
        <TextLoader skeletonClassName="h-6 w-full">
          <p className="text-muted-foreground">
            {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.description`)}
          </p>
        </TextLoader>
      </div>

      <div className="max-w-2xl flex flex-col gap-8">
        {/* Avatar Element Block */}
        <div className="flex flex-col gap-4">
          <TextLoader skeletonClassName="h-8 w-24">
            <h2 className="text-2xl font-semibold">
              {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.avatar_heading`)}
            </h2>
          </TextLoader>
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
          <TextLoader skeletonClassName="h-8 w-24">
            <h2 className="text-2xl font-semibold">
              {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.badge_heading`)}
            </h2>
          </TextLoader>
          <div className="flex items-center justify-center p-6 border border-border rounded-lg bg-background overflow-hidden">
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="flex w-full flex-wrap gap-2 justify-center">
                <Badge>
                  <TextLoader skeletonClassName="h-4 w-12" inheritColor>
                    {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.badge_default`)}
                  </TextLoader>
                </Badge>
                <Badge variant="secondary">
                  <TextLoader skeletonClassName="h-3.5 w-14" inheritColor>
                    {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.badge_secondary`)}
                  </TextLoader>
                </Badge>
                <Badge variant="destructive">
                  <TextLoader skeletonClassName="h-4 w-20" inheritColor>
                    {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.badge_destructive`)}
                  </TextLoader>
                </Badge>
                <Badge variant="outline">
                  <TextLoader skeletonClassName="h-3.5 w-14" inheritColor>
                    {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.badge_outline`)}
                  </TextLoader>
                </Badge>
              </div>
              <div className="flex w-full flex-wrap gap-2 justify-center">
                <Badge
                  variant="secondary"
                  className="bg-blue-500 text-white dark:bg-blue-600"
                >
                  <BadgeCheckIcon className="w-3 h-3" />
                  <TextLoader skeletonClassName="h-3.5 w-10" inheritColor>
                    {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.badge_verified`)}
                  </TextLoader>
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

        {/* Card Element Block */}
        <div className="flex flex-col gap-4">
          <TextLoader skeletonClassName="h-8 w-24">
            <h2 className="text-2xl font-semibold">
              {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.card_heading`)}
            </h2>
          </TextLoader>
          <div className="flex flex-col gap-6 p-6 border border-border rounded-lg bg-background overflow-hidden">
            {/* Basic Card */}
            <div className="flex flex-col gap-2">
              <TextLoader skeletonClassName="h-4 w-24" inheritColor>
                <label className="text-xs text-muted-foreground">
                  Basic Card
                </label>
              </TextLoader>
              <Card className="w-full max-w-sm">
                <CardHeader>
                  <CardTitle>
                    <TextLoader skeletonClassName="h-6 w-32" inheritColor>
                      {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.card_basic_title`)}
                    </TextLoader>
                  </CardTitle>
                  <CardDescription>
                    <TextLoader skeletonClassName="h-4 w-48" inheritColor>
                      {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.card_basic_description`)}
                    </TextLoader>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TextLoader skeletonClassName="h-4 w-full" inheritColor>
                    <p className="text-sm">
                      {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.card_basic_content`)}
                    </p>
                  </TextLoader>
                </CardContent>
              </Card>
            </div>

            {/* User Card */}
            <div className="flex flex-col gap-2">
              <TextLoader skeletonClassName="h-4 w-24" inheritColor>
                <label className="text-xs text-muted-foreground">
                  {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.card_user_title`)}
                </label>
              </TextLoader>
              <Card className="w-full max-w-sm">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <CardTitle className="text-lg">
                        <TextLoader skeletonClassName="h-5 w-24" inheritColor>
                          {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.card_user_name`)}
                        </TextLoader>
                      </CardTitle>
                      <CardDescription>
                        <TextLoader skeletonClassName="h-4 w-40" inheritColor>
                          {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.card_user_email`)}
                        </TextLoader>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        <TextLoader skeletonClassName="h-3.5 w-20" inheritColor>
                          {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.card_user_role`)}
                        </TextLoader>
                      </Badge>
                    </div>
                    <TextLoader skeletonClassName="h-4 w-full" inheritColor>
                      <p className="text-sm text-muted-foreground">
                        {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.card_user_bio`)}
                      </p>
                    </TextLoader>
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button variant={ButtonVariant.Default} size={ButtonSize.Sm} className="flex-1">
                    <TextLoader skeletonClassName="h-5 w-16" inheritColor>
                      {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.card_user_follow`)}
                    </TextLoader>
                  </Button>
                  <Button variant={ButtonVariant.Outline} size={ButtonSize.Sm} className="flex-1">
                    <TextLoader skeletonClassName="h-5 w-20" inheritColor>
                      {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.card_user_message`)}
                    </TextLoader>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Login Form Card */}
            <div className="flex flex-col gap-2">
              <TextLoader skeletonClassName="h-4 w-32" inheritColor>
                <label className="text-xs text-muted-foreground">
                  {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.card_form_title`)}
                </label>
              </TextLoader>
              <Card className="w-full max-w-sm">
                <CardHeader>
                  <CardTitle>
                    <TextLoader skeletonClassName="h-6 w-48" inheritColor>
                      {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.card_form_login_title`)}
                    </TextLoader>
                  </CardTitle>
                  <CardDescription>
                    <div className="flex items-center justify-between">
                      <TextLoader skeletonClassName="h-4 w-56" inheritColor>
                        {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.card_form_login_description`)}
                      </TextLoader>
                      <Button variant={ButtonVariant.Link} size={ButtonSize.Sm} className="h-auto p-0">
                        <TextLoader skeletonClassName="h-4 w-16" inheritColor>
                          {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.card_form_signup`)}
                        </TextLoader>
                      </Button>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form>
                    <div className="flex flex-col gap-6">
                      <div className="grid gap-2">
                        <TextLoader skeletonClassName="h-4 w-12" inheritColor>
                          <label htmlFor="email" className="text-sm font-medium">
                            {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.card_form_email_label`)}
                          </label>
                        </TextLoader>
                        <input
                          id="email"
                          type="email"
                          placeholder={t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.card_form_email_placeholder`)}
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <div className="flex items-center">
                          <TextLoader skeletonClassName="h-4 w-16" inheritColor>
                            <label htmlFor="password" className="text-sm font-medium">
                              {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.card_form_password_label`)}
                            </label>
                          </TextLoader>
                          <TextLoader skeletonClassName="h-4 w-32 ml-auto" inheritColor>
                            <a
                              href="#"
                              className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-primary"
                            >
                              {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.card_form_forgot_password`)}
                            </a>
                          </TextLoader>
                        </div>
                        <input
                          id="password"
                          type="password"
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          required
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                  <Button type="submit" variant={ButtonVariant.Default} className="w-full">
                    <TextLoader skeletonClassName="h-5 w-16" inheritColor>
                      {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.card_form_login_button`)}
                    </TextLoader>
                  </Button>
                  <Button variant={ButtonVariant.Outline} className="w-full">
                    <TextLoader skeletonClassName="h-5 w-32" inheritColor>
                      {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.card_form_login_google`)}
                    </TextLoader>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>

        {/* Dialog Element Block */}
        <div className="flex flex-col gap-4">
          <TextLoader skeletonClassName="h-8 w-24">
            <h2 className="text-2xl font-semibold">
              {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.dialog_heading`)}
            </h2>
          </TextLoader>
          <div className="flex items-center justify-center gap-4 p-6 border border-border rounded-lg bg-background overflow-hidden">
            {/* Edit Profile Dialog */}
            <Dialog>
              <form>
                <DialogTrigger asChild>
                  <Button variant={ButtonVariant.Outline}>
                    <TextLoader skeletonClassName="h-5 w-24" inheritColor>
                      {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.dialog_open_dialog`)}
                    </TextLoader>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>
                      <TextLoader skeletonClassName="h-6 w-32" inheritColor>
                        {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.dialog_edit_profile_title`)}
                      </TextLoader>
                    </DialogTitle>
                    <DialogDescription>
                      <TextLoader skeletonClassName="h-4 w-full" inheritColor>
                        {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.dialog_edit_profile_description`)}
                      </TextLoader>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid gap-3">
                      <TextLoader skeletonClassName="h-4 w-12" inheritColor>
                        <label htmlFor="name-1" className="text-sm font-medium">
                          {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.dialog_name_label`)}
                        </label>
                      </TextLoader>
                      <input
                        id="name-1"
                        name="name"
                        defaultValue={t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.dialog_name_placeholder`)}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="grid gap-3">
                      <TextLoader skeletonClassName="h-4 w-20" inheritColor>
                        <label htmlFor="username-1" className="text-sm font-medium">
                          {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.dialog_username_label`)}
                        </label>
                      </TextLoader>
                      <input
                        id="username-1"
                        name="username"
                        defaultValue={t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.dialog_username_placeholder`)}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant={ButtonVariant.Outline}>
                        <TextLoader skeletonClassName="h-5 w-16" inheritColor>
                          {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.dialog_cancel`)}
                        </TextLoader>
                      </Button>
                    </DialogClose>
                    <Button type="submit">
                      <TextLoader skeletonClassName="h-5 w-28" inheritColor>
                        {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.dialog_save_changes`)}
                      </TextLoader>
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>

            {/* Custom close button Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={ButtonVariant.Outline}>
                  <TextLoader skeletonClassName="h-5 w-40" inheritColor>
                    {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.dialog_custom_close_button`)}
                  </TextLoader>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    <TextLoader skeletonClassName="h-6 w-24" inheritColor>
                      {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.dialog_share_title`)}
                    </TextLoader>
                  </DialogTitle>
                  <DialogDescription>
                    <TextLoader skeletonClassName="h-4 w-full" inheritColor>
                      {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.dialog_share_description`)}
                    </TextLoader>
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-2">
                  <div className="grid flex-1 gap-2">
                    <TextLoader skeletonClassName="h-4 w-12 sr-only" inheritColor>
                      <label htmlFor="link" className="sr-only">
                        {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.dialog_link_label`)}
                      </label>
                    </TextLoader>
                    <input
                      id="link"
                      defaultValue={t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.dialog_link_value`)}
                      readOnly
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button type="button" variant={ButtonVariant.Secondary}>
                      <TextLoader skeletonClassName="h-5 w-12" inheritColor>
                        {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.dialog_close`)}
                      </TextLoader>
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Button Element Block */}
        <div className="flex flex-col gap-4">
          <TextLoader skeletonClassName="h-8 w-24">
            <h2 className="text-2xl font-semibold">
              {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.button_heading`)}
            </h2>
          </TextLoader>
          <div className="flex flex-col gap-4 p-6 border border-border rounded-lg bg-background overflow-hidden">
            {/* First row: 6 Default sized buttons with variants */}
            <div className="flex flex-wrap items-center justify-between w-full gap-2 min-w-0">
              <Button variant={ButtonVariant.Default} className="shrink-0">
                <TextLoader skeletonClassName="h-6 w-16" inheritColor>
                  {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.button_default`)}
                </TextLoader>
              </Button>
              <Button variant={ButtonVariant.Destructive} className="shrink-0">
                <TextLoader skeletonClassName="h-6 w-20" inheritColor>
                  {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.button_destructive`)}
                </TextLoader>
              </Button>
              <Button variant={ButtonVariant.Outline} className="shrink-0">
                <TextLoader skeletonClassName="h-6 w-16" inheritColor>
                  {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.button_outline`)}
                </TextLoader>
              </Button>
              <Button variant={ButtonVariant.Secondary} className="shrink-0">
                <TextLoader skeletonClassName="h-6 w-20" inheritColor>
                  {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.button_secondary`)}
                </TextLoader>
              </Button>
              <Button variant={ButtonVariant.Ghost} className="shrink-0">
                <TextLoader skeletonClassName="h-6 w-16" inheritColor>
                  {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.button_ghost`)}
                </TextLoader>
              </Button>
              <Button variant={ButtonVariant.Link} className="shrink-0">
                <TextLoader skeletonClassName="h-6 w-12" inheritColor>
                  {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.button_link`)}
                </TextLoader>
              </Button>
            </div>

            {/* Second row: 6 buttons grouped by size (Small, Default, Large) */}
            <div className="flex flex-wrap items-center justify-between w-full gap-2 min-w-0">
              {/* Small group */}
              <div className="flex items-center gap-2 shrink-0">
                <Button variant={ButtonVariant.Outline} size={ButtonSize.Sm}>
                  <TextLoader skeletonClassName="h-5 w-24" inheritColor>
                    {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.button_small_outlined`)}
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
                    {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.button_default_outlined`)}
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
                    {t(`screenset.${DEMO_SCREENSET_ID}:screens.${UI_KIT_ELEMENTS_SCREEN_ID}.button_large_outlined`)}
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

        {/* Progress Element Block */}
        <div className="flex flex-col gap-4">
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

        {/* Select Element Block */}
        <div className="flex flex-col gap-4">
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

        {/* Skeleton Element Block */}
        <div className="flex flex-col gap-4">
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

        {/* Slider Element Block */}
        <div className="flex flex-col gap-4">
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

        {/* Spinner Element Block */}
        <div className="flex flex-col gap-4">
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

        {/* Switch Element Block */}
        <div className="flex flex-col gap-4">
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

        {/* Tooltip Element Block */}
        <div className="flex flex-col gap-4">
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
      </div>
    </div>
  );
};

UIKitElementsScreen.displayName = 'UIKitElementsScreen';

