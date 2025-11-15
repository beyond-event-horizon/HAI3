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
 * import { Skeleton } from '@hai3/uikit';
 * 
 * function MyComponent() {
 *   const { t, language, direction, translationsReady, changeLanguage } = useTranslation();
 *   
 *   return (
 *     <div>
 *       {translationsReady ? (
 *         <h1>{t('screenset.demo:screens.hello.title')}</h1>
 *       ) : (
 *         <Skeleton className="h-10 w-48" />
 *       )}
 *       <button onClick={() => changeLanguage(Language.Arabic)}>
 *         {translationsReady ? t('app:settings.switch_to_arabic') : 'Loading...'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useTranslation() {
  // Read language and translations ready state from Redux store (Flux pattern: Store → Component)
  const language = useSelector((state: RootState) => state.app.language);
  const translationsReady = useSelector((state: RootState) => state.app.translationsReady);
  // Subscribe to screen translations version to re-render when screen translations load
  useSelector((state: RootState) => state.app.screenTranslationsVersion);

  // Compute direction from language metadata (convert null to undefined for isRTL)
  const direction = i18nRegistry.isRTL(language ?? undefined)
    ? TextDirection.RightToLeft
    : TextDirection.LeftToRight;

  const t = useCallback((key: string, params?: Record<string, string | number | boolean>) => {
    return i18nRegistry.t(key, params);
  }, []); // No dependencies - selector subscription triggers re-renders

  // Call action (Flux pattern: Component → Action → Event → Effect)
  // Action is a pure function that emits event - effect checks if language changed
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
    translationsReady,
    changeLanguage,
    getLanguageMetadata,
    getSupportedLanguages,
    isRTL: direction === TextDirection.RightToLeft,
  };
}
