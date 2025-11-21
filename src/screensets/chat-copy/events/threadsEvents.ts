/**
 * Chat Copy Threads Events
 * Thread list and selection events
 */

import '@hai3/uicore';
import type { Thread } from '../types';
import type { EnhancedChatThread } from '../uikit/components/EnhancedThreadList';
import { CHAT_COPY_SCREENSET_ID } from '../ids';

const DOMAIN_ID = 'threads';

export enum ThreadsEvents {
  Selected = `${CHAT_COPY_SCREENSET_ID}/${DOMAIN_ID}/selected`,
  DraftCreated = `${CHAT_COPY_SCREENSET_ID}/${DOMAIN_ID}/draftCreated`,
  Created = `${CHAT_COPY_SCREENSET_ID}/${DOMAIN_ID}/created`,
  Deleted = `${CHAT_COPY_SCREENSET_ID}/${DOMAIN_ID}/deleted`,
  TitleUpdated = `${CHAT_COPY_SCREENSET_ID}/${DOMAIN_ID}/titleUpdated`,
  Reordered = `${CHAT_COPY_SCREENSET_ID}/${DOMAIN_ID}/reordered`,
  TemporaryToggled = `${CHAT_COPY_SCREENSET_ID}/${DOMAIN_ID}/temporaryToggled`,
}

declare module '@hai3/uicore' {
  interface EventPayloadMap {
    [ThreadsEvents.Selected]: { threadId: string };
    [ThreadsEvents.DraftCreated]: { threadId: string; title: string; isTemporary: boolean };
    [ThreadsEvents.Created]: { thread: Thread };
    [ThreadsEvents.Deleted]: { threadId: string };
    [ThreadsEvents.TitleUpdated]: { threadId: string; newTitle: string };
    [ThreadsEvents.Reordered]: { threads: EnhancedChatThread[] };
    [ThreadsEvents.TemporaryToggled]: { threadId: string; isTemporary: boolean };
  }
}
