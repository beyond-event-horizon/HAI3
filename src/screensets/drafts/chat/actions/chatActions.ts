/**
 * Chat Actions
 * Emit events AND interact with APIs (Flux pattern)
 * Following Flux: Actions emit events for effects to update Redux, and call APIs
 */

import { eventBus, apiRegistry, type AppDispatch } from '@hai3/uicore';
import { ChatEvents } from '../events/chatEvents';
import type { AttachedFile } from '../types';
import type { EnhancedChatThread } from '../uikit/components/EnhancedThreadList';
import { CHAT_DOMAIN } from '@/api/services/chat/ChatApiService';
import { ChatRole } from '@/api/services/chat/api';

/**
 * Thread Actions
 */
export const selectThread = (threadId: string): void => {
  eventBus.emit(ChatEvents.ThreadSelected, { threadId });
};

export const createThread = (isTemporary: boolean): void => {
  eventBus.emit(ChatEvents.ThreadCreated, { isTemporary });
};

export const deleteThread = (threadId: string): void => {
  eventBus.emit(ChatEvents.ThreadDeleted, { threadId });
};

export const updateThreadTitle = (threadId: string, newTitle: string): void => {
  eventBus.emit(ChatEvents.ThreadTitleUpdated, { threadId, newTitle });
};

export const reorderThreads = (threads: EnhancedChatThread[]): void => {
  eventBus.emit(ChatEvents.ThreadsReordered, { threads });
};

export const toggleThreadTemporary = (threadId: string, isTemporary: boolean): void => {
  eventBus.emit(ChatEvents.ThreadTemporaryToggled, { threadId, isTemporary });
};

/**
 * Message Actions
 */
export const sendMessage = (
  content: string,
  threadId: string,
  model: string,
  conversationMessages: Array<{ role: ChatRole; content: string }>
) => {
  return (_dispatch: AppDispatch): void => {
    if (!threadId || !content.trim()) {
      return;
    }

    // 1. Emit event for effects to handle UI updates
    eventBus.emit(ChatEvents.MessageSent, { content });

    // 2. Action interacts with API (NOT effect!)
    const chatApi = apiRegistry.getService(CHAT_DOMAIN);
    const messageId = `msg-${Date.now()}`;

    // Build messages array from conversation history
    const messages = [
      ...conversationMessages,
      {
        role: ChatRole.User,
        content: content.trim(),
      },
    ];

    // Emit streaming started
    eventBus.emit(ChatEvents.StreamingStarted, { messageId });

    // Start SSE stream - callbacks emit events
    chatApi.createCompletionStream(
      {
        model,
        messages,
        stream: true,
      },
      (chunk) => {
        // API callback emits event for each chunk
        const delta = chunk.choices?.[0]?.delta;
        if (delta?.content) {
          eventBus.emit(ChatEvents.StreamingContentUpdated, {
            messageId,
            content: delta.content,
          });
        }

        if (chunk.choices?.[0]?.finish_reason === 'stop') {
          eventBus.emit(ChatEvents.StreamingCompleted, { messageId });
        }
      },
      () => {
        // Stream completed callback
        eventBus.emit(ChatEvents.StreamingCompleted, { messageId });
      }
    );
  };
};

export const startEditingMessage = (messageId: string, content: string): void => {
  eventBus.emit(ChatEvents.MessageEditingStarted, { messageId, content });
};

export const updateEditedContent = (content: string): void => {
  eventBus.emit(ChatEvents.MessageEditedContentUpdated, { content });
};

export const saveEditedMessage = (messageId: string, content: string): void => {
  eventBus.emit(ChatEvents.MessageEditSaved, { messageId, content });
};

export const cancelEditingMessage = (): void => {
  eventBus.emit(ChatEvents.MessageEditCancelled);
};

export const likeMessage = (messageId: string): void => {
  eventBus.emit(ChatEvents.MessageLiked, { messageId });
};

export const dislikeMessage = (messageId: string): void => {
  eventBus.emit(ChatEvents.MessageDisliked, { messageId });
};

export const deleteMessage = (messageId: string): void => {
  eventBus.emit(ChatEvents.MessageDeleted, { messageId });
};

export const toggleMessageViewMode = (messageId: string): void => {
  eventBus.emit(ChatEvents.MessageViewModeToggled, { messageId });
};

export const regenerateMessage = (messageId: string): void => {
  eventBus.emit(ChatEvents.MessageRegenerated, { messageId });
};

/**
 * Model and Context Actions
 */
export const changeModel = (model: string): void => {
  eventBus.emit(ChatEvents.ModelChanged, { model });
};

export const addContext = (contextId: string): void => {
  eventBus.emit(ChatEvents.ContextAdded, { contextId });
};

export const removeContext = (contextId: string): void => {
  eventBus.emit(ChatEvents.ContextRemoved, { contextId });
};

/**
 * File Actions
 */
export const attachFile = (file: AttachedFile): void => {
  eventBus.emit(ChatEvents.FileAttached, { file });
};

export const removeFile = (fileId: string): void => {
  eventBus.emit(ChatEvents.FileRemoved, { fileId });
};

/**
 * Input Actions
 */
export const changeInputValue = (value: string): void => {
  eventBus.emit(ChatEvents.InputValueChanged, { value });
};
