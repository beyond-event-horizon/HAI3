/**
 * HAI3 UI-Core Components
 * Exports all UI Kit components for easy importing
 */

// Base UI Components (shadcn + HAI3 custom)
export { Avatar, AvatarImage, AvatarFallback } from './base/avatar';
export { Button, type ButtonProps } from './base/button';
// Re-export contract types to ensure consistency
export { ButtonVariant, ButtonSize } from '@hai3/uikit-contracts';
export { Badge, badgeVariants, type BadgeProps } from './base/badge';
export { Input } from './base/input';
export { Textarea } from './base/textarea';
export { Switch } from './base/switch';
export { Skeleton } from './base/skeleton';
export { Spinner, type SpinnerProps } from './base/spinner';
export { Slider, SliderTrack, SliderRange, SliderThumb } from './base/slider';
export { Progress } from './base/progress';
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './base/tooltip';
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './base/card';
export { Header, type HeaderProps } from './base/header'; // HAI3 custom base component

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

// Composite components
export { IconButton, type IconButtonProps } from './composite/buttons/IconButton';
export { DropdownButton, type DropdownButtonProps } from './composite/buttons/DropdownButton';
// Re-export contract types to ensure consistency
export { IconButtonSize } from '@hai3/uikit-contracts';

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

// Composite user components
export { UserInfo, type UserInfoProps } from './composite/user/UserInfo';

// Composite chat components
export { MessageBubble, MessageType, type MessageBubbleProps } from './composite/chat/MessageBubble';
export { ChatInput, type ChatInputProps } from './composite/chat/ChatInput';
export { ThreadList, type ThreadListProps, type ChatThread } from './composite/chat/ThreadList';

// Icons (tree-shakeable - app imports and registers only what it needs)
export { MenuIcon, MENU_ICON_ID } from './icons/MenuIcon';
export { CloseIcon, CLOSE_ICON_ID } from './icons/CloseIcon';

// Theme system (utilities only - theme definitions in app)
export { applyTheme } from './styles/applyTheme';
export type { Theme } from './styles/themeTypes';
export { default as tailwindColors } from './styles/tailwindColors';
export type { TailwindColors, ColorScale } from './styles/tailwindColors';
