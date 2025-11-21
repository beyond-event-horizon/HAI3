/**
 * I18n Events - Language and localization events
 */

import type { Language } from '../../../i18n/types';
import { UICORE_ID } from '../../constants';

const DOMAIN_ID = 'i18n';

export enum I18nEvents {
  LanguageChanged = `${UICORE_ID}/${DOMAIN_ID}/languageChanged`,
}

export interface LanguageChangedPayload {
  language: Language;
}

/**
 * Type map: ties each I18nEvent to its payload type
 */
export interface I18nEventPayloadMap {
  'uicore/i18n/languageChanged': LanguageChangedPayload;
}
