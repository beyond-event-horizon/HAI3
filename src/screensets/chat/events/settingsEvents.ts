/**
 * Chat Settings Events
 * Model selection and context configuration events
 */

import '@hai3/uicore';
import { CHAT_SCREENSET_ID } from '../ids';

const DOMAIN_ID = 'settings';

export enum SettingsEvents {
  ModelChanged = `${CHAT_SCREENSET_ID}/${DOMAIN_ID}/modelChanged`,
  ContextAdded = `${CHAT_SCREENSET_ID}/${DOMAIN_ID}/contextAdded`,
  ContextRemoved = `${CHAT_SCREENSET_ID}/${DOMAIN_ID}/contextRemoved`,
}

declare module '@hai3/uicore' {
  interface EventPayloadMap {
    [SettingsEvents.ModelChanged]: { model: string };
    [SettingsEvents.ContextAdded]: { contextId: string };
    [SettingsEvents.ContextRemoved]: { contextId: string };
  }
}
