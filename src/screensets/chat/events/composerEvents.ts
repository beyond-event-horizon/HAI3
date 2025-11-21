/**
 * Chat Composer Events
 * Input composition and file attachment events
 */

import '@hai3/uicore';
import type { AttachedFile } from '../types';
import { CHAT_SCREENSET_ID } from '../ids';

const DOMAIN_ID = 'composer';

export enum ComposerEvents {
  FileAttached = `${CHAT_SCREENSET_ID}/${DOMAIN_ID}/fileAttached`,
  FileRemoved = `${CHAT_SCREENSET_ID}/${DOMAIN_ID}/fileRemoved`,
  InputValueChanged = `${CHAT_SCREENSET_ID}/${DOMAIN_ID}/inputValueChanged`,
}

declare module '@hai3/uicore' {
  interface EventPayloadMap {
    [ComposerEvents.FileAttached]: { file: AttachedFile };
    [ComposerEvents.FileRemoved]: { fileId: string };
    [ComposerEvents.InputValueChanged]: { value: string };
  }
}
