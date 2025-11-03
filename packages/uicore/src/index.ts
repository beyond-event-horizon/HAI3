/**
 * @hai3/uicore - UI Core package exports
 * Layout system and Redux architecture for SaaS control panels
 */

// Redux store
export { store } from './store';
export type { RootState, AppDispatch } from './store';

// App slice (application-level state)
export * from './app/types';
export * from './app/appSlice';
export { initAppEffects } from './app/appEffects';

// Hooks
export { useAppDispatch, useAppSelector } from './hooks/useRedux';

// Layout
export { Layout } from './layout';

// Layout domains
export { Header, type HeaderProps } from './layout/domains/header/Header';
export { Footer, type FooterProps } from './layout/domains/footer/Footer';
export { setFooterConfig } from './layout/domains/footer/footerSlice';
export { Menu, type MenuProps } from './layout/domains/menu/Menu';
export { setMenuConfig, type MenuItem } from './layout/domains/menu/menuSlice';
export { Sidebar, type SidebarProps } from './layout/domains/sidebar/Sidebar';
export { setSidebarConfig } from './layout/domains/sidebar/sidebarSlice';
export { Screen, type ScreenProps } from './layout/domains/screen/Screen';
export { Popup, type PopupProps } from './layout/domains/popup/Popup';
export { openPopup, closePopup, closeAllPopups } from './layout/domains/popup/popupSlice';
export { Overlay, type OverlayProps } from './layout/domains/overlay/Overlay';

// App domains
export { UserInfo } from './app/domains/user/UserInfo';

// Components (Redux-aware reusable widgets)
export { ThemeSelector, type ThemeSelectorProps } from './components/ThemeSelector';
export { ScreensetSelector, type ScreensetSelectorProps, type ScreensetOption } from './components/ScreensetSelector';

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
export { setTheme, setCurrentScreenset, toggleMenu, navigateToScreen, fetchCurrentUser, setApiMode } from './core/actions';
export { setSelectedScreen } from './layout/layoutSlice'; // Direct action (Menu internal use)

// API (SOLID architecture with domain-driven, self-registering services)
export { apiServices, apiServicesRegistry, type ApiServicesConfig, type ApiServicesMap } from './api/apiServicesRegistry';
export { BaseApiService, type BaseApiServiceConfig } from './api/BaseApiService';
export { AccountsApiService, ACCOUNTS_DOMAIN } from './api/accounts/AccountsApiService'; // Triggers self-registration
export * from './api/accounts/api';
