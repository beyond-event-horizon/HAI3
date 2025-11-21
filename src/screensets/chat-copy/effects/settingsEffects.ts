/**
 * Settings Effects
 * Listen to settings-related events and update settings slice
 * Following Flux: Effects subscribe to events and update their own slice only
 * Cross-domain coordination: Can listen to events from other domains
 */

import { eventBus, type AppDispatch } from '@hai3/uicore';
import { SettingsEvents } from '../events/settingsEvents';
import { DataEvents } from '../events/dataEvents';
import {
  setCurrentModel,
  addContextToList,
  removeContextFromList,
  setAvailableContexts,
} from '../slices/settingsSlice';

let dispatch: AppDispatch;

/**
 * Initialize settings effects
 * Called once during app bootstrap
 */
export const initializeSettingsEffects = (appDispatch: AppDispatch): void => {
  dispatch = appDispatch;

  // Model change
  eventBus.on(SettingsEvents.ModelChanged, ({ model }) => {
    dispatch(setCurrentModel(model));
  });

  // Context management
  eventBus.on(SettingsEvents.ContextAdded, ({ contextId }) => {
    dispatch(addContextToList({ contextId }));
  });

  eventBus.on(SettingsEvents.ContextRemoved, ({ contextId }) => {
    dispatch(removeContextFromList({ contextId }));
  });

  // Data fetch: Load available contexts
  eventBus.on(DataEvents.FetchSucceeded, ({ contexts }) => {
    dispatch(setAvailableContexts(contexts));
  });

  // Data fetch failure
  eventBus.on(DataEvents.FetchFailed, ({ error }) => {
    console.error('Failed to load settings:', error);
  });
};
