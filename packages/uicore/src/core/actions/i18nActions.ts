/**
 * i18n Actions
 * Follows Flux pattern
 * Pattern: Action → Event → Effect → Store update
 */

import { eventBus } from '../events/eventBus';
import { I18nEvents } from '../events/eventTypes/i18nEvents';
import type { Language } from '../../i18n/types';

/**
 * Change user's language preference
 * Emits event - effects handle store updates and side effects
 * 
 * @param language - Language enum value
 */
export const changeLanguage = (language: Language): void => {
  // Emit event - appEffects will handle slice update and i18n loading
  eventBus.emit(I18nEvents.LanguageChanged, { language });
};
