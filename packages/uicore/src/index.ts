/**
 * @hai3/uicore - UI Core package exports
 * Layout system and Redux architecture for SaaS control panels
 */

// Redux store
export { store } from './store';
export type { RootState, AppDispatch } from './store';

// Core slice
export * from './coreSlice';

// Types
export * from './types';

// Hooks
export { useAppDispatch, useAppSelector } from './hooks/useRedux';

// Layout
export { Layout } from './layout';

// Layout domains
export { Header, type HeaderProps, setHeaderConfig } from './layout/domains/header';
export { Footer, type FooterProps, setFooterConfig } from './layout/domains/footer';
export { Menu, type MenuProps, setMenuConfig } from './layout/domains/menu';
export { Sidebar, type SidebarProps, setSidebarConfig } from './layout/domains/sidebar';
export { Screen, type ScreenProps } from './layout/domains/screen';
export { Popup, type PopupProps, openPopup, closePopup, closeAllPopups } from './layout/domains/popup';
export { Overlay, type OverlayProps } from './layout/domains/overlay';

// Components (Redux-aware reusable widgets)
export { ThemeSelector, type ThemeSelectorProps } from './components/ThemeSelector';

// Re-export MenuItem from UI Kit for convenience
export type { MenuItem } from '@hai3/uikit';

// Layout slice
export { setTheme } from './layout/layoutSlice';
