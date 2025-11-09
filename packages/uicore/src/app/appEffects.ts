/**
 * App Effects - Side effects for application-level state
 * Subscribes to user and API events, updates app slice
 * Implements Flux pattern: Event -> Effect -> Slice Update
 * 
 * Pattern: 1 slice = 1 effects file
 * All events that update appSlice are handled here
 */

import type { Store } from '@reduxjs/toolkit';
import { eventBus } from '../core/events/eventBus';
import {
  UserEvents,
  ApiEvents,
  I18nEvents,
} from '../core/events/eventTypes';
import { setUser, setError, setLoading, setUseMockApi, setLanguage, setTranslationsReady } from './appSlice';
import { apiRegistry } from '../api/apiRegistry';
import { i18nRegistry } from '../i18n/i18nRegistry';

/**
 * Initialize app effects
 * Call this once during app setup
 */
export function initAppEffects(store: Store): void {
  // User fetch started - set loading state
  eventBus.on(UserEvents.UserFetchStarted, () => {
    store.dispatch(setLoading(true));
  });
  
  // User fetch succeeded - update user and clear loading
  eventBus.on(UserEvents.UserFetched, ({ user }) => {
    store.dispatch(setUser(user));
    store.dispatch(setLoading(false));
  });

  // User fetch failed - set error and clear loading
  eventBus.on(UserEvents.UserFetchFailed, ({ error }) => {
    store.dispatch(setError(error.message));
    store.dispatch(setLoading(false));
  });

  // API configuration events
  eventBus.on(ApiEvents.ApiModeChanged, ({ useMockApi }) => {
    store.dispatch(setUseMockApi(useMockApi));
    apiRegistry.setMockMode(useMockApi);
  });

  // i18n events
  eventBus.on(I18nEvents.LanguageChanged, async ({ language }) => {
    // Mark translations as not ready while loading
    store.dispatch(setTranslationsReady(false));
    
    // Update Redux store
    store.dispatch(setLanguage(language));
    
    // Update i18nRegistry (sets HTML attributes, loads translations)
    await i18nRegistry.setLanguage(language);
    
    // Mark translations as ready after loading
    store.dispatch(setTranslationsReady(true));
  });
}
