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
import { UICORE_ID } from './core/constants';

/**
 * HAI3 Redux store configuration
 * Implements event-driven Flux architecture with dynamic reducer injection
 * - Actions emit events via Event Bus
 * - Effects subscribe to events and update slices
 * - Loose coupling between domains
 * - Screensets can register slices dynamically via registerSlice()
 */

// Core uicore reducers nested under 'uicore' key
const uicoreReducers = combineReducers({
  app: appReducer,
  layout: layoutReducer,
  header: headerReducer,
  footer: footerReducer,
  menu: menuReducer,
  sidebar: sidebarReducer,
  screen: screenReducer,
  popup: popupReducer,
  overlay: overlayReducer,
});

// Static reducers that are always present
const staticReducers = {
  [UICORE_ID]: uicoreReducers,
};

// Dynamic reducers registered by screensets
const dynamicReducers: Record<string, Reducer> = {};

// Base RootState interface - defined explicitly for module augmentation
// Screensets can extend this via module augmentation to add their slices
export interface RootState {
  uicore: {
    app: ReturnType<typeof appReducer>;
    layout: ReturnType<typeof layoutReducer>;
    header: ReturnType<typeof headerReducer>;
    footer: ReturnType<typeof footerReducer>;
    menu: ReturnType<typeof menuReducer>;
    sidebar: ReturnType<typeof sidebarReducer>;
    screen: ReturnType<typeof screenReducer>;
    popup: ReturnType<typeof popupReducer>;
    overlay: ReturnType<typeof overlayReducer>;
  };
}

// Create store with static reducers
const _internalStore = configureStore({
  reducer: staticReducers,
});

// Export store typed to return RootState (enables module augmentation to work everywhere)
// We create a wrapper object that delegates to the internal store but types getState correctly
export const store = {
  ..._internalStore,
  getState: (): RootState => _internalStore.getState() as RootState,
};

/**
 * Type for a Redux Toolkit slice object
 */
export interface SliceObject {
  name: string;
  reducer: Reducer;
  actions: Record<string, unknown>;
}

/**
 * Register a dynamic slice from a screenset
 * Allows screensets to add their state to the global store without modifying uicore
 *
 * CONVENTION ENFORCEMENT: Slice.name becomes the state key automatically
 * This ensures screenset self-containment - when you duplicate a screenset and change
 * the screenset ID constant, everything auto-updates via template literals.
 *
 * @param slice - Redux Toolkit slice object (from createSlice)
 * @param initEffects - Optional function to initialize effects with store.dispatch
 *
 * @throws Error if domain-based slice has invalid format
 */
export function registerSlice(
  slice: SliceObject,
  initEffects?: (dispatch: typeof store.dispatch) => void
): void {
  // Extract slice name (this is the state key)
  const sliceName = slice.name;
  const reducer = slice.reducer;

  // Prevent duplicate registration
  if (dynamicReducers[sliceName]) {
    console.warn(`Slice "${sliceName}" is already registered. Skipping.`);
    return;
  }

  // VALIDATE DOMAIN-BASED SLICE FORMAT
  // Domain-based slices must follow 'screensetId/domain' format (exactly 2 parts)
  if (sliceName.includes('/')) {
    const parts = sliceName.split('/');
    if (parts.length !== 2) {
      throw new Error(
        `Invalid domain slice key: "${sliceName}".\n` +
        `Domain-based slices must use "screensetId/domain" format (exactly 2 parts).\n` +
        `Examples: "chat/threads", "chat/messages", "dashboard/widgets"\n` +
        `Invalid: "chat/messages/extra" (too many parts)`
      );
    }
    if (parts[0] === '' || parts[1] === '') {
      throw new Error(
        `Invalid domain slice key: "${sliceName}".\n` +
        `Both screensetId and domain must be non-empty.\n` +
        `Fix: Use format "screensetId/domain" (e.g., "chat/threads")`
      );
    }
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
