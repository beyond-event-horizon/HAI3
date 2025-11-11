/**
 * Chat Actions
 * Pure functions that emit events
 * Following Flux: Actions return void and emit events, never dispatch directly
 */

import { eventBus } from '@hai3/uicore';
import { ChatEvents } from '../events/chatEvents';
import type { AttachedFile } from '../types';
import type { EnhancedChatThread } from '../uikit/components/EnhancedThreadList';

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

export const toggleThreadTemporary = (isTemporary: boolean): void => {
  eventBus.emit(ChatEvents.ThreadTemporaryToggled, { isTemporary });
};

/**
 * Message Actions
 */
export const sendMessage = (content: string): void => {
  eventBus.emit(ChatEvents.MessageSent, { content });
};

export const startEditingMessage = (messageId: string): void => {
  eventBus.emit(ChatEvents.MessageEditingStarted, { messageId });
};

export const updateEditedContent = (content: string): void => {
  eventBus.emit(ChatEvents.MessageEditedContentUpdated, { content });
};

export const saveEditedMessage = (): void => {
  eventBus.emit(ChatEvents.MessageEditSaved);
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
