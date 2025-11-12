/**
 * Chat Effects
 * Listen to events and update chat slice
 * Following Flux: Effects ONLY listen to events and update their own slice
 * Effects NEVER call actions or emit events (would create circular flow)
 */

import { eventBus, type AppDispatch } from '@hai3/uicore';
import { ChatEvents } from '../events/chatEvents';
import {
  setCurrentThreadId,
  addThread,
  removeThread,
  updateThread,
  setThreads,
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

  eventBus.on(ChatEvents.ThreadCreated, ({ isTemporary }) => {
    const newThread: Thread = {
      id: `thread-${Date.now()}`,
      title: 'New Chat',
      preview: '',
      timestamp: new Date(),
      isTemporary,
    };
    dispatch(addThread(newThread));
    dispatch(setCurrentThreadId(newThread.id));
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
  eventBus.on(ChatEvents.MessageSent, ({ content: _content }) => {
    // Note: In real implementation, this would:
    // 1. Create user message
    // 2. Call API
    // 3. Start streaming
    // For now, simplified version
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
    // Clear message content and start regenerating
    dispatch(updateMessage({ messageId, updates: { content: '' } }));
    dispatch(removeMessagesAfter({ messageId }));
    dispatch(setIsStreaming(true));
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

  // Streaming effects
  eventBus.on(ChatEvents.StreamingStarted, ({ messageId: _messageId }) => {
    dispatch(setIsStreaming(true));
  });

  eventBus.on(ChatEvents.StreamingContentUpdated, ({ messageId, content }) => {
    dispatch(updateMessage({ messageId, updates: { content } }));
  });

  eventBus.on(ChatEvents.StreamingCompleted, () => {
    dispatch(setIsStreaming(false));
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
