/**
 * HAI3 UI-Core Components
 * Exports all UI Kit components for easy importing
 */

// Base shadcn components
export { Button, type ButtonProps, ButtonVariant, ButtonSize } from './base/button';
export { Switch } from './base/switch';
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './base/card';

// shadcn navigation
export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
} from './base/navigation-menu';

// shadcn sheet (sidebar)
export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from './base/sheet';

// shadcn dialog (popup/modal)
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './base/dialog';

// shadcn select (native-style)
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from './base/select';

// Base dropdowns
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from './base/dropdown-menu';

// Composite selectors
export { CascadingDropdown, type CascadingDropdownProps, type CascadingDropdownOption } from './composite/selectors/CascadingDropdown';

// Composite components
export { IconButton, type IconButtonProps, IconButtonSize } from './composite/buttons/IconButton';

// Composite navigation (tailored from shadcn sidebar)
export {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuLabel,
  SidebarMenuIcon,
} from './composite/navigation/Sidebar';
export { SidebarHeader, type SidebarHeaderProps } from './composite/navigation/SidebarHeader';

// Icons (tree-shakeable - app imports and registers only what it needs)
export { MenuIcon, MENU_ICON_ID } from './icons/MenuIcon';
export { CloseIcon, CLOSE_ICON_ID } from './icons/CloseIcon';

// Theme system (utilities only - theme definitions in app)
export { applyTheme } from './styles/applyTheme';
export type { Theme } from './styles/themeTypes';
export { default as tailwindColors } from './styles/tailwindColors';
export type { TailwindColors, ColorScale } from './styles/tailwindColors';
