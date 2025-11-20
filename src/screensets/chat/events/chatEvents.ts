/**
 * Chat Events
 * Defines all events for the chat screenset
 * Following Flux: Actions emit events, Effects listen to events
 */

import '@hai3/uicore';
import type { AttachedFile, Thread, Message, Context } from '../types';
import type { EnhancedChatThread } from '../uikit/components/EnhancedThreadList';
import { CHAT_SCREENSET_ID } from '../ids';

/**
 * Chat event enum
 * All chat events use template literals with CHAT_SCREENSET_ID for namespace isolation
 * When CHAT_SCREENSET_ID changes, all event names auto-update
 */
export enum ChatEvents {
  // Thread events
  ThreadSelected = `${CHAT_SCREENSET_ID}/threadSelected`,
  DraftThreadCreated = `${CHAT_SCREENSET_ID}/draftThreadCreated`, // Local draft thread (not saved to backend)
  ThreadCreated = `${CHAT_SCREENSET_ID}/threadCreated`,
  ThreadDeleted = `${CHAT_SCREENSET_ID}/threadDeleted`,
  ThreadTitleUpdated = `${CHAT_SCREENSET_ID}/threadTitleUpdated`,
  ThreadsReordered = `${CHAT_SCREENSET_ID}/threadsReordered`,
  ThreadTemporaryToggled = `${CHAT_SCREENSET_ID}/threadTemporaryToggled`,

  // Message events
  MessageSent = `${CHAT_SCREENSET_ID}/messageSent`,
  MessageCreated = `${CHAT_SCREENSET_ID}/messageCreated`,
  MessageEditingStarted = `${CHAT_SCREENSET_ID}/messageEditingStarted`,
  MessageEditedContentUpdated = `${CHAT_SCREENSET_ID}/messageEditedContentUpdated`,
  MessageEditSaved = `${CHAT_SCREENSET_ID}/messageEditSaved`,
  MessageEditCancelled = `${CHAT_SCREENSET_ID}/messageEditCancelled`,
  MessageLiked = `${CHAT_SCREENSET_ID}/messageLiked`,
  MessageDisliked = `${CHAT_SCREENSET_ID}/messageDisliked`,
  MessageDeleted = `${CHAT_SCREENSET_ID}/messageDeleted`,
  MessageViewModeToggled = `${CHAT_SCREENSET_ID}/messageViewModeToggled`,
  MessageRegenerated = `${CHAT_SCREENSET_ID}/messageRegenerated`,

  // Model and Context events
  ModelChanged = `${CHAT_SCREENSET_ID}/modelChanged`,
  ContextAdded = `${CHAT_SCREENSET_ID}/contextAdded`,
  ContextRemoved = `${CHAT_SCREENSET_ID}/contextRemoved`,

  // File events
  FileAttached = `${CHAT_SCREENSET_ID}/fileAttached`,
  FileRemoved = `${CHAT_SCREENSET_ID}/fileRemoved`,

  // Input events
  InputValueChanged = `${CHAT_SCREENSET_ID}/inputValueChanged`,

  // Streaming
  StreamingStarted = `${CHAT_SCREENSET_ID}/streamingStarted`,
  StreamingContentUpdated = `${CHAT_SCREENSET_ID}/streamingContentUpdated`,
  StreamingCompleted = `${CHAT_SCREENSET_ID}/streamingCompleted`,

  // Data fetch events
  DataFetchStarted = `${CHAT_SCREENSET_ID}/dataFetchStarted`,
  DataFetchSucceeded = `${CHAT_SCREENSET_ID}/dataFetchSucceeded`,
  DataFetchFailed = `${CHAT_SCREENSET_ID}/dataFetchFailed`,
}

/**
 * Module Augmentation
 * Extends EventPayloadMap from @hai3/uicore to register chat events
 */
declare module '@hai3/uicore' {
  interface EventPayloadMap {
    // Thread events
    [ChatEvents.ThreadSelected]: { threadId: string };
    [ChatEvents.DraftThreadCreated]: { threadId: string; title: string; isTemporary: boolean }; // Draft thread created locally
    [ChatEvents.ThreadCreated]: { thread: Thread };
    [ChatEvents.ThreadDeleted]: { threadId: string };
    [ChatEvents.ThreadTitleUpdated]: { threadId: string; newTitle: string };
    [ChatEvents.ThreadsReordered]: { threads: EnhancedChatThread[] };
    [ChatEvents.ThreadTemporaryToggled]: { threadId: string; isTemporary: boolean };

    // Message events
    [ChatEvents.MessageSent]: { content: string };
    [ChatEvents.MessageCreated]: { message: Message };
    [ChatEvents.MessageEditingStarted]: { messageId: string; content: string };
    [ChatEvents.MessageEditedContentUpdated]: { content: string };
    [ChatEvents.MessageEditSaved]: { messageId: string; content: string };
    [ChatEvents.MessageEditCancelled]: void;
    [ChatEvents.MessageLiked]: { messageId: string };
    [ChatEvents.MessageDisliked]: { messageId: string };
    [ChatEvents.MessageDeleted]: { messageId: string };
    [ChatEvents.MessageViewModeToggled]: { messageId: string };
    [ChatEvents.MessageRegenerated]: { messageId: string };

    // Model and context events
    [ChatEvents.ModelChanged]: { model: string };
    [ChatEvents.ContextAdded]: { contextId: string };
    [ChatEvents.ContextRemoved]: { contextId: string };

    // File events
    [ChatEvents.FileAttached]: { file: AttachedFile };
    [ChatEvents.FileRemoved]: { fileId: string };

    // Input events
    [ChatEvents.InputValueChanged]: { value: string };

    // Streaming events
    [ChatEvents.StreamingStarted]: { messageId: string };
    [ChatEvents.StreamingContentUpdated]: { messageId: string; content: string };
    [ChatEvents.StreamingCompleted]: { messageId: string };

    // Data fetch events
    [ChatEvents.DataFetchStarted]: Record<string, never>;
    [ChatEvents.DataFetchSucceeded]: { threads: Thread[]; messages: Message[]; contexts: Context[] };
    [ChatEvents.DataFetchFailed]: { error: string };
  }
}
