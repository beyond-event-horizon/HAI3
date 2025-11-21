/**
 * Chat Copy Messages Events
 * Message creation, editing, streaming, and interactions
 */

import '@hai3/uicore';
import type { Message } from '../types';
import { CHAT_COPY_SCREENSET_ID } from '../ids';

const DOMAIN_ID = 'messages';

export enum MessagesEvents {
  Sent = `${CHAT_COPY_SCREENSET_ID}/${DOMAIN_ID}/sent`,
  Created = `${CHAT_COPY_SCREENSET_ID}/${DOMAIN_ID}/created`,
  EditingStarted = `${CHAT_COPY_SCREENSET_ID}/${DOMAIN_ID}/editingStarted`,
  EditedContentUpdated = `${CHAT_COPY_SCREENSET_ID}/${DOMAIN_ID}/editedContentUpdated`,
  EditSaved = `${CHAT_COPY_SCREENSET_ID}/${DOMAIN_ID}/editSaved`,
  EditCancelled = `${CHAT_COPY_SCREENSET_ID}/${DOMAIN_ID}/editCancelled`,
  Liked = `${CHAT_COPY_SCREENSET_ID}/${DOMAIN_ID}/liked`,
  Disliked = `${CHAT_COPY_SCREENSET_ID}/${DOMAIN_ID}/disliked`,
  Deleted = `${CHAT_COPY_SCREENSET_ID}/${DOMAIN_ID}/deleted`,
  ViewModeToggled = `${CHAT_COPY_SCREENSET_ID}/${DOMAIN_ID}/viewModeToggled`,
  Regenerated = `${CHAT_COPY_SCREENSET_ID}/${DOMAIN_ID}/regenerated`,
  StreamingStarted = `${CHAT_COPY_SCREENSET_ID}/${DOMAIN_ID}/streamingStarted`,
  StreamingContentUpdated = `${CHAT_COPY_SCREENSET_ID}/${DOMAIN_ID}/streamingContentUpdated`,
  StreamingCompleted = `${CHAT_COPY_SCREENSET_ID}/${DOMAIN_ID}/streamingCompleted`,
}

declare module '@hai3/uicore' {
  interface EventPayloadMap {
    [MessagesEvents.Sent]: { content: string };
    [MessagesEvents.Created]: { message: Message };
    [MessagesEvents.EditingStarted]: { messageId: string; content: string };
    [MessagesEvents.EditedContentUpdated]: { content: string };
    [MessagesEvents.EditSaved]: { messageId: string; content: string };
    [MessagesEvents.EditCancelled]: void;
    [MessagesEvents.Liked]: { messageId: string };
    [MessagesEvents.Disliked]: { messageId: string };
    [MessagesEvents.Deleted]: { messageId: string };
    [MessagesEvents.ViewModeToggled]: { messageId: string };
    [MessagesEvents.Regenerated]: { messageId: string };
    [MessagesEvents.StreamingStarted]: { messageId: string };
    [MessagesEvents.StreamingContentUpdated]: { messageId: string; content: string };
    [MessagesEvents.StreamingCompleted]: { messageId: string };
  }
}
