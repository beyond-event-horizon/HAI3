/**
 * Chat Copy Actions
 * Emit events AND interact with APIs (Flux pattern)
 * Following Flux: Actions emit events for effects to update Redux, and call APIs
 */

import { eventBus, apiRegistry, type AppDispatch } from '@hai3/uicore';
import { ChatCopyEvents } from '../events/chatCopyEvents';
import type { AttachedFile } from '../types';
import type { EnhancedChatThread } from '../uikit/components/EnhancedThreadList';
import { CHAT_DOMAIN } from '@/api/services/chat/ChatApiService';
import { ChatRole } from '@/api/services/chat/api';

/**
 * Thread Actions
 */
export const selectThread = (threadId: string): void => {
  eventBus.emit(ChatCopyEvents.ThreadSelected, { threadId });
};

export const createDraftThread = (title: string, isTemporary: boolean): void => {
  // Generate draft ID
  const draftId = `draft-${Date.now()}`;

  // Emit event to create local draft thread (not saved to backend)
  eventBus.emit(ChatCopyEvents.DraftThreadCreated, { threadId: draftId, title, isTemporary });
};

export const createThread = (isTemporary: boolean, title: string) => {
  return (_dispatch: AppDispatch): void => {
    const chatApi = apiRegistry.getService(CHAT_DOMAIN);

    // Call API to create thread (title should already be translated by UI)
    chatApi.createThread({
      title, // Translated title from UI
      isTemporary,
    })
      .then((thread) => {
        // Emit event with full thread object
        eventBus.emit(ChatCopyEvents.ThreadCreated, { thread });
      })
      .catch((error) => {
        console.error('Failed to create thread:', error);
      });
  };
};

export const deleteThread = (threadId: string) => {
  return (_dispatch: AppDispatch): void => {
    const chatApi = apiRegistry.getService(CHAT_DOMAIN);

    // Call API to delete thread
    chatApi.deleteThread(threadId)
      .then(() => {
        // Emit event after successful deletion
        eventBus.emit(ChatCopyEvents.ThreadDeleted, { threadId });
      })
      .catch((error) => {
        console.error('Failed to delete thread:', error);
      });
  };
};

export const updateThreadTitle = (threadId: string, newTitle: string) => {
  return (_dispatch: AppDispatch): void => {
    const chatApi = apiRegistry.getService(CHAT_DOMAIN);

    // Call API to update thread
    chatApi.updateThread(threadId, { title: newTitle })
      .then(() => {
        // Emit event after successful update
        eventBus.emit(ChatCopyEvents.ThreadTitleUpdated, { threadId, newTitle });
      })
      .catch((error) => {
        console.error('Failed to update thread title:', error);
      });
  };
};

export const reorderThreads = (threads: EnhancedChatThread[]): void => {
  eventBus.emit(ChatCopyEvents.ThreadsReordered, { threads });
};

export const toggleThreadTemporary = (threadId: string, isTemporary: boolean): void => {
  eventBus.emit(ChatCopyEvents.ThreadTemporaryToggled, { threadId, isTemporary });
};

/**
 * Message Actions
 */
