/**
 * Chat Copy Events
 * Defines all events for the chat copy screenset
 * Following Flux: Actions emit events, Effects listen to events
 */

import '@hai3/uicore';
import type { AttachedFile, Thread, Message, Context } from '../types';
import type { EnhancedChatThread } from '../uikit/components/EnhancedThreadList';
import { CHAT_COPY_SCREENSET_ID } from '../ids';

/**
 * Chat Copy event enum
 * All chat copy events use template literals with CHAT_COPY_SCREENSET_ID for auto-updating namespace
 */
export enum ChatCopyEvents {
  // Thread events
  ThreadSelected = `${CHAT_COPY_SCREENSET_ID}/threadSelected`,
  DraftThreadCreated = `${CHAT_COPY_SCREENSET_ID}/draftThreadCreated`, // Local draft thread (not saved to backend)
  ThreadCreated = `${CHAT_COPY_SCREENSET_ID}/threadCreated`,
  ThreadDeleted = `${CHAT_COPY_SCREENSET_ID}/threadDeleted`,
  ThreadTitleUpdated = `${CHAT_COPY_SCREENSET_ID}/threadTitleUpdated`,
  ThreadsReordered = `${CHAT_COPY_SCREENSET_ID}/threadsReordered`,
  ThreadTemporaryToggled = `${CHAT_COPY_SCREENSET_ID}/threadTemporaryToggled`,

  // Message events
  MessageSent = `${CHAT_COPY_SCREENSET_ID}/messageSent`,
  MessageCreated = `${CHAT_COPY_SCREENSET_ID}/messageCreated`,
  MessageEditingStarted = `${CHAT_COPY_SCREENSET_ID}/messageEditingStarted`,
  MessageEditedContentUpdated = `${CHAT_COPY_SCREENSET_ID}/messageEditedContentUpdated`,
  MessageEditSaved = `${CHAT_COPY_SCREENSET_ID}/messageEditSaved`,
  MessageEditCancelled = `${CHAT_COPY_SCREENSET_ID}/messageEditCancelled`,
  MessageLiked = `${CHAT_COPY_SCREENSET_ID}/messageLiked`,
  MessageDisliked = `${CHAT_COPY_SCREENSET_ID}/messageDisliked`,
  MessageDeleted = `${CHAT_COPY_SCREENSET_ID}/messageDeleted`,
  MessageViewModeToggled = `${CHAT_COPY_SCREENSET_ID}/messageViewModeToggled`,
  MessageRegenerated = `${CHAT_COPY_SCREENSET_ID}/messageRegenerated`,

  // Model and Context events
  ModelChanged = `${CHAT_COPY_SCREENSET_ID}/modelChanged`,
  ContextAdded = `${CHAT_COPY_SCREENSET_ID}/contextAdded`,
  ContextRemoved = `${CHAT_COPY_SCREENSET_ID}/contextRemoved`,

  // File events
  FileAttached = `${CHAT_COPY_SCREENSET_ID}/fileAttached`,
  FileRemoved = `${CHAT_COPY_SCREENSET_ID}/fileRemoved`,

  // Input events
  InputValueChanged = `${CHAT_COPY_SCREENSET_ID}/inputValueChanged`,

  // Streaming
  StreamingStarted = `${CHAT_COPY_SCREENSET_ID}/streamingStarted`,
  StreamingContentUpdated = `${CHAT_COPY_SCREENSET_ID}/streamingContentUpdated`,
  StreamingCompleted = `${CHAT_COPY_SCREENSET_ID}/streamingCompleted`,

  // Data fetch events
  DataFetchStarted = `${CHAT_COPY_SCREENSET_ID}/dataFetchStarted`,
  DataFetchSucceeded = `${CHAT_COPY_SCREENSET_ID}/dataFetchSucceeded`,
  DataFetchFailed = `${CHAT_COPY_SCREENSET_ID}/dataFetchFailed`,
}

/**
 * Module Augmentation
 * Extends EventPayloadMap from @hai3/uicore to register chat copy events
 */
declare module '@hai3/uicore' {
  interface EventPayloadMap {
    // Thread events
    'chatCopy/threadSelected': { threadId: string };
    'chatCopy/draftThreadCreated': { threadId: string; title: string; isTemporary: boolean }; // Draft thread created locally
    'chatCopy/threadCreated': { thread: Thread };
    'chatCopy/threadDeleted': { threadId: string };
    'chatCopy/threadTitleUpdated': { threadId: string; newTitle: string };
    'chatCopy/threadsReordered': { threads: EnhancedChatThread[] };
    'chatCopy/threadTemporaryToggled': { threadId: string; isTemporary: boolean };

    // Message events
    'chatCopy/messageSent': { content: string };
    'chatCopy/messageCreated': { message: Message };
    'chatCopy/messageEditingStarted': { messageId: string; content: string };
    'chatCopy/messageEditedContentUpdated': { content: string };
    'chatCopy/messageEditSaved': { messageId: string; content: string };
    'chatCopy/messageEditCancelled': void;
    'chatCopy/messageLiked': { messageId: string };
    'chatCopy/messageDisliked': { messageId: string };
    'chatCopy/messageDeleted': { messageId: string };
    'chatCopy/messageViewModeToggled': { messageId: string };
    'chatCopy/messageRegenerated': { messageId: string };

    // Model and context events
    'chatCopy/modelChanged': { model: string };
    'chatCopy/contextAdded': { contextId: string };
    'chatCopy/contextRemoved': { contextId: string };

    // File events
    'chatCopy/fileAttached': { file: AttachedFile };
    'chatCopy/fileRemoved': { fileId: string };

    // Input events
    'chatCopy/inputValueChanged': { value: string };

    // Streaming events
    'chatCopy/streamingStarted': { messageId: string };
    'chatCopy/streamingContentUpdated': { messageId: string; content: string };
    'chatCopy/streamingCompleted': { messageId: string };

    // Data fetch events
    'chatCopy/dataFetchStarted': Record<string, never>;
    'chatCopy/dataFetchSucceeded': { threads: Thread[]; messages: Message[]; contexts: Context[] };
    'chatCopy/dataFetchFailed': { error: string };
  }
}
