/**
 * Threads Effects
 * Listen to thread-related events and update threads slice
 * Following Flux: Effects subscribe to events and update their own slice only
 * Cross-domain coordination: Can listen to events from other domains
 */

import { eventBus, type AppDispatch, store } from '@hai3/uicore';
import { ThreadsEvents } from '../events/threadsEvents';
import { MessagesEvents } from '../events/messagesEvents';
import { DataEvents } from '../events/dataEvents';
import { selectThreadsState } from '../slices/threadsSlice';
import {
  setCurrentThreadId,
  addThread,
  removeThread,
  updateThread,
  setThreads,
} from '../slices/threadsSlice';
import type { Thread } from '../types';

let dispatch: AppDispatch;

/**
 * Initialize threads effects
 * Called once during app bootstrap
 */
export const initializeThreadsEffects = (appDispatch: AppDispatch): void => {
  dispatch = appDispatch;

  // Thread selection
  eventBus.on(ThreadsEvents.Selected, ({ threadId }) => {
    dispatch(setCurrentThreadId(threadId));
  });

  // Draft thread creation
  eventBus.on(ThreadsEvents.DraftCreated, ({ threadId, title, isTemporary }) => {
    // Create a local draft thread (not saved to backend yet)
    const draftThread: Thread = {
      id: threadId,
      title,
      preview: '',
      timestamp: new Date().toISOString(),
      isTemporary,
      isDraft: true, // Mark as draft
    };
    dispatch(addThread(draftThread));
    dispatch(setCurrentThreadId(threadId));
  });

  // Thread created (from backend)
  eventBus.on(ThreadsEvents.Created, ({ thread }) => {
    // If this is replacing a draft thread, remove the draft first
    const threadsState = selectThreadsState(store.getState());
    const draftThread = threadsState.threads.find((t) => t.isDraft);
    if (draftThread) {
      dispatch(removeThread({ threadId: draftThread.id }));
    }

    dispatch(addThread(thread));
    dispatch(setCurrentThreadId(thread.id));
  });

  // Thread deletion
  eventBus.on(ThreadsEvents.Deleted, ({ threadId }) => {
    dispatch(removeThread({ threadId }));
  });

  // Thread title update
  eventBus.on(ThreadsEvents.TitleUpdated, ({ threadId, newTitle }) => {
    dispatch(updateThread({ threadId, updates: { title: newTitle } }));
  });

  // Thread reordering
  eventBus.on(ThreadsEvents.Reordered, ({ threads }) => {
    // Convert EnhancedChatThread to Thread
    const reorderedThreads: Thread[] = threads.map((t) => ({
      id: t.id,
      title: t.title,
      preview: t.preview,
      timestamp: t.timestamp,
      isTemporary: t.isTemporary,
    }));
    dispatch(setThreads(reorderedThreads));
  });

  // Thread temporary toggle
  eventBus.on(ThreadsEvents.TemporaryToggled, ({ threadId, isTemporary }) => {
    dispatch(updateThread({ threadId, updates: { isTemporary } }));
  });

  // Cross-domain: Update thread preview when message is sent
  eventBus.on(MessagesEvents.Sent, ({ content }) => {
    const threadsState = selectThreadsState(store.getState());
    const currentThreadId = threadsState.currentThreadId;

    if (!currentThreadId || !content.trim()) {
      return;
    }

    // Update thread preview and timestamp
    dispatch(updateThread({
      threadId: currentThreadId,
      updates: {
        preview: content.trim().substring(0, 100),
        timestamp: new Date().toISOString(),
      }
    }));
  });

  // Data fetch: Load threads
  eventBus.on(DataEvents.FetchSucceeded, ({ threads }) => {
    dispatch(setThreads(threads));

    // Set current thread to the first one if available
    const threadsState = selectThreadsState(store.getState());
    if (threads.length > 0 && !threadsState.currentThreadId) {
      dispatch(setCurrentThreadId(threads[0].id));
    }
  });

  // Data fetch failure
  eventBus.on(DataEvents.FetchFailed, ({ error }) => {
    console.error('Failed to load threads:', error);
  });
};
