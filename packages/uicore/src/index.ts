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
export { ScreensetSelector, type ScreensetSelectorProps, type ScreensetOption } from './components/ScreensetSelector';

// Re-export MenuItem from menu domain (vertical slice approach)
export type { MenuItem } from './layout/domains/menu';

// Screenset management (Footer domain handles watching)
export { screensetService, type ScreensetConfig } from './screensets/screensetService';

// Theme management (Footer domain handles watching)
export { themeService } from './theme/themeService';

// Icon management (screensets register icons)
export { iconService } from './icons/iconService';

// HAI3Provider - Main entry point for apps
export { HAI3Provider, type HAI3ProviderProps } from './core/HAI3Provider';

// Routing
export { AppRouter } from './core/routing/AppRouter';
export { routeService, type RouteInfo } from './core/routing/routeService';

// Event-driven actions (AI: READ THIS - use these, NOT slice actions)
export { setTheme, setCurrentScreenset, toggleMenu, navigateToScreen } from './core/actions';
export { setSelectedScreen } from './layout/layoutSlice'; // Direct action (Menu internal use)
