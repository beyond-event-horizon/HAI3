/**
 * Chat Copy Events
 * Defines all events for the chat copy screenset
 * Following Flux: Actions emit events, Effects listen to events
 */

import '@hai3/uicore';
import type { AttachedFile, Thread, Message, Context } from '../types';
import type { EnhancedChatThread } from '../uikit/components/EnhancedThreadList';

/**
 * Chat Copy event enum
 * All chat copy events use the 'chat-copy/' prefix for namespace isolation
 */
export enum ChatCopyEvents {
  // Thread events
  ThreadSelected = 'chat-copy/threadSelected',
  DraftThreadCreated = 'chat-copy/draftThreadCreated', // Local draft thread (not saved to backend)
  ThreadCreated = 'chat-copy/threadCreated',
  ThreadDeleted = 'chat-copy/threadDeleted',
  ThreadTitleUpdated = 'chat-copy/threadTitleUpdated',
  ThreadsReordered = 'chat-copy/threadsReordered',
  ThreadTemporaryToggled = 'chat-copy/threadTemporaryToggled',

  // Message events
  MessageSent = 'chat-copy/messageSent',
  MessageCreated = 'chat-copy/messageCreated',
  MessageEditingStarted = 'chat-copy/messageEditingStarted',
  MessageEditedContentUpdated = 'chat-copy/messageEditedContentUpdated',
  MessageEditSaved = 'chat-copy/messageEditSaved',
  MessageEditCancelled = 'chat-copy/messageEditCancelled',
  MessageLiked = 'chat-copy/messageLiked',
  MessageDisliked = 'chat-copy/messageDisliked',
  MessageDeleted = 'chat-copy/messageDeleted',
  MessageViewModeToggled = 'chat-copy/messageViewModeToggled',
  MessageRegenerated = 'chat-copy/messageRegenerated',

  // Model and Context events
  ModelChanged = 'chat-copy/modelChanged',
  ContextAdded = 'chat-copy/contextAdded',
  ContextRemoved = 'chat-copy/contextRemoved',

  // File events
  FileAttached = 'chat-copy/fileAttached',
  FileRemoved = 'chat-copy/fileRemoved',

  // Input events
  InputValueChanged = 'chat-copy/inputValueChanged',

  // Streaming
  StreamingStarted = 'chat-copy/streamingStarted',
  StreamingContentUpdated = 'chat-copy/streamingContentUpdated',
  StreamingCompleted = 'chat-copy/streamingCompleted',

  // Data fetch events
  DataFetchStarted = 'chat-copy/dataFetchStarted',
  DataFetchSucceeded = 'chat-copy/dataFetchSucceeded',
  DataFetchFailed = 'chat-copy/dataFetchFailed',
}

/**
 * Module Augmentation
 * Extends EventPayloadMap from @hai3/uicore to register chat copy events
 */
declare module '@hai3/uicore' {
  interface EventPayloadMap {
    // Thread events
    'chat-copy/threadSelected': { threadId: string };
    'chat-copy/draftThreadCreated': { threadId: string; title: string; isTemporary: boolean }; // Draft thread created locally
    'chat-copy/threadCreated': { thread: Thread };
    'chat-copy/threadDeleted': { threadId: string };
    'chat-copy/threadTitleUpdated': { threadId: string; newTitle: string };
    'chat-copy/threadsReordered': { threads: EnhancedChatThread[] };
    'chat-copy/threadTemporaryToggled': { threadId: string; isTemporary: boolean };

    // Message events
    'chat-copy/messageSent': { content: string };
    'chat-copy/messageCreated': { message: Message };
    'chat-copy/messageEditingStarted': { messageId: string; content: string };
    'chat-copy/messageEditedContentUpdated': { content: string };
    'chat-copy/messageEditSaved': { messageId: string; content: string };
    'chat-copy/messageEditCancelled': void;
    'chat-copy/messageLiked': { messageId: string };
    'chat-copy/messageDisliked': { messageId: string };
    'chat-copy/messageDeleted': { messageId: string };
    'chat-copy/messageViewModeToggled': { messageId: string };
    'chat-copy/messageRegenerated': { messageId: string };

    // Model and context events
    'chat-copy/modelChanged': { model: string };
    'chat-copy/contextAdded': { contextId: string };
    'chat-copy/contextRemoved': { contextId: string };

    // File events
    'chat-copy/fileAttached': { file: AttachedFile };
    'chat-copy/fileRemoved': { fileId: string };

    // Input events
    'chat-copy/inputValueChanged': { value: string };

    // Streaming events
    'chat-copy/streamingStarted': { messageId: string };
    'chat-copy/streamingContentUpdated': { messageId: string; content: string };
    'chat-copy/streamingCompleted': { messageId: string };

    // Data fetch events
    'chat-copy/dataFetchStarted': Record<string, never>;
    'chat-copy/dataFetchSucceeded': { threads: Thread[]; messages: Message[]; contexts: Context[] };
    'chat-copy/dataFetchFailed': { error: string };
  }
}
