/**
 * Chat Events
 * Defines all events for the chat screenset
 * Following Flux: Actions emit events, Effects listen to events
 */

import '@hai3/uicore';
import type { AttachedFile, Thread, Message, Context } from '../types';
import type { EnhancedChatThread } from '../uikit/components/EnhancedThreadList';

/**
 * Chat event enum
 * All chat events use the 'chat/' prefix for namespace isolation
 */
export enum ChatEvents {
  // Thread events
  ThreadSelected = 'chat/threadSelected',
  DraftThreadCreated = 'chat/draftThreadCreated', // Local draft thread (not saved to backend)
  ThreadCreated = 'chat/threadCreated',
  ThreadDeleted = 'chat/threadDeleted',
  ThreadTitleUpdated = 'chat/threadTitleUpdated',
  ThreadsReordered = 'chat/threadsReordered',
  ThreadTemporaryToggled = 'chat/threadTemporaryToggled',

  // Message events
  MessageSent = 'chat/messageSent',
  MessageCreated = 'chat/messageCreated',
  MessageEditingStarted = 'chat/messageEditingStarted',
  MessageEditedContentUpdated = 'chat/messageEditedContentUpdated',
  MessageEditSaved = 'chat/messageEditSaved',
  MessageEditCancelled = 'chat/messageEditCancelled',
  MessageLiked = 'chat/messageLiked',
  MessageDisliked = 'chat/messageDisliked',
  MessageDeleted = 'chat/messageDeleted',
  MessageViewModeToggled = 'chat/messageViewModeToggled',
  MessageRegenerated = 'chat/messageRegenerated',

  // Model and Context events
  ModelChanged = 'chat/modelChanged',
  ContextAdded = 'chat/contextAdded',
  ContextRemoved = 'chat/contextRemoved',

  // File events
  FileAttached = 'chat/fileAttached',
  FileRemoved = 'chat/fileRemoved',

  // Input events
  InputValueChanged = 'chat/inputValueChanged',

  // Streaming
  StreamingStarted = 'chat/streamingStarted',
  StreamingContentUpdated = 'chat/streamingContentUpdated',
  StreamingCompleted = 'chat/streamingCompleted',

  // Data fetch events
  DataFetchStarted = 'chat/dataFetchStarted',
  DataFetchSucceeded = 'chat/dataFetchSucceeded',
  DataFetchFailed = 'chat/dataFetchFailed',
}

/**
 * Module Augmentation
 * Extends EventPayloadMap from @hai3/uicore to register chat events
 */
declare module '@hai3/uicore' {
  interface EventPayloadMap {
    // Thread events
    'chat/threadSelected': { threadId: string };
    'chat/draftThreadCreated': { threadId: string; isTemporary: boolean }; // Draft thread created locally
    'chat/threadCreated': { thread: Thread };
    'chat/threadDeleted': { threadId: string };
    'chat/threadTitleUpdated': { threadId: string; newTitle: string };
    'chat/threadsReordered': { threads: EnhancedChatThread[] };
    'chat/threadTemporaryToggled': { threadId: string; isTemporary: boolean };
    
    // Message events
    'chat/messageSent': { content: string };
    'chat/messageCreated': { message: Message };
    'chat/messageEditingStarted': { messageId: string; content: string };
    'chat/messageEditedContentUpdated': { content: string };
    'chat/messageEditSaved': { messageId: string; content: string };
    'chat/messageEditCancelled': void;
    'chat/messageLiked': { messageId: string };
    'chat/messageDisliked': { messageId: string };
    'chat/messageDeleted': { messageId: string };
    'chat/messageViewModeToggled': { messageId: string };
    'chat/messageRegenerated': { messageId: string };
    
    // Model and context events
    'chat/modelChanged': { model: string };
    'chat/contextAdded': { contextId: string };
    'chat/contextRemoved': { contextId: string };
    
    // File events
    'chat/fileAttached': { file: AttachedFile };
    'chat/fileRemoved': { fileId: string };
    
    // Input events
    'chat/inputValueChanged': { value: string };
    
    // Streaming events
    'chat/streamingStarted': { messageId: string };
    'chat/streamingContentUpdated': { messageId: string; content: string };
    'chat/streamingCompleted': { messageId: string };

    // Data fetch events
    'chat/dataFetchStarted': Record<string, never>;
    'chat/dataFetchSucceeded': { threads: Thread[]; messages: Message[]; contexts: Context[] };
    'chat/dataFetchFailed': { error: string };
  }
}
