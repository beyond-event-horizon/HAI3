import React from 'react';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbPage, 
  BreadcrumbSeparator, 
  BreadcrumbEllipsis,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
} from '@hai3/uikit';
import { useTranslation, TextLoader } from '@hai3/uicore';
import { Slash } from 'lucide-react';
import { DEMO_SCREENSET_ID } from "../ids";
import { UI_KIT_ELEMENTS_SCREEN_ID } from "../ids";

/**
 * Navigation Elements Component
 * Contains Breadcrumb and Menubar demonstrations
 * Uses parent screen (UIKitElementsScreen) translations
 */
export const NavigationElements: React.FC = () => {
  const { t } = useTranslation();
  const [showBookmarksBar, setShowBookmarksBar] = React.useState(false);
  const [showFullUrls, setShowFullUrls] = React.useState(true);
  const [selectedProfile, setSelectedProfile] = React.useState("benoit");
  
  // Helper function to access parent screen's translations
  const tk = (key: string) => t(`screen.${DEMO_SCREENSET_ID}.${UI_KIT_ELEMENTS_SCREEN_ID}:${key}`);

  return (
    <>
      {/* Breadcrumb Element Block */}
      <div data-element-id="element-breadcrumb" className="flex flex-col gap-4">
        <TextLoader skeletonClassName="h-8 w-32">
          <h2 className="text-2xl font-semibold">
            {tk('breadcrumb_heading')}
          </h2>
        </TextLoader>
        <div className="flex flex-col gap-6 p-6 border border-border rounded-lg bg-background overflow-hidden">
          {/* Custom Separator */}
          <div className="flex flex-col gap-2">
            <TextLoader skeletonClassName="h-4 w-32" inheritColor>
              <label className="text-xs text-muted-foreground">
                {tk('breadcrumb_custom_separator_label')}
              </label>
            </TextLoader>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">
                    <TextLoader skeletonClassName="h-4 w-12" inheritColor>
                      {tk('breadcrumb_home')}
                    </TextLoader>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <Slash />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">
                    <TextLoader skeletonClassName="h-4 w-20" inheritColor>
                      {tk('breadcrumb_components')}
                    </TextLoader>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <Slash />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    <TextLoader skeletonClassName="h-4 w-20" inheritColor>
                      {tk('breadcrumb_breadcrumb')}
                    </TextLoader>
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Dropdown Breadcrumb */}
          <div className="flex flex-col gap-2">
            <TextLoader skeletonClassName="h-4 w-32" inheritColor>
              <label className="text-xs text-muted-foreground">
                {tk('breadcrumb_dropdown_label')}
              </label>
            </TextLoader>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">
                    <TextLoader skeletonClassName="h-4 w-12" inheritColor>
                      {tk('breadcrumb_home')}
                    </TextLoader>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1">
                      <BreadcrumbEllipsis className="size-4" />
                      <span className="sr-only">Toggle menu</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem>
                        {tk('breadcrumb_documentation')}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        {tk('breadcrumb_themes')}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        {tk('breadcrumb_github')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">
                    <TextLoader skeletonClassName="h-4 w-20" inheritColor>
                      {tk('breadcrumb_components')}
                    </TextLoader>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    <TextLoader skeletonClassName="h-4 w-20" inheritColor>
                      {tk('breadcrumb_breadcrumb')}
                    </TextLoader>
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </div>

      {/* Menubar Element Block */}
      <div data-element-id="element-menubar" className="flex flex-col gap-4">
        <TextLoader skeletonClassName="h-8 w-32">
          <h2 className="text-2xl font-semibold">
            {tk('menubar_heading')}
          </h2>
        </TextLoader>
        <div className="flex flex-col gap-6 p-6 border border-border rounded-lg bg-background overflow-hidden">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>{tk('menubar_file')}</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  {tk('menubar_new_tab')} <MenubarShortcut>⌘T</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  {tk('menubar_new_window')} <MenubarShortcut>⌘N</MenubarShortcut>
                </MenubarItem>
                <MenubarItem disabled>{tk('menubar_new_incognito')}</MenubarItem>
                <MenubarSeparator />
                <MenubarSub>
                  <MenubarSubTrigger>{tk('menubar_share')}</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem>{tk('menubar_email')}</MenubarItem>
                    <MenubarItem>{tk('menubar_messages')}</MenubarItem>
                    <MenubarItem>{tk('menubar_notes')}</MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarSeparator />
                <MenubarItem>
                  {tk('menubar_print')} <MenubarShortcut>⌘P</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>{tk('menubar_edit')}</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  {tk('menubar_undo')} <MenubarShortcut>⌘Z</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  {tk('menubar_redo')} <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarSub>
                  <MenubarSubTrigger>{tk('menubar_find')}</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem>{tk('menubar_search_web')}</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>{tk('menubar_find_file')}</MenubarItem>
                    <MenubarItem>{tk('menubar_find_next')}</MenubarItem>
                    <MenubarItem>{tk('menubar_find_previous')}</MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarSeparator />
                <MenubarItem>{tk('menubar_cut')}</MenubarItem>
                <MenubarItem>{tk('menubar_copy')}</MenubarItem>
                <MenubarItem>{tk('menubar_paste')}</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>{tk('menubar_view')}</MenubarTrigger>
              <MenubarContent>
                <MenubarCheckboxItem 
                  checked={showBookmarksBar} 
                  onCheckedChange={setShowBookmarksBar}
                >
                  {tk('menubar_always_show_bookmarks')}
                </MenubarCheckboxItem>
                <MenubarCheckboxItem 
                  checked={showFullUrls} 
                  onCheckedChange={setShowFullUrls}
                >
                  {tk('menubar_always_show_full_urls')}
                </MenubarCheckboxItem>
                <MenubarSeparator />
                <MenubarItem inset>
                  {tk('menubar_reload')} <MenubarShortcut>⌘R</MenubarShortcut>
                </MenubarItem>
                <MenubarItem inset disabled>
                  {tk('menubar_force_reload')} <MenubarShortcut>⇧⌘R</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem inset>{tk('menubar_toggle_fullscreen')}</MenubarItem>
                <MenubarSeparator />
                <MenubarItem inset>{tk('menubar_hide_sidebar')}</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>{tk('menubar_profiles')}</MenubarTrigger>
              <MenubarContent>
                <MenubarRadioGroup value={selectedProfile} onValueChange={setSelectedProfile}>
                  <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
                  <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
                  <MenubarRadioItem value="luis">Luis</MenubarRadioItem>
                </MenubarRadioGroup>
                <MenubarSeparator />
                <MenubarItem inset>{tk('menubar_edit_profile')}</MenubarItem>
                <MenubarSeparator />
                <MenubarItem inset>{tk('menubar_add_profile')}</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
    </>
  );
};

NavigationElements.displayName = 'NavigationElements';

export default NavigationElements;

