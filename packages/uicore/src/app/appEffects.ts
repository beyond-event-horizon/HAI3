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
} from '../core/events/eventTypes';
import { setUser, setError, setLoading, setUseMockApi } from './appSlice';
import { apiServices } from '../api/apiServices';

/**
 * Initialize API services with current configuration
 * Initializes all service instances in the registry
 */
function initializeApiServices(useMockApi: boolean): void {
  apiServices.initialize({
    useMockApi,
    mockDelay: 500,
  });
}

/**
 * Initialize app effects
 * Call this once during app setup
 */
export function initAppEffects(store: Store): void {
  // Initialize API services on startup
  const initialUseMockApi = store.getState().app.useMockApi;
  initializeApiServices(initialUseMockApi);

  // User events
  eventBus.on(UserEvents.UserFetched, ({ user }) => {
    store.dispatch(setUser(user));
    store.dispatch(setLoading(false));
  });

  eventBus.on(UserEvents.UserFetchFailed, ({ error }) => {
    store.dispatch(setError(error.message));
    store.dispatch(setLoading(false));
  });

  // API configuration events
  eventBus.on(ApiEvents.ApiModeChanged, ({ useMockApi }) => {
    store.dispatch(setUseMockApi(useMockApi));
    // Re-initialize API services with new mock mode
    initializeApiServices(useMockApi);
  });
}