export const sendMessage = (
  content: string,
  threadId: string,
  model: string,
  conversationMessages: Array<{ role: ChatRole; content: string }>,
  isTemporary: boolean
) => {
  return (_dispatch: AppDispatch): void => {
    if (!threadId || !content.trim()) {
      return;
    }

    const chatApi = apiRegistry.getService(CHAT_DOMAIN);
    const isDraft = threadId.startsWith('draft-');

    if (isDraft) {
      // Create real thread first with the first message for smart title generation
      chatApi.createThread({
        firstMessage: content.trim(),
        isTemporary,
      })
        .then((newThread) => {
          // Emit ThreadCreated with the new thread (has smart-generated title)
          eventBus.emit(ChatCopyEvents.ThreadCreated, { thread: newThread });

          // Now create the user message in the new thread
          return chatApi.createMessage({
            threadId: newThread.id,
            type: 'user',
            content: content.trim(),
          });
        })
        .then((userMessage) => {
          // Emit MessageCreated event
          eventBus.emit(ChatCopyEvents.MessageCreated, { message: userMessage });

          // Clear input
          eventBus.emit(ChatCopyEvents.MessageSent, { content });

          // Create empty assistant message via API before streaming
          return chatApi.createMessage({
            threadId: userMessage.threadId,
            type: 'assistant',
            content: '',
          });
        })
        .then((assistantMessage) => {
          // Emit MessageCreated event with API-created message
          eventBus.emit(ChatCopyEvents.MessageCreated, { message: assistantMessage });

          // Signal streaming started
          eventBus.emit(ChatCopyEvents.StreamingStarted, { messageId: assistantMessage.id });

          // Build messages array for completion
          const messages = [
            {
              role: ChatRole.User,
              content: content.trim(),
            },
          ];

          // Start SSE stream
          chatApi.createCompletionStream(
            {
              model,
              messages,
              stream: true,
            },
            (chunk) => {
              const delta = chunk.choices?.[0]?.delta;
              if (delta?.content) {
                eventBus.emit(ChatCopyEvents.StreamingContentUpdated, {
                  messageId: assistantMessage.id,
                  content: delta.content,
                });
              }

              if (chunk.choices?.[0]?.finish_reason === 'stop') {
                eventBus.emit(ChatCopyEvents.StreamingCompleted, { messageId: assistantMessage.id });
              }
            },
            () => {
              eventBus.emit(ChatCopyEvents.StreamingCompleted, { messageId: assistantMessage.id });
            }
          );
        })
        .catch((error) => {
          console.error('Failed to create thread and send message:', error);
        });
    } else {
      // Existing thread - normal flow
      chatApi.createMessage({
        threadId,
        type: 'user',
        content: content.trim(),
      })
        .then((userMessage) => {
          eventBus.emit(ChatCopyEvents.MessageCreated, { message: userMessage });
          eventBus.emit(ChatCopyEvents.MessageSent, { content });

          // Create empty assistant message via API before streaming
          return chatApi.createMessage({
            threadId,
            type: 'assistant',
            content: '',
          });
        })
        .then((assistantMessage) => {
          // Emit MessageCreated event with API-created message
          eventBus.emit(ChatCopyEvents.MessageCreated, { message: assistantMessage });

          // Signal streaming started
          eventBus.emit(ChatCopyEvents.StreamingStarted, { messageId: assistantMessage.id });

          // Build messages array for completion (conversation history + new user message)
          const messages = [
            ...conversationMessages,
            {
              role: ChatRole.User,
              content: content.trim(),
            },
          ];

          chatApi.createCompletionStream(
            {
              model,
              messages,
              stream: true,
            },
            (chunk) => {
              const delta = chunk.choices?.[0]?.delta;
              if (delta?.content) {
                eventBus.emit(ChatCopyEvents.StreamingContentUpdated, {
                  messageId: assistantMessage.id,
                  content: delta.content,
                });
              }

              if (chunk.choices?.[0]?.finish_reason === 'stop') {
                eventBus.emit(ChatCopyEvents.StreamingCompleted, { messageId: assistantMessage.id });
              }
            },
            () => {
              eventBus.emit(ChatCopyEvents.StreamingCompleted, { messageId: assistantMessage.id });
            }
          );
        })
        .catch((error) => {
          console.error('Failed to send message:', error);
        });
    }
  };
};

export const startEditingMessage = (messageId: string, content: string): void => {
  eventBus.emit(ChatCopyEvents.MessageEditingStarted, { messageId, content });
};

export const updateEditedContent = (content: string): void => {
  eventBus.emit(ChatCopyEvents.MessageEditedContentUpdated, { content });
};

export const saveEditedMessage = (messageId: string, content: string): void => {
  eventBus.emit(ChatCopyEvents.MessageEditSaved, { messageId, content });
};

export const cancelEditingMessage = (): void => {
  eventBus.emit(ChatCopyEvents.MessageEditCancelled);
};

