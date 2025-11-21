/**
 * Composer Effects
 * Listen to composer-related events and update composer slice
 * Following Flux: Effects subscribe to events and update their own slice only
 * Cross-domain coordination: Can listen to events from other domains
 */

import { eventBus, type AppDispatch } from '@hai3/uicore';
import { ComposerEvents } from '../events/composerEvents';
import { MessagesEvents } from '../events/messagesEvents';
import {
  addFileToList,
  removeFileFromList,
  setInputValue,
  setAttachedFiles,
} from '../slices/composerSlice';

let dispatch: AppDispatch;

/**
 * Initialize composer effects
 * Called once during app bootstrap
 */
export const initializeComposerEffects = (appDispatch: AppDispatch): void => {
  dispatch = appDispatch;

  // File attachment
  eventBus.on(ComposerEvents.FileAttached, ({ file }) => {
    dispatch(addFileToList({ file }));
  });

  eventBus.on(ComposerEvents.FileRemoved, ({ fileId }) => {
    dispatch(removeFileFromList({ fileId }));
  });

  // Input value change
  eventBus.on(ComposerEvents.InputValueChanged, ({ value }) => {
    dispatch(setInputValue(value));
  });

  // Cross-domain: Clear input and files when message is sent
  eventBus.on(MessagesEvents.Sent, () => {
    dispatch(setInputValue(''));
    dispatch(setAttachedFiles([]));
  });
};
