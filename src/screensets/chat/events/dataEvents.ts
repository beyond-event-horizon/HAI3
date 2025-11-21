/**
 * Chat Data Events
 * Coordination events for data fetching (no associated state slice)
 */

import '@hai3/uicore';
import type { Thread, Message, Context } from '../types';
import { CHAT_SCREENSET_ID } from '../ids';

const DOMAIN_ID = 'data';

export enum DataEvents {
  FetchStarted = `${CHAT_SCREENSET_ID}/${DOMAIN_ID}/fetchStarted`,
  FetchSucceeded = `${CHAT_SCREENSET_ID}/${DOMAIN_ID}/fetchSucceeded`,
  FetchFailed = `${CHAT_SCREENSET_ID}/${DOMAIN_ID}/fetchFailed`,
}

declare module '@hai3/uicore' {
  interface EventPayloadMap {
    [DataEvents.FetchStarted]: Record<string, never>;
    [DataEvents.FetchSucceeded]: { threads: Thread[]; messages: Message[]; contexts: Context[] };
    [DataEvents.FetchFailed]: { error: string };
  }
}
