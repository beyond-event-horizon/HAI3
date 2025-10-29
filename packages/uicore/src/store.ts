import { configureStore } from '@reduxjs/toolkit';
import coreReducer from './coreSlice';
import layoutReducer from './layout/layoutSlice';
import { headerReducer } from './layout/domains/header';
import { footerReducer } from './layout/domains/footer';
import { menuReducer } from './layout/domains/menu';
import { sidebarReducer } from './layout/domains/sidebar';
import { screenReducer } from './layout/domains/screen';
import { popupReducer } from './layout/domains/popup';
import { overlayReducer } from './layout/domains/overlay';
import { initEffects } from './core/effects';

/**
 * HAI3 Redux store configuration
 * Implements event-driven Flux architecture
 * - Actions emit events via Event Bus
 * - Effects subscribe to events and update slices
 * - Loose coupling between domains
 */

export const store = configureStore({
  reducer: {
    core: coreReducer,
    layout: layoutReducer,
    header: headerReducer,
    footer: footerReducer,
    menu: menuReducer,
    sidebar: sidebarReducer,
    screen: screenReducer,
    popup: popupReducer,
    overlay: overlayReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore popup props which may contain non-serializable values
        ignoredActions: ['popup/openPopup'],
        ignoredPaths: ['popup.stack'],
      },
    }),
});

// Initialize effects - sets up event subscriptions
initEffects(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export * from './types';
export * from './coreSlice';
export * from './layout/layoutSlice';
export * from './layout/domains/header';
export * from './layout/domains/footer';
export * from './layout/domains/menu';
export * from './layout/domains/sidebar';
export * from './layout/domains/screen';
export * from './layout/domains/popup';
export * from './layout/domains/overlay';
