/**
 * HAI3 UI-Core Components
 * Exports all UI Kit components for easy importing
 */

// Base components
export { Header, type HeaderProps } from './base/layout/Header';
export { Footer, type FooterProps } from './base/layout/Footer';
export { Menu, type MenuProps, type MenuItem } from './base/layout/Menu';
export { Sidebar, type SidebarProps } from './base/layout/Sidebar';
export { Popup, type PopupProps } from './base/layout/Popup';
export { Overlay, type OverlayProps } from './base/layout/Overlay';

export { Button, type ButtonProps, ButtonVariant, ButtonSize, IconButtonSize } from './base/button';

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
