/**
 * HAI3 UI-Core Components
 * Exports all UI Kit components for easy importing
 */

// Base shadcn components
export { Button, type ButtonProps, ButtonVariant, ButtonSize, IconButtonSize } from './base/button';

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
export { CascadingSelect, type CascadingSelectProps, type CascadingOption } from './composite/selectors/CascadingSelect';
export { SimpleSelect, type SimpleSelectProps, type SimpleSelectOption } from './composite/selectors/SimpleSelect';

// Composite components
export { IconButton, type IconButtonProps } from './composite/buttons/IconButton';

// Theme system (utilities only - theme definitions in app)
export { applyTheme } from './styles/applyTheme';
export type { Theme } from './styles/themeTypes';
