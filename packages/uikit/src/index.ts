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

export { Button, type ButtonProps, ButtonVariant, ButtonSize } from './base/buttons/Button';
export { Select, type SelectProps, type SelectOption, type SelectOptionGroup } from './base/selectors/Select';

// Base dropdowns (wraps shadcn)
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from './base/dropdowns/DropdownMenu';
export { CascadingSelect, type CascadingSelectProps, type CascadingOption } from './composite/selectors/CascadingSelect';

// Composite components
export { IconButton, type IconButtonProps, IconButtonSize } from './composite/buttons/IconButton';

// Theme system (utilities only - theme definitions in app)
export { applyTheme } from './styles/applyTheme';
export type { Theme } from './styles/themeTypes';
