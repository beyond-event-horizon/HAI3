import React from 'react';
import { Button, ButtonVariant, ButtonSize, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose, Sheet, SheetTrigger, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, Avatar, AvatarImage, AvatarFallback, Badge } from '@hai3/uikit';
import { useTranslation, TextLoader } from '@hai3/uicore';
import { FormInput } from '../uikit/icons/FormInput';
import { DEMO_SCREENSET_ID } from "../ids";
import { UI_KIT_ELEMENTS_SCREEN_ID } from "../ids";

/**
 * Layout Elements Component
 * Contains Card, Dialog, and Sheet demonstrations
 * Uses parent screen (UIKitElementsScreen) translations
 */
export const LayoutElements: React.FC = () => {
  const { t } = useTranslation();
  
  // Helper function to access parent screen's translations
  const tk = (key: string) => t(`screen.${DEMO_SCREENSET_ID}.${UI_KIT_ELEMENTS_SCREEN_ID}:${key}`);

  return (
    <>
      {/* Card Element Block */}
      <div data-element-id="element-card" className="flex flex-col gap-4">
        <TextLoader skeletonClassName="h-8 w-24">
          <h2 className="text-2xl font-semibold">
            {tk('card_heading')}
          </h2>
        </TextLoader>
        <div className="flex flex-col gap-6 p-6 border border-border rounded-lg bg-background overflow-hidden">
          {/* Basic Card */}
          <div className="flex flex-col gap-2">
            <TextLoader skeletonClassName="h-4 w-24" inheritColor>
              <label className="text-xs text-muted-foreground">
                {tk('card_basic_label')}
              </label>
            </TextLoader>
            <Card className="w-full max-w-sm">
              <CardHeader>
                <CardTitle>
                  <TextLoader skeletonClassName="h-6 w-32" inheritColor>
                    {tk('card_basic_title')}
                  </TextLoader>
                </CardTitle>
                <CardDescription>
                  <TextLoader skeletonClassName="h-4 w-48" inheritColor>
                    {tk('card_basic_description')}
                  </TextLoader>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TextLoader skeletonClassName="h-4 w-full" inheritColor>
                  <p className="text-sm">
                    {tk('card_basic_content')}
                  </p>
                </TextLoader>
              </CardContent>
            </Card>
          </div>

          {/* User Card */}
          <div className="flex flex-col gap-2">
            <TextLoader skeletonClassName="h-4 w-24" inheritColor>
              <label className="text-xs text-muted-foreground">
                {tk('card_user_title')}
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
                        {tk('card_user_name')}
                      </TextLoader>
                    </CardTitle>
                    <CardDescription>
                      <TextLoader skeletonClassName="h-4 w-40" inheritColor>
                        {tk('card_user_email')}
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
                        {tk('card_user_role')}
                      </TextLoader>
                    </Badge>
                  </div>
                  <TextLoader skeletonClassName="h-4 w-full" inheritColor>
                    <p className="text-sm text-muted-foreground">
                      {tk('card_user_bio')}
                    </p>
                  </TextLoader>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button variant={ButtonVariant.Default} size={ButtonSize.Sm} className="flex-1">
                  <TextLoader skeletonClassName="h-5 w-16" inheritColor>
                    {tk('card_user_follow')}
                  </TextLoader>
                </Button>
                <Button variant={ButtonVariant.Outline} size={ButtonSize.Sm} className="flex-1">
                  <TextLoader skeletonClassName="h-5 w-20" inheritColor>
                    {tk('card_user_message')}
                  </TextLoader>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Login Form Card */}
          <div className="flex flex-col gap-2">
            <TextLoader skeletonClassName="h-4 w-32" inheritColor>
              <label className="text-xs text-muted-foreground">
                {tk('card_form_title')}
              </label>
            </TextLoader>
            <Card className="w-full max-w-sm">
              <CardHeader>
                <CardTitle>
                  <TextLoader skeletonClassName="h-6 w-48" inheritColor>
                    {tk('card_form_login_title')}
                  </TextLoader>
                </CardTitle>
                <CardDescription>
                  <div className="flex items-center justify-between">
                    <TextLoader skeletonClassName="h-4 w-56" inheritColor>
                      {tk('card_form_login_description')}
                    </TextLoader>
                    <Button variant={ButtonVariant.Link} size={ButtonSize.Sm} className="h-auto p-0">
                      <TextLoader skeletonClassName="h-4 w-16" inheritColor>
                        {tk('card_form_signup')}
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
                          {tk('card_form_email_label')}
                        </label>
                      </TextLoader>
                      <FormInput
                        id="email"
                        type="email"
                        placeholder={tk('card_form_email_placeholder')}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <TextLoader skeletonClassName="h-4 w-16" inheritColor>
                          <label htmlFor="password" className="text-sm font-medium">
                            {tk('card_form_password_label')}
                          </label>
                        </TextLoader>
                        <TextLoader skeletonClassName="h-4 w-32 ml-auto" inheritColor>
                          <a
                            href="#"
                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-primary"
                          >
                            {tk('card_form_forgot_password')}
                          </a>
                        </TextLoader>
                      </div>
                      <FormInput
                        id="password"
                        type="password"
                        required
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <Button type="submit" variant={ButtonVariant.Default} className="w-full">
                  <TextLoader skeletonClassName="h-5 w-16" inheritColor>
                    {tk('card_form_login_button')}
                  </TextLoader>
                </Button>
                <Button variant={ButtonVariant.Outline} className="w-full">
                  <TextLoader skeletonClassName="h-5 w-32" inheritColor>
                    {tk('card_form_login_google')}
                  </TextLoader>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialog Element Block */}
      <div data-element-id="element-dialog" className="flex flex-col gap-4">
        <TextLoader skeletonClassName="h-8 w-24">
          <h2 className="text-2xl font-semibold">
            {tk('dialog_heading')}
          </h2>
        </TextLoader>
        <div className="flex items-center justify-center gap-4 p-6 border border-border rounded-lg bg-background overflow-hidden">
          {/* Edit Profile Dialog */}
          <Dialog>
            <form>
              <DialogTrigger asChild>
                <Button variant={ButtonVariant.Outline}>
                  <TextLoader skeletonClassName="h-5 w-24" inheritColor>
                    {tk('dialog_open_dialog')}
                  </TextLoader>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    <TextLoader skeletonClassName="h-6 w-32" inheritColor>
                      {tk('dialog_edit_profile_title')}
                    </TextLoader>
                  </DialogTitle>
                  <DialogDescription>
                    <TextLoader skeletonClassName="h-4 w-full" inheritColor>
                      {tk('dialog_edit_profile_description')}
                    </TextLoader>
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <TextLoader skeletonClassName="h-4 w-12" inheritColor>
                      <label htmlFor="name-1" className="text-sm font-medium">
                        {tk('dialog_name_label')}
                      </label>
                    </TextLoader>
                    <FormInput
                      id="name-1"
                      name="name"
                      type="text"
                      defaultValue={tk('dialog_name_placeholder')}
                    />
                  </div>
                  <div className="grid gap-3">
                    <TextLoader skeletonClassName="h-4 w-20" inheritColor>
                      <label htmlFor="username-1" className="text-sm font-medium">
                        {tk('dialog_username_label')}
                      </label>
                    </TextLoader>
                    <FormInput
                      id="username-1"
                      name="username"
                      type="text"
                      defaultValue={tk('dialog_username_placeholder')}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant={ButtonVariant.Outline}>
                      <TextLoader skeletonClassName="h-5 w-16" inheritColor>
                        {tk('dialog_cancel')}
                      </TextLoader>
                    </Button>
                  </DialogClose>
                  <Button type="submit">
                    <TextLoader skeletonClassName="h-5 w-28" inheritColor>
                      {tk('dialog_save_changes')}
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
                  {tk('dialog_custom_close_button')}
                </TextLoader>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  <TextLoader skeletonClassName="h-6 w-24" inheritColor>
                    {tk('dialog_share_title')}
                  </TextLoader>
                </DialogTitle>
                <DialogDescription>
                  <TextLoader skeletonClassName="h-4 w-full" inheritColor>
                    {tk('dialog_share_description')}
                  </TextLoader>
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-2">
                <div className="grid flex-1 gap-2">
                  <TextLoader skeletonClassName="h-4 w-12 sr-only" inheritColor>
                    <label htmlFor="link" className="sr-only">
                      {tk('dialog_link_label')}
                    </label>
                  </TextLoader>
                  <FormInput
                    id="link"
                    type="text"
                    defaultValue={tk('dialog_link_value')}
                  />
                </div>
              </div>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button type="button" variant={ButtonVariant.Secondary}>
                    <TextLoader skeletonClassName="h-5 w-12" inheritColor>
                      {tk('dialog_close')}
                    </TextLoader>
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Drawer Element Block */}
      <div data-element-id="element-drawer" className="flex flex-col gap-4">
        <TextLoader skeletonClassName="h-8 w-24">
          <h2 className="text-2xl font-semibold">
            {tk('drawer_heading')}
          </h2>
        </TextLoader>
        <div className="flex items-center justify-center gap-4 p-6 border border-border rounded-lg bg-background overflow-hidden">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant={ButtonVariant.Outline}>
                <TextLoader skeletonClassName="h-5 w-24" inheritColor>
                  {tk('drawer_open')}
                </TextLoader>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>
                  <TextLoader skeletonClassName="h-6 w-32" inheritColor>
                    {tk('drawer_title')}
                  </TextLoader>
                </DrawerTitle>
                <DrawerDescription>
                  <TextLoader skeletonClassName="h-4 w-full" inheritColor>
                    {tk('drawer_description')}
                  </TextLoader>
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-4">
                <TextLoader skeletonClassName="h-4 w-full" inheritColor>
                  <p className="text-sm text-muted-foreground">
                    {tk('drawer_content')}
                  </p>
                </TextLoader>
              </div>
              <DrawerFooter>
                <Button type="submit">
                  <TextLoader skeletonClassName="h-5 w-16" inheritColor>
                    {tk('drawer_submit')}
                  </TextLoader>
                </Button>
                <DrawerClose asChild>
                  <Button variant={ButtonVariant.Outline}>
                    <TextLoader skeletonClassName="h-5 w-16" inheritColor>
                      {tk('drawer_close')}
                    </TextLoader>
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      {/* Sheet Element Block */}
      <div data-element-id="element-sheet" className="flex flex-col gap-4">
        <TextLoader skeletonClassName="h-8 w-24">
          <h2 className="text-2xl font-semibold">
            {tk('sheet_heading')}
          </h2>
        </TextLoader>
        <div className="flex items-center justify-center gap-4 p-6 border border-border rounded-lg bg-background overflow-hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant={ButtonVariant.Outline}>
                <TextLoader skeletonClassName="h-5 w-16" inheritColor>
                  {tk('sheet_open')}
                </TextLoader>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>
                  <TextLoader skeletonClassName="h-6 w-32" inheritColor>
                    {tk('sheet_edit_profile_title')}
                  </TextLoader>
                </SheetTitle>
                <SheetDescription>
                  <TextLoader skeletonClassName="h-4 w-full" inheritColor>
                    {tk('sheet_edit_profile_description')}
                  </TextLoader>
                </SheetDescription>
              </SheetHeader>
              <div className="grid flex-1 auto-rows-min gap-6 px-4">
                <div className="grid gap-3">
                  <TextLoader skeletonClassName="h-4 w-12" inheritColor>
                    <label htmlFor="sheet-demo-name" className="text-sm font-medium">
                      {tk('sheet_name_label')}
                    </label>
                  </TextLoader>
                  <FormInput
                    id="sheet-demo-name"
                    type="text"
                    defaultValue={tk('sheet_name_placeholder')}
                  />
                </div>
                <div className="grid gap-3">
                  <TextLoader skeletonClassName="h-4 w-20" inheritColor>
                    <label htmlFor="sheet-demo-username" className="text-sm font-medium">
                      {tk('sheet_username_label')}
                    </label>
                  </TextLoader>
                  <FormInput
                    id="sheet-demo-username"
                    type="text"
                    defaultValue={tk('sheet_username_placeholder')}
                  />
                </div>
              </div>
              <SheetFooter>
                <Button type="submit">
                  <TextLoader skeletonClassName="h-5 w-28" inheritColor>
                    {tk('sheet_save_changes')}
                  </TextLoader>
                </Button>
                <SheetClose asChild>
                  <Button variant={ButtonVariant.Outline}>
                    <TextLoader skeletonClassName="h-5 w-16" inheritColor>
                      {tk('sheet_close')}
                    </TextLoader>
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};

LayoutElements.displayName = 'LayoutElements';

