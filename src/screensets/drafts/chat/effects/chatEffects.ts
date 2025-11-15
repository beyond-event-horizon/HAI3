/**
 * Chat Effects
 * Listen to events and update chat slice
 * Following Flux: Effects ONLY listen to events and update their own slice
 * Effects NEVER call actions or emit events (would create circular flow)
 */

import { eventBus, type AppDispatch, store, type RootState, apiRegistry } from '@hai3/uicore';
import { ChatEvents } from '../events/chatEvents';
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
} from '../slices/chatSlice';
import type { Thread, Message } from '../types';
import { CHAT_DOMAIN } from '@/api/chat/ChatApiService';
import { ChatRole, type CreateChatCompletionRequest } from '@/api/chat/api';

let dispatch: AppDispatch;

/**
 * Stream chat completion from API
 * Uses ChatApiService with streaming for realistic backend simulation
 */
const streamChatCompletion = async (threadId: string, userMessage: string): Promise<void> => {
  const state = store.getState() as RootState;
  const currentModel = state.chat.currentModel;

  // Get chat API service
  const chatApi = apiRegistry.getService(CHAT_DOMAIN);

  // Build conversation history for the request
  const messages = state.chat.messages
    .filter((m) => m.threadId === threadId)
    .map((m) => ({
      role: m.type === 'user' ? ChatRole.User : ChatRole.Assistant,
      content: m.content,
    }));

  // Add the new user message
  messages.push({
    role: ChatRole.User,
    content: userMessage,
  });

  const request: CreateChatCompletionRequest = {
    model: currentModel,
    messages,
    stream: true,
  };

  const messageId = `msg-${Date.now()}`;

  // Create initial empty assistant message
  const assistantMessage: Message = {
    id: messageId,
    threadId,
    type: 'assistant',
    content: '',
    timestamp: new Date(),
  };

  dispatch(addMessage(assistantMessage));
  eventBus.emit(ChatEvents.StreamingStarted, { messageId });

  try {
    // Stream the completion
    let fullContent = '';
    for await (const chunk of chatApi.createCompletionStream(request)) {
      const delta = chunk.choices[0]?.delta;
      if (delta?.content) {
        fullContent += delta.content;
        eventBus.emit(ChatEvents.StreamingContentUpdated, { messageId, content: fullContent });
      }

      if (chunk.choices[0]?.finish_reason === 'stop') {
        eventBus.emit(ChatEvents.StreamingCompleted);
        break;
      }
    }
  } catch (error) {
    console.error('Chat completion streaming error:', error);
    eventBus.emit(ChatEvents.StreamingCompleted);
  }
};

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
  eventBus.on(ChatEvents.MessageSent, ({ content }) => {
    // Add user message to store and stream API response
    const state = store.getState() as RootState;
    const currentThreadId = state.chat.currentThreadId;

    if (!currentThreadId || !content.trim()) {
      return;
    }

    // Create user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      threadId: currentThreadId,
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    // Add message to store
    dispatch(addMessage(userMessage));

    // Clear input
    dispatch(setInputValue(''));

    // Update thread preview with the new message
    dispatch(updateThread({
      threadId: currentThreadId,
      updates: {
        preview: content.trim().substring(0, 100),
        timestamp: new Date(),
      }
    }));

    // Stream backend response using API service
    streamChatCompletion(currentThreadId, content.trim());
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
    // Get the message and thread info
    const state = store.getState() as RootState;
    const message = state.chat.messages.find((m) => m.id === messageId);

    if (!message) {
      return;
    }

    // Remove the message and all messages after it
    dispatch(removeMessage({ messageId }));
    dispatch(removeMessagesAfter({ messageId }));

    // Find the last user message to regenerate from
    const threadMessages = state.chat.messages.filter((m) => m.threadId === message.threadId);
    const lastUserMessage = threadMessages
      .slice()
      .reverse()
      .find((m) => m.type === 'user');

    if (lastUserMessage) {
      // Stream backend response using API service for regeneration
      streamChatCompletion(message.threadId, lastUserMessage.content);
    }
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
