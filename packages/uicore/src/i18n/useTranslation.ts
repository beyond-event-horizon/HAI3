import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { i18nRegistry } from './i18nRegistry';
import { changeLanguage as changeLanguageAction } from '../core/actions/i18nActions';
import { TextDirection, type Language, type LanguageMetadata } from './types';

/**
 * React hook for translations
 * 
 * Features:
 * - Reactive to language changes (no reload needed)
 * - Type-safe translation keys
 * - Parameter interpolation
 * - RTL/LTR direction support
 * 
 * @example
 * ```tsx
 * import { useTranslation, Language } from '@hai3/uicore';
 * 
 * function MyComponent() {
 *   const { t, language, direction, changeLanguage } = useTranslation();
 *   
 *   return (
 *     <div>
 *       <h1>{t('screenset.demo:screens.hello.title')}</h1>
 *       <p>{t('screenset.demo:screens.hello.message', { name: 'John' })}</p>
 *       <button onClick={() => changeLanguage(Language.Arabic)}>
 *         {t('app:settings.switch_to_arabic')}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useTranslation() {
  // Read language from Redux store (Flux pattern: Store → Component)
  const language = useSelector((state: RootState) => state.app.language);
  
  // Compute direction from language metadata
  const direction = i18nRegistry.isRTL(language) 
    ? TextDirection.RightToLeft 
    : TextDirection.LeftToRight;

  const t = useCallback((key: string, params?: Record<string, string | number | boolean>) => {
    return i18nRegistry.t(key, params);
  }, []); // No dependencies - always use current language from registry

  // Call action (Flux pattern: Component → Action → Event → Effect)
  const changeLanguage = useCallback((lang: Language) => {
    changeLanguageAction(lang);
  }, []);

  const getLanguageMetadata = useCallback((code?: Language): LanguageMetadata | undefined => {
    return i18nRegistry.getLanguageMetadata(code);
  }, []);

  const getSupportedLanguages = useCallback(() => {
    return i18nRegistry.getSupportedLanguages();
  }, []);

  return {
    t,
    language,
    direction,
    changeLanguage,
    getLanguageMetadata,
    getSupportedLanguages,
    isRTL: direction === TextDirection.RightToLeft,
  };
}