export const likeMessage = (messageId: string): void => {
  eventBus.emit(ChatCopyEvents.MessageLiked, { messageId });
};

export const dislikeMessage = (messageId: string): void => {
  eventBus.emit(ChatCopyEvents.MessageDisliked, { messageId });
};

export const deleteMessage = (messageId: string): void => {
  eventBus.emit(ChatCopyEvents.MessageDeleted, { messageId });
};

export const toggleMessageViewMode = (messageId: string): void => {
  eventBus.emit(ChatCopyEvents.MessageViewModeToggled, { messageId });
};

export const regenerateMessage = (
  messageId: string,
  threadId: string,
  model: string,
  conversationMessages: Array<{ role: ChatRole; content: string }>
) => {
  return (_dispatch: AppDispatch): void => {
    const chatApi = apiRegistry.getService(CHAT_DOMAIN);

    // Remove the message being regenerated (and all after it)
    eventBus.emit(ChatCopyEvents.MessageRegenerated, { messageId });

    // Create empty assistant message via API before streaming
    chatApi.createMessage({
      threadId,
      type: 'assistant',
      content: '',
    })
      .then((assistantMessage) => {
        // Emit MessageCreated event with API-created message
        eventBus.emit(ChatCopyEvents.MessageCreated, { message: assistantMessage });

        // Signal streaming started
        eventBus.emit(ChatCopyEvents.StreamingStarted, { messageId: assistantMessage.id });

        // Call streaming API with conversation history (excluding regenerated message)
        chatApi.createCompletionStream(
          {
            model,
            messages: conversationMessages,
            stream: true,
          },
          (chunk) => {
            const delta = chunk.choices?.[0]?.delta;
            if (delta?.content) {
              eventBus.emit(ChatCopyEvents.StreamingContentUpdated, {
                messageId: assistantMessage.id,
                content: delta.content,
              });
            }

            if (chunk.choices?.[0]?.finish_reason === 'stop') {
              eventBus.emit(ChatCopyEvents.StreamingCompleted, { messageId: assistantMessage.id });
            }
          },
          () => {
            eventBus.emit(ChatCopyEvents.StreamingCompleted, { messageId: assistantMessage.id });
          }
        );
      })
      .catch((error) => {
        console.error('Failed to regenerate message:', error);
      });
  };
};

/**
 * Model and Context Actions
 */
export const changeModel = (model: string): void => {
  eventBus.emit(ChatCopyEvents.ModelChanged, { model });
};

export const addContext = (contextId: string): void => {
  eventBus.emit(ChatCopyEvents.ContextAdded, { contextId });
};

export const removeContext = (contextId: string): void => {
  eventBus.emit(ChatCopyEvents.ContextRemoved, { contextId });
};

/**
 * File Actions
 */
export const attachFile = (file: AttachedFile): void => {
  eventBus.emit(ChatCopyEvents.FileAttached, { file });
};

export const removeFile = (fileId: string): void => {
  eventBus.emit(ChatCopyEvents.FileRemoved, { fileId });
};

/**
 * Input Actions
 */
export const changeInputValue = (value: string): void => {
  eventBus.emit(ChatCopyEvents.InputValueChanged, { value });
};

/**
 * Data Fetch Actions
 */
export const fetchChatData = () => {
  return (_dispatch: AppDispatch): void => {
    const chatApi = apiRegistry.getService(CHAT_DOMAIN);

    // Emit fetch started event
    eventBus.emit(ChatCopyEvents.DataFetchStarted, {});

    // Fetch all data in parallel
    Promise.all([
      chatApi.getThreads(),
      chatApi.getMessages(),
      chatApi.getContexts(),
    ])
      .then(([threads, messages, contexts]) => {
        // Emit success event with data
        eventBus.emit(ChatCopyEvents.DataFetchSucceeded, { threads, messages, contexts });
      })
      .catch((error) => {
        console.error('Failed to fetch chat data:', error);
        eventBus.emit(ChatCopyEvents.DataFetchFailed, {
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      });
  };
};
