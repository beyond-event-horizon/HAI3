import { configureStore } from '@reduxjs/toolkit';
import appReducer from './app/appSlice';
import layoutReducer from './layout/layoutSlice';
import headerReducer from './layout/domains/header/headerSlice';
import footerReducer from './layout/domains/footer/footerSlice';
import menuReducer from './layout/domains/menu/menuSlice';
import sidebarReducer from './layout/domains/sidebar/sidebarSlice';
import screenReducer from './layout/domains/screen/screenSlice';
import popupReducer from './layout/domains/popup/popupSlice';
import overlayReducer from './layout/domains/overlay/overlaySlice';
import { initAppEffects } from './app/appEffects';
import { initLayoutEffects } from './layout/layoutEffects';
import { initNavigationEffects } from './layout/navigationEffects';
import { initMenuEffects } from './layout/domains/menu/menuEffects';

/**
 * HAI3 Redux store configuration
 * Implements event-driven Flux architecture
 * - Actions emit events via Event Bus
 * - Effects subscribe to events and update slices
 * - Loose coupling between domains
 */

export const store = configureStore({
  reducer: {
    app: appReducer,
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
// Pattern: Each slice has its own effects file co-located with it
initAppEffects(store);
initLayoutEffects(store);
initNavigationEffects(store);
initMenuEffects(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export * from './app/types';
export * from './app/appSlice';
export * from './layout/layoutSlice';
export * from './layout/domains/header/headerSlice';
export * from './layout/domains/footer/footerSlice';
export * from './layout/domains/menu/menuSlice';
export * from './layout/domains/sidebar/sidebarSlice';
export * from './layout/domains/screen/screenSlice';
export * from './layout/domains/popup/popupSlice';
export * from './layout/domains/overlay/overlaySlice';
