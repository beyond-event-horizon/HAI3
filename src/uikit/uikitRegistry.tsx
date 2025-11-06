/**
 * UI Kit Registry for HAI3 Demo App
 * Registers HAI3 UI Kit components and icons with UI Core
 * Self-registers on import, similar to themeRegistry
 */

import { uikitRegistry, UiKitIcon } from '@hai3/uicore';
import {
  Button,
  IconButton,
  Switch,
  Header,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuIcon,
  SidebarMenuLabel,
  UserInfo,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  CascadingDropdown,
  CloseIcon,
  CLOSE_ICON_ID,
} from '@hai3/uikit';
import { HAI3LogoIcon, APP_LOGO_ICON_ID } from '../icons/HAI3LogoIcon';
import { HAI3LogoTextIcon, APP_LOGO_TEXT_ICON_ID } from '../icons/HAI3LogoTextIcon';

// Re-export icon IDs for use by layout components
export { CLOSE_ICON_ID, APP_LOGO_ICON_ID, APP_LOGO_TEXT_ICON_ID };

// Register all HAI3 UI Kit components
uikitRegistry.registerComponents({
  // Basic components
  Button: Button as import('@hai3/uikit-contracts').ButtonComponent, // Type assertion to bridge contract/implementation mismatch
  IconButton: IconButton as import('@hai3/uikit-contracts').IconButtonComponent,
  Switch: Switch as import('@hai3/uikit-contracts').SwitchComponent,
  
  // Layout components
  Header,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem: SidebarMenuItem as import('@hai3/uikit-contracts').SidebarMenuItemComponent,
  SidebarMenuButton: SidebarMenuButton as import('@hai3/uikit-contracts').SidebarMenuButtonComponent,
  SidebarMenuIcon: SidebarMenuIcon as import('@hai3/uikit-contracts').SidebarMenuIconComponent,
  SidebarMenuLabel: SidebarMenuLabel as import('@hai3/uikit-contracts').SidebarMenuLabelComponent,
  
  // Domain components
  UserInfo,
  
  // Dropdown components
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem: DropdownMenuItem as import('@hai3/uikit-contracts').DropdownMenuItemComponent,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  CascadingDropdown: CascadingDropdown as import('@hai3/uikit-contracts').CascadingDropdownComponent,
});

// Register core framework icons
uikitRegistry.registerIcons({
  [UiKitIcon.Close]: <CloseIcon />,
  [UiKitIcon.AppLogo]: <HAI3LogoIcon />,
  [UiKitIcon.AppLogoText]: <HAI3LogoTextIcon />,
});
