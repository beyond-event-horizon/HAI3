/**
 * @hai3/uicore - UI Core package exports
 * Layout system and Redux architecture for SaaS control panels
 */

// Redux store
export { store, registerSlice } from './store';
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
export { Header } from './layout/domains/header/Header';
export { Footer } from './layout/domains/footer/Footer';
export { Menu } from './layout/domains/menu/Menu';
export { setMenuConfig, type MenuItem } from './layout/domains/menu/menuSlice';
export { Sidebar } from './layout/domains/sidebar/Sidebar';
export { setSidebarConfig } from './layout/domains/sidebar/sidebarSlice';
export { Screen, type ScreenProps } from './layout/domains/screen/Screen';
export { Popup } from './layout/domains/popup/Popup';
export { Overlay } from './layout/domains/overlay/Overlay';
// TODO: setMenuConfig, setSidebarConfig should have action wrappers
// Currently exported from slices - will be flagged by arch:check if used in components

// Components (Redux-aware reusable widgets)
export { UserInfo } from './components/UserInfo';
export { ThemeSelector, type ThemeSelectorProps } from './components/ThemeSelector';
export { ScreensetSelector, type ScreensetSelectorProps, type ScreensetOption } from './components/ScreensetSelector';
// TODO: Uncomment when Select components are registered in UI Kit
// export { LanguageSelector, type LanguageSelectorProps } from './components/LanguageSelector';

// Screenset management (Footer domain handles watching)
export { screensetRegistry, type ScreensetConfig } from './screensets/screensetRegistry';

// Theme management (Footer domain handles watching)
export { themeRegistry } from './theme/themeRegistry';

// UI Kit registry (app registers UI components and icons)
export { uikitRegistry } from './uikit/uikitRegistry';
export type { UiKitComponentMap, ComponentName, Theme } from '@hai3/uikit-contracts';
export { UiKitComponent, UiKitIcon } from '@hai3/uikit-contracts';

// HAI3Provider - Main entry point for apps
export { HAI3Provider, type HAI3ProviderProps } from './core/HAI3Provider';

// Routing
export { AppRouter } from './core/routing/AppRouter';
export { routeRegistry, type RouteInfo } from './core/routing/routeRegistry';

// Event-driven actions (AI: READ THIS - use these, NOT slice actions)
// Note: bootstrapApp is internal to uicore, dispatched automatically by Layout
// Actions use imperative names (change, select, toggle, fetch) - NOT "set" prefix
export { changeTheme, selectScreenset, toggleMenu, navigateToScreen, fetchCurrentUser, setApiMode } from './core/actions';
export { setSelectedScreen } from './layout/layoutSlice'; // Direct action (Menu internal use)

// API (SOLID architecture with domain-driven, self-registering services)
export { apiRegistry, type ApiServicesConfig, type ApiServicesMap } from './api/apiRegistry';
export { BaseApiService, type BaseApiServiceConfig } from './api/BaseApiService';
export { AccountsApiService, ACCOUNTS_DOMAIN } from './api/accounts/AccountsApiService'; // Triggers self-registration
export * from './api/accounts/api';

// i18n (Internationalization system)
export { i18nRegistry } from './i18n/i18nRegistry';
export { useTranslation } from './i18n/useTranslation';
export { TextLoader, type TextLoaderProps } from './i18n/TextLoader';
export { changeLanguage } from './core/actions/i18nActions';
export { Language, TextDirection, LanguageDisplayMode, SUPPORTED_LANGUAGES, type LanguageMetadata, type TranslationDictionary, type TranslationLoader, type I18nConfig } from './i18n/types';
export { I18nEvents, type LanguageChangedPayload } from './core/events/eventTypes/i18nEvents';

// Event system (bus, types, enums)
export { eventBus } from './core/events/eventBus';
export type { EventPayloadMap, EventKey } from './core/events/eventTypes/eventMap';
