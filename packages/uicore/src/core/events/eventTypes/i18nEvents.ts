/**
 * I18n Events - Language and localization events
 */

import type { Language } from '../../../i18n/types';

export enum I18nEvents {
  LanguageChanged = 'i18n/languageChanged',
}

export interface LanguageChangedPayload {
  language: Language;
}

/**
 * Type map: ties each I18nEvent to its payload type
 */
export interface I18nEventPayloadMap {
  'i18n/languageChanged': LanguageChangedPayload;
}
