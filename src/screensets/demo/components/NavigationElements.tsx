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
} from '@hai3/uikit';
import { useTranslation, TextLoader } from '@hai3/uicore';
import { Slash } from 'lucide-react';
import { DEMO_SCREENSET_ID } from "../ids";
import { UI_KIT_ELEMENTS_SCREEN_ID } from "../ids";

/**
 * Navigation Elements Component
 * Contains Breadcrumb demonstrations
 * Uses parent screen (UIKitElementsScreen) translations
 */
export const NavigationElements: React.FC = () => {
  const { t } = useTranslation();
  
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
    </>
  );
};

NavigationElements.displayName = 'NavigationElements';

export default NavigationElements;

