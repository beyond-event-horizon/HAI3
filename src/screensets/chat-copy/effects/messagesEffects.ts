/**
 * Messages Effects
 * Listen to message-related events and update messages slice
 * Following Flux: Effects subscribe to events and update their own slice only
 * Cross-domain coordination: Can listen to events from other domains
 */

import { eventBus, type AppDispatch, store } from '@hai3/uicore';
import { MessagesEvents } from '../events/messagesEvents';
import { DataEvents } from '../events/dataEvents';
import { selectMessagesState } from '../slices/messagesSlice';
import {
  addMessage,
  updateMessage,
  toggleMessageRawMarkdown,
  removeMessage,
  removeMessagesAfter,
  setEditingMessageId,
  setEditedContent,
  setIsStreaming,
  setMessages,
} from '../slices/messagesSlice';

let dispatch: AppDispatch;

/**
 * Initialize messages effects
 * Called once during app bootstrap
 */
export const initializeMessagesEffects = (appDispatch: AppDispatch): void => {
  dispatch = appDispatch;

  // Message creation
  eventBus.on(MessagesEvents.Created, ({ message }) => {
    dispatch(addMessage(message));
  });

  // Message editing
  eventBus.on(MessagesEvents.EditingStarted, ({ messageId, content }) => {
    dispatch(setEditingMessageId(messageId));
    dispatch(setEditedContent(content));
  });

  eventBus.on(MessagesEvents.EditedContentUpdated, ({ content }) => {
    dispatch(setEditedContent(content));
  });

  eventBus.on(MessagesEvents.EditSaved, ({ messageId, content }) => {
    dispatch(updateMessage({ messageId, updates: { content } }));
    dispatch(setEditingMessageId(null));
    dispatch(setEditedContent(''));
  });

  eventBus.on(MessagesEvents.EditCancelled, () => {
    dispatch(setEditingMessageId(null));
    dispatch(setEditedContent(''));
  });

  // Message reactions
  eventBus.on(MessagesEvents.Liked, ({ messageId }) => {
    dispatch(updateMessage({
      messageId,
      updates: { liked: true, disliked: false }
    }));
  });

  eventBus.on(MessagesEvents.Disliked, ({ messageId }) => {
    dispatch(updateMessage({
      messageId,
      updates: { disliked: true, liked: false }
    }));
  });

  // Message deletion
  eventBus.on(MessagesEvents.Deleted, ({ messageId }) => {
    dispatch(removeMessage({ messageId }));
  });

  // Message view mode toggle
  eventBus.on(MessagesEvents.ViewModeToggled, ({ messageId }) => {
    dispatch(toggleMessageRawMarkdown({ messageId }));
  });

  // Message regeneration
  eventBus.on(MessagesEvents.Regenerated, ({ messageId }) => {
    // Remove the message and all messages after it
    dispatch(removeMessage({ messageId }));
    dispatch(removeMessagesAfter({ messageId }));
  });

  // Streaming
  eventBus.on(MessagesEvents.StreamingStarted, ({ messageId: _messageId }) => {
    dispatch(setIsStreaming(true));
  });

  eventBus.on(MessagesEvents.StreamingContentUpdated, ({ messageId, content }) => {
    // Append new content to existing message
    const messagesState = selectMessagesState(store.getState());
    const message = messagesState.messages.find(m => m.id === messageId);

    if (message) {
      const newContent = message.content + content;
      dispatch(updateMessage({ messageId, updates: { content: newContent } }));
    }
  });

  eventBus.on(MessagesEvents.StreamingCompleted, ({ messageId: _messageId }) => {
    dispatch(setIsStreaming(false));
  });

  // Data fetch: Load messages
  eventBus.on(DataEvents.FetchSucceeded, ({ messages }) => {
    dispatch(setMessages(messages));
  });

  // Data fetch failure
  eventBus.on(DataEvents.FetchFailed, ({ error }) => {
    console.error('Failed to load messages:', error);
  });
};
