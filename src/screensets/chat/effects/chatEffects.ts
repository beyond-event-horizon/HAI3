/**
 * Chat Effects
 * Listen to events and update chat slice
 * Following Flux: Effects ONLY listen to events and update their own slice
 * Effects NEVER call actions or emit events (would create circular flow)
 */

import { eventBus, type AppDispatch, store } from '@hai3/uicore';
import { ChatEvents } from '../events/chatEvents';
import { selectChatState } from '../slices/chatSlice';
import {
  setCurrentThreadId,
  addThread,
  removeThread,
  updateThread,
  setThreads,
  addMessage,
  updateMessage,
  toggleMessageRawMarkdown,
  removeMessage,
  removeMessagesAfter,
  setEditingMessageId,
  setEditedContent,
  setCurrentModel,
  addContextToList,
  removeContextFromList,
  addFileToList,
  removeFileFromList,
  setInputValue,
  setIsStreaming,
  setMessages,
  setAvailableContexts,
} from '../slices/chatSlice';
import type { Thread } from '../types';

let dispatch: AppDispatch;

/**
 * Initialize chat effects
 * Called once during app bootstrap
 */
export const initializeChatEffects = (appDispatch: AppDispatch): void => {
  dispatch = appDispatch;

  // Thread effects
  eventBus.on(ChatEvents.ThreadSelected, ({ threadId }) => {
    dispatch(setCurrentThreadId(threadId));
  });

  eventBus.on(ChatEvents.DraftThreadCreated, ({ threadId, title, isTemporary }) => {
    // Create a local draft thread (not saved to backend yet)
    const draftThread: Thread = {
      id: threadId,
      title, // Localized "New chat" title
      preview: '',
      timestamp: new Date().toISOString(),
      isTemporary,
      isDraft: true, // Mark as draft
    };
    dispatch(addThread(draftThread));
    dispatch(setCurrentThreadId(threadId));
  });

  eventBus.on(ChatEvents.ThreadCreated, ({ thread }) => {
    // Effect ONLY updates Redux - thread object comes from action/API
    // If this is replacing a draft thread, remove the draft first
    const chat = selectChatState(store.getState());
    const draftThread = chat.threads.find((t) => t.isDraft);
    if (draftThread) {
      dispatch(removeThread({ threadId: draftThread.id }));
    }

    dispatch(addThread(thread));
    dispatch(setCurrentThreadId(thread.id));
  });

  eventBus.on(ChatEvents.ThreadDeleted, ({ threadId }) => {
    dispatch(removeThread({ threadId }));
    // Note: selecting new thread is handled in selector/component logic
  });

  eventBus.on(ChatEvents.ThreadTitleUpdated, ({ threadId, newTitle }) => {
    dispatch(updateThread({ threadId, updates: { title: newTitle } }));
  });

  eventBus.on(ChatEvents.ThreadsReordered, ({ threads }) => {
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

  eventBus.on(ChatEvents.ThreadTemporaryToggled, ({ threadId, isTemporary }) => {
    dispatch(updateThread({ threadId, updates: { isTemporary } }));
  });

  // Message effects
  eventBus.on(ChatEvents.MessageCreated, ({ message }) => {
    // Effect ONLY updates Redux - message object comes from action/API
    dispatch(addMessage(message));
  });

  eventBus.on(ChatEvents.MessageSent, ({ content }) => {
    // Handle UI updates after message is sent
    const chat = selectChatState(store.getState());
    const currentThreadId = chat.currentThreadId;

    if (!currentThreadId || !content.trim()) {
      return;
    }

    // Clear input
    dispatch(setInputValue(''));

    // Update thread preview with the new message
    dispatch(updateThread({
      threadId: currentThreadId,
      updates: {
        preview: content.trim().substring(0, 100),
        timestamp: new Date().toISOString(),
      }
    }));
  });

  eventBus.on(ChatEvents.MessageEditingStarted, ({ messageId, content }) => {
    dispatch(setEditingMessageId(messageId));
    dispatch(setEditedContent(content));
  });

  eventBus.on(ChatEvents.MessageEditedContentUpdated, ({ content }) => {
    dispatch(setEditedContent(content));
  });

  eventBus.on(ChatEvents.MessageEditSaved, ({ messageId, content }) => {
    dispatch(updateMessage({ messageId, updates: { content } }));
    dispatch(setEditingMessageId(null));
    dispatch(setEditedContent(''));
  });

  eventBus.on(ChatEvents.MessageEditCancelled, () => {
    dispatch(setEditingMessageId(null));
    dispatch(setEditedContent(''));
  });

  eventBus.on(ChatEvents.MessageLiked, ({ messageId }) => {
    dispatch(updateMessage({
      messageId,
      updates: { liked: true, disliked: false }
    }));
  });

  eventBus.on(ChatEvents.MessageDisliked, ({ messageId }) => {
    dispatch(updateMessage({
      messageId,
      updates: { disliked: true, liked: false }
    }));
  });

  eventBus.on(ChatEvents.MessageDeleted, ({ messageId }) => {
    dispatch(removeMessage({ messageId }));
  });

  eventBus.on(ChatEvents.MessageViewModeToggled, ({ messageId }) => {
    dispatch(toggleMessageRawMarkdown({ messageId }));
  });

  eventBus.on(ChatEvents.MessageRegenerated, ({ messageId }) => {
    // Remove the message and all messages after it
    // The action will handle calling the API to regenerate
    dispatch(removeMessage({ messageId }));
    dispatch(removeMessagesAfter({ messageId }));
  });

  // Model and Context effects
  eventBus.on(ChatEvents.ModelChanged, ({ model }) => {
    dispatch(setCurrentModel(model));
  });

  eventBus.on(ChatEvents.ContextAdded, ({ contextId }) => {
    dispatch(addContextToList({ contextId }));
  });

  eventBus.on(ChatEvents.ContextRemoved, ({ contextId }) => {
    dispatch(removeContextFromList({ contextId }));
  });

  // File effects
  eventBus.on(ChatEvents.FileAttached, ({ file }) => {
    dispatch(addFileToList({ file }));
  });

  eventBus.on(ChatEvents.FileRemoved, ({ fileId }) => {
    dispatch(removeFileFromList({ fileId }));
  });

  // Input effects
  eventBus.on(ChatEvents.InputValueChanged, ({ value }) => {
    dispatch(setInputValue(value));
  });

  // Streaming effects (Effects ONLY update Redux - no API calls!)
  eventBus.on(ChatEvents.StreamingStarted, ({ messageId: _messageId }) => {
    // Effect ONLY sets streaming flag - message is created via API and MessageCreated event
    dispatch(setIsStreaming(true));
  });

  eventBus.on(ChatEvents.StreamingContentUpdated, ({ messageId, content }) => {
    // Append new content to existing message
    const chat = selectChatState(store.getState());
    const message = chat.messages.find(m => m.id === messageId);

    if (message) {
      const newContent = message.content + content;
      dispatch(updateMessage({ messageId, updates: { content: newContent } }));
    }
  });

  eventBus.on(ChatEvents.StreamingCompleted, ({ messageId: _messageId }) => {
    dispatch(setIsStreaming(false));
  });

  // Data fetch effects
  eventBus.on(ChatEvents.DataFetchSucceeded, ({ threads, messages, contexts }) => {
    // Store data as-is (timestamps are ISO strings, Redux-serializable)
    dispatch(setThreads(threads));
    dispatch(setMessages(messages));
    dispatch(setAvailableContexts(contexts));

    // Set current thread to the first one if available
    if (threads.length > 0 && !selectChatState(store.getState()).currentThreadId) {
      dispatch(setCurrentThreadId(threads[0].id));
    }
  });

  eventBus.on(ChatEvents.DataFetchFailed, ({ error }) => {
    console.error('Failed to load chat data:', error);
    // Could show an error message to user here
  });
};

/**
 * Cleanup chat effects
 * Called when unmounting (though effects typically live for app lifetime)
 */
export const cleanupChatEffects = (): void => {
  // EventBus cleanup would go here if needed
  // For now, effects live for the app lifetime
};
