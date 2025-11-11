import { configureStore, combineReducers, type Reducer } from '@reduxjs/toolkit';
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
 * Implements event-driven Flux architecture with dynamic reducer injection
 * - Actions emit events via Event Bus
 * - Effects subscribe to events and update slices
 * - Loose coupling between domains
 * - Screensets can register slices dynamically via registerSlice()
 */

// Core reducers that are always present
const staticReducers = {
  app: appReducer,
  layout: layoutReducer,
  header: headerReducer,
  footer: footerReducer,
  menu: menuReducer,
  sidebar: sidebarReducer,
  screen: screenReducer,
  popup: popupReducer,
  overlay: overlayReducer,
};

// Dynamic reducers registered by screensets
const dynamicReducers: Record<string, Reducer> = {};

export const store = configureStore({
  reducer: staticReducers,
});

/**
 * Register a dynamic slice from a screenset
 * Allows screensets to add their state to the global store without modifying uicore
 * 
 * @param sliceName - Name of the slice (e.g., 'chat')
 * @param reducer - Reducer function for the slice
 * @param initEffects - Optional function to initialize effects with store.dispatch
 */
export function registerSlice(
  sliceName: string,
  reducer: Reducer,
  initEffects?: (dispatch: typeof store.dispatch) => void
): void {
  // Prevent duplicate registration
  if (dynamicReducers[sliceName]) {
    console.warn(`Slice "${sliceName}" is already registered. Skipping.`);
    return;
  }

  // Add to dynamic reducers
  dynamicReducers[sliceName] = reducer;

  // Rebuild root reducer with new slice
  const rootReducer = combineReducers({
    ...staticReducers,
    ...dynamicReducers,
  });

  // Replace store's reducer
  store.replaceReducer(rootReducer);

  // Initialize effects if provided
  if (initEffects) {
    initEffects(store.dispatch);
  }
}

// Initialize core effects - sets up event subscriptions
// Pattern: Each slice has its own effects file co-located with it
initAppEffects(store);
initLayoutEffects(store);
initNavigationEffects(store);
initMenuEffects(store);

// Base RootState interface for augmentation by screensets
// Screensets can extend this via module augmentation to add their slices
export interface RootState extends ReturnType<typeof store.getState> {}

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
