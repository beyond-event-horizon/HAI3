/**
 * Chat Copy Effects
 * Listen to events and update chat copy slice
 * Following Flux: Effects ONLY listen to events and update their own slice
 * Effects NEVER call actions or emit events (would create circular flow)
 */

import { eventBus, type AppDispatch, store } from '@hai3/uicore';
import { ChatCopyEvents } from '../events/chatCopyEvents';
import { selectChatCopyState } from '../slices/chatCopySlice';
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
} from '../slices/chatCopySlice';
import type { Thread } from '../types';

let dispatch: AppDispatch;

/**
 * Initialize chat copy effects
 * Called once during app bootstrap
 */
export const initializeChatCopyEffects = (appDispatch: AppDispatch): void => {
  dispatch = appDispatch;

  // Thread effects
  eventBus.on(ChatCopyEvents.ThreadSelected, ({ threadId }) => {
    dispatch(setCurrentThreadId(threadId));
  });

  eventBus.on(ChatCopyEvents.DraftThreadCreated, ({ threadId, title, isTemporary }) => {
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

  eventBus.on(ChatCopyEvents.ThreadCreated, ({ thread }) => {
    // Effect ONLY updates Redux - thread object comes from action/API
    // If this is replacing a draft thread, remove the draft first
    const chatCopy = selectChatCopyState(store.getState());
    const draftThread = chatCopy.threads.find((t) => t.isDraft);
    if (draftThread) {
      dispatch(removeThread({ threadId: draftThread.id }));
    }

    dispatch(addThread(thread));
    dispatch(setCurrentThreadId(thread.id));
  });

  eventBus.on(ChatCopyEvents.ThreadDeleted, ({ threadId }) => {
    dispatch(removeThread({ threadId }));
    // Note: selecting new thread is handled in selector/component logic
  });

  eventBus.on(ChatCopyEvents.ThreadTitleUpdated, ({ threadId, newTitle }) => {
    dispatch(updateThread({ threadId, updates: { title: newTitle } }));
  });

  eventBus.on(ChatCopyEvents.ThreadsReordered, ({ threads }) => {
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

  eventBus.on(ChatCopyEvents.ThreadTemporaryToggled, ({ threadId, isTemporary }) => {
    dispatch(updateThread({ threadId, updates: { isTemporary } }));
  });

  // Message effects
  eventBus.on(ChatCopyEvents.MessageCreated, ({ message }) => {
    // Effect ONLY updates Redux - message object comes from action/API
    dispatch(addMessage(message));
  });

  eventBus.on(ChatCopyEvents.MessageSent, ({ content }) => {
    // Handle UI updates after message is sent
    const chatCopy = selectChatCopyState(store.getState());
    const currentThreadId = chatCopy.currentThreadId;

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

  eventBus.on(ChatCopyEvents.MessageEditingStarted, ({ messageId, content }) => {
    dispatch(setEditingMessageId(messageId));
    dispatch(setEditedContent(content));
  });

  eventBus.on(ChatCopyEvents.MessageEditedContentUpdated, ({ content }) => {
    dispatch(setEditedContent(content));
  });

  eventBus.on(ChatCopyEvents.MessageEditSaved, ({ messageId, content }) => {
    dispatch(updateMessage({ messageId, updates: { content } }));
    dispatch(setEditingMessageId(null));
    dispatch(setEditedContent(''));
  });

  eventBus.on(ChatCopyEvents.MessageEditCancelled, () => {
    dispatch(setEditingMessageId(null));
    dispatch(setEditedContent(''));
  });

  eventBus.on(ChatCopyEvents.MessageLiked, ({ messageId }) => {
    dispatch(updateMessage({
      messageId,
      updates: { liked: true, disliked: false }
    }));
  });

  eventBus.on(ChatCopyEvents.MessageDisliked, ({ messageId }) => {
    dispatch(updateMessage({
      messageId,
      updates: { disliked: true, liked: false }
    }));
  });

  eventBus.on(ChatCopyEvents.MessageDeleted, ({ messageId }) => {
    dispatch(removeMessage({ messageId }));
  });

  eventBus.on(ChatCopyEvents.MessageViewModeToggled, ({ messageId }) => {
    dispatch(toggleMessageRawMarkdown({ messageId }));
  });

  eventBus.on(ChatCopyEvents.MessageRegenerated, ({ messageId }) => {
    // Remove the message and all messages after it
    // The action will handle calling the API to regenerate
    dispatch(removeMessage({ messageId }));
    dispatch(removeMessagesAfter({ messageId }));
  });

  // Model and Context effects
  eventBus.on(ChatCopyEvents.ModelChanged, ({ model }) => {
    dispatch(setCurrentModel(model));
  });

  eventBus.on(ChatCopyEvents.ContextAdded, ({ contextId }) => {
    dispatch(addContextToList({ contextId }));
  });

  eventBus.on(ChatCopyEvents.ContextRemoved, ({ contextId }) => {
    dispatch(removeContextFromList({ contextId }));
  });

  // File effects
  eventBus.on(ChatCopyEvents.FileAttached, ({ file }) => {
    dispatch(addFileToList({ file }));
  });

  eventBus.on(ChatCopyEvents.FileRemoved, ({ fileId }) => {
    dispatch(removeFileFromList({ fileId }));
  });

  // Input effects
  eventBus.on(ChatCopyEvents.InputValueChanged, ({ value }) => {
    dispatch(setInputValue(value));
  });

  // Streaming effects (Effects ONLY update Redux - no API calls!)
  eventBus.on(ChatCopyEvents.StreamingStarted, ({ messageId: _messageId }) => {
    // Effect ONLY sets streaming flag - message is created via API and MessageCreated event
    dispatch(setIsStreaming(true));
  });

  eventBus.on(ChatCopyEvents.StreamingContentUpdated, ({ messageId, content }) => {
    // Append new content to existing message
    const chatCopy = selectChatCopyState(store.getState());
    const message = chatCopy.messages.find(m => m.id === messageId);

    if (message) {
      const newContent = message.content + content;
      dispatch(updateMessage({ messageId, updates: { content: newContent } }));
    }
  });

  eventBus.on(ChatCopyEvents.StreamingCompleted, ({ messageId: _messageId }) => {
    dispatch(setIsStreaming(false));
  });

  // Data fetch effects
  eventBus.on(ChatCopyEvents.DataFetchSucceeded, ({ threads, messages, contexts }) => {
    // Store data as-is (timestamps are ISO strings, Redux-serializable)
    dispatch(setThreads(threads));
    dispatch(setMessages(messages));
    dispatch(setAvailableContexts(contexts));

    // Set current thread to the first one if available
    const chatCopy = selectChatCopyState(store.getState());
    if (threads.length > 0 && !chatCopy.currentThreadId) {
      dispatch(setCurrentThreadId(threads[0].id));
    }
  });

  eventBus.on(ChatCopyEvents.DataFetchFailed, ({ error }) => {
    console.error('Failed to load chat data:', error);
    // Could show an error message to user here
  });
};

/**
 * Cleanup chat copy effects
 * Called when unmounting (though effects typically live for app lifetime)
 */
export const cleanupChatCopyEffects = (): void => {
  // EventBus cleanup would go here if needed
  // For now, effects live for the app lifetime
};
